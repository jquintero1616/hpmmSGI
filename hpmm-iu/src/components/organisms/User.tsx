// src/components/organisms/User.tsx

import React, { useEffect, useState } from "react";
import { useUser } from "../../hooks/use.User";
import { userInterface } from "../../interfaces/user.interface";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";
import { useRole } from "../../hooks/use.Role";

const User: React.FC<{ status?: string }> = ({ status ="Todo"}) => {
  const {
    users,
    GetUsersContext,
    PostCreateUserContext,
    PutUpdateUserContext,
    DeleteUserContext,
  } = useUser();

  // Asegúrate de que el hook useRole esté correctamente implementado
  const { roles, GetRolesContext } = useRole();
//  // Estados locales para manejar la UI
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<userInterface[]>([]);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<userInterface | null>(null);
  const [itemToDelete, setItemToDelete] = useState<userInterface | null>(null);
  


// 1) Columnas de la tabla
const userColumns: Column<userInterface>[] = [
  { header: "Usuario", accessor: "username" },
  { header: "Correo", accessor: "email" },
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
  { name: "username", label: "Nombre completo", type: "text" },
  { name: "email", label: "Correo", type: "text" },
  { name: "password", label: "Contraseña", type: "password" },
  // Si quieres id_rol con select, necesitas cargar roles; por ahora lo dejamos como text
  {
        name: "role_name",
        label: "Rol",
        type: "select",
        options: roles.map((r) => ({ label: r.name, value: r.name })),
      },
  {
    name: "estado",
    label: "Estado",
    type: "select",
    options: ["true", "false"],
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
    Promise.all([GetUsersContext(), 
      GetRolesContext()]).finally(
      () => setLoading(false)
    );

  }, []);

  const closeAll = () => {
    setEditOpen(false);
    setCreateOpen(false);
    setDeleteOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
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

  const handleTableContent = (list: userInterface[]) => {
    const filtrados =
      status === "Todo"
        ? list
        : list.filter((u) => String(u.estado) === status);

    // 2) Ordenar por username (o por la propiedad que prefieras)
    const ordenados = filtrados.sort((a, b) =>
      a.username.localeCompare(b.username)
    );

    setFilteredData(ordenados);
  };

  const handleSave = async (values: any) => {
    if (!itemToEdit) return;

    // Arma el objeto de actualización a partir de lo que traías y lo que editaste
    const payload: Partial<userInterface> = {
      ...itemToEdit,
      ...values,
      estado: values.estado === "true",
    };

    // Si el password viene vacío, lo quitamos para no pisar la existente
    if (!values.password) {
      delete (payload as any).password;
    }

    await PutUpdateUserContext(itemToEdit.id_user, payload as userInterface);
    await GetUsersContext();
    closeAll();
  };

  
  const handleCreate = async (values: any) => {
    await PostCreateUserContext(values as userInterface);
    await GetUsersContext();
    closeAll();
  };

  if (loading) {
    return <div>Cargando usuarios…</div>;
  }

  return (
    <div>
      <h1>Lista de Usuarios</h1>
      <Button onClick={() => setCreateOpen(true)}>+ Nuevo usuario</Button>

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
      />

      {/* Modal Editar */}
      <Modal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <GenericForm<Partial<userInterface>>
            initialValues={{
              username: itemToEdit.username,
              email: itemToEdit.email,
              password: "",
              role_name: itemToEdit.role_name,
              estado: itemToEdit.estado,
            }}
            fields={userFields}
            onSubmit={handleSave}
            onCancel={closeAll}
            submitLabel="Guardar"
            cancelLabel="Cancelar"
          />
        )}
      </Modal>

      {/* Modal Crear */}
      <Modal isOpen={isCreateOpen} onClose={closeAll}>
        <GenericForm<Partial<userInterface>>
          initialValues={{
            username: "",
            email: "",
            password: "",
            role_name: "",
            estado: true,
          }}
          fields={userFields}
          onSubmit={handleCreate}
          onCancel={closeAll}
          submitLabel="Crear"
          cancelLabel="Cancelar"
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
              columns={userColumns}
              data={[itemToDelete]}
              rowKey={(row) => row.id_user}
            />
            <div className="mt-4 text-right">
              <Button onClick={closeAll} className="mr-2">
                Cancelar
              </Button>
              <Button
                isPrimary
                onClick={() => handleConfirmDelete(itemToDelete.id_user)}
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

export default User;
