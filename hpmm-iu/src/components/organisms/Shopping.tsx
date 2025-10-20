import React, { useEffect, useState } from "react";
import { ShoppingEditInterface, ShoppingInterface } from "../../interfaces/shopping.interface";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useSolicitudCompras } from "../../hooks/use.SolicitudCompras";
import { useShopping } from "../../hooks/use.Shopping";
import { useVendedor } from "../../hooks/use.vendedor";
import { useRequisicion } from "../../hooks/use.Requisicion";
import { formattedDate } from "../../helpers/formatData";

const Shopping: React.FC<{ status?: string }> = ({ status = "Todo" }) => {
  // 1) HOOKS
  const {
    shopping,
    GetShoppingContext,
    PostShoppingContext,
    PutShoppingContext,
    DeleteShoppingContext,
  } = useShopping();

  const { vendedor, GetVendedorContext } = useVendedor();
  const { scompras, GetSolicitudesComprasContext } = useSolicitudCompras();
  const { GetRequisiDetailsContext } = useRequisicion();

  // 2) ESTADOS LOCALES
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<ShoppingInterface[]>([]);
  const [isOpenModal, setOpenModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ShoppingEditInterface | null>(null);

  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ShoppingInterface | null>(null);
  const [saving, setSaving] = useState(false);

  // Estados para lista temporal de compras
  const [dataListForm, setDataListForm] = useState<any[]>([]);
  const [itemToEditList, setItemToEditList] = useState<any | null>(null);
  const [validateEdition, setValidateEdition] = useState(true);

  // Agrega este estado para guardar el valor original al editar
  const [originalItemToEditList, setOriginalItemToEditList] = useState<any | null>(null);

  // Estado local para el filtro
  const [estadoFiltro] = useState<string>("Todo");

  // 3) FUNCIONES DE VALIDACIÓN
  // Función para validar si el número de orden ya existe
  const isOrderIdTaken = (orderId: string, excludeShoppingId?: string) => {
    return shopping.some(
      (s) =>
        s.shopping_order_id?.trim().toLowerCase() ===
          orderId.trim().toLowerCase() &&
        (!excludeShoppingId || s.id_shopping !== excludeShoppingId)
    );
  };

  // Validación para el formulario de crear compra
  const validateCreate = (values: any) => {
    const errors: any = {};
    if (values.shopping_order_id && isOrderIdTaken(values.shopping_order_id)) {
      errors.shopping_order_id =
        "El número de orden ya está registrado en otra compra.";
    }
    return errors;
  };

  const shoppingColumns: Column<ShoppingInterface>[] = [
    {
      header: "N.º Solicitud",
      accessor: (row) =>
        `SC-${row.id_scompra.split("-")[0].toLocaleUpperCase()}`,
    },
    { header: "Vendedor", accessor: "vendedor_nombre" },
    {
      header: "Fecha Compra",
      accessor: (row) =>
        row.fecha_compra ? new Date(row.fecha_compra).toLocaleDateString() : "",
    },
    { header: "N.º Orden", accessor: "shopping_order_id" },
    { header: "Unidad Ejecutora", accessor: "nombre_unidad" },
    { header: "Tipo de Compra", accessor: "tipo_compra" },
    { header: "Financiamiento", accessor: "financiamiento" },
    { header: "Lugar Entrega", accessor: "lugar_entrega" },
    { header: "N.º Cotización", accessor: "numero_cotizacion" },
    { header: "N.º Pedido", accessor: "numero_pedido" },
    { header: "ISV 15%", accessor: (row) => (row.ISV ? "Si" : "No") },
    { header: "Nombre Producto", accessor: "nombre_producto" },
    { header: "Cantidad Solicitada", accessor: "cantidad_solicitada" },
    {
      header: "Cantidad Comprada",
      accessor: "cantidad_comprada",
      
    },
    {
      header: "Precio Unitario",
      accessor: "precio_unitario",
    },
    {
      header: "Total de Compra",
      accessor: (row) => {
        const cantidad = Number(row.cantidad_comprada) || 0;
        const precio = Number(row.precio_unitario) || 0;
        const isvIncluido = row.ISV === true;
        const total = cantidad * precio * (isvIncluido ? 1.15 : 1);
        // Redondea hacia arriba a 2 decimales y lo muestra como string
        return (Math.ceil(total * 100) / 100).toFixed(2);
      },
    },
    
    {
      header: "Fecha Creación",
      accessor: (row) =>
        row.created_at ? new Date(row.created_at).toLocaleString() : "",
    },
    {
      header: "Fecha Actualización",
      accessor: (row) =>
        row.updated_at ? new Date(row.updated_at).toLocaleString() : "",
    },
  ];

  const shoppingListColumns: Column<ShoppingInterface>[] = [
    {
      header: "N.º solicitud",
      accessor: "id_scompra",
      editable: false,
    },
    {
      header: "Nombre Unidad",
      accessor: "nombre_unidad",
      editable: false,
    },
    {
      header: "Tipo de Compra",
      accessor: "tipo_compra",
      editable: true,
      editType: "select",
      editOptions: [
      { label: "Compra Directa", value: "Compra Directa" },
        { label: "Licitación", value: "Licitación" },
      ],
    },
    {
      header: "Financiamiento",
      accessor: "financiamiento",
      editable: true,
      editType: "select",
      editOptions: [
        { label: "Presupuesto Nacional", value: "Presupuesto Nacional" },
        { label: "Fondos Recuperados", value: "Fondos Recuperados" },
      ],
    },
    {
      header: "Lugar Entrega",
      accessor: "lugar_entrega",
      editable: false,
      editType: "select",
      editOptions: [
        {
          label: "Almacen Materiales HPMMM",
          value: "Almacen Materiales HPMMM",
        },
        { label: "Almacen Materiales HPMM", value: "Almacen Materiales HPMM" },
        {
          label: "Almacen Medicamentos HPMM",
          value: "Almacen Medicamentos HPMM",
        },
      ],
    },
    {
      header: "Fecha Compra",
      accessor: "fecha_compra",
      editable: true,
      editType: "date",
    },
    {
      header: "N.º orden",
      accessor: "shopping_order_id",
      editable: true,
      editType: "text",
    },
    { header: "N.º cotización", editable: true, accessor: "numero_cotizacion" },
    { header: "N.º pedido", editable: true, accessor: "numero_pedido" },

    {
      header: "Vendedor",
      accessor: "vendedor_nombre",
      editable: true,
      editType: "select",
      editOptions: vendedor.map((v) => ({
        label: v.nombre_contacto,
        value: v.nombre_contacto,
      })),
    },
    {
      header: "Nombre Productos",
      accessor: (row) =>
        row.product_name ? row.product_name : row.nombre_producto,
    },
    { header: "Cantidad Solicitada", accessor: "cantidad_solicitada" },
    {
      header: "Cantidad Comprada",
      editable: true,
      accessor: "cantidad_comprada",
    },

    { header: "Precio Unitario", editable: true, accessor: "precio_unitario" },
    {
      header: "Incluye ISV (15%)",
      accessor: "ISV",
      editable: true,
      editType: "select",
      editOptions: [
        { label: "Sí", value: true },
        { label: "No", value: false },
      ],
    },
    {
      header: "Total de Compra",
      accessor: (row) =>
        row.cantidad_comprada
          ? row.cantidad_comprada * row.precio_unitario * (row.ISV ? 1.15 : 1)
          : 0,
    },
  ];

  // Campos para el formulario
  const shoppingFields: FieldConfig[] = React.useMemo(
    () => [
      {
        name: "id_scompra",
        label: "Solicitud de compras",
        type: "select",
        options: scompras
          .filter((sc) => sc.estado === "Comprado")
          .filter(
            (sc, idx, arr) =>
              arr.findIndex((other) => other.id_scompra === sc.id_scompra) ===
              idx
          )
          // Filtrar solicitudes que ya tienen compras registradas
          .filter((sc) => {
            const yaExisteCompra = shopping.some(
              (shop) => shop.id_scompra === sc.id_scompra
            );
            return !yaExisteCompra;
          })
          .map((sc) => ({
            label: `SC-${sc.id_scompra.split("-")[0].toLocaleUpperCase()} : ${
              sc.descripcion
            }`,
            value: sc.id_scompra,
          })),
        required: false,
        disabled: !!itemToEditList,
      },
      {
        name: "id_vendedor",
        label: "Vendedor",
        type: "select",
        options: vendedor.map((v) => ({
          label: v.nombre_contacto,
          value: v.id_vendedor,
        })),
        required: true,
        disabled: (values) => !values.id_scompra,
      },
      {
        name: "fecha_compra",
        label: "Fecha Compra",
        defaultValue: formattedDate(),
        type: "date",
        required: true,
        disabled: (values) => !values.id_scompra,
      },
      
      {
        name: "shopping_order_id",
        label: "Numero Orden",
        type: "text",
        required: true,
        disabled: (values) => !values.id_scompra,
      },
      {
        name: "numero_cotizacion",
        label: "Numero Cotización",
        type: "text",
        required: true,
        disabled: (values) => !values.id_scompra,
      },
      {
        name: "numero_pedido",
        label: "Numero Pedido",
        type: "text",
        required: true,
        disabled: (values) => !values.id_scompra,
      },
    ],
    [vendedor, scompras, shopping] // Agregar shopping como dependencia
  );

  const handleEditRow = (
    rowKey: string,
    newValues: Partial<ShoppingInterface>
  ) => {
    // Expresión regular para detectar letras
    const hasLetters = /[a-zA-Z]/;
    // Solo números positivos (decimales permitidos)
    const onlyPositiveNumbers = /^([1-9]\d*(\.\d{1,2})?)$/;
    // Solo enteros positivos

    // cantidad_comprada
    if (
      newValues.cantidad_comprada !== undefined &&
      hasLetters.test(String(newValues.cantidad_comprada))
    ) {
      toast.error("No se permiten letras en Cantidad Comprada.");
      return;
    }
    if (
      newValues.cantidad_comprada !== undefined &&
      (!onlyPositiveNumbers.test(String(newValues.cantidad_comprada)) ||
        isNaN(Number(newValues.cantidad_comprada)))
    ) {
      toast.error("Ingrese solo números mayores a 0 en Cantidad Comprada.");
      return;
    }

    // precio_unitario
    if (
      newValues.precio_unitario !== undefined &&
      hasLetters.test(String(newValues.precio_unitario))
    ) {
      toast.error("No se permiten letras en Precio Unitario.");
      return;
    }
    if (
      newValues.precio_unitario !== undefined &&
      (!onlyPositiveNumbers.test(String(newValues.precio_unitario)) ||
        isNaN(Number(newValues.precio_unitario)))
    ) {
      toast.error("Ingrese solo números mayores a 0 en Precio Unitario.");
      return;
    }


    // ISV: no validar

    setDataListForm((prev) =>
      prev.map((item) =>
        item.id_shopping === rowKey
          ? { ...item, ...newValues }
          : item
      )
    );
  };

  const isEditListChanged = () => {
    if (!itemToEditList || !originalItemToEditList) return false;
    return (
      JSON.stringify(itemToEditList) !== JSON.stringify(originalItemToEditList)
    );
  };

  const openEdit = (id_shopping: string) => {
    const item = shopping.find((s) => s.id_shopping === id_shopping);
    if (item) {
      setItemToEdit({
        id_scompra: item.id_scompra,
        id_vendedor: item.id_vendedor, 
        fecha_compra: item.fecha_compra,
        shopping_order_id: item.shopping_order_id,
        numero_cotizacion: item.numero_cotizacion,
        numero_pedido: item.numero_pedido,
      }); 
      setOpenModal(true);
      setItemToEditList(null); // Limpia edición de lista
      setOriginalItemToEditList(null); // Limpia original de lista
      setDataListForm([item]);
    } else {
      toast.error("No se encontró la compra seleccionada.");
    }
  };

  // 5) FUNCIÓN handleTableContent
  const handleTableContent = (list: ShoppingInterface[]) => {
    // Asegurar que todos los elementos sean válidos
    const validList = list.filter(
      (item) => item && item.id_shopping && typeof item.id_shopping === "string"
    );

    let filtrados = validList;
    if (estadoFiltro === "Activos") {
      filtrados = validList.filter((s) => s.estado === true);
    } else if (estadoFiltro === "Inactivos") {
      filtrados = validList.filter((s) => s.estado === false);
    } else if (status !== "Todo") {
      // Filtrar solo activos si no es "Todo"
      filtrados = validList.filter((s) => s.estado === true);
    }

    // Ordenar por fecha de compra (más recientes primero)
    const ordenados = filtrados.sort((a, b) => {
      const fechaA = a.fecha_compra ? new Date(a.fecha_compra).getTime() : 0;
      const fechaB = b.fecha_compra ? new Date(b.fecha_compra).getTime() : 0;
      return fechaB - fechaA;
    });

    setFilteredData(ordenados);
  };

  const handleSaveAllList = async () => {
    setSaving(true);
    try {
      // CORRIGE ESTA CONDICIÓN:
      if (itemToEditList && !isEditListChanged()) {
        toast.warning("No se realizaron cambios. Por favor, edite algún valor antes de guardar.");
        setSaving(false);
        return;
      }

      for (const item of dataListForm) {
        // Calcula el total antes de guardar
        const cantidad = Number(item.cantidad_comprada) || 0;
        const precio = Number(item.precio_unitario) || 0;
        const isvIncluido = item.ISV === true;
        const total = cantidad * precio * (isvIncluido ? 1.15 : 1);

        const itemConTotal = {
          ...item,
          total: (Math.ceil(total * 100) / 100).toFixed(2), // Redondea a 2 decimales
        };

        if (
          item.id_shopping &&
          shopping.some((s) => s.id_shopping === item.id_shopping)
        ) {
          await PutShoppingContext(item.id_shopping, itemConTotal);
        } else {
          await PostShoppingContext(itemConTotal);
        }
      }

      toast.success("Lista de compras guardada correctamente");
      await GetShoppingContext();
      setDataListForm([]);
      setOpenModal(false);
      setItemToEditList(null);
      setOriginalItemToEditList(null);

    } catch (error) {
      toast.error("Error al guardar la lista de compras");
    } finally {
      setSaving(false);
    }
  };

  // 6) FUNCIONES DE MANEJO DE MODALES
  const closeAll = () => {
    setOpenModal(false);
    setDeleteOpen(false);
    setItemToDelete(null);
  };

  const openDelete = (id_shopping: string) => {
    const item = shopping.find((s) => s.id_shopping === id_shopping);
    if (item) {
      setItemToDelete(item);
      setDeleteOpen(true);
    } else {
      toast.error("No se encontró la compra seleccionada.");
    }
  };

  // 7) HANDLERS DE CRUD
  const handleConfirmDelete = async (id_shopping: string) => {
    try {
      setSaving(true);
      await DeleteShoppingContext(id_shopping);
      await GetShoppingContext();
      toast.success("Compra eliminada correctamente");
      closeAll();
    } catch (error) {
      console.error("Error eliminando compra:", error);
      toast.error("Error al eliminar la compra");
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = (item: any) => {
     const vendedorSeleccionado = vendedor.find(
    (v) => v.id_vendedor === item.id_vendedor
  );

  const itemConVendedor = {
    ...item,
    id_scompra: item.id_scompra,
    vendedor_nombre: vendedorSeleccionado
      ? vendedorSeleccionado.nombre_contacto
      : "",
  };

    setDataListForm((prev: any[]) => {
      if (Array.isArray(prev)) {
        return prev.map((element) => ({
          ...element,
          ...itemConVendedor,
        }));
      }
      return [];
    });
  };

  const handleFormChange = async (
    values: Partial<ShoppingInterface>,
    prevValues?: Partial<ShoppingInterface>
  ) => {
    if (
      values.id_scompra &&
      values.id_scompra !== prevValues?.id_scompra
    ) {
      const productos = await cargarProductosDeRequisicion(values.id_scompra);
      setDataListForm(productos);
    }
  };

  // Función para cargar productos de una requisición a la lista temporal
  const cargarProductosDeRequisicion = async (id_scompra: string) => {
    try {
      const scompra = scompras.find((sc) => sc.id_scompra === id_scompra);
      if (!scompra) {
        toast.error("Solicitud de compra no encontrada.");
        return [];
      }
      const requisicion = await GetRequisiDetailsContext();
      if (!requisicion || requisicion.length === 0) {
        toast.error("No se encontraron productos en la requisición seleccionada.");
        return [];
      }

      const requisiDetail = requisicion.filter(
        (r) => r.id_requisi === scompra.id_requisi
      );

      if (requisiDetail.length !== 0) {
        const productosFormateados = requisiDetail.map((producto: any) => ({
          id_shopping: crypto.randomUUID(), // <-- Genera un id único temporal
          id_scompra: scompra.id_scompra,
          cantidad_solicitada: producto.cantidad || 0,
          //id_scompra: `SC-${id_scompra.split("-")[0].toLocaleUpperCase()}`,
          nombre_unidad: "HPMM",
          lugar_entrega: "Almacen Materiales HPMMM",
          fecha_compra: formattedDate(),
          id_vendedor: "",
          shopping_order_id: "",
          numero_cotizacion: "",
          numero_pedido: "",
          ISV: false,
          total: producto.total || 0,
          nombre_producto:
            producto.product_name || "No se encontró el nombre del producto",
          id_product: producto.id_product || "",
          ...producto,
          estado: true,
        }));

        // Reemplaza la lista, no la mezcles
        return productosFormateados;
      }
      return [];
    } catch (error) {
      toast.error("Error al cargar productos de la requisición");
      return dataListForm;
    }
  };

  // 8) EFFECTS
  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          GetShoppingContext(),
          GetVendedorContext(),
          GetSolicitudesComprasContext(),
        ]);
      } catch (error) {
        console.error("Error cargando datos:", error);
        toast.error("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Actualiza el filtro cuando cambie
  useEffect(() => {
    handleTableContent(shopping);
  }, [estadoFiltro, shopping, status]);

  useEffect(() => {
  if (itemToEditList && originalItemToEditList) {
    setValidateEdition(
      JSON.stringify(itemToEditList) === JSON.stringify(originalItemToEditList)
    );
  } else {
    setValidateEdition(true); // Si no hay edición, está validado
  }
}, [itemToEditList, originalItemToEditList]);

  // 9) RENDER CONDICIONAL
  if (loading) {
    return <div>Cargando Compras...</div>;
  }

  // 10) RENDER PRINCIPAL
  return (
    <div>
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4 text-lefth">Lista de Compras</h1>

      <div className="flex justify-end mb-4">
        <Button
          className="bg-hpmm-azul-claro hover:bg-hpmm-azul-oscuro text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setOpenModal(true);
            setItemToEdit(null);
            setItemToEditList(null);
            setOriginalItemToEditList(null);
            setDataListForm([]);
          }}
        >
          + Nueva Compra
        </Button>
      </div>

      <GenericTable
        columns={shoppingColumns}
        data={filteredData}
        rowKey={(row) => row.id_shopping}
        actions={[
          {
            header: "Editar",
            label: "Editar",
            onClick: (row) => openEdit(row.id_shopping),
          },
          {
            header: "Eliminar",
            label: "Eliminar",
            onClick: (row) => openDelete(row.id_shopping),
          },
        ]}
        // Filas inactivas with opacidad y tachado
        rowClassName={(row) =>
          row.estado === false ? "opacity-40 line-through" : ""
        }
      />

      {/* Modal Crear / Editar */}
      <Modal isOpen={isOpenModal} onClose={closeAll} fullScreen={true}>
        {!!itemToEdit ? (
          <p className="text-center mb-4">{`SC-${itemToEdit.id_scompra
            .split("-")[0]
            .toLocaleUpperCase()}`}</p>
        ) : itemToEditList ? (
          // FORMULARIO DE EDICIÓN DE LA LISTA TEMPORAL
          <GenericForm<Partial<ShoppingInterface>>
            fullScreen={true}
            initialValues={itemToEditList}
            fields={shoppingFields.map((f) =>
              f.name === "estado" ? { ...f, disabled: true } : f
            )}
            onSubmit={(values) => {
              if (
                originalItemToEditList &&
                JSON.stringify(values) ===
                  JSON.stringify(originalItemToEditList)
              ) {
                toast.info("No se modificó nada porque no hubo cambios.");
                return;
              }
              setDataListForm((prev) =>
                prev.map((item) =>
                  item.id_shopping === itemToEditList.id_shopping
                    ? { ...item, ...values }
                    : item
                )
              );
              setItemToEditList(null);
              setOriginalItemToEditList(null); // Limpia el original
            }}
            onCancel={() => {
              setItemToEditList(null);
              setOriginalItemToEditList(null); // Limpia el original
            }}
            validate={validateCreate}
            submitLabel="Guardar cambios"
            title="Editar compra de la lista"
            submitDisabled={saving}
            onChange={(values) => setItemToEditList(values)} // <--- AGREGA ESTA LÍNEA
          />
        ) : (
          // FORMULARIO DE AGREGAR NUEVO
          <GenericForm<Partial<ShoppingInterface>>
            fullScreen={true}
            initialValues={
              itemToEdit
                ? itemToEdit
                : {
                    id_vendedor: "",
                    fecha_compra: formattedDate(),
                    shopping_order_id: "",
                    numero_cotizacion: "",
                    numero_pedido: "",
                  }
            }
            fields={shoppingFields.map((f) =>
              f.name === "estado" ? { ...f, disabled: true } : f
            )}
            onSubmit={handleAddItem}
            onCancel={() => setItemToEditList(null)}
            validate={validateCreate}
            submitLabel={"Agregar a Conjunto"}
            title={
              itemToEdit
                ? "Editar compra de la lista"
                : "Agregar compra a la lista"
            }
            submitDisabled={saving}
            onChange={handleFormChange}
          />
        )}
        <GenericTable
          fullScreen={true}
          editable={true}
          columns={shoppingListColumns}
          data={dataListForm}
          rowKey={(row) => row.id_shopping}
          onEditRow={handleEditRow}
          rowClassName={(row) =>
            row.estado === false ? "opacity-40 line-through" : ""
          }
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button
            onClick={handleSaveAllList}
            className="bg-hpmm-azul-claro hover:bg-hpmm-azul-oscuro text-white font-bold py-2 px-4 rounded"
            disabled={
              saving ||
              dataListForm.length === 0 ||
              (itemToEditList && validateEdition) // <--- aquí usas el flag
            }
          >
            {saving ? (
              <span>
                <span className="animate-spin inline-block mr-2">⏳</span>
                Creando...
              </span>
            ) : (
              "Ingresar Compras"
            )}
          </Button>
          <Button
            onClick={() => {
              setItemToEditList(null);
              setDataListForm([]);
              closeAll();
            }}
            className="bg-hpmm-rojo-claro hover:bg-hpmm-rojo-oscuro text-gray-800 font-bold py-2 px-4 rounded"
            disabled={saving}
          >
            Cancelar
          </Button>
        </div>
      </Modal>
      {/* Modal Eliminar */}
      <Modal isOpen={isDeleteOpen} onClose={closeAll}>
        {itemToDelete && (
          <>
            <h3 className="text-xl font-semibold mb-4">
              Confirmar Eliminación
            </h3>
            <p>¿Seguro que deseas borrar esta compra?</p>
            <GenericTable
              rowKey={(row) => row.id_shopping}
              data={[itemToDelete]}
              columns={shoppingColumns}
            />
            <div className="mt-4 text-right gap-2 flex justify-center">
              <Button
                onClick={() => handleConfirmDelete(itemToDelete.id_shopping)}
                className="bg-hpmm-rojo-claro hover:bg-hpmm-rojo-oscuro text-white font-bold py-2 px-4 rounded"
                disabled={saving}
              >
                {saving ? (
                  <span>
                    <span className="animate-spin inline-block mr-2">⏳</span>
                    Eliminando...
                  </span>
                ) : (
                  "Eliminar"
                )}
              </Button>
              <Button
                onClick={closeAll}
                className="mr-2 bg-hpmm-amarillo-claro hover:bg-hpmm-amarillo-oscuro text-gray-800 font-bold py-2 px-4 rounded"
                disabled={saving}
              >
                Cancelar
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Shopping;