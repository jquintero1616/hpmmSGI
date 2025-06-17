import React, { useEffect, useState } from "react";
import { useReport } from "../../hooks/use.Report";
import { ToastContainer, toast } from "react-toastify";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";
import Button from "../atoms/Buttons/Button";
import "react-toastify/dist/ReactToastify.css";

// Ajusta esta interfaz a tu modelo real
interface reportInterface {
  id_report: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  estado: boolean;
}

const Report: React.FC = () => {
  const {
    report: reports,
    GetReportsContext,
    PostCreateReportContext,
    PutUpdateReportContext,
    DeleteReportContext,
  } = useReport();

  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<reportInterface[]>([]);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<reportInterface | null>(null);
  const [itemToDelete, setItemToDelete] = useState<reportInterface | null>(null);
  const [saving, setSaving] = useState(false);

  // Columnas de la tabla
  const reportColumns: Column<reportInterface>[] = [
    { header: "Título", accessor: "title" },
    { header: "Descripción", accessor: "description" },
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

  // Campos del formulario
  const reportFields: FieldConfig[] = [
    { name: "title", label: "Título", type: "text", required: true },
    { name: "description", label: "Descripción", type: "text", required: true },
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

  useEffect(() => {
    setLoading(true);
    GetReportsContext().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setFilteredData(reports.sort((a, b) => a.title.localeCompare(b.title)));
  }, [reports]);

  const closeAll = () => {
    setEditOpen(false);
    setCreateOpen(false);
    setDeleteOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
  };

  const openEdit = (id_report: string) => {
    setItemToEdit(reports.find((r) => r.id_report === id_report) || null);
    setEditOpen(true);
  };

  const openDelete = (id_report: string) => {
    setItemToDelete(reports.find((r) => r.id_report === id_report) || null);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async (id_report: string) => {
    await DeleteReportContext(id_report);
    await GetReportsContext();
    closeAll();
  };

  const handleSave = async (values: any) => {
    if (!itemToEdit) return;
    setSaving(true);
    await PutUpdateReportContext(itemToEdit.id_report, values);
    await GetReportsContext();
    setSaving(false);
    toast.success(`Reporte actualizado correctamente`);
    closeAll();
  };

  const handleCreate = async (values: any) => {
    setSaving(true);
    await PostCreateReportContext(values);
    await GetReportsContext();
    setSaving(false);
    toast.success(`Reporte creado correctamente`);
    closeAll();
  };

  if (loading) {
    return <div>Cargando reportes…</div>;
  }

  return (
    <div>
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4 text-center">Lista de Reportes</h1>
      <div className="flex justify-end mb-4">
        <Button
          className="bg-hpmm-azul-claro hover:bg-hpmm-azul-oscuro text-white font-bold py-2 px-4 rounded"
          onClick={() => setCreateOpen(true)}
        >
          + Nuevo reporte
        </Button>
      </div>
      <GenericTable
        columns={reportColumns}
        data={filteredData}
        rowKey={(row) => row.id_report}
        actions={[
          {
            header: "Editar",
            label: "Editar",
            onClick: (row) => openEdit(row.id_report),
          },
          {
            header: "Eliminar",
            label: "Eliminar",
            onClick: (row) => openDelete(row.id_report),
          },
        ]}
        rowClassName={(row) =>
          row.estado === false ? "opacity-40 line-through" : ""
        }
      />

      {/* Modal Editar */}
      <Modal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <GenericForm<Partial<reportInterface>>
            initialValues={{
              title: itemToEdit.title,
              description: itemToEdit.description,
              estado: itemToEdit.estado,
            }}
            fields={reportFields}
            onSubmit={handleSave}
            onCancel={closeAll}
            submitLabel={saving ? "Guardando..." : "Guardar"}
            cancelLabel="Cancelar"
            title="Editar Reporte"
            submitDisabled={saving}
          />
        )}
      </Modal>

      {/* Modal Crear */}
      <Modal isOpen={isCreateOpen} onClose={closeAll}>
        <GenericForm<Partial<reportInterface>>
          initialValues={{
            title: "",
            description: "",
            estado: true,
          }}
          fields={reportFields}
          onSubmit={handleCreate}
          onCancel={closeAll}
          submitLabel={saving ? "Creando..." : "Crear"}
          cancelLabel="Cancelar"
          title="Crear Reporte"
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
            <p>¿Seguro que deseas borrar este reporte?</p>
            <GenericTable
              rowKey={(row) => row.id_report}
              data={[itemToDelete]}
              columns={reportColumns}
            />
            <div className="mt-4 text-right gap-2 flex justify-center">
              <Button
                onClick={() => handleConfirmDelete(itemToDelete.id_report)}
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

export default Report;