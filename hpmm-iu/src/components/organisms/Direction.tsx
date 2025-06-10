import React, { useEffect, useState } from "react";
import { useDirection } from "../../hooks/use.Direction";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";
import { DirectionInterface } from "../../interfaces/direction.interface";

const Direction: React.FC<{ status?: string }> = ({ status = "Todo" }) => {
  const {
    directions,
    GetDirectionsContext,
    PostCreateDirectionContext,
    PutUpdateDirectionContext,
    DeleteDirectionContext,
  } = useDirection();

  // Estados locales para manejar la UI
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<DirectionInterface[]>([]);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<DirectionInterface | null>(
    null
  );
  const [itemToDelete, setItemToDelete] = useState<DirectionInterface | null>(
    null
  );

  // 1) Columnas de la tabla
  const directionColumns: Column<DirectionInterface>[] = [
    { header: "Nombre", accessor: "nombre" },
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

  // 2) Campos para el formulario - Memo para evitar recreaciones innecesarias
  const directionFields: FieldConfig[] = React.useMemo(
    () => [
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
        await GetDirectionsContext();
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [GetDirectionsContext]);

  // Filtrar datos cuando cambie el status o directions
  useEffect(() => {
    if (!directions || directions.length === 0) {
      setFilteredData([]);
      return;
    }

    // Filtrar elementos válidos antes de procesar
    const validDirections = directions.filter(
      (item) =>
        item && item.id_direction && typeof item.id_direction === "string"
    );

    handleTableContent(validDirections);
  }, [status, directions]);

// ------------------------------------------------------------------------------------
  const closeAll = () => {
    setEditOpen(false);
    setCreateOpen(false);
    setDeleteOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
  };
  
// ------------------------------------------------------------------------------------
  const openEdit = (id_direction: string) => {
    if (!directions || directions.length === 0) {
      return;
    }

    const item = directions.find(
      (item) => item && item.id_direction === id_direction
    );

    if (item) {
      console.log("Item a editar:", item);
      setItemToEdit(item);
      setEditOpen(true);
    } else {
      console.error("No se encontró la dirección con ID:", id_direction);
    }
  };

  const openDelete = (id_direction: string) => {
    if (!directions || directions.length === 0) {
      return;
    }

    const item = directions.find(
      (item) => item && item.id_direction === id_direction
    );

    if (item) {
      setItemToDelete(item);
      setDeleteOpen(true);
    } else {
      console.error("No se encontró la dirección con ID:", id_direction);
    }
  };

  //-----------------------------------------------------------------------------------------
  const handleConfirmDelete = async (id_direction: string) => {
    try {
      await DeleteDirectionContext(id_direction);
      await GetDirectionsContext();
      closeAll();
    } catch (error) {
      console.error("Error eliminando dirección:", error);
    }
  };

  const handleTableContent = (list: DirectionInterface[]) => {
    // Asegurar que todos los elementos sean válidos
    const validList = list.filter(
      (item) =>
        item && item.id_direction && typeof item.id_direction === "string"
    );

    if (status === "Todo") {
      setFilteredData(validList);
    } else {
      // Filtrar solo activos
      const activeItems = validList.filter((item) => item.estado === true);
      console.log("Items activos filtrados:", activeItems);
      setFilteredData(activeItems);
    }
  };

  const handleSave = async (values: any) => {
    if (!itemToEdit) {
      console.error("No hay item para editar");
      return;
    }

    console.log("Valores del formulario:", values);
    console.log("Item original:", itemToEdit);

    try {
      // Arma el objeto de actualización
      const payload: Partial<DirectionInterface> = {
        ...itemToEdit,
        ...values,
        estado: values.estado === "true" || values.estado === true,
      };

      console.log("Payload para actualizar:", payload);

      await PutUpdateDirectionContext(
        itemToEdit.id_direction,
        payload as DirectionInterface
      );
      await GetDirectionsContext();
      closeAll();
    } catch (error) {
      console.error("Error actualizando dirección:", error);
    }
  };

  const handleCreate = async (values: any) => {
    try {
      const payload = {
        ...values,
        estado: values.estado === "true" || values.estado === true,
      };

      console.log("Payload para crear:", payload);

      await PostCreateDirectionContext(payload as DirectionInterface);
      await GetDirectionsContext();
      closeAll();
    } catch (error) {
      console.error("Error creando dirección:", error);
    }
  };

  if (loading) {
    return <div>Cargando Direcciones...</div>;
  }

  return (
    <div>
      <h1>Lista de Direcciones</h1>
      <Button onClick={() => setCreateOpen(true)}>+ Nueva Dirección</Button>

      <GenericTable
        columns={directionColumns}
        data={filteredData.filter((item) => item && item.id_direction)} // Filtro adicional de seguridad
        rowKey={(row) => row?.id_direction || ""}
        actions={[
          {
            header: "Editar",
            label: "Editar",
            onClick: (row) =>
              row?.id_direction && openEdit(row.id_direction),
          },
          {
            header: "Eliminar",
            label: "Eliminar",
            onClick: (row) =>
              row?.id_direction && openDelete(row.id_direction),
          },
        ]}
      />

      {/* Modal Editar */}
      <Modal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <GenericForm<Partial<DirectionInterface>>
            initialValues={{
              nombre: itemToEdit.nombre || "",
              estado: itemToEdit.estado,
            }}
            fields={directionFields}
            onSubmit={handleSave}
            onCancel={closeAll}
            submitLabel="Guardar"
            cancelLabel="Cancelar"
          />
        )}
      </Modal>

      {/* Modal Crear */}
      <Modal isOpen={isCreateOpen} onClose={closeAll}>
        <GenericForm<Partial<DirectionInterface>>
          initialValues={{
            nombre: "",
            estado: true,
          }}
          fields={directionFields}
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
            <p>¿Seguro que deseas borrar esta dirección?</p>
            <GenericTable
              columns={directionColumns}
              data={[itemToDelete]}
              rowKey={(row) => row.id_direction}
            />
            <div className="mt-4 text-right">
              <Button onClick={closeAll} className="mr-2">
                Cancelar
              </Button>
              <Button
                isPrimary
                onClick={() => handleConfirmDelete(itemToDelete.id_direction)}
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

export default Direction;



