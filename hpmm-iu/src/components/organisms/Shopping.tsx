import React, { useEffect, useState } from "react";
import { ShoppingInterface } from "../../interfaces/shopping.interface";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useSolicitudCompras } from "../../hooks/use.SolicitudCompras";
import { useShopping } from "../../hooks/use.Shopping";
import { useVendedor } from "../../hooks/use.vendedor";

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

  // 2) ESTADOS LOCALES
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<ShoppingInterface[]>([]);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ShoppingInterface | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ShoppingInterface | null>(null);
  const [saving, setSaving] = useState(false);

  // Estados para lista temporal de compras
  const [dataListForm, setDataListForm] = useState<any[]>([]);
  const [itemToEditList, setItemToEditList] = useState<any | null>(null);

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

  // Validación para el formulario de editar compra
  const validateEdit = (values: any) => {
    const errors: any = {};
    if (
      itemToEdit &&
      values.shopping_order_id &&
      values.shopping_order_id.trim().toLowerCase() !==
        itemToEdit.shopping_order_id?.trim().toLowerCase() &&
      isOrderIdTaken(values.shopping_order_id, itemToEdit.id_shopping)
    ) {
      errors.shopping_order_id =
        "El número de orden ya está registrado en otra compra.";
    }
    return errors;
  };

  const shoppingColumns: Column<ShoppingInterface>[] = [
    { header: "N.º Solicitud", accessor: "id_scompra" },
    { header: "Vendedor", accessor: "vendedor_nombre" },
    {
      header: "Fecha Compra",
      accessor: (row) =>
        row.fecha_compra ? new Date(row.fecha_compra).toLocaleDateString() : "",
    },
    { header: "N.º Orden", accessor: "shopping_order_id" },
    { header: "Nombre Unidad", accessor: "nombre_unidad" },
    { header: "Lugar Entrega", accessor: "lugar_entrega" },
    { header: "N.º Cotización", accessor: "numero_cotizacion" },
    { header: "N.º Pedido", accessor: "numero_pedido" },
    { header: "Total", accessor: "total" },
    {
      header: "Estado",
      accessor: (row) => (row.estado ? "Activo" : "Inactivo"),
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
    { header: "N.º solicitud", accessor: "id_scompra" },
    { header: "Vendedor", accessor: "vendedor_nombre" },
    {
      header: "Fecha Compra",
      accessor: (row) =>
        row.fecha_compra ? new Date(row.fecha_compra).toLocaleDateString() : "",
    },
    { header: "N.º orden", accessor: "shopping_order_id" },
    { header: "Nombre Unidad", accessor: "nombre_unidad" },
    { header: "Lugar Entrega", accessor: "lugar_entrega" },
    { header: "N.º cotización", accessor: "numero_cotizacion" },
    { header: "N.º pedido", accessor: "numero_pedido" },
    { header: "Total", accessor: "total" },
    
    
    
  ];

  // Campos para el formulario
  const shoppingFields: FieldConfig[] = React.useMemo(
    () => [
      {
        name: "id_scompra",
        label: "Solicitud de compra",
        type: "select",
        options: scompras.map((sc) => ({
          label: sc.id_scompra,
          value: sc.id_scompra,
        })),
        required: true,
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
      },
      {
        name: "fecha_compra",
        label: "Fecha Compra",
        type: "date",
        required: true,
      },
      {
        name: "shopping_order_id",
        label: "Numero Orden",
        type: "text",
        required: true,
      },
      {
        name: "total",
        label: "Total",
        type: "number",
        required: true,
      },
      {
        name: "numero_cotizacion",
        label: "Numero Cotización",
        type: "text",
        required: true,
      },
      {
        name: "numero_pedido",
        label: "Numero Pedido",
        type: "text",
        required: true,
      },
      {
        name: "nombre_unidad",
        label: "Nombre Unidad",
        type: "select",
        options: [{ label: "HPMM", value: "HPMM" }],
        disabled: true,
        readOnly: true, // Asignar un valor por defecto y hacerlo de solo lectura
      },
      {
        name: "lugar_entrega",
        label: "Lugar Entrega",
        type: "select",
        options: [
          { label: "Almacen Materiales HPMMM", value: "Almacen Materiales HPMMM" },
          { label: "Almacen Materiales HPMM", value: "Almacen Materiales HPMM" },
          { label: "Almacen Medicamentos HPMM", value: "Almacen Medicamentos HPMM" },
        ],
        required: true,
      },
      {
        name: "estado",
        label: "Estado",
        type: "select",
        options: [
          { label: "Activo", value: true },
          { label: "Inactivo", value: false },
        ],
        required: true,
      },
    ],
    [vendedor, scompras]
  );

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

  // 6) FUNCIONES DE MANEJO DE MODALES
  const closeAll = () => {
    setEditOpen(false);
    setCreateOpen(false);
    setDeleteOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
  };

  const openEdit = (id_shopping: string) => {
    const item = shopping.find((s) => s.id_shopping === id_shopping);
    if (item) {
      setItemToEdit(item);
      setEditOpen(true);
    } else {
      toast.error("No se encontró la compra seleccionada.");
    }
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

  const handleSave = async (values: any) => {
    if (!itemToEdit) {
      toast.error("No hay compra para editar");
      return;
    }

    // Validar si hay cambios
    const hasChanges =
      values.id_scompra !== itemToEdit.id_scompra ||
      values.id_vendedor !== itemToEdit.id_vendedor ||
      values.fecha_compra !== itemToEdit.fecha_compra ||
      values.shopping_order_id !== itemToEdit.shopping_order_id ||
      values.numero_cotizacion !== itemToEdit.numero_cotizacion ||
      values.numero_pedido !== itemToEdit.numero_pedido ||
      values.nombre_unidad !== itemToEdit.nombre_unidad ||
      values.lugar_entrega !== itemToEdit.lugar_entrega ||
      parseFloat(values.total) !== itemToEdit.total ||
      values.estado !== itemToEdit.estado;

    if (!hasChanges) {
      toast.error("No se detectaron cambios para guardar.");
      return;
    }

    // Solo validar si el número de orden cambió
    if (
      values.shopping_order_id &&
      values.shopping_order_id.trim().toLowerCase() !==
        itemToEdit.shopping_order_id?.trim().toLowerCase() &&
      isOrderIdTaken(values.shopping_order_id, itemToEdit.id_shopping)
    ) {
      toast.error("El número de orden ya está registrado en otra compra.");
      return;
    }

    try {
      setSaving(true);
      const payload: Partial<ShoppingInterface> = {
        ...itemToEdit,
        ...values,
        estado: values.estado === true,
        total: parseFloat(values.total) || 0,
        fecha_compra: new Date(values.fecha_compra),
      };

      await PutShoppingContext(
        itemToEdit.id_shopping,
        payload as ShoppingInterface
      );
      await GetShoppingContext();
      toast.success(`Compra ${values.id_scompra} actualizada correctamente`);
      closeAll();
    } catch (error) {
      console.error("Error actualizando compra:", error);
      toast.error("Error al actualizar la compra");
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async (values: any) => {
    // Validar si el número de orden ya existe
    if (values.shopping_order_id && isOrderIdTaken(values.shopping_order_id)) {
      toast.error("El número de orden ya está registrado en otra compra.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...values,
        estado: values.estado === true,
        total: parseFloat(values.total) || 0,
        fecha_compra: new Date(values.fecha_compra),
      };

      await PostShoppingContext(payload as ShoppingInterface);
      await GetShoppingContext();
      toast.success(`Compra ${values.id_scompra} creada correctamente`);
      closeAll();
    } catch (error) {
      console.error("Error creando compra:", error);
      toast.error("Error al crear la compra");
    } finally {
      setSaving(false);
    }
  };

  // FUNCIONES PARA AGREGAR, EDITAR Y ELIMINAR DE LA LISTA
  const deleteItemList = (id: string) => {
    setDataListForm((prev) => prev.filter((item) => item.id_temp !== id));
  };

  const handleAddItem = (item: any) => {
    let fecha_compra = "";
    if (typeof item.fecha_compra === "string" && /^\d{4}-\d{2}-\d{2}$/.test(item.fecha_compra)) {
      fecha_compra = item.fecha_compra;
    } else if (item.fecha_compra instanceof Date) {
      fecha_compra = item.fecha_compra.toISOString().slice(0, 10);
    } else {
      fecha_compra = new Date().toISOString().slice(0, 10);
    }

    const newItem = { ...item, fecha_compra };

    if (itemToEditList) {
      setDataListForm((prev) =>
        prev.map((p) =>
          p.id_temp === itemToEditList.id_temp
            ? { ...newItem, id_temp: itemToEditList.id_temp }
            : p
        )
      );
      setItemToEditList(null);
    } else {
      setDataListForm((prev) => [
        ...prev,
        { ...newItem, id_temp: crypto.randomUUID() },
      ]);
    }
  };

  const handleCreateList = async () => {
    setSaving(true);
    try {
      if (dataListForm.length === 0) {
        toast.error("Debes agregar al menos una compra a la lista.");
        return;
      }
      await Promise.all(
        dataListForm.map(async (item) => {
          const payload = {
            ...item,
            estado: item.estado === true,
            total: parseFloat(item.total) || 0,
            fecha_compra: new Date(item.fecha_compra),
          };
          await PostShoppingContext(payload as ShoppingInterface);
        })
      );
      await GetShoppingContext();
      toast.success("Compras creadas correctamente");
      setDataListForm([]);
      closeAll();
    } catch (error) {
      toast.error("Error al crear las compras");
    } finally {
      setSaving(false);
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
          onClick={() => setCreateOpen(true)}
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
        // Filas inactivas con opacidad y tachado
        rowClassName={(row) =>
          row.estado === false ? "opacity-40 line-through" : ""
        }
      />

      {/* Modal Editar */}
      <Modal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <GenericForm<Partial<ShoppingInterface>>
            initialValues={{
              id_scompra: itemToEdit.id_scompra ?? "",
              id_vendedor: itemToEdit.id_vendedor ?? "",
              fecha_compra: itemToEdit.fecha_compra ?? new Date(),
              shopping_order_id: itemToEdit.shopping_order_id ?? "",
              numero_cotizacion: itemToEdit.numero_cotizacion ?? "",
              numero_pedido: itemToEdit.numero_pedido ?? "",
              nombre_unidad: itemToEdit.nombre_unidad ?? "HPMM",
              lugar_entrega: itemToEdit.lugar_entrega ?? "",
              total: itemToEdit.total ?? 0,
              estado: itemToEdit.estado ?? "",
            }}
            fields={shoppingFields}
            onSubmit={handleSave}
            onCancel={closeAll}
            validate={validateEdit}
            submitLabel={
              saving ? (
                <span>
                  <span className="animate-spin inline-block mr-2">⏳</span>
                  Guardando...
                </span>
              ) : (
                "Guardar"
              )
            }
            cancelLabel="Cancelar"
            title="Editar Compra"
            submitDisabled={saving}
          />
        )}
      </Modal>

      {/* Modal Crear */}
      <Modal isOpen={isCreateOpen} onClose={closeAll}>
        <h2 className="text-xl font-bold mb-4 text-center">
          {itemToEditList ? "Editar compra de la lista" : "Agregar compra a la lista"}
        </h2>
        <GenericForm<Partial<ShoppingInterface>>
          initialValues={
            itemToEditList
              ? itemToEditList
              : {
                  id_scompra: "",
                  id_vendedor: "",
                  fecha_compra: new Date().toISOString().slice(0, 10),
                  shopping_order_id: "",
                  numero_cotizacion: "",
                  numero_pedido: "",
                  nombre_unidad: "HPMM",
                  lugar_entrega: "",
                  total: 0,
                  estado: true,
                }
          }
          fields={shoppingFields.map((f) =>
            f.name === "estado" ? { ...f, disabled: true } : f
          )}
          onSubmit={handleAddItem}
          onCancel={() => setItemToEditList(null)}
          validate={validateCreate}
          submitLabel={itemToEditList ? "Actualizar" : "Agregar a lista"}
          cancelLabel="Cancelar edición"
          title={
            itemToEditList
              ? "Editar compra de la lista"
              : "Agregar compra a la lista"
          }
          submitDisabled={saving}
        />
        <GenericTable
          columns={shoppingListColumns}
          data={dataListForm}
          rowKey={(row) => (row as any).id_temp}
          actions={[
            {
              header: "Acciones",
              label: "Editar",
              onClick: (row) => setItemToEditList(row),
            },
            {
              header: "Eliminar",
              label: "Eliminar",
              onClick: (row) => deleteItemList((row as any).id_temp),
            },
          ]}
          rowClassName={(row) =>
            row.estado === false ? "opacity-40 line-through" : ""
          }
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button
            onClick={handleCreateList}
            className="bg-hpmm-azul-claro hover:bg-hpmm-azul-oscuro text-white font-bold py-2 px-4 rounded"
            disabled={saving || dataListForm.length === 0}
          >
            {saving ? (
              <span>
                <span className="animate-spin inline-block mr-2">⏳</span>
                Creando...
              </span>
            ) : (
              "Crear todas"
            )}
          </Button>
          <Button
            onClick={() => {
              setItemToEditList(null);
              setDataListForm([]);
              closeAll();
            }}
            className="bg-hpmm-amarillo-claro hover:bg-hpmm-amarillo-oscuro text-gray-800 font-bold py-2 px-4 rounded"
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
