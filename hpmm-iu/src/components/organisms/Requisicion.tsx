import React, { useEffect, useState } from "react";

import {
  RequisiInterface,
  RequisiDetail,
} from "../../interfaces/Requisition.interface";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column, Action } from "../molecules/GenericTable";
import DataSheet from "../molecules/DataSheet";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useProductRequisi } from "../../hooks/use.Product_requisi";
import { useRequisicion } from "../../hooks/use.Requisicion";
import { useEmploye } from "../../hooks/use.Employe";
import { useProducts } from "../../hooks/use.Product";
import { useSolicitudCompras } from "../../hooks/use.SolicitudCompras";
import { useAuth } from "../../hooks/use.Auth"; // Asegúrate de tener este hook
import { useNotificacion } from "../../hooks/use.Notificacion"; 
import { formattedDate } from "../../helpers/formatData";
import {
  createNotificationData,
  getNotificationMessage,
  CreateNotificationParams,
} from "../../helpers/notificacionHelper";

const Requisicion: React.FC<{ status: string }> = ({ status = "Todo" }) => {
  // 1. HOOKS
  const {
    requisitions,
    requisiDetail,
    GetRequisicionesContext,
    PostCreateRequisicionContext,
    PutUpdateRequisicionContext,
    DeleteRequisicionContext,
  } = useRequisicion();

  const { employes, GetEmployeContext } = useEmploye();
  const { products, GetProductsContext } = useProducts();

  const { PostCreateProductRequisitionContext } = useProductRequisi();
  const { PostCreateSolicitudCompraContext } = useSolicitudCompras();
  const { PostNotificacionContext } = useNotificacion(); // Agregamos el hook de notificaciones

  // 2. ESTADOS LOCALES
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<RequisiDetail[]>([]);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<RequisiInterface | null>(null);
  const [itemToDelete, setItemToDelete] = useState<RequisiDetail | null>(null);
  const [saving, setSaving] = useState(false);
  const [isDetailOpen, setDetailOpen] = useState(false);
  const [itemToView, setItemToView] = useState<RequisiDetail | null>(null);

  // NUEVOS ESTADOS PARA LISTA DE REQUISICIONES
  const [dataListForm, setDataListForm] = useState<any[]>([]);
  const [itemToEditList, setItemToEditList] = useState<any | null>(null);

  // ESTADO PARA MODAL DE RECHAZO
  const [isRejectOpen, setRejectOpen] = useState(false);
  const [itemToReject, setItemToReject] = useState<RequisiDetail | null>(null);
  const [motivoRechazo, setMotivoRechazo] = useState("");

  // Obtén userId y roleName del contexto de autenticación
  const { roleName, idEmployes } = useAuth();

  // 3. FUNCIONES DE VALIDACIÓN
  const validateCreate = (values: any) => {
    const errors: any = {};
    // Aquí puedes agregar validaciones específicas si necesitas
    // Por ejemplo, validar fechas o lógica de negocio
    return errors;
  };

  const validateEdit = (values: any) => {
    const errors: any = {};
    // Aquí puedes agregar validaciones específicas si necesitas
    return errors;
  };

  // 4. CONFIGURACIÓN DE COLUMNAS Y CAMPOS
  const requisicionColumns: Column<any>[] = [
    { header: "Empleado", accessor: "employee_name" },
    { header: "Unidad", accessor: "unit_name" },
    { header: "Producto", accessor: "product_name" },
    { header: "Cantidad", accessor: "cantidad" },
    {
      header: "Fecha de Solicitud",
      accessor: (row) =>
        row.fecha ? new Date(row.fecha).toLocaleDateString() : "",
    },
    { header: "Descripción", accessor: "descripcion" },
    { header: "Motivo", accessor: "motivo" },

    { header: "Estado", accessor: "estado" },
  ];

  const requisicionListColumns: Column<any>[] = [
    { header: "Empleado", accessor: "employee_name" },
    { header: "Producto", accessor: "product_name" },
    { header: "Cantidad", accessor: "cantidad" },
    {
      header: "Fecha de Solicitud",
      accessor: (row) =>
        row.fecha ? new Date(row.fecha).toLocaleDateString() : "",
    },
    { header: "Descripción", accessor: "descripcion" },
  ];
  const requisicionFields: FieldConfig[] = [
    {
      name: "id_product",
      label: "Producto",
      type: "searchable-select",
      options: products
        .filter((p) => p.id_product)
        .map((p) => ({
          label: p.nombre || p.product_name || "Sin nombre",
          value: p.id_product,
          searchTerms: p.numero_lote || "",
        })),
      required: true,
    },
    {
      name: "id_employes",
      label: "Empleado",
      type: "select",
      options: employes
        .filter((e) => e.id_employes)
        .map((e) => ({
          label: e.name || e.employee_name || "Sin nombre",
          value: e.id_employes,
        })),
      required: true,
      // defaultValue NO sirve si initialValue, por eso corregimos initialValues abajo
      defaultValue: idEmployes || "",
      disabled: roleName !== "Administrador" && roleName !== "Super Admin",
    },
    {
      name: "fecha",
      label: "Fecha",
      type: "date",
      required: true,
    },
    {
      name: "cantidad",
      label: "Cantidad",
      type: "number",
      required: true,
    },
    {
      name: "descripcion",
      label: "Descripción",
      type: "textarea",
      required: false,
      colSpan: 2,
    },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      options: [
        { label: "Pendiente", value: "Pendiente" },
        { label: "Aprobado", value: "Aprobado" },
        { label: "Rechazado", value: "Rechazado" },
        { label: "Cancelado", value: "Cancelado" },
      ],
      required: true,
    },
  ];

  // 5. FUNCIÓN PARA MANEJAR EL CONTENIDO DE LA TABLA
  const handleTableContent = (list: RequisiDetail[]) => {
    let filtrados = [...list];

    // Filtrar por usuario si no es Administrador
    if (roleName !== "Administrador" && roleName !== "Super Admin") {
      filtrados = filtrados.filter((item) => item.id_employes === idEmployes);
    }

    // Verificar IDs duplicados
    const ids = filtrados.map((item) => item.id_requisi);
    const uniqueIds = [...new Set(ids)];
    if (ids.length !== uniqueIds.length) {
      // Filtrar duplicados manteniendo solo el primero
      filtrados = filtrados.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.id_requisi === item.id_requisi)
      );
    }

    // Filtrar por estado
    if (status !== "Todo") {
      filtrados = filtrados.filter((item) => item.estado === status);
    }

    // Ordenar por fecha de creación (más recientes primero)
    const ordenados = filtrados.sort(
      (a, b) =>
        new Date(b.created_at || 0).getTime() -
        new Date(a.created_at || 0).getTime()
    );

    setFilteredData(ordenados);
  };

  // 6. FUNCIONES DE MANEJO DE MODALES
  const closeAll = () => {
    setEditOpen(false);
    setCreateOpen(false);
    setDeleteOpen(false);
    setRejectOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
    setItemToReject(null);
    setMotivoRechazo("");
  };

  const openEdit = (id_requisi: string) => {
    const item = requisitions.find((r) => r.id_requisi === id_requisi);
    setItemToEdit(item || null);
    setEditOpen(true);
  };

  const openDelete = (id_requisi: string) => {
    const item = requisiDetail.find((r) => r.id_requisi === id_requisi) || null;
    setItemToDelete(item);
    setDeleteOpen(true);
  };

  const openDetail = (row: RequisiDetail) => {
    setItemToView(row);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setItemToView(null);
    setDetailOpen(false);
  };

  // Abrir modal de rechazo
  const openReject = (row: RequisiDetail) => {
    setItemToReject(row);
    setMotivoRechazo("");
    setRejectOpen(true);
  };

  // Confirmar rechazo con motivo
  const handleConfirmReject = async () => {
    if (!itemToReject) return;
    if (!motivoRechazo.trim()) {
      toast.error("Debes ingresar un motivo para el rechazo");
      return;
    }
    await changeRequisicionStatus(itemToReject, "Rechazado", motivoRechazo);
    closeAll();
  };

  // 7. HANDLERS DE CRUD
  const handleConfirmDelete = async (id_requisi: string) => {
    setSaving(true);
    try {
      await DeleteRequisicionContext(id_requisi);
      await GetRequisicionesContext();
      toast.success("Requisición eliminada correctamente");
      closeAll();
    } catch (error) {
      toast.error("Error al eliminar la requisición");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (values: any) => {
    if (!itemToEdit) return;

    // Validar si hay cambios
    const hasChanges =
      values.id_employes !== itemToEdit.id_employes ||
      values.fecha !== itemToEdit.fecha ||
      values.estado !== itemToEdit.estado ||
      values.cantidad !== itemToEdit.cantidad;

    if (!hasChanges) {
      toast.error("No se detectaron cambios para guardar.");
      return;
    }

    setSaving(true);
    try {
      await PutUpdateRequisicionContext(itemToEdit.id_requisi, values);
      await GetRequisicionesContext();
      toast.success("Requisición actualizada correctamente");
      closeAll();
    } catch (error) {
      toast.error("Error al actualizar la requisición");
    } finally {
      setSaving(false);
    }
  };

  // FUNCIONES PARA AGREGAR, EDITAR Y ELIMINAR DE LA LISTA
  const deleteItemList = (id: string) => {
    setDataListForm((prev) => prev.filter((item) => item.id_requisi !== id));
  };

  const handleAddItem = (item: any) => {
    // Forzar id_employes si viene vacío (caso usuario no admin con campo deshabilitado)
    const effectiveIdEmployes = item.id_employes || idEmployes;

    let fechaISO = "";
    if (typeof item.fecha === "string" && /^\d{4}-\d{2}-\d{2}$/.test(item.fecha)) {
      const [year, month, day] = item.fecha.split("-");
      const localDate = new Date(Number(year), Number(month) - 1, Number(day));
      fechaISO = localDate.toISOString();
    } else if (item.fecha instanceof Date) {
      fechaISO = item.fecha.toISOString();
    } else {
      fechaISO = new Date().toISOString();
    }

    const newItem = { ...item, fecha: fechaISO, id_employes: effectiveIdEmployes };

    if (itemToEditList) {
      setDataListForm((prev) =>
        prev.map((p) =>
          p.id_requisi === itemToEditList.id_requisi
            ? { ...newItem, id_requisi: itemToEditList.id_requisi }
            : p
        )
      );
      setItemToEditList(null);
    } else {
      setDataListForm((prev) => [
        ...prev,
        { ...newItem, id_requisi: crypto.randomUUID() },
      ]);
    }
  };

  const handleCreate = async (_values: any) => {
    setSaving(true);
    try {
      if (dataListForm.length === 0) {
        toast.error("Debes agregar al menos una requisición a la lista.");
        return;
      }

      // Normalizar cada item antes de enviar
      const normalizados = dataListForm.map((it) => ({
        ...it,
        id_employes: it.id_employes || idEmployes,
      }));

      await Promise.all(
        normalizados.map(async (item) => {
          await PostCreateRequisicionContext(item);
          await PostCreateProductRequisitionContext({
            id_product: item.id_product,
            id_requisi: item.id_requisi,
            cantidad: item.cantidad,
          });

          const producto = products.find((p) => p.id_product === item.id_product);
          const empleado = employes.find((e) => e.id_employes === item.id_employes);

            const datosNotificacion = {
              producto: producto?.nombre || producto?.product_name || 'Producto desconocido',
              cantidad: item.cantidad,
              solicitante: empleado?.name || empleado?.employee_name || 'Usuario desconocido',
            };

          await notificarAdministradores('requisicion_pendiente', datosNotificacion);
        })
      );

      await GetRequisicionesContext();
      toast.success("Requisiciones creadas correctamente");
      setDataListForm([]);
      closeAll();
    } catch (error) {
      toast.error("Error al crear las requisiciones");
    } finally {
      setSaving(false);
    }
  };

  // Funciones para crear notificaciones
  const crearNotificacion = async (
    tipoEvento: CreateNotificationParams['tipo_evento'],
    destinatarioId: string,
    datosRequisicion: any
  ) => {
    try {
      const mensaje = getNotificationMessage(tipoEvento, datosRequisicion);

      const notificationData = createNotificationData({
        id_user: destinatarioId,
        mensaje,
        tipo_evento: tipoEvento,
      });

      await PostNotificacionContext(notificationData);
    } catch (error) {
      console.error("Error al crear notificación:", error);
    }
  };

  // Función para notificar a todos los administradores
  const notificarAdministradores = async (
    tipoEvento: CreateNotificationParams['tipo_evento'],
    datosRequisicion: any
  ) => {
    try {
      // Filtrar empleados que sean administradores
      const administradores = employes.filter(
        (emp) => emp.role_name === "Administrador" || emp.role_name === "Super Admin"
      );

      // Crear notificación para cada administrador
      for (const admin of administradores) {
        if (admin.id_user) { // Usar id_user en lugar de id_employes
          await crearNotificacion(tipoEvento, admin.id_user, datosRequisicion);
        }
      }
    } catch (error) {
      console.error( "Error al notificar administradores:", error);
    }
  };

  // Handlers específicos para cambiar estado
  const changeRequisicionStatus = async (row: RequisiDetail, newStatus: "Pendiente" | "Aprobado" | "Rechazado" | "Cancelado", motivo?: string) => {
    const item = requisitions.find((r) => r.id_requisi === row.id_requisi);
    if (item) {
      setSaving(true);
      try {
        // Si vuelve a Pendiente, limpiar el motivo
        const nuevoMotivo = newStatus === "Pendiente" ? "" : (motivo || item.motivo || "");
        
        await PutUpdateRequisicionContext(item.id_requisi, {
          ...item,
          estado: newStatus,
          motivo: nuevoMotivo,
        });

        // Obtener datos adicionales para la notificación
        const producto = products.find((p) => p.id_product === row.id_product);
        const datosNotificacion = {
          producto: producto?.nombre || producto?.product_name || 'Producto desconocido',
          cantidad: row.cantidad,
          solicitante: row.employee_name,
          motivo: motivo || "",
        };

        if (newStatus === "Aprobado") {
          await PostCreateSolicitudCompraContext({
            id_requisi: item.id_requisi,
            estado: "Pendiente",
          });

          // Notificar al solicitante que su requisición fue aprobada
          if (row.id_employes) {
            // Buscar el empleado para obtener su id_user
            const empleadoSolicitante = employes.find(emp => emp.id_employes === row.id_employes);
            if (empleadoSolicitante?.id_user) {
              await crearNotificacion('requisicion_aprobada', empleadoSolicitante.id_user, datosNotificacion);
            }
          }

          toast.success(
            "La requisición ha sido APROBADA"
          );
        } else if (newStatus === "Rechazado") {
          // Notificar al solicitante que su requisición fue rechazada
          if (row.id_employes) {
            // Buscar el empleado para obtener su id_user
            const empleadoSolicitante = employes.find(emp => emp.id_employes === row.id_employes);
            if (empleadoSolicitante?.id_user) {
              await crearNotificacion('requisicion_rechazada', empleadoSolicitante.id_user, datosNotificacion);
            }
          }
          toast.success(`Estado cambiado a ${newStatus}`);
        } else if (newStatus === "Cancelado") {
          // Notificar al solicitante que su requisición fue cancelada
          if (row.id_employes) {
            // Buscar el empleado para obtener su id_user
            const empleadoSolicitante = employes.find(emp => emp.id_employes === row.id_employes);
            if (empleadoSolicitante?.id_user) {
              await crearNotificacion('requisicion_cancelada', empleadoSolicitante.id_user, datosNotificacion);
            }
          }
          toast.success(`Estado cambiado a ${newStatus}`);
        } else {
          toast.success(`Estado cambiado a ${newStatus}`);
        }

        await GetRequisicionesContext();
      } catch (error) {
        toast.error("Error al cambiar el estado");
      } finally {
        setSaving(false);
      }
    }
  };

  // Configuración de acciones por estado
  const getActionsForStatus = (status: string): Action<RequisiDetail>[] => {
    const baseActions: Action<RequisiDetail>[] = [
      {
        header: "Acciones",
        label: "Ver",
        actionType: "ver",
        tooltip: "Ver detalle de requisición",
        onClick: (row: RequisiDetail) => openDetail(row),
      },
    ];

    switch (status) {
      case "Pendiente":
        const pendienteActions: Action<RequisiDetail>[] = [...baseActions];

        // Solo Administrador y Super Admin pueden aprobar/rechazar
        if (roleName === "Administrador" || roleName === "Super Admin") {
          pendienteActions.push(
            {
              header: "Acciones",
              label: "Aprobar",
              actionType: "aprobar",
              tooltip: "Aprobar requisición",
              onClick: (row: RequisiDetail) => changeRequisicionStatus(row, "Aprobado"),
            },
            {
              header: "Acciones",
              label: "Rechazar",
              actionType: "rechazar",
              tooltip: "Rechazar requisición",
              onClick: (row: RequisiDetail) => openReject(row),
            }
          );
        }

        // Agregar acciones específicas para el solicitante
        pendienteActions.push(
          {
            header: "Acciones",
            label: "Editar",
            actionType: "editar",
            tooltip: "Editar requisición",
            onClick: (row: RequisiDetail) => {
              if (row.id_employes === idEmployes) {
                openEdit(row.id_requisi);
              }
            },
          },
          {
            header: "Acciones",
            label: "Cancelar",
            actionType: "cancelar",
            tooltip: "Cancelar requisición",
            onClick: (row: RequisiDetail) => {
              if (row.id_employes === idEmployes) {
                changeRequisicionStatus(row, "Cancelado");
              }
            },
          }
        );

        return pendienteActions;

      case "Aprobado":
        const aprobadoActions: Action<RequisiDetail>[] = [...baseActions];

        // Solo Administrador y Super Admin pueden rechazar o cancelar aprobadas
        if (roleName === "Administrador" || roleName === "Super Admin") {
          aprobadoActions.push(
            {
              header: "Acciones",
              label: "Rechazar",
              actionType: "rechazar",
              tooltip: "Rechazar requisición aprobada",
              onClick: (row: RequisiDetail) => openReject(row),
            },
            {
              header: "Acciones",
              label: "Cancelar",
              actionType: "cancelar",
              tooltip: "Cancelar requisición aprobada",
              onClick: (row: RequisiDetail) => changeRequisicionStatus(row, "Cancelado"),
            }
          );
        }

        return aprobadoActions;

      case "Rechazado":
        const rechazadoActions: Action<RequisiDetail>[] = [...baseActions];

        // Solo Administrador y Super Admin pueden recuperar rechazadas
        if (roleName === "Administrador" || roleName === "Super Admin") {
          rechazadoActions.push({
            header: "Acciones",
            label: "Recuperar",
            actionType: "reactivar",
            tooltip: "Recuperar requisición rechazada",
            onClick: (row: RequisiDetail) => changeRequisicionStatus(row, "Pendiente"),
          });
        }

        return rechazadoActions;

      case "Cancelado":
        const canceladoActions: Action<RequisiDetail>[] = [...baseActions];

        // Solo el solicitante o administradores pueden recuperar canceladas
        canceladoActions.push({
          header: "Acciones",
          label: "Recuperar",
          actionType: "reactivar",
          tooltip: "Recuperar requisición cancelada",
          onClick: (row: RequisiDetail) => {
            if (row.id_employes === idEmployes || roleName === "Administrador" || roleName === "Super Admin") {
              changeRequisicionStatus(row, "Pendiente");
            }
          },
        });

        return canceladoActions;

      default:
        return baseActions;
    }
  };

  // 8. EFFECTS
  useEffect(() => {
    setLoading(true);
    Promise.all([GetRequisicionesContext(), GetEmployeContext(), GetProductsContext()])
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    handleTableContent(requisiDetail);
  }, [status, requisiDetail]);

  // 9. RENDER CONDICIONAL
  if (loading) {
    return <div>Cargando requisiciones...</div>;
  }

  const dataListFormDisplay = dataListForm.map((item) => {
    const empleado = employes.find((e) => e.id_employes === item.id_employes);
    const producto = products.find((p) => p.id_product === item.id_product);
    return {
      ...item,
      employee_name: empleado?.name || empleado?.employee_name || "Sin nombre",
      product_name: producto?.nombre || producto?.product_name || "Sin nombre",
    };
  });

  return (
    <div>
      <ToastContainer />
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Gestión de Requisiciones
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Controla las solicitudes de productos
          </p>
        </div>
        <Button
          className="bg-hpmm-azul-claro hover:bg-hpmm-azul-oscuro text-white font-bold py-2 px-4 rounded-lg"
          onClick={() => setCreateOpen(true)}
        >
          + Nueva Requisición
        </Button>
      </div>

      <GenericTable
        columns={requisicionColumns as Column<RequisiDetail>[]}
        data={filteredData}
        rowKey={(row) => row.id_requisi}
        actions={getActionsForStatus(status)}
        rowClassName={(row) =>
          row.estado === "Rechazado" 
            ? "bg-red-50 border-l-4 border-red-400 text-red-700" 
            : ""
        }
      />

      {/* Modal Editar */}
      <Modal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <GenericForm<Partial<RequisiInterface>>
            columns={2}
            initialValues={{
              id_product: itemToEdit.id_product ?? "",
              id_employes: itemToEdit.id_employes ?? "",
              fecha: itemToEdit.fecha ?? new Date().toISOString().slice(0, 10),
              estado: itemToEdit.estado ?? "Pendiente",
              cantidad: itemToEdit.cantidad ?? "0",
              descripcion: itemToEdit.descripcion ?? "",
            }}
            fields={requisicionFields}
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
            title="Editar Requisición"
            submitDisabled={saving}
          />
        )}
      </Modal>

      {/* Modal Crear */}
      <Modal isOpen={isCreateOpen} onClose={closeAll}>
        <h2 className="text-xl font-bold mb-4 text-center">
          {itemToEditList
            ? "Editar requisición de la lista"
            : "Agregar requisición a la lista"}
        </h2>
        <GenericForm<Partial<RequisiDetail>>
          columns={2}
          initialValues={
            itemToEditList
              ? itemToEditList
              : {
                  id_product: "",
                  // Aquí forzamos el empleado actual si no es Admin:
                  id_employes:
                    roleName === "Administrador" || roleName === "Super Admin"
                      ? ""
                      : idEmployes || "",
                  fecha: formattedDate(),
                  estado: "Pendiente",
                  descripcion: "",
                  cantidad: "",
                }
          }
          fields={requisicionFields.map((f) =>
            f.name === "estado" ? { ...f, disabled: true } : f
          )}
          onSubmit={handleAddItem}
          onCancel={() => {
            setItemToEditList(null);
          }}
          validate={validateCreate}
          submitLabel={itemToEditList ? "Actualizar" : "Agregar a lista"}
          cancelLabel="Cancelar edición"
          title={
            itemToEditList
              ? "Editar requisición de la lista"
              : "Agregar requisición a la lista"
          }
          submitDisabled={saving}
        />
        <GenericTable
          columns={requisicionListColumns}
          data={dataListFormDisplay}
          rowKey={(row) => row.id_requisi}
          actions={[
            {
              header: "Acciones",
              label: "Editar",
              onClick: (row) => setItemToEditList(row),
            },
            {
              header: "Eliminar",
              label: "Eliminar",
              onClick: (row) => deleteItemList(row.id_requisi),
            },
          ]}
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button
            onClick={handleCreate}
            className="bg-hpmm-azul-claro hover:bg-hpmm-azul-oscuro text-white font-bold py-2 px-4 rounded"
            disabled={saving || dataListForm.length === 0}
          >
            {saving ? (
              <span>
                <span className="animate-spin inline-block mr-2">⏳</span>
                Creando...
              </span>
            ) : (
              "Ingresar Requisiciónes"
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

            <p>¿Seguro que deseas borrar esta requisición?</p>

            <GenericTable
              columns={requisicionColumns}
              data={[itemToDelete]}
              rowKey={(row) => row.id_requisi}
            />

            <div className="mt-4 text-right gap-2 flex justify-center">
              <Button
                onClick={() => handleConfirmDelete(itemToDelete.id_requisi)}
                className="bg-hpmm-rojo-claro hover:bg-hpmm-rojo-oscuro text-white font-bold py-2 px-4 rounded"
                disabled={saving}
              >
                {saving ? (
                  <span>
                    <span className="animate-spin inline-block mr-2"></span>
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

      {/* Modal Detalle */}
      <Modal
        isOpen={isDetailOpen}
        onClose={closeDetail}
        showHeader={false}
        showFooter={false}
      >
        {itemToView && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-center text-xl font-semibold tracking-wide mb-4">
              Detalle de la Requisición
            </h2>

            <DataSheet
              items={[
                { label: "Solicitante", value: itemToView.employee_name },
                { label: "Unidad", value: itemToView.unit_name },
                { label: "Producto", value: itemToView.product_name },
                {
                  label: "Cantidad",
                  value: Number(itemToView.cantidad).toFixed(2),
                },
                { label: "Estado", value: itemToView.estado },
                {
                  label: "Fecha de Solicitud",
                  value: new Date(itemToView.fecha).toLocaleDateString(),
                },  
                { label: "Descripción", value: itemToView.descripcion || "" },
                ...(itemToView.motivo ? [{ label: "Motivo", value: itemToView.motivo }] : []),
              ]}
              columns={1}
            />

            <div className="mt-6 text-right">
              <button
                onClick={closeDetail}
                className="px-5 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-100  "
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Rechazar */}
      <Modal isOpen={isRejectOpen} onClose={closeAll}>
        {itemToReject && (
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Rechazar Requisición
            </h3>
            <div className="mb-4 space-y-2">
              <p className="text-sm"><span className="font-medium text-gray-700">Producto:</span> <span className="text-gray-900">{itemToReject.product_name}</span></p>
              <p className="text-sm"><span className="font-medium text-gray-700">Unidad:</span> <span className="text-gray-900">{itemToReject.unit_name || "Sin unidad"}</span></p>
              <p className="text-sm"><span className="font-medium text-gray-700">Solicitante:</span> <span className="text-gray-900">{itemToReject.employee_name}</span></p>
              <p className="text-sm"><span className="font-medium text-gray-700">Cantidad:</span> <span className="text-gray-900">{itemToReject.cantidad}</span></p>
            </div>
            <p className="text-gray-600 mb-4 text-center">
              ¿Estás seguro de rechazar esta requisición?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo del rechazo <span className="text-red-500">*</span>
              </label>
              <textarea
                value={motivoRechazo}
                onChange={(e) => setMotivoRechazo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={4}
                placeholder="Ingrese el motivo del rechazo..."
              />
            </div>
            <div className="flex justify-center gap-3">
              <Button
                onClick={handleConfirmReject}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                disabled={saving || !motivoRechazo.trim()}
              >
                {saving ? (
                  <span>
                    <span className="animate-spin inline-block mr-2">⏳</span>
                    Rechazando...
                  </span>
                ) : (
                  "Confirmar Rechazo"
                )}
              </Button>
              <Button
                onClick={closeAll}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                disabled={saving}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Requisicion;
