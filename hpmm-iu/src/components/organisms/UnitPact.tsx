import React, { useEffect, useState } from "react";
import { useUnitPacts } from "../../hooks/use.UnitPact";
import { UnitPactDetail } from "../../interfaces/UnitPact.inteface";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";

const unitPactsColumns: Column<UnitPactDetail>[] = [
  { header: "Pacto",        accessor: "nombre_pacto" },
  { header: "Tipo",         accessor: "tipo" },
  { header: "Unidad",       accessor: "unidad" },
  { header: "Subcategoría", accessor: "subcategori" },
  { header: "Estado",       accessor: row => (row.estado ? "Activo" : "Inactivo") },
  {
    header: "Fecha",
    accessor: row => new Date(row.created_at).toLocaleDateString(),
  },
];

const unitPactsFields: FieldConfig[] = [
  { name: "id_pacts",       label: "ID del pacto",      type: "text" },
  { name: "id_units",       label: "ID de unidad",      type: "text" },
  { name: "id_subcategory", label: "ID de subcategoría", type: "text" },
];

const UnitPacts: React.FC<{ status: string }> = ({ status }) => {
  const {
    unitPacts,
    GetUnitPactsContext,
    PostCreateUnitPactContext,
    PutUpdateUnitPactContext,
    DeleteUnitPactContext,
  } = useUnitPacts();

  const [filteredData, setFilteredData] = useState<UnitPactDetail[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  const [itemToEdit, setItemToEdit] = useState<UnitPactDetail | null>(null);
  const [itemToDelete, setItemToDelete] = useState<UnitPactDetail | null>(null);

  useEffect(() => {
    GetUnitPactsContext().finally(() => setLoading(false));
  }, [GetUnitPactsContext]);

  useEffect(() => {
    if (status === "Todo") {
      setFilteredData(unitPacts);
    } else {
      setFilteredData(unitPacts.filter(item => String(item.estado) === status));
    }
  }, [unitPacts, status]);

  const closeAll = () => {
    setEditOpen(false);
    setCreateOpen(false);
    setDeleteOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
  };

  const handleCreate = async (values: {
    id_pacts: string;
    id_units: string;
    id_subcategory: string;
  }) => {
    await PostCreateUnitPactContext(values);
    await GetUnitPactsContext();
    closeAll();
  };

  const handleEdit = async (values: {
    id_pacts: string;
    id_units: string;
    id_subcategory: string;
  }) => {
    if (!itemToEdit) return;
    await PutUpdateUnitPactContext(itemToEdit.id_units_x_pacts, values);
    await GetUnitPactsContext();
    closeAll();
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    await DeleteUnitPactContext(itemToDelete.id_units_x_pacts);
    await GetUnitPactsContext();
    closeAll();
  };

  if (loading) return <div>Cargando detalles de pactos…</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestión de Detalles de Pactos</h2>
      <Button onClick={() => setCreateOpen(true)}>+ Nuevo</Button>

      <GenericTable
        columns={unitPactsColumns}
        data={filteredData}
        rowKey={row => row.id_units_x_pacts}
        actions={[
          {
            header: "Acciones",
            label: "Editar",
            onClick: row => {
              setItemToEdit(row);
              setEditOpen(true);
            },
          },
          {
            header: "Eliminar",
            label: "Eliminar",
            onClick: row => {
              setItemToDelete(row);
              setDeleteOpen(true);
            },
          },
        ]}
      />

      {/* Modal Crear */}
      <Modal isOpen={isCreateOpen} onClose={closeAll}>
        <GenericForm
          initialValues={{ id_pacts: "", id_units: "", id_subcategory: "" }}
          fields={unitPactsFields}
          onSubmit={handleCreate}
          onCancel={closeAll}
          submitLabel="Crear"
          cancelLabel="Cancelar"
        />
      </Modal>

      {/* Modal Editar */}
      <Modal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <GenericForm
            initialValues={{
              id_pacts: itemToEdit.id_pacts,
              id_units: itemToEdit.id_units,
              id_subcategory: itemToEdit.id_subcategory,
            }}
            fields={unitPactsFields}
            onSubmit={handleEdit}
            onCancel={closeAll}
            submitLabel="Guardar"
            cancelLabel="Cancelar"
          />
        )}
      </Modal>

      {/* Modal Eliminar */}
      <Modal isOpen={isDeleteOpen} onClose={closeAll}>
        {itemToDelete && (
          <>
            <h3 className="text-xl font-semibold mb-4">
              Confirmar Eliminación
            </h3>
            <p>¿Estás seguro que deseas eliminar esta asignación?</p>
            <div className="mt-4 flex justify-end gap-4">
              <Button onClick={closeAll}>Cancelar</Button>
              <Button isPrimary onClick={handleDelete}>
                Eliminar
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default UnitPacts;
