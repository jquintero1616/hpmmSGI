import React, { useEffect, useState } from "react";
import { useUnit } from "../../hooks/use.Unit";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";
import { UnitInterface } from "../../interfaces/Units.interface";
import { useSubdireccion } from "../../hooks/use.subdireccion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Unit: React.FC<{ status?: string }> = ({ status = "Todo" }) => {
  // Hooks
  const {
    units,
    GetUnitsContext,
    PostCreateUnitContext,
    PutUpdateUnitContext,
    DeleteUnitContext,
  } = useUnit();

  const { subdireccion, GetSubdireccionesContext } = useSubdireccion();

  // Estados locales para manejar la UI
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<UnitInterface[]>([]);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<UnitInterface | null>(null);
  const [itemToDelete, setItemToDelete] = useState<UnitInterface | null>(null);
  const [saving, setSaving] = useState(false);

  // Estado local para el filtro
  const [estadoFiltro] = useState<string>("Todo");

  // Funciones de validación
  const isNameTaken = (name: string, excludeUnitId?: string) => {
    return units.some(
      (u) =>
        u.name.trim().toLowerCase() === name.trim().toLowerCase() &&
        (!excludeUnitId || u.id_units !== excludeUnitId)
    );
  };

  const validateCreate = (values: any) => {
    const errors: any = {};
    if (isNameTaken(values.name)) {
      errors.name = "El nombre ya está registrado en otra unidad.";
    }
    return errors;
  };

  const validateEdit = (values: any) => {
    const errors: any = {};
    if (
      itemToEdit &&
      values.name.trim().toLowerCase() !==
        itemToEdit.name.trim().toLowerCase() &&
      isNameTaken(values.name, itemToEdit.id_units)
    ) {
      errors.name = "El nombre ya está registrado en otra unidad.";
    }
    return errors;
  };

  // Configuración de columnas de la tabla
  const unitColumns: Column<UnitInterface>[] = [
    { header: "Subdireccion", accessor: "id_subdireccion" },
    { header: "Nombre", accessor: "name" },
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

  // Configuración de campos del formulario
  const unitFields: FieldConfig[] = React.useMemo(
    () => [
      { 
        name: "name", 
        label: "Nombre", 
        type: "text",
        required: true 
      },
      {
        name: "id_subdireccion",
        label: "Subdirección",
        type: "select",
        options: subdireccion.map((c) => ({ label: c.nombre, value: c.id_subdireccion })),
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
    [subdireccion]
  );

  // Función handleTableContent con filtrado y ordenamiento
  const handleTableContent = (list: UnitInterface[]) => {
    // Asegurar que todos los elementos sean válidos
    const validList = list.filter(
      (item) => item && item.id_units && typeof item.id_units === "string"
    );

    let filtrados = validList;
    if (estadoFiltro === "Activos") {
      filtrados = validList.filter((u) => u.estado === true);
    } else if (estadoFiltro === "Inactivos") {
      filtrados = validList.filter((u) => u.estado === false);
    } else if (status === "Activos") {
      filtrados = validList.filter((u) => u.estado === true);
    }

    // Ordenar por nombre
    const ordenados = filtrados.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setFilteredData(ordenados);
  };

  // Funciones de manejo de modales
  const closeAll = () => {
    setEditOpen(false);
    setCreateOpen(false);
    setDeleteOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
  };

  const openEdit = (id_units: string) => {
    if (!units || units.length === 0) {
      return;
    }

    const item = units.find((item) => item && item.id_units === id_units);

    if (item) {
      setItemToEdit(item);
      setEditOpen(true);
    } else {
      console.error("No se encontró la unidad con ID:", id_units);
    }
  };

  const openDelete = (id_units: string) => {
    if (!units || units.length === 0) {
      return;
    }

    const item = units.find((item) => item && item.id_units === id_units);

    if (item) {
      setItemToDelete(item);
      setDeleteOpen(true);
    } else {
      console.error("No se encontró la unidad con ID:", id_units);
    }
  };

  // Handlers de CRUD
  const handleConfirmDelete = async (id_units: string) => {
    try {
      await DeleteUnitContext(id_units);
      await GetUnitsContext();
      toast.success("Unidad eliminada correctamente");
      closeAll();
    } catch (error) {
      console.error("Error eliminando unidad:", error);
      toast.error("Error al eliminar la unidad");
    }
  };

  const handleSave = async (values: any) => {
    if (!itemToEdit) return;

    // Validar si hay cambios
    const hasChanges =
      values.name !== itemToEdit.name ||
      values.id_subdireccion !== itemToEdit.id_subdireccion ||
      values.estado !== itemToEdit.estado;

    if (!hasChanges) {
      toast.error("No se detectaron cambios para guardar.");
      return;
    }

    // Solo validar si el nombre cambió
    if (
      values.name.trim().toLowerCase() !==
        itemToEdit.name.trim().toLowerCase() &&
      isNameTaken(values.name, itemToEdit.id_units)
    ) {
      toast.error("El nombre ya está registrado en otra unidad.");
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<UnitInterface> = {
        ...itemToEdit,
        ...values,
        estado: values.estado === true,
      };

      await PutUpdateUnitContext(itemToEdit.id_units, payload as UnitInterface);
      await GetUnitsContext();
      toast.success(`Unidad ${values.name} actualizada correctamente`);
      closeAll();
    } catch (error) {
      console.error("Error actualizando unidad:", error);
      toast.error("Error al actualizar la unidad");
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async (values: any) => {
    // Validar si el nombre ya existe
    if (isNameTaken(values.name)) {
      toast.error("El nombre ya está registrado en otra unidad.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...values,
        estado: values.estado === true,
      };

      await PostCreateUnitContext(payload as UnitInterface);
      await GetUnitsContext();
      toast.success(`Unidad ${values.name} creada correctamente`);
      closeAll();
    } catch (error) {
      console.error("Error creando unidad:", error);
      toast.error("Error al crear la unidad");
    } finally {
      setSaving(false);
    }
  };

  // Effects
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([GetUnitsContext(), GetSubdireccionesContext()]);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // ✅ Sin dependencias - solo se ejecuta al montar

  useEffect(() => {
    handleTableContent(units);
  }, [estadoFiltro, units, status]); // ✅ Este está bien

  // Render condicional
  if (loading) {
    return <div>Cargando Unidades...</div>;
  }

  // Render principal
  return (
    <div>
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4 text-center">Lista de Unidades</h1>

      <div className="flex justify-end mb-4">
        <Button
          className="bg-hpmm-azul-claro hover:bg-hpmm-azul-oscuro text-white font-bold py-2 px-4 rounded"
          onClick={() => setCreateOpen(true)}
        >
          + Nueva Unidad
        </Button>
      </div>

      <GenericTable
        columns={unitColumns}
        data={filteredData.filter((item) => item && item.id_units)}
        rowKey={(row) => row?.id_units || ""}
        actions={[
          {
            header: "Editar",
            label: "Editar",
            onClick: (row) => row?.id_units && openEdit(row.id_units),
          },
          {
            header: "Eliminar",
            label: "Eliminar",
            onClick: (row) => row?.id_units && openDelete(row.id_units),
          },
        ]}
        rowClassName={(row) =>
          row.estado === false ? "opacity-40 line-through" : ""
        }
      />

      {/* Modal Editar */}
      <Modal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <GenericForm<Partial<UnitInterface>>
            initialValues={{
              name: itemToEdit.name ?? "",
              id_subdireccion: itemToEdit.id_subdireccion ?? "",
              estado: true
            }}
            fields={unitFields}
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
            title="Editar Unidad"
            submitDisabled={saving}
          />
        )}
      </Modal>

      {/* Modal Crear */}
      <Modal isOpen={isCreateOpen} onClose={closeAll}>
        <GenericForm<Partial<UnitInterface>>
          initialValues={{
            name: "",
            id_subdireccion: "",
            estado: true,
          }}
          fields={unitFields.map((f) =>
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
          title="Crear Unidad"
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

            <p>¿Seguro que deseas borrar esta unidad?</p>

            <GenericTable
              columns={unitColumns}
              data={[itemToDelete]}
              rowKey={(row) => row.id_units}
            />

            <div className="mt-4 text-right gap-2 flex justify-center">
              <Button
                onClick={() => handleConfirmDelete(itemToDelete.id_units)}
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

export default Unit;
