// src/components/organisms/Pacts.tsx
import React, { useEffect, useState } from "react";
import { usePacts } from "../../hooks/use.Pacts";
import { PactInterface } from "../../interfaces/pacts.interface";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";

const pactColumns: Column<PactInterface>[] = [
  { header: "Nombre", accessor: "name" },
  { header: "Tipo", accessor: (row) => row.tipo },
  { header: "Estado", accessor: (row) => (row.estado ? "Activo" : "Inactivo") },
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

const pactFields: FieldConfig[] = [
  { name: "name", label: "Nombre", type: "text" },
  {
    name: "tipo",
    label: "Tipo",
    type: "select",
    options: ["Diario", "Quincenal", "Mensual", "Trimestral"],
  },
  {
    name: "estado",
    label: "Estado",
    type: "select",
    options: [
      { label: "Activo", value: "true" },
      { label: "Inactivo", value: "false" },
    ],
  },
];

const Pacts: React.FC<{ status?: string }> = ({ status = "Todo" }) => {
  const {
    pacts,
    GetPactsContext,
    PostCreatePactContext,
    PutUpdatePactContext,
    DeletePactContext,
  } = usePacts();

  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<PactInterface[]>([]);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<PactInterface | null>(null);
  const [itemToDelete, setItemToDelete] = useState<PactInterface | null>(null);

  useEffect(() => {
    setLoading(true);
    GetPactsContext().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    handleTableContent(pacts);
  }, [status, pacts]);

  const closeAll = () => {
    setCreateOpen(false);
    setEditOpen(false);
    setDeleteOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
  };

  const openEdit = (id: string) => {
    const pact = pacts.find((p) => p.id_pacts === id) || null;
    setItemToEdit(pact);
    setEditOpen(true);
  };

  const openDelete = (id: string) => {
    const pact = pacts.find((p) => p.id_pacts === id) || null;
    setItemToDelete(pact);
    setDeleteOpen(true);
  };

  const handleCreate = async (values: any) => {
    await PostCreatePactContext({
      ...values,
      estado: values.estado === "true",
    });
    await GetPactsContext();
    closeAll();
  };

  const handleSave = async (values: any) => {
    if (!itemToEdit) return;
    await PutUpdatePactContext(itemToEdit.id_pacts, {
      ...values,
      estado: values.estado === "true",
    });
    await GetPactsContext();
    closeAll();
  };

  const handleConfirmDelete = async (id: string) => {
    await DeletePactContext(id);
    await GetPactsContext();
    closeAll();
  };
  const handleTableContent = (pacts: PactInterface[]) => {
    if (status === "Todo") {
      setFilteredData(pacts);
    } else {
      setFilteredData(pacts.filter((pact) => String(pact.estado) === status));
    }
  };

  if (loading) return <div>Cargando pactos…</div>;

  return (
    <div>
      <h2>Gestión de Pactos</h2>
      <Button onClick={() => setCreateOpen(true)}>+ Nuevo pacto</Button>

      <GenericTable
        columns={pactColumns}
        data={filteredData}
        rowKey={(row) => row.id_pacts}
        actions={[
          {
            header: "Acciones",
            label: "Editar",
            onClick: (row) => openEdit(row.id_pacts),
          },
          {
            header: "",
            label: "Eliminar",
            onClick: (row) => openDelete(row.id_pacts),
          },
        ]}
      />

      {/* Modal Crear */}
      <Modal isOpen={isCreateOpen} onClose={closeAll}>
        <GenericForm<Partial<PactInterface>>
          initialValues={{
            name: "",
            tipo: "Diario",
            estado: true,
          }}
          fields={pactFields}
          onSubmit={handleCreate}
          onCancel={closeAll}
          submitLabel="Crear"
          cancelLabel="Cancelar"
        />
      </Modal>

      {/* Modal Editar */}
      <Modal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <GenericForm<Partial<PactInterface>>
            initialValues={{
              name: itemToEdit.name,
              tipo: itemToEdit.tipo,
              estado: itemToEdit.estado,
            }}
            fields={pactFields}
            onSubmit={handleSave}
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
            <p>¿Seguro que deseas borrar este pacto?</p>
            <GenericTable
              columns={pactColumns}
              data={[itemToDelete]}
              rowKey={(row) => row.id_pacts}
            />
            <div className="mt-4 text-right">
              <Button onClick={closeAll} className="mr-2">
                Cancelar
              </Button>
              <Button
                isPrimary
                onClick={() => handleConfirmDelete(itemToDelete.id_pacts)}
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

export default Pacts;
