import React, { useEffect, useState } from "react";
import { SubdireccionInterface } from "../../interfaces/subdireccion.interface";
import { useSubdireccion } from "../../hooks/use.subdireccion";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Subdireccion: React.FC<{ status?: string }> = ({ status = "Todo" }) => {
  const {
    subdireccion,
    GetSubdireccionesContext,
    PostCreateSubdireccionContext,
    PutUpdateSubdireccionContext,
    DeleteSubdireccionContext,
  } = useSubdireccion();

  // Estados locales para manejar la UI
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<SubdireccionInterface[]>([]);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<SubdireccionInterface | null>(null);
  const [itemToDelete, setItemToDelete] = useState<SubdireccionInterface | null>(null);
  const [saving, setSaving] = useState(false);

  // Estado local para el filtro
  const [estadoFiltro] = useState<string>("Todo");

  // 1) Columnas de la tabla
  const subdireccionColumns: Column<SubdireccionInterface>[] = [
    { header: "Dirección", accessor: "id_direction" },
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

  // 2) Campos para el formulario
  const subdireccionFields: FieldConfig[] = [
    {
      name: "id_direction",
      label: "Dirección",
      type: "text",
      required: true,
    },
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

  // 4) Carga subdirecciones solo al montar
  useEffect(() => {
    setLoading(true);
    GetSubdireccionesContext().finally(() => setLoading(false));
  }, []);

  // 5) Filtra cada vez que cambien subdireccion o status
  useEffect(() => {
    handleTableContent(subdireccion);
  }, [status, subdireccion]);

  // Función para validar si el nombre ya existe (ignorando mayúsculas/minúsculas)
  const isNameTaken = (nombre: string, excludeId?: string) => {
    return subdireccion.some(
      (s) =>
        s.nombre.trim().toLowerCase() === nombre.trim().toLowerCase() &&
        (!excludeId || s.id_subdireccion !== excludeId)
    );
  };

  // Validación para el formulario de crear subdirección
  const validateCreate = (values: any) => {
    const errors: any = {};
    if (isNameTaken(values.nombre)) {
      errors.nombre = "El nombre ya está registrado en otra subdirección.";
    }
    return errors;
  };

  // Validación para el formulario de editar subdirección
  const validateEdit = (values: any) => {
    const errors: any = {};
    if (
      itemToEdit &&
      values.nombre.trim().toLowerCase() !==
        itemToEdit.nombre.trim().toLowerCase() &&
      isNameTaken(values.nombre, itemToEdit.id_subdireccion)
    ) {
      errors.nombre = "El nombre ya está registrado en otra subdirección.";
    }
    return errors;
  };

  const closeAll = () => {
    setEditOpen(false);
    setCreateOpen(false);
    setDeleteOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
  };

  const openEdit = (id_subdireccion: string) => {
    setItemToEdit(subdireccion.find((s) => s.id_subdireccion === id_subdireccion) || null);
    setEditOpen(true);
  };

  const openDelete = (id_subdireccion: string) => {
    setItemToDelete(subdireccion.find((s) => s.id_subdireccion === id_subdireccion) || null);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async (id_subdireccion: string) => {
    await DeleteSubdireccionContext(id_subdireccion);
    await GetSubdireccionesContext();
    closeAll();
  };

  // Modifica handleTableContent para usar estadoFiltro
  const handleTableContent = (list: SubdireccionInterface[]) => {
    let filtrados = list;
    if (estadoFiltro === "Activos") {
      filtrados = list.filter((s) => s.estado === true);
    } else if (estadoFiltro === "Inactivos") {
      filtrados = list.filter((s) => s.estado === false);
    }
    // Ordenar por nombre
    const ordenados = filtrados.sort((a, b) =>
      a.nombre.localeCompare(b.nombre)
    );
    setFilteredData(ordenados);
  };

  // Actualiza el filtro cuando cambie
  useEffect(() => {
    handleTableContent(subdireccion);
  }, [estadoFiltro, subdireccion]);

  const handleSave = async (values: any) => {
    if (!itemToEdit) return;

    // Validar si hay cambios
    const hasChanges =
      values.id_direction !== itemToEdit.id_direction ||
      values.nombre !== itemToEdit.nombre ||
      values.estado !== itemToEdit.estado;

    if (!hasChanges) {
      toast.error("No se detectaron cambios para guardar.");
      return;
    }

    // Solo validar si el nombre cambió
    if (
      values.nombre.trim().toLowerCase() !==
        itemToEdit.nombre.trim().toLowerCase() &&
      isNameTaken(values.nombre, itemToEdit.id_subdireccion)
    ) {
      toast.error("El nombre ya está registrado en otra subdirección.");
      return;
    }

    setSaving(true);
    const payload: Partial<SubdireccionInterface> = {
      ...itemToEdit,
      ...values,
      estado: values.estado === true,
    };

    await PutUpdateSubdireccionContext(itemToEdit.id_subdireccion, payload as SubdireccionInterface);
    await GetSubdireccionesContext();
    setSaving(false);
    toast.success(`Subdirección ${values.nombre} actualizada correctamente`);
    closeAll();
  };

  const handleCreate = async (values: any) => {
    // Validar si el nombre ya existe
    if (isNameTaken(values.nombre)) {
      toast.error("El nombre ya está registrado en otra subdirección.");
      return;
    }

    setSaving(true);
    await PostCreateSubdireccionContext(values as SubdireccionInterface);
    await GetSubdireccionesContext();
    setSaving(false);
    toast.success(`Subdirección ${values.nombre} creada correctamente`);
    closeAll();
  };

  if (loading) {
    return <div>Cargando subdirecciones…</div>;
  }

  return (
    <div>
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4 text-center">Lista de Subdirecciones</h1>

      <div className="flex justify-end mb-4">
        <Button
          className="bg-hpmm-azul-claro hover:bg-hpmm-azul-oscuro text-white font-bold py-2 px-4 rounded"
          onClick={() => setCreateOpen(true)}
        >
          + Nueva subdirección
        </Button>
      </div>

      <GenericTable
        columns={subdireccionColumns}
        data={filteredData}
        rowKey={(row) => row.id_subdireccion}
        actions={[
          {
            header: "Editar",
            label: "Editar",
            onClick: (row) => openEdit(row.id_subdireccion),
          },
          {
            header: "Eliminar",
            label: "Eliminar",
            onClick: (row) => openDelete(row.id_subdireccion),
          },
        ]}
        // Agrega esta prop para custom row styling
        rowClassName={(row) =>
          row.estado === false ? "opacity-40 line-through" : ""
        }
      />

      {/* Modal Editar */}
      <Modal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <GenericForm<Partial<SubdireccionInterface>>
            initialValues={{
              id_direction: itemToEdit.id_direction ?? "",
              nombre: itemToEdit.nombre ?? "",
              estado: itemToEdit.estado,
            }}
            fields={subdireccionFields}
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
            title="Editar Subdirección"
            submitDisabled={saving}
          />
        )}
      </Modal>

      {/* Modal Crear */}
      <Modal isOpen={isCreateOpen} onClose={closeAll}>
        <GenericForm<Partial<SubdireccionInterface>>
          initialValues={{
            id_direction: "",
            nombre: "",
            estado: true,
          }}
          fields={subdireccionFields.map((f) =>
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
          title="Crear Subdirección"
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

            <p>¿Seguro que deseas borrar esta subdirección?</p>

            <GenericTable
              rowKey={(row) => row.id_subdireccion}
              data={[itemToDelete]}
              columns={subdireccionColumns}
            />

            <div className="mt-4 text-right gap-2 flex justify-center">
              <Button
                onClick={() => handleConfirmDelete(itemToDelete.id_subdireccion)}
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

export default Subdireccion;
