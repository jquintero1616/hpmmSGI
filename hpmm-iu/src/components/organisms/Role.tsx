// ----------------------- Roles.tsx -----------------------

import React, { useEffect, useState } from "react";
import { useRole } from "../../hooks/use.Role";
import { RolesInterface } from "../../interfaces/role.interface";
import Button from "../atoms/Buttons/Button";
import GenericModal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column,} from "../molecules/GenericTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 1. Hooks y estados locales
const Roles: React.FC<{ status?: string }> = ({ status = "Todo" }) => {
  const {
    roles,
    GetRolesContext,
    PostCreateRoleContext,
    PutUpdateRoleContext,
    DeleteRoleContext,
  } = useRole();

  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<RolesInterface[]>([]);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<RolesInterface | null>(null);
  const [itemToDelete, setItemToDelete] = useState<RolesInterface | null>(null);
  const [saving, setSaving] = useState(false);

  // 2. Validaciones personalizadas (solo nombre duplicado)
  const isNameTaken = (name: string, excludeId?: string) => {
    return roles.some(
      (r) =>
        r.name.trim().toLowerCase() === name.trim().toLowerCase() &&
        (!excludeId || r.id_rol !== excludeId)
    );
  };

  const validateCreate = (values: any) => {
    const errors: any = {};
    if (isNameTaken(values.name)) {
      errors.name = "El nombre del rol ya existe.";
    }
    return errors;
  };

  const validateEdit = (values: any) => {
    const errors: any = {};
    if (
      itemToEdit &&
      values.name.trim().toLowerCase() !== itemToEdit.name.trim().toLowerCase() &&
      isNameTaken(values.name, itemToEdit.id_rol)
    ) {
      errors.name = "El nombre del rol ya existe.";
    }
    return errors;
  };

  // 3. Configuración de columnas y campos
  const roleColumns: Column<RolesInterface>[] = [
    { header: "Nombre", accessor: "name" },
    { header: "Descripción", accessor: "descripcion" },
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

  const roleFields: FieldConfig[] = [
    {
      name: "name",
      label: "Nombre",
      type: "text",
      required: true,
    },
    {
      name: "descripcion",
      label: "Descripción",
      type: "text",
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
      disabled: true, // Solo para crear, se ajusta abajo
    },
  ];

  // 4. Función para filtrar y ordenar la tabla
  const handleTableContent = (list: RolesInterface[]) => {
    let filtrados = list;
    if (status === "Activos") {
      filtrados = list.filter((r) => r.estado === true);
    } else if (status === "Inactivos") {
      filtrados = list.filter((r) => r.estado === false);
    }
    // Ordenar por nombre
    const ordenados = filtrados.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setFilteredData(ordenados);
  };

  // 5. Funciones de manejo de modales
  const closeAll = () => {
    setEditOpen(false);
    setCreateOpen(false);
    setDeleteOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
    setSaving(false);
  };

  const openEdit = (id_rol: string) => {
    setItemToEdit(roles.find((r) => r.id_rol === id_rol) || null);
    setEditOpen(true);
  };

  const openDelete = (id_rol: string) => {
    setItemToDelete(roles.find((r) => r.id_rol === id_rol) || null);
    setDeleteOpen(true);
  };

  // 6. Handlers de CRUD
  const handleCreate = async (values: any) => {
    if (isNameTaken(values.name)) {
      toast.error("El nombre del rol ya existe.");
      return;
    }
    setSaving(true);
    try {
      await PostCreateRoleContext({
        name: values.name,
        descripcion: values.descripcion,
        estado: true,
      });
      await GetRolesContext();
      toast.success(`Rol ${values.name} creado correctamente`);
      closeAll();
    } catch (error) {
      toast.error("Error al crear el rol.");
      setSaving(false);
    }
  };

  const handleSave = async (values: any) => {
    if (!itemToEdit) return;
    // Validar si hay cambios
    const hasChanges =
      values.name !== itemToEdit.name ||
      values.descripcion !== itemToEdit.descripcion;
    if (!hasChanges) {
      toast.error("No se detectaron cambios para guardar.");
      return;
    }
    // Validar nombre duplicado
    if (
      values.name.trim().toLowerCase() !== itemToEdit.name.trim().toLowerCase() &&
      isNameTaken(values.name, itemToEdit.id_rol)
    ) {
      toast.error("El nombre del rol ya existe.");
      return;
    }
    setSaving(true);
    try {
      await PutUpdateRoleContext(itemToEdit.id_rol, {
        ...itemToEdit,
        name: values.name,
        descripcion: values.descripcion,
        estado: itemToEdit.estado,
      });
      await GetRolesContext();
      toast.success(`Rol ${values.name} actualizado correctamente`);
      closeAll();
    } catch (error) {
      toast.error("Error al actualizar el rol.");
      setSaving(false);
    }
  };

  const handleConfirmDelete = async (id_rol: string) => {
    setSaving(true);
    try {
      await DeleteRoleContext(id_rol);
      await GetRolesContext();
      toast.success("Rol desactivado correctamente");
      closeAll();
    } catch (error) {
      toast.error("Error al desactivar el rol.");
      setSaving(false);
    }
  };

  // 7. Effects
  useEffect(() => {
    setLoading(true);
    GetRolesContext().finally(() => setLoading(false));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    handleTableContent(roles);
    // eslint-disable-next-line
  }, [roles, status]);

  // 8. Render condicional
  if (loading) return <div>Cargando roles…</div>;

  // 9. Render principal
  return (
    <div>
      <ToastContainer />
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Gestión de Roles
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Define los roles y permisos del sistema
          </p>
        </div>
        <Button
          className="bg-hpmm-azul-claro hover:bg-hpmm-azul-oscuro text-white font-bold py-2 px-4 rounded-lg"
          onClick={() => setCreateOpen(true)}
        >
          + Nuevo rol
        </Button>
      </div>
      <GenericTable
        columns={roleColumns}
        data={filteredData}
        rowKey={(row) => row.id_rol}
        actions={[
          {
            header: "Editar",
            label: "Editar",
            actionType: "editar" as const,
            tooltip: "Editar rol",
            onClick: (row) => openEdit(row.id_rol),
          },
          {
            header: "Eliminar",
            label: "Eliminar",
            actionType: "eliminar" as const,
            tooltip: "Eliminar rol",
            onClick: (row) => openDelete(row.id_rol),
          },
        ]}
        rowClassName={(row) =>
          row.estado === false ? "opacity-40 line-through" : ""
        }
      />

      {/* Modal Crear */}
      <GenericModal isOpen={isCreateOpen} onClose={closeAll}>
        <GenericForm
          initialValues={{
            name: "",
            descripcion: "",
            estado: true,
          }}
          fields={roleFields.map((f) =>
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
          title="Crear Rol"
          submitDisabled={saving}
        />
      </GenericModal>

      {/* Modal Editar */}
      <GenericModal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <GenericForm
            initialValues={{
              name: itemToEdit.name ?? "",
              descripcion: itemToEdit.descripcion ?? "",
              estado: itemToEdit.estado,
            }}
            fields={roleFields}
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
            title="Editar Rol"
            submitDisabled={saving}
          />
        )}
      </GenericModal>

      {/* Modal Eliminar */}
      <GenericModal isOpen={isDeleteOpen} onClose={closeAll}>
        {itemToDelete && (
          <>
            <h3 className="text-xl font-semibold mb-4 text-center">
              Confirmar Desactivación
            </h3>
            <p className="text-center mb-2">
              ¿Seguro que deseas desactivar el rol{" "}
              <strong>{itemToDelete.name}</strong>?
            </p>
            <GenericTable
              columns={roleColumns}
              data={[itemToDelete]}
              rowKey={(row) => row.id_rol}
            />
            <div className="mt-4 text-right gap-2 flex justify-center">
              <Button
                onClick={() => handleConfirmDelete(itemToDelete.id_rol)}
                className="bg-hpmm-rojo-claro hover:bg-hpmm-rojo-oscuro text-white font-bold py-2 px-4 rounded"
                disabled={saving}
              >
                {saving ? (
                  <span>
                    <span className="animate-spin inline-block mr-2">⏳</span>
                    Desactivando...
                  </span>
                ) : (
                  "Desactivar"
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
      </GenericModal>
    </div>
  );
};

export default Roles;