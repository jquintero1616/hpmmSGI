// src/components/organisms/Donante.tsx

import React, { useEffect, useState } from "react";
import { useDonante } from "../../hooks/use.Donante";
import { DonanteInterface, TipoDonante } from "../../interfaces/donante.interface";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface DonantesProps {
  status?: string;
}

const Donantes: React.FC<DonantesProps> = ({ status = "Todo" }) => {
  // Hooks
  const {
    donantes,
    GetDonantesContext,
    PostCreateDonanteContext,
    PutUpdateDonanteContext,
    DeleteDonanteContext,
  } = useDonante();

  // Estados locales
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<DonanteInterface[]>([]);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<DonanteInterface | null>(null);
  const [itemToDelete, setItemToDelete] = useState<DonanteInterface | null>(null);
  const [saving, setSaving] = useState(false);

  // Estado local para el filtro - usa status del prop
  const [estadoFiltro] = useState<string>(status);

  // Tipos de donante para el select
  const tiposDonante: { label: string; value: TipoDonante }[] = [
    { label: "Persona", value: "Persona" },
    { label: "Empresa", value: "Empresa" },
    { label: "ONG", value: "ONG" },
    { label: "Gobierno", value: "Gobierno" },
    { label: "Otro", value: "Otro" },
  ];

  // Funciones de validación
  const isEmailTaken = (email: string, excludeDonanteId?: string) => {
    if (!email) return false;
    return donantes.some(
      (d) =>
        d.correo &&
        d.correo.trim().toLowerCase() === email.trim().toLowerCase() &&
        (!excludeDonanteId || d.id_donante !== excludeDonanteId)
    );
  };

  const validateCreate = (values: any) => {
    const errors: any = {};
    if (values.correo && isEmailTaken(values.correo)) {
      errors.correo = "El correo ya está registrado en otro donante.";
    }
    return errors;
  };

  const validateEdit = (values: any) => {
    const errors: any = {};
    if (
      itemToEdit &&
      values.correo &&
      values.correo.trim().toLowerCase() !==
        (itemToEdit.correo || "").trim().toLowerCase() &&
      isEmailTaken(values.correo, itemToEdit.id_donante)
    ) {
      errors.correo = "El correo ya está registrado en otro donante.";
    }
    return errors;
  };

  // Configuración de columnas
  const donanteColumns: Column<DonanteInterface>[] = [
    { header: "Nombre", accessor: (row) => row.nombre || "" },
    { 
      header: "Tipo", 
      accessor: (row) => {
        const tipos: Record<TipoDonante, string> = {
          Persona: " Persona",
          Empresa: "Empresa",
          ONG: " ONG",
          Gobierno: " Gobierno",
          Otro: " Otro",
        };
        return tipos[row.tipo_donante] || row.tipo_donante;
      }
    },
    { header: "Teléfono", accessor: (row) => row.numero_contacto || "" },
    { header: "Correo", accessor: (row) => row.correo || "" },
    { header: "RTN", accessor: (row) => row.rtn || "" },
    { 
      header: "Estado", 
      accessor: (row) => (row.estado ? "Activo" : "Inactivo") 
    },
    {
      header: "Fecha Creación",
      accessor: (row) =>
        row.created_at ? new Date(row.created_at).toLocaleDateString() : "",
    },
  ];

  // Configuración de campos del formulario
  const donanteFields: FieldConfig[] = [
    {
      name: "nombre",
      label: "Nombre del Donante",
      type: "text",
      required: true,
      colSpan: 2,
    },
    {
      name: "tipo_donante",
      label: "Tipo de Donante",
      type: "select",
      options: tiposDonante,
      required: true,
    },
    {
      name: "numero_contacto",
      label: "Teléfono",
      type: "text",
      required: false,
    },
    {
      name: "correo",
      label: "Correo Electrónico",
      type: "email",
      required: false,
      pattern: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$",
      colSpan: 2,
    },
    {
      name: "direccion",
      label: "Dirección",
      type: "textarea",
      required: false,
      colSpan: 2,
    },
    {
      name: "rtn",
      label: "RTN (Registro Tributario)",
      type: "text",
      required: false,
    },
    {
      name: "notas",
      label: "Notas adicionales",
      type: "textarea",
      required: false,
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

  // Función handleTableContent
  const handleTableContent = (list: DonanteInterface[]) => {
    if (!Array.isArray(list)) {
      setFilteredData([]);
      return;
    }

    let filtrados = list.filter((donante) => donante && donante.id_donante);

    if (estadoFiltro === "Activos") {
      filtrados = filtrados.filter((d) => d.estado === true);
    } else if (estadoFiltro === "Inactivos") {
      filtrados = filtrados.filter((d) => d.estado === false);
    }

    // Ordenar por nombre
    const ordenados = filtrados.sort((a, b) =>
      a.nombre.localeCompare(b.nombre)
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
    setSaving(false);
  };

  const handleEdit = (item: DonanteInterface) => {
    setItemToEdit(item);
    setEditOpen(true);
  };

  const handleDelete = (item: DonanteInterface) => {
    setItemToDelete(item);
    setDeleteOpen(true);
  };

  // Handlers de submit
  const handleCreateSubmit = async (values: any) => {
    setSaving(true);
    try {
      await PostCreateDonanteContext({
        ...values,
        estado: values.estado === "true" || values.estado === true,
      });
      toast.success("Donante creado exitosamente");
      closeAll();
      await GetDonantesContext();
    } catch (error) {
      toast.error("Error al crear el donante");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleEditSubmit = async (values: any) => {
    if (!itemToEdit?.id_donante) return;
    setSaving(true);
    try {
      await PutUpdateDonanteContext(itemToEdit.id_donante, {
        ...values,
        estado: values.estado === "true" || values.estado === true,
      });
      toast.success("Donante actualizado exitosamente");
      closeAll();
      await GetDonantesContext();
    } catch (error) {
      toast.error("Error al actualizar el donante");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete?.id_donante) return;
    setSaving(true);
    try {
      await DeleteDonanteContext(itemToDelete.id_donante);
      toast.success("Donante eliminado exitosamente");
      closeAll();
      await GetDonantesContext();
    } catch (error) {
      toast.error("Error al eliminar el donante");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // Effects
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await GetDonantesContext();
      } catch (error) {
        console.error("Error al cargar donantes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    handleTableContent(donantes);
  }, [donantes, estadoFiltro]);

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
             Gestión de Donantes
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Administra los donantes que realizan aportes al hospital
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-blue-800 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <span></span>+Nuevo Donante
        </Button>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <GenericTable<DonanteInterface>
          columns={donanteColumns}
          data={filteredData}
          rowKey={(row) => row?.id_donante || ""}
          actions={[
            {
              header: "Acciones",
              label: "Editar",
              actionType: "editar" as const,
              tooltip: "Editar donante",
              onClick: (row) => handleEdit(row),
            },
            {
              header: "Acciones",
              label: "Eliminar",
              actionType: "eliminar" as const,
              tooltip: "Eliminar donante",
              onClick: (row) => handleDelete(row),
            },
          ]}
          rowClassName={(row) =>
            row?.estado === false ? "opacity-40 line-through" : ""
          }
        />
      )}

      {/* Modal Crear */}
      <Modal
        isOpen={isCreateOpen}
        onClose={closeAll}
        title="Crear Nuevo Donante"
      >
        <GenericForm<Partial<DonanteInterface>>
          columns={2}
          fields={donanteFields}
          onSubmit={handleCreateSubmit}
          onCancel={closeAll}
          initialValues={{ estado: true, tipo_donante: "Persona" }}
          validate={validateCreate}
          submitLabel={
            saving ? (
              <span>
                <span className="animate-spin inline-block mr-2">⏳</span>
                Creando...
              </span>
            ) : (
              "Crear Donante"
            )
          }
          cancelLabel="Cancelar"
          title="Crear Nuevo Donante"
          submitDisabled={saving}
        />
      </Modal>

      {/* Modal Editar */}
      <Modal
        isOpen={isEditOpen}
        onClose={closeAll}
        title="Editar Donante"
      >
        {itemToEdit && (
          <GenericForm<DonanteInterface>
            columns={2}
            fields={donanteFields}
            onSubmit={handleEditSubmit}
            onCancel={closeAll}
            initialValues={itemToEdit}
            validate={validateEdit}
            submitLabel={
              saving ? (
                <span>
                  <span className="animate-spin inline-block mr-2">⏳</span>
                  Guardando...
                </span>
              ) : (
                "Guardar Cambios"
              )
            }
            cancelLabel="Cancelar"
            title="Editar Donante"
            submitDisabled={saving}
          />
        )}
      </Modal>

      {/* Modal Eliminar */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={closeAll}
        title="Confirmar Eliminación"
      >
        <div className="p-4">
          <p className="text-gray-700 mb-4">
            ¿Estás seguro de que deseas eliminar al donante{" "}
            <strong>{itemToDelete?.nombre}</strong>?
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Esta acción desactivará el donante del sistema.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              onClick={closeAll}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              disabled={saving}
            >
              {saving ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Donantes;
