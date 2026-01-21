// src/components/organisms/Pacts.tsx
import React, { useEffect, useState } from "react";
import { usePacts } from "../../hooks/use.Pacts";
import { PactInterface } from "../../interfaces/pacts.interface";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";
import { useAuth } from "../../hooks/use.Auth"; // <-- Agrega este import
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  { name: "name", label: "Nombre Pacto", type: "text" },
  {
    name: "tipo",
    label: "Tipo Frecuencia",
    type: "select",
    options: [
      { label: "Diario", value: "Diario" },
      { label: "Quincenal", value: "Quincenal" },
      { label: "Mensual", value: "Mensual" },
      { label: "Trimestral", value: "Trimestral" },
    ],
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

  const { roleName } = useAuth(); // <-- Obtén el rol

  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<PactInterface[]>([]);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<PactInterface | null>(null);
  const [itemToDelete, setItemToDelete] = useState<PactInterface | null>(null);
  const [saving, setSaving] = useState(false);

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

  // Validación para evitar nombres duplicados y campos vacíos
  const validatePact = (values: any) => {
    const errors: any = {};
    if (!values.name || values.name.trim() === "") {
      errors.name = "El nombre es obligatorio";
    }
    // Evita duplicados (ignorando mayúsculas/minúsculas)
    if (
      pacts.some(
        (p) =>
          p.name.trim().toLowerCase() === values.name.trim().toLowerCase() &&
          (!itemToEdit || p.id_pacts !== itemToEdit.id_pacts)
      )
    ) {
      errors.name = "Ya existe un pacto con ese nombre";
    }
    return errors;
  };

  const handleCreate = async (values: any) => {
    setSaving(true);
    try {
      await PostCreatePactContext({
        ...values,
        estado: values.estado === "true" || values.estado === true,
      });
      await GetPactsContext();
      toast.success(`Pacto "${values.name}" creado correctamente`);
      closeAll();
    } catch (e) {
      toast.error("Error al crear el pacto");
    }
    setSaving(false);
  };

  const handleSave = async (values: any) => {
    if (!itemToEdit) return;
    setSaving(true);
    try {
      await PutUpdatePactContext(itemToEdit.id_pacts, {
        ...values,
        estado: values.estado === "true" || values.estado === true,
      });
      await GetPactsContext();
      toast.success(`Pacto "${values.name}" actualizado correctamente`);
      closeAll();
    } catch (e) {
      toast.error("Error al actualizar el pacto");
    }
    setSaving(false);
  };

  const handleConfirmDelete = async (id: string) => {
    setSaving(true);
    try {
      await DeletePactContext(id);
      await GetPactsContext();
      toast.success("Pacto eliminado correctamente");
      closeAll();
    } catch (e) {
      toast.error("Error al eliminar el pacto");
    }
    setSaving(false);
  };

  const handleTableContent = (pacts: PactInterface[]) => {
    if (status === "Todo") {
      setFilteredData(pacts);
    } else {
      setFilteredData(pacts.filter((pact) => String(pact.estado) === status));
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-32">
        <span className="animate-spin mr-2">⏳</span> Cargando pactos…
      </div>
    );

  return (
    <div>
      <ToastContainer />
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Gestión de Pactos
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Administra los pactos y convenios institucionales
          </p>
        </div>
        {(roleName === "Jefe Almacén" || roleName === "Super Admin") && (
          <Button
            className="bg-hpmm-azul-claro hover:bg-hpmm-azul-oscuro text-white font-bold py-2 px-4 rounded-lg"
            onClick={() => setCreateOpen(true)}
          >
            + Nuevo pacto
          </Button>
        )}
      </div>

      <GenericTable
        columns={pactColumns}
        data={filteredData}
        rowKey={(row) => row.id_pacts}
        actions={[
          {
            header: "Acciones",
            label: "Editar",
            actionType: "editar" as const,
            tooltip: "Editar pacto",
            onClick: (row) => openEdit(row.id_pacts),
          },
          {
            header: "",
            label: "Eliminar",
            actionType: "eliminar" as const,
            tooltip: "Eliminar pacto",
            onClick: (row) => openDelete(row.id_pacts),
          },
        ]}
        rowClassName={(row) =>
          row.estado === false ? "opacity-40 line-through" : ""
        }
      />

      {/* Modal Crear */}
      <Modal isOpen={isCreateOpen} onClose={closeAll}>
        <GenericForm<Partial<PactInterface>>
          initialValues={{
            name: "",
            tipo: "Diario",
            estado: true,
          }}
          fields={pactFields.map((f) =>
            f.name === "estado" ? { ...f, disabled: true } : f
          )}
          onSubmit={handleCreate}
          onCancel={closeAll}
          validate={validatePact}
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
          submitDisabled={saving}
          title="Crear Pacto"
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
            validate={validatePact}
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
            submitDisabled={saving}
            title="Editar Pacto"
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
            <div className="mt-4 text-right gap-2 flex justify-center">
              <Button
                onClick={() => handleConfirmDelete(itemToDelete.id_pacts)}
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

export default Pacts;
