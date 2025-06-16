import React, { useEffect, useState } from "react";
import { ScomprasInterface } from "../../interfaces/SolicitudCompras.inteface";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSolicitudCompras } from "../../hooks/use.SolicitudCompras";
import { useRequisicion } from "../../hooks/use.Requisicion";

const SolicitudCompras: React.FC<{ status?: string }> = ({ status = "Todo" }) => {
  // 1. HOOKS
  const {
    scompras,
    GetSolicitudesComprasContext,
    PostCreateSolicitudCompraContext,
    PutUpdateSolicitudCompraContext,
    DeleteSolicitudCompraContext,
  } = useSolicitudCompras();

  const { requisitions, GetRequisicionesContext } = useRequisicion();

  // 2. ESTADOS LOCALES
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<ScomprasInterface[]>([]);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ScomprasInterface | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ScomprasInterface | null>(null);
  const [saving, setSaving] = useState(false);

  // 3. FUNCIONES DE VALIDACIÓN
  const validateCreate = (values: any) => {
    const errors: any = {};
    if (isRequisicionTaken(values.id_requisi)) {
      errors.id_requisi = "Esta requisición ya tiene una solicitud de compra asignada.";
    }
    return errors;
  };

  const validateEdit = (values: any) => {
    const errors: any = {};
    if (
      itemToEdit &&
      values.id_requisi !== itemToEdit.id_requisi &&
      isRequisicionTaken(values.id_requisi, itemToEdit.id_scompra)
    ) {
      errors.id_requisi = "Esta requisición ya tiene una solicitud de compra asignada.";
    }
    return errors;
  };

  // 4. CONFIGURACIÓN DE COLUMNAS Y CAMPOS
  const solicitudComprasColumns: Column<ScomprasInterface>[] = [
    { header: "ID Solicitud", accessor: "id_scompra" },
    { header: "ID Requisición", accessor: "id_requisi" },
    {
      header: "Estado",
      accessor: "estado",
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

  const solicitudComprasFields: FieldConfig[] = [
    {
      name: "id_requisi",
      label: "Requisición",
      type: "select",
      options: requisitions
        .filter((r) => r.id_requisi) // Filtrar requisiciones válidas
        .map((r) => ({
          label: `${r.id_requisi} - ${r.estado }`,
          value: r.id_requisi,
        })),
      required: true,
    },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      options: [
        { label: "Pendiente", value: "Pendiente" },
        { label: "Comprado", value: "Comprado" },
        { label: "Cancelado", value: "Cancelado" },
      ],
      required: true,
    },
  ];

  // 5. FUNCIÓN PARA MANEJAR EL CONTENIDO DE LA TABLA
  const handleTableContent = (list: ScomprasInterface[]) => {
    let filtrados = [...list];

    // CORRECCIÓN: Verificar IDs duplicados como en Requisicion
    const ids = filtrados.map((item) => item.id_scompra);
    const uniqueIds = [...new Set(ids)];
    if (ids.length !== uniqueIds.length) {
      // Filtrar duplicados manteniendo solo el primero
      filtrados = filtrados.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.id_scompra === item.id_scompra)
      );
    }

    // CORRECCIÓN: Filtrar por status prop, no estadoFiltro
    if (status !== "Todo") {
      filtrados = filtrados.filter((item) => item.estado === status);
    }

    // CORRECCIÓN: Ordenar por fecha de creación como en Requisicion
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
    setItemToEdit(null);
    setItemToDelete(null);
  };

  const openEdit = (id_scompra: string) => {
    const item = scompras.find((s) => s.id_scompra === id_scompra);
    setItemToEdit(item || null);
    setEditOpen(true);
  };

  const openDelete = (id_scompra: string) => {
    const item = scompras.find((s) => s.id_scompra === id_scompra) || null;
    setItemToDelete(item);
    setDeleteOpen(true);
  };

  // 7. HANDLERS DE CRUD
  const handleConfirmDelete = async (id_scompra: string) => {
    setSaving(true);
    try {
      await DeleteSolicitudCompraContext(id_scompra);
      await GetSolicitudesComprasContext();
      toast.success("Solicitud de compra eliminada correctamente");
      closeAll();
    } catch (error) {
      toast.error("Error al eliminar la solicitud de compra");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (values: any) => {
    if (!itemToEdit) return;

    // Validar si hay cambios
    const hasChanges =
      values.id_requisi !== itemToEdit.id_requisi ||
      values.estado !== itemToEdit.estado;

    if (!hasChanges) {
      toast.error("No se detectaron cambios para guardar.");
      return;
    }

    // Solo validar si la requisición cambió
    if (
      values.id_requisi !== itemToEdit.id_requisi &&
      isRequisicionTaken(values.id_requisi, itemToEdit.id_scompra)
    ) {
      toast.error("Esta requisición ya tiene una solicitud de compra asignada.");
      return;
    }

    setSaving(true);
    try {
      await PutUpdateSolicitudCompraContext(itemToEdit.id_scompra, values);
      await GetSolicitudesComprasContext();
      toast.success("Solicitud de compra actualizada correctamente");
      closeAll();
    } catch (error) {
      toast.error("Error al actualizar la solicitud de compra");
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async (values: any) => {
    // Validar si la requisición ya está asignada
    if (isRequisicionTaken(values.id_requisi)) {
      toast.error("Esta requisición ya tiene una solicitud de compra asignada.");
      return;
    }

    setSaving(true);
    try {
      await PostCreateSolicitudCompraContext(values);
      await GetSolicitudesComprasContext();
      toast.success("Solicitud de compra creada correctamente");
      closeAll();
    } catch (error) {
      toast.error("Error al crear la solicitud de compra");
    } finally {
      setSaving(false);
    }
  };

  // Función para validar si la requisición ya está asignada
  const isRequisicionTaken = (id_requisi: string, excludeId?: string) => {
    return scompras.some(
      (s) =>
        s.id_requisi === id_requisi &&
        (!excludeId || s.id_scompra !== excludeId)
    );
  };

  // 8. EFFECTS
  useEffect(() => {
    setLoading(true);
    Promise.all([GetSolicitudesComprasContext(), GetRequisicionesContext()]).finally(() =>
      setLoading(false)
    );
  }, []);

  useEffect(() => {
    handleTableContent(scompras);
  }, [scompras, status]); // CORRECCIÓN: Usar status prop, no estadoFiltro



  // 9. RENDER CONDICIONAL
  if (loading) {
    return <div>Cargando solicitudes de compras...</div>;
  }

  // 10. RENDER PRINCIPAL
  return (
    <div>
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4 text-center">Gestión de Solicitudes de Compras</h1>

      <div className="flex justify-end mb-4">
        <Button
          className="bg-hpmm-azul-claro hover:bg-hpmm-azul-oscuro text-white font-bold py-2 px-4 rounded"
          onClick={() => setCreateOpen(true)}
        >
          + Nueva solicitud de compra
        </Button>
      </div>

      <GenericTable
        columns={solicitudComprasColumns}
        data={filteredData}
        rowKey={(row) => row.id_scompra}
        actions={[
          {
            header: "Acciones",
            label: "Editar",
            onClick: (row) => openEdit(row.id_scompra),
          },
          {
            header: "Acciones",
            label: "Eliminar",
            onClick: (row) => openDelete(row.id_scompra),
          },
        ]}
        rowClassName={(row) =>
          row.estado === "Cancelado" ? "opacity-40 line-through" : ""
        }
      />

      {/* Modal Editar */}
      <Modal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <GenericForm<Partial<ScomprasInterface>>
            initialValues={{
              id_scompra: itemToEdit.id_scompra ?? "",
              id_requisi: itemToEdit.id_requisi ?? "",
              estado: itemToEdit.estado ?? "Pendiente",
            }}
            fields={solicitudComprasFields}
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
            title="Editar Solicitud de Compra"
            submitDisabled={saving}
          />
        )}
      </Modal>

      {/* Modal Crear */}
      <Modal isOpen={isCreateOpen} onClose={closeAll}>
        <GenericForm<Partial<ScomprasInterface>>
          initialValues={{
            id_scompra: "",
            id_requisi: "",
            estado: "Pendiente",
          }}
          fields={solicitudComprasFields.map((f) =>
            f.name === "estado" ? { ...f, disabled: true } : f
          )}
          onSubmit={handleCreate}
          onCancel={closeAll}
          validate={validateCreate}
          submitLabel={
            saving ? (
              <span>
                <span className="animate-spin inline-block mr-2">⏳</span>
                Creando...
              </span>
            ) : (
              "Crear"
            )
          }
          cancelLabel="Cancelar"
          title="Crear Solicitud de Compra"
          submitDisabled={saving}
        />
      </Modal>

      {/* Modal Eliminar */}
      <Modal isOpen={isDeleteOpen} onClose={closeAll}>
        {itemToDelete && (
          <>
            <h3 className="text-xl font-semibold mb-4">
              Confirmar Eliminación
            </h3>

            <p>¿Seguro que deseas borrar esta solicitud de compra?</p>

            <GenericTable
              rowKey={(row) => row.id_scompra}
              data={[itemToDelete]}
              columns={solicitudComprasColumns}
            />

            <div className="mt-4 text-right gap-2 flex justify-center">
              <Button
                onClick={() => handleConfirmDelete(itemToDelete.id_scompra)}
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

export default SolicitudCompras;