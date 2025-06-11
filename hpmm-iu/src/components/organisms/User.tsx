// src/components/organisms/User.tsx

import React, { useEffect, useState } from "react";
import { useUser } from "../../hooks/use.User";
import { userInterface } from "../../interfaces/user.interface";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";
import { useRole } from "../../hooks/use.Role";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const User: React.FC<{ status?: string }> = ({ status = "Todo" }) => {
  const {
    users,
    GetUsersContext,
    PostCreateUserContext,
    PutUpdateUserContext,
    DeleteUserContext,
  } = useUser();

  // Asegúrate de que el hook useRole esté correctamente implementado
  const { roles, GetRolesContext } = useRole();
  const { PostCreateRoleContext } = useRole();

  //  // Estados locales para manejar la UI
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<userInterface[]>([]);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<userInterface | null>(null);
  const [itemToDelete, setItemToDelete] = useState<userInterface | null>(null);
  const [saving, setSaving] = useState(false);
  const [isRoleModalOpen, setRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState(""); // Opcional, para seleccionar el nuevo rol

  // Estado local para el filtro
  const [estadoFiltro, setEstadoFiltro] = useState<string>("Todo");

  // 1) Columnas de la tabla
  const userColumns: Column<userInterface>[] = [
    { header: "Usuario", accessor: "username" },
    { header: "Correo Electrónico", accessor: "email" },
    { header: "Rol", accessor: "role_name" },
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

  // 2) Campos fijos para el formulario (usa solo userInterface)
  const userFields: FieldConfig[] = [
    {
      name: "username",
      label: "Nombre completo",
      type: "text",
      required: true,
    },
    {
      name: "email",
      label: "Correo Electrónico",
      type: "text",
      required: true,
    },
    { name: "password", label: "Contraseña", type: "password", required: true },
    {
      name: "id_rol",
      label: "Rol",
      type: "select",
      options: roles.map((r) => ({ label: r.name, value: r.id_rol })),
      required: true,
    },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      options: ["true", "false"],
      // Si lo deshabilitas, no pongas required
    },
  ];

  // 4) Carga usuarios solo al montar
  useEffect(() => {
    setLoading(true);
    GetUsersContext().finally(() => setLoading(false));
  }, []);

  // 5) Filtra cada vez que cambien users o status
  useEffect(() => {
    handleTableContent(users);
  }, [status, users]);

  useEffect(() => {
    setLoading(true);
    Promise.all([GetUsersContext(), GetRolesContext()]).finally(() =>
      setLoading(false)
    );
  }, []);

  const closeAll = () => {
    setEditOpen(false);
    setCreateOpen(false);
    setDeleteOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
    setRoleModalOpen(false); // Cerrar modal de rol
  };

  const openEdit = (id_user: string) => {
    setItemToEdit(users.find((u) => u.id_user === id_user) || null);
    setEditOpen(true);
  };

  const openDelete = (id_user: string) => {
    setItemToDelete(users.find((u) => u.id_user === id_user) || null);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async (id_user: string) => {
    await DeleteUserContext(id_user);
    await GetUsersContext();
    closeAll();
  };

  // Modifica handleTableContent para usar estadoFiltro
  const handleTableContent = (list: userInterface[]) => {
    let filtrados = list;
    if (estadoFiltro === "Activos") {
      filtrados = list.filter((u) => u.estado === true);
    } else if (estadoFiltro === "Inactivos") {
      filtrados = list.filter((u) => u.estado === false);
    }
    // Ordenar por username
    const ordenados = filtrados.sort((a, b) =>
      a.username.localeCompare(b.username)
    );
    setFilteredData(ordenados);
  };

  // Actualiza el filtro cuando cambie
  useEffect(() => {
    handleTableContent(users);
  }, [estadoFiltro, users]);

  // Función para validar si el correo ya existe (ignorando mayúsculas/minúsculas)
  const isEmailTaken = (email: string, excludeUserId?: string) => {
    return users.some(
      (u) =>
        u.email.trim().toLowerCase() === email.trim().toLowerCase() &&
        (!excludeUserId || u.id_user !== excludeUserId)
    );
  };

  // Validación para el formulario de crear usuario
  const validateCreate = (values: any) => {
    const errors: any = {};
    if (isEmailTaken(values.email)) {
      errors.email = "El correo ya está registrado en otro usuario.";
    }
    return errors;
  };

  // Validación para el formulario de editar usuario
  const validateEdit = (values: any) => {
    const errors: any = {};
    if (
      itemToEdit &&
      values.email.trim().toLowerCase() !==
        itemToEdit.email.trim().toLowerCase() &&
      isEmailTaken(values.email, itemToEdit.id_user)
    ) {
      errors.email = "El correo ya está registrado en otro usuario.";
    }
    return errors;
  };

  const handleSave = async (values: any) => {
    if (!itemToEdit) return;

    // Solo validar si el correo cambió
    if (
      values.email.trim().toLowerCase() !==
        itemToEdit.email.trim().toLowerCase() &&
      isEmailTaken(values.email, itemToEdit.id_user)
    ) {
      toast.error("El correo ya está registrado en otro usuario.");
      return;
    }

    setSaving(true);
    const payload: Partial<userInterface> = {
      ...itemToEdit,
      ...values,
      estado: values.estado === true,
    };

    if (!values.password) {
      delete (payload as any).password;
    }

    await PutUpdateUserContext(itemToEdit.id_user, payload as userInterface);
    await GetUsersContext();
    setSaving(false);
    toast.success(`Usuario ${values.username} actualizado correctamente`);
    closeAll();
  };

  const handleCreate = async (values: any) => {
    // Validar si el correo ya existe
    if (isEmailTaken(values.email)) {
      toast.error("El correo ya está registrado en otro usuario.");
      return;
    }

    setSaving(true);
    await PostCreateUserContext(values as userInterface);
    await GetUsersContext();
    setSaving(false);
    toast.success(`Usuario ${values.username} creado correctamente`);
    closeAll();
  };

  // Nueva función para manejar la creación de roles desde el modal de usuario
  const handleCreateRoleFromUser = async (values: any) => {
    await PostCreateRoleContext({
      name: values.name,
      descripcion: values.descripcion,
      estado: true,
    });
    await GetRolesContext();
    setRoleModalOpen(false);
    setNewRoleName(values.name);
  };

  if (loading) {
    return <div>Cargando usuarios…</div>;
  }

  return (
    <div>
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4 text-center">Lista de Usuarios</h1>

      <div className="flex justify-end mb-4">
        <Button
          className="bg-hpmm-azul-claro hover:bg-hpmm-azul-oscuro text-white font-bold py-2 px-4 rounded"
          onClick={() => setCreateOpen(true)}
        >
          + Nuevo usuario
        </Button>
      </div>

      <GenericTable
        columns={userColumns}
        data={filteredData}
        rowKey={(row) => row.id_user}
        actions={[
          {
            header: "Editar",
            label: "Editar",
            onClick: (row) => openEdit(row.id_user),
          },
          {
            header: "Eliminar",
            label: "Eliminar",
            onClick: (row) => openDelete(row.id_user),
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
          <GenericForm<Partial<userInterface>>
            initialValues={{
              id_rol: itemToEdit.id_rol,
              username: itemToEdit.username,
              email: itemToEdit.email,
              password: "",
              estado: true,
            }}
            fields={userFields}
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
            title="Editar Usuario"
            submitDisabled={saving}
          />
        )}
      </Modal>

      {/* Modal Crear */}
      <Modal isOpen={isCreateOpen} onClose={closeAll}>
        <GenericForm<Partial<userInterface>>
          initialValues={{
            id_rol: "",
            username: "",
            email: "",
            password: "",
            estado: true,
          }}
          fields={userFields.map((f) =>
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
          title="Crear Usuario"
          submitDisabled={saving}
          extraFields={{
            add_role_button: (
              <button
                type="button"
                className="text-green-600 text-xl font-bold ml-2"
                title="Agregar nuevo rol"
                onClick={() => setRoleModalOpen(true)}
              >
                +
              </button>
            ),
          }}
        />
      </Modal>

      {/* Modal Eliminar */}
      <Modal isOpen={isDeleteOpen} onClose={closeAll}>
        {itemToDelete && (
          <>
            <h3 className="text-xl font-semibold mb-4">
              Confirmar Eliminación
            </h3>

            <p>¿Seguro que deseas borrar este usuario?</p>

            <GenericTable
              rowKey={(row) => row.id_user}
              data={[itemToDelete]}
              columns={userColumns}
            />

            <div className="mt-4 text-right gap-2 flex justify-center">
              <Button
                onClick={() => handleConfirmDelete(itemToDelete.id_user)}
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

      {/* Modal para crear rol (nuevo) */}
      <Modal isOpen={isRoleModalOpen} onClose={() => setRoleModalOpen(false)}>
        <GenericForm
          initialValues={{ name: "", descripcion: "" }}
          fields={[
            { name: "name", label: "Nombre", type: "text", required: true },
            { name: "descripcion", label: "Descripción", type: "text" },
          ]}
          onSubmit={handleCreateRoleFromUser}
          onCancel={() => setRoleModalOpen(false)}
          submitLabel={
            saving ? (
              <span>
                <span className="animate-spin inline-block mr-2">⏳</span>
                Creando rol...
              </span>
            ) : (
              "Crear"
            )
          }
          cancelLabel="Cancelar"
          title="Crear Nuevo Rol"
        />
      </Modal>
    </div>
  );
};

export default User;
