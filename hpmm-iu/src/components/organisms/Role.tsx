// ----------------------- Roles.tsx -----------------------

import React, { useEffect, useState } from "react";
import { useRole } from "../../hooks/use.Role";
import Button from "../atoms/Buttons/Button";
import GenericModal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column, Action } from "../molecules/GenericTable";
import { RolesInterface } from "../../interfaces/role.interface";

const roleColumns: Column<RolesInterface>[] = [
  { header: "Nombre", accessor: "name" },
  { header: "Descripción", accessor: "descripcion" },
  { header: "Estado", accessor: row => (row.estado ? "Activo" : "Inactivo") },
  {
    header: "Fecha Creación",
    accessor: row =>
      row.created_at ? new Date(row.created_at).toLocaleString() : "",
  },
  {
    header: "Fecha Actualización",
    accessor: row =>
      row.updated_at ? new Date(row.updated_at).toLocaleString() : "",
  },
];

const roleFields: FieldConfig[] = [
  { name: "name", label: "Nombre", type: "text" },
  { name: "descripcion", label: "Descripción", type: "text" },
];

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
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<RolesInterface | null>(null);
  const [itemToDelete, setItemToDelete] = useState<RolesInterface | null>(null);

  // 1) Fetch inicial
  useEffect(() => {
    GetRolesContext()
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [GetRolesContext]);

  // 2) Filtrar solo estado=true
  useEffect(() => {
    if (roles) {
     handleTableContent(roles);
    }
  }, [roles, status]);

  const closeAll = () => {
    setCreateOpen(false);
    setEditOpen(false);
    setDeleteOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
  };

  const openEdit = (id: string) => {
    setItemToEdit(roles.find(r => r.id_rol === id) || null);
    setEditOpen(true);
  };

  const openDelete = (id: string) => {
    setItemToDelete(roles.find(r => r.id_rol === id) || null);
    setDeleteOpen(true);
  };

  // Definir las acciones de la tabla
  const roleActions: Action<RolesInterface>[] = [
    {
      header: "Editar",
      label: "Editar",
      onClick: (row) => openEdit(row.id_rol),
    },
    {
      header: "Eliminar",
      label: "Eliminar",
      onClick: (row) => openDelete(row.id_rol),
    },
  ];

  // 3) Crear rol → POST + recarga
  const handleCreate = async (values: any) => {
    await PostCreateRoleContext({
      name: values.name,
      descripcion: values.descripcion,
      estado: true,
    });
    await GetRolesContext();
    closeAll();
  };

  const handleSave = async (vals: any) => {
    if (!itemToEdit) return;
    await PutUpdateRoleContext(itemToEdit.id_rol, {
      ...itemToEdit,
      name: vals.name,
      descripcion: vals.descripcion,
      estado: itemToEdit.estado,
    });
    await GetRolesContext();
    closeAll();
  };

  // 5) Desactivar → PUT {estado:false} + recarga
  const handleConfirmDelete = async (id: string) => {
    await DeleteRoleContext(id);
    await GetRolesContext();
    closeAll();
  };

   const handleTableContent = (emp: RolesInterface[]) => {
      // Verificar que emp existe y tiene elementos
      if (!emp || emp.length === 0) {
        setFilteredData([]);
        return;
      }
  
      const rowContent = emp.filter((item) => {
        // Verificar que el item existe y tiene la propiedad estado
        return (
          item && item.estado !== undefined && item.estado === (status === "Todo")
        );
      });
      setFilteredData(rowContent);
    };

  if (loading) return <div>Cargando roles…</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Gestión de Roles</h2>
      <Button onClick={() => setCreateOpen(true)}>+ Nuevo rol</Button>

      {filteredData.length > 0 ? (
        <GenericTable
          columns={roleColumns}
          data={filteredData}
          rowKey={r => r.id_rol}
          actions={roleActions}
        />
      ) : (
        <p className="mt-4 text-gray-600">No hay roles activos.</p>
      )}

      {/* Modal Crear */}
      <GenericModal isOpen={isCreateOpen} onClose={closeAll}>
        
        <GenericForm
          initialValues={{ 
            name: "", 
            descripcion: "", 
            estado: "true" }}
          fields={roleFields}
          onSubmit={handleCreate}
          onCancel={closeAll}
          submitLabel="Crear"
          cancelLabel="Cancelar"
        />
      </GenericModal>

      {/* Modal Editar */}
      <GenericModal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <>
            <h3 className="text-xl font-semibold mb-4">Editar Rol</h3>
            <GenericForm
              initialValues={{
                name: itemToEdit.name,
                descripcion: itemToEdit.descripcion,
              
              }}
              fields={roleFields}
              onSubmit={handleSave}
              onCancel={closeAll}
              submitLabel="Guardar"
              cancelLabel="Cancelar"
            />
          </>
        )}
      </GenericModal>

      {/* Modal Desactivar */}
      <GenericModal isOpen={isDeleteOpen} onClose={closeAll}>
        {itemToDelete && (
          <>
            <h3 className="text-xl font-semibold mb-4">Confirmar Desactivación</h3>
            <p>
              ¿Seguro que deseas desactivar el rol{" "}
              <strong>{itemToDelete.name}</strong>?
            </p>
            <GenericTable
              columns={roleColumns}
              data={[itemToDelete]}
              rowKey={r => r.id_rol}
            />
            <div className="mt-4 text-right">
              <Button onClick={closeAll} className="mr-2">Cancelar</Button>
              <Button
                isPrimary
                onClick={() => handleConfirmDelete(itemToDelete.id_rol)}
              >
                Desactivar
              </Button>
            </div>
          </>
        )}
      </GenericModal>
    </div>
  );
};

export default Roles;