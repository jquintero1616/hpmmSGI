import React, { useEffect, useState } from "react";
import { SubdireccionInterface } from "../../interfaces/subdireccion.interface";
import { useSubdireccion } from "../../hooks/use.subdireccion";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";

const Subdireccion: React.FC<{ status?: string }> = ({ status = "Todo" }) => {
  const {
    subdireccion,
    GetSubdireccionesContext,
    PostCreateSubdireccionContext,
    PutUpdateSubdireccionContext,
    DeleteSubdireccionContext,
  } = useSubdireccion();

  // Estados locales
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<SubdireccionInterface[]>([]);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<SubdireccionInterface | null>(
    null
  );
  const [itemToDelete, setItemToDelete] =
    useState<SubdireccionInterface | null>(null);

  // 1) Columnas de la tabla
  const subdireccionColumns: Column<SubdireccionInterface>[] = [
    { header: "Dirección", accessor: "id_direction" },
    { header: "Nombre", accessor: "nombre" },
    {
      header: "Estado",
      accessor: (row) => (row.estado ? "Activo" : "Inactivo"),
    },
    {
      header: "Fecha de Creación",
      accessor: (row) =>
        row.created_at ? new Date(row.created_at).toLocaleString() : "",
    },
    {
      header: "Fecha de Actualización",
      accessor: (row) =>
        row.updated_at ? new Date(row.updated_at).toLocaleString() : "",
    },
  ];

  // 2) Campos para el formulario
  const subdireccionFields: FieldConfig[] = React.useMemo(
    () => [
      { name: "id_direction", label: "Dirección", type: "text" },
      { name: "nombre", label: "Nombre", type: "text" },
      {
        name: "estado",
        label: "Estado",
        type: "select",
        options: [
          { label: "Activo", value: "true" },
          { label: "Inactivo", value: "false" },
        ],
      },
    ],
    []
  );

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([GetSubdireccionesContext()]);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [GetSubdireccionesContext]);

  // Filtrar según status
  useEffect(() => {
    if (!subdireccion || subdireccion.length === 0) {
      setFilteredData([]);
      return;
    }

    const validSubdireccion = subdireccion.filter(
      (item) =>
        item && item.id_subdireccion && typeof item.id_subdireccion === "string"
    );

    handleTableContent(validSubdireccion);
  }, [status, subdireccion]);

  const closeAll = () => {
    setEditOpen(false);
    setCreateOpen(false);
    setDeleteOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
  };

  const openEdit = (id_subdireccion: string) => {
    if (!subdireccion || subdireccion.length === 0) {
      return;
    }

    const item = subdireccion.find(
      (item) => item && item.id_subdireccion === id_subdireccion
    );

    if (item) {
      console.log("Item encontrado:", item);
      setItemToEdit(item);
      setEditOpen(true);
    } else {
      console.error("No se encontró el item con id:", id_subdireccion);
    }
  };

  const openDelete = (id_subdireccion: string) => {
    if (!subdireccion || subdireccion.length === 0) {
      return;
    }
    const item = subdireccion.find(
      (item) => item && item.id_subdireccion === id_subdireccion
    );
    if (item) {
      setItemToDelete(item);
      setDeleteOpen(true);
    } else {
      console.error(`No se encontro la subdireccion con ID ${id_subdireccion}`);
    }
  };

  const handleConfirmDelete = async (id_subdireccion: string) => {
    try {
      await DeleteSubdireccionContext(id_subdireccion);
      await GetSubdireccionesContext();
      closeAll();
    } catch (error) {
      console.error("Error eliminando subdirección:", error);
    }
  };

  const handleTableContent = (list: SubdireccionInterface[]) => {
    const validList = list.filter(
      (item) =>
        item && item.id_subdireccion && typeof item.id_subdireccion === "string"
    );
    if (status === "Todo") {
      setFilteredData(validList);
    } else {
      const activeItems = validList.filter((item) => item.estado === true);
      console.log("Item activos filtrados", activeItems);
      setFilteredData(activeItems);
    }
  };

  const handleSave = async (values: any) => {
    if (!itemToEdit) return;
    const payload: Partial<SubdireccionInterface> = {
      ...itemToEdit,
      ...values,
      estado: values.estado === "true" || values.estado === true,
    };
    try {
      await PutUpdateSubdireccionContext(
        itemToEdit.id_subdireccion,
        payload as SubdireccionInterface
      );
      await GetSubdireccionesContext();
      closeAll();
    } catch (error) {
      console.error("Error actualizando subdirección:", error);
    }
  };

  const handleCreate = async (values: any) => {
    const payload: Partial<SubdireccionInterface> = {
      ...values,
      estado: values.estado === "true" || values.estado === true,
    };
    try {
      await PostCreateSubdireccionContext(payload as SubdireccionInterface);
      await GetSubdireccionesContext();
      closeAll();
    } catch (error) {
      console.error("Error creando subdirección:", error);
    }
  };

  if (loading) {
    return <div>Cargando Subdirecciones...</div>;
  }

  return (
    <div>
      <h1>Lista de Subdirecciones</h1>
      <Button onClick={() => setCreateOpen(true)}>+ Nueva Subdirección</Button>

      <GenericTable
        columns={subdireccionColumns}
        data={filteredData.filter((item) => item && item.id_subdireccion)}
        rowKey={(row) => row?.id_subdireccion || ""}
        actions={[
          {
            header: "Editar",
            label: "Editar",
            onClick: (row) =>
              row?.id_subdireccion && openEdit(row.id_subdireccion),
          },
          {
            header: "Eliminar",
            label: "Eliminar",
            onClick: (row) =>
              row?.id_subdireccion && openDelete(row.id_subdireccion),
          },
        ]}
      />

      {/* Modal Editar */}
      <Modal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <GenericForm<Partial<SubdireccionInterface>>
            initialValues={{
              id_direction: itemToEdit.id_direction || "",
              nombre: itemToEdit.nombre || "",
              estado: itemToEdit.estado,
            }}
            fields={subdireccionFields}
            onSubmit={handleSave}
            onCancel={closeAll}
            submitLabel="Guardar"
            cancelLabel="Cancelar"
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
          fields={subdireccionFields}
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
            <p>¿Seguro que deseas borrar esta subdirección?</p>
            <GenericTable
              columns={subdireccionColumns}
              data={[itemToDelete]}
              rowKey={(row) => row.id_subdireccion}
            />
            <div className="mt-4 text-right">
              <Button onClick={closeAll} className="mr-2">
                Cancelar
              </Button>
              <Button
                isPrimary
                onClick={() =>
                  handleConfirmDelete(itemToDelete.id_subdireccion)
                }
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

export default Subdireccion;
