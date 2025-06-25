// src/components/pages/Kardex.tsx
import React, { useContext, useEffect, useState } from "react";
import { useKardex } from "../../hooks/use.Kardex";
import { ShoppingInterface } from "../../interfaces/shopping.interface";
import { KardexDetail, KardexEdit } from "../../interfaces/kardex.interface";
import Button from "../../components/atoms/Buttons/Button";
import Modal from "../../components/molecules/GenericModal";
import GenericForm, {
  FieldConfig,
} from "../../components/molecules/GenericForm";
import GenericTable, { Column } from "../../components/molecules/GenericTable";
import { useProducts } from "../../hooks/use.Product";
import { useShopping } from "../../hooks/use.Shopping";
import { useDetallePactos } from "../../hooks/use.DetallePactos";
import { ToastContainer, toast } from "react-toastify";
import { formattedDate } from "../../helpers/formatData";
import { useSolicitudCompras } from "../../hooks/use.SolicitudCompras";
import { useVendedor } from "../../hooks/use.vendedor";
import RFIDScannerModal from "../molecules/RFIDScannerModal";
import { AuthContext } from "../../contexts/Auth.context";
import { useLocation } from "react-router-dom";

type KardexRow = KardexDetail & Partial<ShoppingInterface>;

const Kardex: React.FC<{ status: string }> = ({ status = "Todo" }) => {
  const {
    kardex,
    kardexDetail,
    GetKardexContext,
    PostCreateKardexContext,
    PutUpdateKardexContext,
    DeleteKardexContext,
  } = useKardex();
  const { shopping, GetShoppingContext } = useShopping();
  const { GetProductsContext } = useProducts();
  const { detallePactos, GetDetallePactosContext } = useDetallePactos();
  const { scompras } = useSolicitudCompras();
  const { vendedor } = useVendedor();
  const location = useLocation();

  // 1. Obtén el contexto de autenticación
  const auth = useContext(AuthContext);
  const roleName = auth?.roleName;
  const idEmployes = auth?.idEmployes;

  // 2. ESTADOS (agrupados por función)
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [filteredData, setFilteredData] = useState<KardexDetail[]>([]);
  const [estadoFiltro] = useState<string>("Todo");
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Estados de modales
  const [isOpenModal, setOpenModal] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  const [originalItemToEditList, setOriginalItemToEditList] = useState<
    any | null
  >(null);
  const [saving, setSaving] = useState(false);

  // Estados de items seleccionados
  const [itemToEdit, setItemToEdit] = useState<KardexEdit | null>(null);
  const [itemToDelete, setItemToDelete] = useState<KardexDetail | null>(null);

  // NUEVOS ESTADOS para la lista temporal en el modal de creación
  const [dataListForm, setDataListForm] = useState<any[]>([]);
  const [itemToEditList, setItemToEditList] = useState<any | null>(null);
  const [rfidScanRow, setRfidScanRow] = useState<string | null>(null); // <-- NUEVO estado
  const [isSalida, setIsSalida] = useState(false); // <-- NUEVO estado

  useEffect(() => {
    handleTableContent(kardex);
  }, [estadoFiltro, shopping, status]);

  const [validateEdition, setValidateEdition] = useState(true);

  const handleTableContent = (list: KardexDetail[]) => {
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

  
const cargarProductosParaSalida = (id_shopping : string) => {
  // Solo productos aprobados y con stock > 0
  const productosAprobados = kardex
    .filter((item) => item.tipo === "Aprobado" && item.id_shopping == id_shopping)

  // Formatea para la tabla
  return productosAprobados.map((item) => ({
    ...item,
    tipo_movimiento: "Salida",
    cantidad: 0, // El usuario debe ingresar la cantidad a sacar
  }));
};

  // 3. CONFIGURACIONES
  const kardexColumns: Column<KardexRow>[] = [
    {
      header: "Fecha Movimiento",
      accessor: (row) => row.fecha_movimiento || "N/A",
    },
    {
      header: "Factura",
      accessor: (row) => row.numero_factura || "N/A",
    },
    {
      header: "Tipo de Movimiento",
      accessor: "tipo_movimiento",
    },
    {
      header: "Producto",
      accessor: (row) => row.nombre_producto || "N/A",
    },
    {
      header: "Cantidad Comprada",
      accessor: (row) => (
        <span className="font-medium">{Number(row.cantidad).toFixed(2)}</span>
      ),
    },
    {
      header: "Cantidad Recepcionada",
      accessor: "cantidad_recepcionada",
    },
    {
      header: "Precio Unitario",
      accessor: (row) => (
        <span className="font-medium">
          {Number(row.precio_unitario).toFixed(2)}
        </span>
      ),
    },
    {
      header: "Total",
      accessor: (row) => (
        <span className="font-medium">{Number(row.total).toFixed(2)}</span>
      ),
    },
    {
      header: "Impuesto",
      accessor: (row) => (row.isv ? "15%" : "0.00"),
    },
    {
      header: "Proveedor",
      accessor: (row) => {
        const vendedorId = vendedor.find(
          (v) => v.id_vendedor === row.id_vendedor
        );
        return vendedorId ? vendedorId.supplier_name : "N/A";
      },
    },
    {
      header: "Vendedor",
      accessor: (row) => {
        const vendedorId = vendedor.find(
          (v) => v.id_vendedor === row.id_vendedor
        );
        return vendedorId ? vendedorId.nombre_contacto : "N/A";
      },
    },
    {
      header: "Tipo Solicitud",
      accessor: "tipo_solicitud",
    },
    {
      header: "RFID",
      accessor: (row) => row.rfid || "N/A",
    },
    {
      header: "cantidad",
      accessor: "cantidad",
    },
    {
      header: "Estado",
      accessor: (row) => row.tipo,
    },
  ];

  const kardexListColumns: Column<KardexRow>[] = [
    {
      header: "Estado",
      accessor: (row) => row.tipo,
    },
    {
      header: "Fecha de Compra",
      accessor: (row) =>
        row.fecha_movimiento
          ? new Date(row.fecha_movimiento).toLocaleDateString()
          : "N/A",
    },
    {
      header: "Factura",
      accessor: (row) => row.numero_factura || "N/A",
    },
    {
      header: "Producto",
      accessor: (row) => row.nombre_producto || "N/A",
    },
    {
      header: "Cantidad Comprada",
      accessor: (row) => (
        <span className="font-medium">{Number(row.cantidad).toFixed(2)}</span>
      ),
    },
    {
      header: "Precio Unitario",
      accessor: (row) => (
        <span className="font-medium">
          L.{Number(row.precio_unitario).toFixed(2)}
        </span>
      ),
    },
    {
      header: "Proveedor",
      accessor: (row) => {
        const vendedorId = vendedor.find(
          (s) => s.id_vendedor === row.id_vendedor
        );
        return vendedorId ? vendedorId.supplier_name : "N/A";
      },
    },
    {
      header: "Vendedor",
      accessor: (row) => {
        const vendedorId = vendedor.find(
          (s) => s.id_vendedor === row.id_vendedor
        );
        return vendedorId ? vendedorId.nombre_contacto : "N/A";
      },
    },
    {
      header: "ISV",
      accessor: (row) => (row.ISV ? "15%" : "0.00"),
    },
    {
      header: "Total",
      accessor: "total",
    },
    {
      header: "Cantidad Recepcionada",
      accessor: "cantidad_recepcionada",
      editable: true,
    },
    {
      header: "Observación",
      accessor: "observacion",
      editable: true,
    },
    {
      header: "Descripción",
      accessor: "descripcion",
      editable: true,
    },
    {
      header: "Fecha de Vencimiento",
      accessor: "fecha_vencimiento",
      editable: true,
    },
    {
      header: "Número de Lote",
      accessor: "numero_lote",
      editable: true,
    },
    {
      header: "Unidad",
      accessor: (row) => {
        const unidad = scompras.find((s) => s.id_scompra === row.id_scompra);
        return unidad ? unidad.nombre_unidad : "N/A";
      },
    },
    {
      header: "Tipo de Movimiento",
      accessor: "tipo_movimiento",
      editable: false,
    },
    {
      header: "RFID",
      accessor: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="text"
            value={row.rfid || ""}
            readOnly
            style={{ width: 120 }}
          />
          <button
            type="button"
            title="Escanear RFID"
            onClick={() => setRfidScanRow(row.id_shopping)}
            style={{
              background: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "2px 8px",
              cursor: "pointer",
            }}
          >
            📡
          </button>
        </div>
      ),
      editable: false, // El input no es editable manualmente
    },
  ];

  const kardexFields: FieldConfig[] = [
    {
      name: "tipo_solicitud",
      label: "Solicitud",
      type: "select",
      options: [
        { label: "Requisicion", value: "Requisicion" }
      ],
      required: true,
    },
    {
      name: "id_scompra",
      label: "Factura",
      type: "select",
      options: shopping
        .filter(
          (s, idx, arr) =>
            arr.findIndex((other) => other.id_scompra === s.id_scompra) === idx
        )
        .map((s) => ({
          label: s.shopping_order_id,
          value: s.id_scompra,
        })),
      required: true,
      disabled: (values) => values.tipo_solicitud !== "Requisicion",
      showIf: (values) => values.tipo_solicitud === "Requisicion",
    },
    {
      name: "id_detalle_pacto",
      label: "Pactos",
      type: "select",
      options: detallePactos.map((pacto) => ({
        label: pacto.id_units_x_pacts,
        value: pacto.id_units_x_pacts,
      })),
      required: true,
      disabled: (values) => values.tipo_solicitud !== "Pacto",
      showIf: (values) => values.tipo_solicitud === "Pacto",
    },
  ];

  useEffect(() => {
    if (itemToEditList && originalItemToEditList) {
      setValidateEdition(
        JSON.stringify(itemToEditList) ===
          JSON.stringify(originalItemToEditList)
      );
    } else {
      setValidateEdition(true); // Si no hay edición, está validado
    }
  }, [itemToEditList, originalItemToEditList]);

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

  // Utilidad para comparar dos objetos shallow (puedes usar una comparación profunda si lo necesitas)
  const isObjectEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

  const isEditListChanged = () => {
    if (!originalItemToEditList || !dataListForm) return false;
    if (originalItemToEditList.length !== dataListForm.length) return true;

    for (let i = 0; i < originalItemToEditList.length; i++) {
      const original = originalItemToEditList[i];
      const current = dataListForm[i];
      if (!isObjectEqual(original, current)) {
        return true; // Hay al menos un cambio
      }
    }
    return false; // Todos los objetos son iguales
  };

  // 4. EFFECTS
  useEffect(() => {
    // Carga productos y kardex al montar
    Promise.all([
      GetKardexContext(),
      GetProductsContext(),
      GetShoppingContext(),
      GetDetallePactosContext(),
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let data = [...kardexDetail];

    // Filtrado según la URL
    if (location.pathname === "/kardex") {
      data = data.filter((item) => item.tipo === "Aprobado");
    } else if (location.pathname === "/KardexRechazadas") {
      data = data.filter((item) => item.tipo === "Rechazado");
    } else if (location.pathname === "/KardexPendiente") {
      data = data.filter((item) => item.tipo === "Pendiente");
    } else if (location.pathname === "/KardexCancelada") {
      data = data.filter((item) => item.tipo === "Cancelado");
    } else if (location.pathname === "/KardexHistorico") {
      // No filtrar, mostrar todo
    } else if (status !== "Todo") {
      data = data.filter((item) => item.tipo === status);
    }

    data.sort(
      (a, b) =>
        new Date(a.fecha_movimiento).getTime() -
        new Date(b.fecha_movimiento).getTime()
    );

    const runningStock: Record<string, number> = {};
    const processed: KardexRow[] = data.map((row) => {
      const key = `${row.id_product}-${row.nombre_de_factura}`;
      if (runningStock[key] === undefined) runningStock[key] = 0;
      const qty = Number(row.cantidad);
      const delta = row.tipo_movimiento === "Entrada" ? qty : -qty;
      runningStock[key] += delta;

      // Buscar la compra relacionada para completar los datos
      const compra = shopping.find((s) => s.id_shopping === row.id_shopping);

      return {
        ...compra,
        ...row,
        calculado_stock: runningStock[key],
      };
    });

    setFilteredData(processed);
  }, [kardexDetail, status, shopping, location.pathname]);

  // Filtrado para mostrar solo los registros propios, excepto para roles especiales
  const filteredDataByRole =
    roleName === "Super Admin" || roleName === "Jefe Almacen"
      ? filteredData
      : filteredData.filter((row) => row.id_empleado_sf === idEmployes);

  if (loading) return <div>Cargando kardex…</div>;

  const cargarProductosDeCompra = async (id_scompra: string) => {
    try {
      const compra = shopping.filter((s) => s.id_scompra === id_scompra);

      const cargadoEnKardex = kardex.filter((k) => k.id_scompra === id_scompra);

      if (!compra) {
        toast.error("Compra no encontrada.");
        return [];
      }

      // Si tienes los productos en la compra:
      if (!compra || compra.length === 0) {
        toast.error("No se encontraron productos en la compra seleccionada.");
        return [];
      }

      if (isSalida && cargadoEnKardex.length > 0) {
        // Si es una salida y ya hay productos cargados en el kardex, cargar solo los productos aprobados
        const productosSalida = cargarProductosParaSalida(compra[0].id_shopping);
        if (productosSalida.length === 0) {
          toast.error("No hay productos aprobados para esta salida.");
          return [];
        }
        return productosSalida;
      }

      // Formatea los productos para el Kardex
      const productosFormateados = compra.map((producto: any) => ({
        id_temp: crypto.randomUUID(),
        id_scompra: producto.id_scompra,
        id_shopping: producto.id_shopping,
        numero_factura: producto.shopping_order_id,
        id_product: producto.id_product,
        nombre_producto: producto.nombre_producto,
        cantidad: producto.cantidad_comprada || 0,
        cantidad_solicitada: producto.cantidad_solicitada || 0,
        cantidad_recepcionada: producto.cantidad_recepcionada || 0,
        precio_unitario: producto.precio_unitario || 0,
        isv: producto.ISV || 0,
        total: producto.total || 0,
        tipo_movimiento: isSalida ? "Salida" : "Entrada",
        fecha_movimiento: formattedDate(),
        tipo: "Pendiente",
        id_vendedor: producto.id_vendedor || "",
        rfid: producto.rfid || producto.rfid || "",
        anio_creacion: new Date().getFullYear(),
        tipo_solicitud: producto.id_scompra ? "Requisicion" : "Pacto",
        requisicion_numero: producto.requisicion_numero || "",
      }));

      return productosFormateados;
    } catch (error) {
      toast.error("Error al cargar productos de la compra");
      return dataListForm;
    }
  };

  const handleEditRow = (
    rowKey: string,
    newValues: Partial<ShoppingInterface>
  ) => {
    setDataListForm((prev) =>
      prev.map((item) =>
        item.id_shopping === rowKey ? { ...item, ...newValues } : item
      )
    );
  };

  const handleFormChange = async (values: any, prevValues?: any) => {
      if (values.id_scompra && values.id_scompra !== prevValues?.id_scompra) {
        const productos = await cargarProductosDeCompra(values.id_scompra);
        setDataListForm(productos);
      }
    } 


  const handleSaveAllList = async () => {
    setSaving(true);
    try {
      // CORRIGE ESTA CONDICIÓN:
      if (!isEditListChanged() && !isSalida) {
        toast.warning(
          "No se realizaron cambios. Por favor, edite algún valor antes de guardar."
        );
        setSaving(false);
        return;
      }

      for (const item of dataListForm) {
        const existeEnShopping = item.id_shopping
          ? kardex.some((s) => s.id_shopping === item.id_shopping)
          : false;

        const existeEnKardex = item.id_kardex
          ? kardex.some((s) => s.id_kardex === item.id_kardex)
          : false;

        // Asegúrate de que cantidad esté presente y sea un número
        const itemConCantidad = {
          ...item,
          cantidad: Number(item.cantidad) || 0,
          tipo: "Pendiente",
          isv: item.isv ? 0.15 : 0, // Asegúrate de que isv sea un número
        };

        if (existeEnKardex && existeEnShopping && !isSalida) {
          await PutUpdateKardexContext(item.id_kardex, itemConCantidad);
        } else {
          await PostCreateKardexContext(itemConCantidad);
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

  // Handlers de UI
  const closeAll = () => {
    setOpenModal(false);
    setDeleteOpen(false);
    setItemToDelete(null);
  };

  const openEdit = (id_kardex: string) => {
    const item = kardex.find((k) => k.id_kardex === id_kardex);
    if (item) {
      setItemToEdit({
        id_scompra: item.id_scompra,
        id_vendedor: item.id_vendedor,
        fecha_compra: item.fecha_compra,
        shopping_order_id: item.shopping_order_id,
        numero_cotizacion: item.numero_cotizacion,
        numero_pedido: item.numero_pedido,
        rfid: item.rfid,
        tipo: item.tipo,
      });
      setOpenModal(true);
      setIsReadOnly(false); // Editable
      setItemToEditList(item);
      setOriginalItemToEditList(item);
      setDataListForm([item]);
    } else {
      toast.error("No se encontró la compra seleccionada.");
    }
  };

  const openView = (id_kardex: string) => {
    const item = kardex.find((k) => k.id_kardex === id_kardex);
    if (item) {
      setItemToEdit({
        id_scompra: item.id_scompra,
        id_vendedor: item.id_vendedor,
        fecha_compra: item.fecha_compra,
        shopping_order_id: item.shopping_order_id,
        numero_cotizacion: item.numero_cotizacion,
        numero_pedido: item.numero_pedido,
        rfid: item.rfid,
        tipo: item.tipo,
      });
      setOpenModal(true);
      setIsReadOnly(true); // Solo lectura
      setItemToEditList(item);
      setOriginalItemToEditList(item);
      setDataListForm([item]);
    } else {
      toast.error("No se encontró la compra seleccionada.");
    }
  };

  const isKardexIdTaken = (kardexId: string, excludeKardexId?: string) => {
    return kardex.some(
      (k) =>
        k.id_kardex?.trim().toLowerCase() === kardexId.trim().toLowerCase() &&
        (!excludeKardexId || k.id_kardex !== excludeKardexId)
    );
  };

  const validateCreate = (values: any) => {
    const errors: any = {};
    if (values.id_kardex && isKardexIdTaken(values.id_kardex)) {
      errors.id_kardex =
        "El número de kardex ya está registrado en otra compra.";
    }
    return errors;
  };

  const openDelete = (id_kardex: string) => {
    const item = kardex.find((k) => k.id_kardex === id_kardex);
    if (item) {
      setItemToDelete(item);
      setDeleteOpen(true);
    } else {
      toast.error("No se encontró el kardex seleccionado.");
    }
  };

  const handleConfirmDelete = async (id_kardex: string) => {
    try {
      setSaving(true);
      await DeleteKardexContext(id_kardex);
      await GetKardexContext();
      toast.success("Kardex eliminado correctamente");
      closeAll();
    } catch (error) {
      console.error("Error eliminando kardex:", error);
      toast.error("Error al eliminar el kardex");
    } finally {
      setSaving(false);
    }
  };

  // Handlers específicos
  // Función helper para cambiar estado del kardex
  const changeKardexStatus = async (
    row: KardexDetail,
    newStatus: "Pendiente" | "Aprobado" | "Rechazado" | "Cancelado"
  ) => {
    const item = kardex.find((k) => k.id_kardex === row.id_kardex);
    if (item) {
      setSaving(true);
      try {
        await PutUpdateKardexContext(item.id_kardex, {
          ...item,
          tipo: newStatus,
        });
        toast.success(`Estado cambiado a ${newStatus}`);
        await GetKardexContext();
      } catch (error) {
        toast.error("Error al cambiar el estado");
      } finally {
        setSaving(false);
      }
    }
  };

  const getActionsForStatus = (status: string) => {
    switch (status) {
      case "Pendiente":
        return [
          // Solo Jefe Almacen puede aprobar o rechazar
          ...(roleName === "Jefe Almacen" || roleName === "Super Admin"
            ? [
                {
                  header: "Acciones",
                  label: "Aprobar",
                  onClick: (row: KardexDetail) =>
                    changeKardexStatus(row, "Aprobado"),
                },
                {
                  header: "Acciones",
                  label: "Rechazar",
                  onClick: (row: KardexDetail) => openDelete(row.id_kardex),
                },
              ]
            : []),
          // Solo el solicitante puede cancelar o editar
          {
            header: "Acciones",
            label: "Cancelar",
            onClick: (row: KardexDetail) =>
              row.id_empleado_sf === idEmployes
                ? changeKardexStatus(row, "Cancelado")
                : undefined,
            show: (row: KardexDetail) =>
              row.id_empleado_sf === idEmployes,
          },
          {
            header: "Acciones",
            label: "Editar",
            onClick: (row: KardexDetail) =>
              row.id_empleado_sf === idEmployes
                ? openEdit(row.id_kardex)
                : undefined,
            show: (row: KardexDetail) =>
              row.id_empleado_sf === idEmployes,
          },
        ].filter(
          (action) =>
            !action.show || (typeof action.show === "function" && action.show)
        );
      case "Aprobado":
        return [
          {
            header: "Acciones",
            label: "Ver",
            onClick: (row: KardexDetail) => openView(row.id_kardex),
          },
        ];
      case "Rechazado":
        return [
          {
            header: "Acciones",
            label: "Recuperar",
            onClick: (row: KardexDetail) =>
              changeKardexStatus(row, "Pendiente"),
          }
        ];
      case "Cancelado":
        return [
          {
            header: "Acciones",
            label: "Ver",
            onClick: (row: KardexDetail) => openEdit(row.id_kardex),
          },
          {
            header: "Acciones",
            label: "Recuperar",
            onClick: (row: KardexDetail) =>
              changeKardexStatus(row, "Pendiente"),
          },
        ];
      default:
        return [];
    }
  };

  // 6. EARLY RETURNS
  if (loading) return <div>Cargando kardex…</div>;

  // 7. RENDER
  return (
    <div>
      <ToastContainer />

      <div className="flex justify-end mb-4">
        <Button
          className="bg-hpmm-azul-claro hover:bg-hpmm-azul-oscuro text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setOpenModal(true);
            setItemToEdit(null);
            setItemToEditList(null);
            setOriginalItemToEditList(null);
            setDataListForm([]);
            setIsSalida(false); // <-- NUEVO ESTADO
          }}
        >
          + Nueva Ingreso
        </Button>
        <Button
          className="bg-hpmm-verde-claro hover:bg-hpmm-verde-oscuro text-white font-bold py-2 px-4 rounded ml-2"
          onClick={() => {
            setOpenModal(true);
            setItemToEdit(null);
            setItemToEditList(null);
            setOriginalItemToEditList(null);
            setDataListForm([]);
            setIsSalida(true);
          }}
        >
          + Nueva Salida
        </Button>
      </div>

      <GenericTable
        columns={kardexColumns}
        data={filteredDataByRole} // <-- usa el filtrado aquí
        rowKey={(row) => row.id_shopping}
        actions={getActionsForStatus(status)}
        rowClassName={(row) =>
          row.estado === false ? "opacity-40 line-through" : ""
        }
      />

      {/* Modal Crear con lista temporal */}
      <Modal isOpen={isOpenModal} onClose={closeAll} fullScreen={true}>
        {!!itemToEditList ? (
          <GenericForm<Partial<ShoppingInterface>>
            fullScreen={true}
            initialValues={itemToEditList}
            fields={kardexFields.map((f) =>
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
              setOriginalItemToEditList(null);
            }}
            onCancel={() => {
              setItemToEditList(null);
              setOriginalItemToEditList(null);
            }}
            validate={validateCreate}
            title="Editar compra de la lista"
            submitDisabled={saving}
            onChange={(values) => setItemToEditList(values)}
            readOnly={isReadOnly} // <-- Solo lectura
          />
        ) : (
          <GenericForm
            fullScreen={true}
            initialValues={
              itemToEdit
                ? itemToEdit
                : {
                    id_shopping: null,
                    id_units_x_pacts: null,
                  }
            }
            fields={kardexFields.map((f) =>
              f.name === "estado" ? { ...f, disabled: true } : f
            )}
            subTitle="Ingreso de productos al Kardex"
            onSubmit={handleAddItem}
            onCancel={() => setItemToEditList(null)}
            validate={validateCreate}
            title={
              itemToEdit
                ? "Editar compra de la lista"
                : "Crear Solicitud de Fusión"
            }
            submitDisabled={saving}
            onChange={handleFormChange}
            readOnly={isReadOnly} // <-- Solo lectura
          />
        )}
        <GenericTable
          fullScreen={true}
          editable={!isReadOnly} // <-- Solo editable si no es solo lectura
          columns={kardexListColumns}
          data={dataListForm}
          rowKey={(row) => row.id_shopping}
          onEditRow={handleEditRow}
          rowClassName={(row) =>
            row.estado === false ? "opacity-40 line-through" : ""
          }
        />
        {!isReadOnly ? (
          <RFIDScannerModal
            isOpen={!!rfidScanRow}
            onClose={() => setRfidScanRow(null)}
            onScan={(code) => {
              setDataListForm((prev) =>
                prev.map((item) =>
                  item.id_shopping === rfidScanRow
                    ? { ...item, rfid: code }
                    : item
                )
              );
              setRfidScanRow(null);
            }}
          />
        ) : null}
        {/* MODAL DE ESCANEO RFID */}

        <div className="mt-4 flex justify-end gap-2">
          {!isReadOnly ? (
            <Button
              onClick={handleSaveAllList}
              className="bg-hpmm-azul-claro hover:bg-hpmm-azul-oscuro text-white font-bold py-2 px-4 rounded"
              disabled={
                saving || dataListForm.length === 0 //||
                //(itemToEditList && validateEdition)
              }
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
          ) : null}

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
            <p>¿Seguro que deseas borrar este registro?</p>
            <GenericTable
              columns={kardexColumns}
              data={[
                itemToDelete as KardexDetail extends KardexRow
                  ? KardexRow
                  : never,
              ]}
              rowKey={(row) => row.id_shopping}
            />
            <div className="mt-4 text-right">
              <Button onClick={closeAll} className="mr-2">
                Cancelar
              </Button>
              <Button
                isPrimary
                onClick={() => handleConfirmDelete(itemToDelete.id_kardex)}
              >
                Eliminar
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Kardex;

