import React, { useEffect, useState } from "react";
import { useUnit } from "../../hooks/use.Unit";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";
import { UnitInterface } from "../../interfaces/Units.interface";
import { useSubdireccion } from "../../hooks/use.subdireccion";

const Unit: React.FC<{ status?: string }> = ({ status = "Todo" }) => {
  const {
    units,
    GetUnitsContext,
    PostCreateUnitContext,
    PutUpdateUnitContext,
    DeleteUnitContext,
  } = useUnit();

  const { subdireccion, GetSubdireccionesContext } = useSubdireccion();
  // Estados locales para manejar la UI
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<UnitInterface[]>([]);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<UnitInterface | null>(null);
  const [itemToDelete, setItemToDelete] = useState<UnitInterface | null>(null);

  // 1) Columnas de la tabla
  const unitColumns: Column<UnitInterface>[] = [
    { header: "Subdireccion", accessor: "id_subdireccion" },
    { header: "Nombre", accessor: "name" },

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

  const unitFields: FieldConfig[] = React.useMemo(
    () => [
      { name: "name", label: "Nombre", type: "text" },
      
     
      {
        name: "id_subdireccion",
        label: "subdireccion",
        type: "select",
        options: subdireccion.map((c) => ({ label: c.nombre, value: c.id_subdireccion })),
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
    ],
    [subdireccion]
  );

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([GetUnitsContext(), GetSubdireccionesContext()]);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [GetUnitsContext, GetSubdireccionesContext]);

  // Filtrar datos cuando cambie el status o units
  useEffect(() => {
    if (!units || units.length === 0) {
      setFilteredData([]);
      return;
    }

    // Filtrar elementos válidos antes de procesar
    const validUnits = units.filter(
      (item) => item && item.id_units && typeof item.id_units === "string"
    );

    handleTableContent(validUnits);
  }, [status, units]);

  // ------------------------------------------------------------------------------------
  const closeAll = () => {
    setEditOpen(false);
    setCreateOpen(false);
    setDeleteOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
  };

  // ------------------------------------------------------------------------------------
  const openEdit = (id_units: string) => {
    if (!units || units.length === 0) {
      return;
    }

    const item = units.find((item) => item && item.id_units === id_units);

    if (item) {
      console.log("Item a editar:", item);
      setItemToEdit(item);
      setEditOpen(true);
    } else {
      console.error("No se encontró la unidad con ID:", id_units);
    }
  };

  const openDelete = (id_units: string) => {
    if (!units || units.length === 0) {
      return;
    }

    const item = units.find((item) => item && item.id_units === id_units);

    if (item) {
      setItemToDelete(item);
      setDeleteOpen(true);
    } else {
      console.error("No se encontró la unidad con ID:", id_units);
    }
  };

  //-----------------------------------------------------------------------------------------
  const handleConfirmDelete = async (id_units: string) => {
    try {
      await DeleteUnitContext(id_units);
      await GetUnitsContext();
      closeAll();
    } catch (error) {
      console.error("Error eliminando unidad:", error);
    }
  };

  const handleTableContent = (list: UnitInterface[]) => {
    // Asegurar que todos los elementos sean válidos
    const validList = list.filter(
      (item) => item && item.id_units && typeof item.id_units === "string"
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
      const payload: Partial<UnitInterface> = {
        ...itemToEdit,
        ...values,
        estado: values.estado === "true" || values.estado === true,
      };

      console.log("Payload para actualizar:", payload);

      await PutUpdateUnitContext(itemToEdit.id_units, payload as UnitInterface);
      await GetUnitsContext();
      closeAll();
    } catch (error) {
      console.error("Error actualizando unidad:", error);
    }
  };

  const handleCreate = async (values: any) => {
    try {
      const payload = {
        ...values,
        estado: values.estado === "true" || values.estado === true,
      };

      console.log("Payload para crear:", payload);

      await PostCreateUnitContext(payload as UnitInterface);
      await GetUnitsContext();
      closeAll();
    } catch (error) {
      console.error("Error creando unidad:", error);
    }
  };

  if (loading) {
    return <div>Cargando Unidades...</div>;
  }

  return (
    <div>
      <h1>Lista de Unidades</h1>
      <Button onClick={() => setCreateOpen(true)}>+ Nueva Unidad</Button>

      <GenericTable
        columns={unitColumns}
        data={filteredData.filter((item) => item && item.id_units)} // Filtro adicional de seguridad
        rowKey={(row) => row?.id_units || ""}
        actions={[
          {
            header: "Editar",
            label: "Editar",
            onClick: (row) => row?.id_units && openEdit(row.id_units),
          },
          {
            header: "Eliminar",
            label: "Eliminar",
            onClick: (row) => row?.id_units && openDelete(row.id_units),
          },
        ]}
      />

      {/* Modal Editar */}
      <Modal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <GenericForm<Partial<UnitInterface>>
            initialValues={{
              name: itemToEdit.name || "",
              id_subdireccion: itemToEdit.id_subdireccion || "",
              estado: itemToEdit.estado,
            }}
            fields={unitFields}
            onSubmit={handleSave}
            onCancel={closeAll}
            submitLabel="Guardar"
            cancelLabel="Cancelar"
          />
        )}
      </Modal>

      {/* Modal Crear */}
      <Modal isOpen={isCreateOpen} onClose={closeAll}>
        <GenericForm<Partial<UnitInterface>>
          initialValues={{
            name: "",
            id_subdireccion: "",
            estado: true,
          }}
          fields={unitFields}
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
            <p>¿Seguro que deseas borrar esta unidad?</p>
            <GenericTable
              columns={unitColumns}
              data={[itemToDelete]}
              rowKey={(row) => row.id_units}
            />
            <div className="mt-4 text-right">
              <Button onClick={closeAll} className="mr-2">
                Cancelar
              </Button>
              <Button
                isPrimary
                onClick={() => handleConfirmDelete(itemToDelete.id_units)}
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

export default Unit;
