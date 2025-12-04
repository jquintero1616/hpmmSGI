import React, { useEffect, useState } from "react";
import { useDirection } from "../../hooks/use.Direction";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";
import { DirectionInterface } from "../../interfaces/direction.interface";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Direction: React.FC<{ status?: string }> = ({ status = "Todo" }) => {
  // 1. Hooks
  const {
    directions,
    GetDirectionsContext,
    PostCreateDirectionContext,
    PutUpdateDirectionContext,
    DeleteDirectionContext,
  } = useDirection();

  // 2. Estados locales para manejar la UI
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<DirectionInterface[]>([]);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<DirectionInterface | null>(null);
  const [itemToDelete, setItemToDelete] = useState<DirectionInterface | null>(null);
  const [saving, setSaving] = useState(false);

  // Estado local para el filtro
  const [estadoFiltro] = useState<string>("Todo");

  // 3. Funciones de validación
  const isNombreTaken = (nombre: string, excludeDirectionId?: string) => {
    return directions.some(
      (d) =>
        d.nombre.trim().toLowerCase() === nombre.trim().toLowerCase() &&
        (!excludeDirectionId || d.id_direction !== excludeDirectionId)
    );
  };

  const validateCreate = (values: any) => {
    const errors: any = {};
    if (isNombreTaken(values.nombre)) {
      errors.nombre = "El nombre de dirección ya está registrado.";
    }
    return errors;
  };

  const validateEdit = (values: any) => {
    const errors: any = {};
    if (
      itemToEdit &&
      values.nombre.trim().toLowerCase() !==
        itemToEdit.nombre.trim().toLowerCase() &&
      isNombreTaken(values.nombre, itemToEdit.id_direction)
    ) {
      errors.nombre = "El nombre de dirección ya está registrado.";
    }
    return errors;
  };

  // 4. Configuración de columnas y campos
  const directionColumns: Column<DirectionInterface>[] = [
    { header: "Nombre", accessor: "nombre" },
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

  const directionFields: FieldConfig[] = [
    {
      name: "nombre",
      label: "Nombre",
      type: "text",
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
  ];

  // 5. Función handleTableContent
  const handleTableContent = (list: DirectionInterface[]) => {
    // Filtrar elementos válidos antes de procesar
    const validDirections = list.filter(
      (item) =>
        item && item.id_direction && typeof item.id_direction === "string"
    );

    let filtrados = validDirections;
    if (status === "Activos") {
      filtrados = validDirections.filter((d) => d.estado === true);
    } else if (status === "Inactivos") {
      filtrados = validDirections.filter((d) => d.estado === false);
    }

    // Ordenar por nombre
    const ordenados = filtrados.sort((a, b) =>
      a.nombre.localeCompare(b.nombre)
    );
    setFilteredData(ordenados);
  };

  // 6. Funciones de manejo de modales
  const closeAll = () => {
    setEditOpen(false);
    setCreateOpen(false);
    setDeleteOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
  };

  const openEdit = (id_direction: string) => {
    const item = directions.find(
      (item) => item && item.id_direction === id_direction
    );

    if (item) {
      setItemToEdit(item);
      setEditOpen(true);
    } else {
      console.error("No se encontró la dirección con ID:", id_direction);
    }
  };

  const openDelete = (id_direction: string) => {
    const item = directions.find(
      (item) => item && item.id_direction === id_direction
    );

    if (item) {
      setItemToDelete(item);
      setDeleteOpen(true);
    } else {
      console.error("No se encontró la dirección con ID:", id_direction);
    }
  };

  // 7. Handlers de CRUD
  const handleConfirmDelete = async (id_direction: string) => {
    try {
      await DeleteDirectionContext(id_direction);
      await GetDirectionsContext();
      toast.success("Dirección eliminada correctamente");
      closeAll();
    } catch (error) {
      console.error("Error eliminando dirección:", error);
      toast.error("Error al eliminar la dirección");
    }
  };

  const handleSave = async (values: any) => {
    if (!itemToEdit) return;

    // Validar si hay cambios
    const hasChanges =
      values.nombre !== itemToEdit.nombre ||
      values.estado !== itemToEdit.estado;

    if (!hasChanges) {
      toast.error("No se detectaron cambios para guardar.");
      return;
    }

    // Validar si el nombre cambió y ya existe
    if (
      values.nombre.trim().toLowerCase() !==
        itemToEdit.nombre.trim().toLowerCase() &&
      isNombreTaken(values.nombre, itemToEdit.id_direction)
    ) {
      toast.error("El nombre de dirección ya está registrado.");
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<DirectionInterface> = {
        ...itemToEdit,
        ...values,
        estado: values.estado === true,
      };

      await PutUpdateDirectionContext(
        itemToEdit.id_direction,
        payload as DirectionInterface
      );
      await GetDirectionsContext();
      toast.success(`Dirección ${values.nombre} actualizada correctamente`);
      closeAll();
    } catch (error) {
      console.error("Error actualizando dirección:", error);
      toast.error("Error al actualizar la dirección");
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async (values: any) => {
    // Validar si el nombre ya existe
    if (isNombreTaken(values.nombre)) {
      toast.error("El nombre de dirección ya está registrado.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...values,
        estado: values.estado === true,
      };

      await PostCreateDirectionContext(payload as DirectionInterface);
      await GetDirectionsContext();
      toast.success(`Dirección ${values.nombre} creada correctamente`);
      closeAll();
    } catch (error) {
      console.error("Error creando dirección:", error);
      toast.error("Error al crear la dirección");
    } finally {
      setSaving(false);
    }
  };

  // 8. Effects
  useEffect(() => {
    setLoading(true);
    GetDirectionsContext().finally(() => setLoading(false));
  }, []);

  // Filtra cada vez que cambien directions o status
  useEffect(() => {
    handleTableContent(directions);
  }, [status, directions]);

  // Actualiza el filtro cuando cambie
  useEffect(() => {
    handleTableContent(directions);
  }, [estadoFiltro, directions]);

  // 9. Render condicional
  if (loading) {
    return <div>Cargando Direcciones...</div>;
  }

  // 10. Render principal
  return (
    <div>
      <ToastContainer />
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Gestión de Direcciones
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Configura las direcciones administrativas del hospital
          </p>
        </div>
        <Button
          className="bg-hpmm-azul-claro hover:bg-hpmm-azul-oscuro text-white font-bold py-2 px-4 rounded-lg"
          onClick={() => setCreateOpen(true)}
        >
          + Nueva Dirección
        </Button>
      </div>

      <GenericTable
        columns={directionColumns}
        data={filteredData}
        rowKey={(row) => row?.id_direction || ""}
        actions={[
          {
            header: "Editar",
            label: "Editar",
            actionType: "editar" as const,
            tooltip: "Editar dirección",
            onClick: (row) =>
              row?.id_direction && openEdit(row.id_direction),
          },
          {
            header: "Eliminar",
            label: "Eliminar",
            actionType: "eliminar" as const,
            tooltip: "Eliminar dirección",
            onClick: (row) =>
              row?.id_direction && openDelete(row.id_direction),
          },
        ]}
        rowClassName={(row) =>
          row.estado === false ? "opacity-40 line-through" : ""
        }
      />

      {/* Modal Editar */}
      <Modal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <GenericForm<Partial<DirectionInterface>>
            initialValues={{
              nombre: itemToEdit.nombre,
              estado: true,
            }}
            fields={directionFields}
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
            title="Editar Dirección"
            submitDisabled={saving}
          />
        )}
      </Modal>

      {/* Modal Crear */}
      <Modal isOpen={isCreateOpen} onClose={closeAll}>
        <GenericForm<Partial<DirectionInterface>>
          initialValues={{
            nombre: "",
            estado: true,
          }}
          fields={directionFields.map((f) =>
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
          title="Crear Dirección"
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

            <p>¿Seguro que deseas borrar esta dirección?</p>

            <GenericTable
              columns={directionColumns}
              data={[itemToDelete]}
              rowKey={(row) => row.id_direction}
            />

            <div className="mt-4 text-right gap-2 flex justify-center">
              <Button
                onClick={() => handleConfirmDelete(itemToDelete.id_direction)}
                className="bg-hpmm-rojo-claro hover:bg-hpmm-rojo-oscuro text-white font-bold py-2 px-4 rounded"
              >
                Eliminar
              </Button>
              <Button
                onClick={closeAll}
                className="mr-2 bg-hpmm-amarillo-claro hover:bg-hpmm-amarillo-oscuro text-gray-800 font-bold py-2 px-4 rounded"
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

export default Direction;



