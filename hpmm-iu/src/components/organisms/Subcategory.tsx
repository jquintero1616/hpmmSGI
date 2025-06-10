import React, { useEffect, useState } from "react";
import { useSubcategory } from "../../hooks/use.Subcategory";

import { useCategory } from "../../hooks/use.Category";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";
import { SubcategoryInterface } from "../../interfaces/subcategory.interface";

const Subcategory: React.FC<{ status?: string }> = ({ status = "Todo" }) => {
  const {
    subcategory,
    GetSubcategoriesContext,
    PostCreateSubcategoryContext,
    PutUpdateSubcategoryContext,
    DeleteSubcategoryContext,
  } = useSubcategory();

  const { category, GetCategoriesContext } = useCategory();

  // Estados locales para manejar la UI
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<SubcategoryInterface[]>([]);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<SubcategoryInterface | null>(
    null
  );
  const [itemToDelete, setItemToDelete] = useState<SubcategoryInterface | null>(
    null
  );

  // 1) Columnas de la tabla
  const subcategoryColumns: Column<SubcategoryInterface>[] = [
    { header: "Nombre", accessor: "nombre" },
    { header: "Categoria", accessor: "category_name" },
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
  const subcategoryFields: FieldConfig[] = React.useMemo(
    () => [
      { name: "nombre", label: "Nombre", type: "text" },
      {
        name: "id_category",
        label: "Categoria",
        type: "select",
        options: category.map((c) => ({ label: c.name, value: c.id_category })),
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
    [category]
  );

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([GetSubcategoriesContext(), GetCategoriesContext()]);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [GetSubcategoriesContext, GetCategoriesContext]);

  // Filtrar datos cuando cambie el status o subcategory
  useEffect(() => {
    if (!subcategory || subcategory.length === 0) {
      setFilteredData([]);
      return;
    }

    // Filtrar elementos válidos antes de procesar
    const validSubcategories = subcategory.filter(
      (item) =>
        item && item.id_subcategory && typeof item.id_subcategory === "string"
    );

    handleTableContent(validSubcategories);
  }, [status, subcategory]);
// ------------------------------------------------------------------------------------
  const closeAll = () => {
    setEditOpen(false);
    setCreateOpen(false);
    setDeleteOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
  };
  // ------------------------------------------------------------------------------------
  const openEdit = (id_subcategory: string) => {
    if (!subcategory || subcategory.length === 0) {
      return;
    }

    const item = subcategory.find(
      (item) => item && item.id_subcategory === id_subcategory
    );

    if (item) {
      console.log("Item a editar:", item);
      setItemToEdit(item);
      setEditOpen(true);
    } else {
      console.error("No se encontró la subcategoría con ID:", id_subcategory);
    }
  };

  const openDelete = (id_subcategory: string) => {
    if (!subcategory || subcategory.length === 0) {
      return;
    }

    const item = subcategory.find(
      (item) => item && item.id_subcategory === id_subcategory
    );

    if (item) {
      setItemToDelete(item);
      setDeleteOpen(true);
    } else {
      console.error("No se encontró la subcategoría con ID:", id_subcategory);
    }
  };
  //-----------------------------------------------------------------------------------------
  const handleConfirmDelete = async (id_subcategory: string) => {
    try {
      await DeleteSubcategoryContext(id_subcategory);
      await GetSubcategoriesContext();
      closeAll();
    } catch (error) {
      console.error("Error eliminando subcategoría:", error);
    }
  };

  const handleTableContent = (list: SubcategoryInterface[]) => {
    // Asegurar que todos los elementos sean válidos
    const validList = list.filter(
      (item) =>
        item && item.id_subcategory && typeof item.id_subcategory === "string"
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
      const payload: Partial<SubcategoryInterface> = {
        ...itemToEdit,
        ...values,
        estado: values.estado === "true" || values.estado === true,
      };

      console.log("Payload para actualizar:", payload);

      await PutUpdateSubcategoryContext(
        itemToEdit.id_subcategory,
        payload as SubcategoryInterface
      );
      await GetSubcategoriesContext();
      closeAll();
    } catch (error) {
      console.error("Error actualizando subcategoría:", error);
    }
  };

  const handleCreate = async (values: any) => {
    try {
      const payload = {
        ...values,
        estado: values.estado === "true" || values.estado === true,
      };

      console.log("Payload para crear:", payload);

      await PostCreateSubcategoryContext(payload as SubcategoryInterface);
      await GetSubcategoriesContext();
      closeAll();
    } catch (error) {
      console.error("Error creando subcategoría:", error);
    }
  };

  if (loading) {
    return <div>Cargando Subcategorías...</div>;
  }

  return (
    <div>
      <h1>Lista de Subcategorías</h1>
      <Button onClick={() => setCreateOpen(true)}>+ Nueva Subcategoría</Button>

      <GenericTable
        columns={subcategoryColumns}
        data={filteredData.filter((item) => item && item.id_subcategory)} // Filtro adicional de seguridad
        rowKey={(row) => row?.id_subcategory || ""}
        actions={[
          {
            header: "Editar",
            label: "Editar",
            onClick: (row) =>
              row?.id_subcategory && openEdit(row.id_subcategory),
          },
          {
            header: "Eliminar",
            label: "Eliminar",
            onClick: (row) =>
              row?.id_subcategory && openDelete(row.id_subcategory),
          },
        ]}
      />

      {/* Modal Editar */}
      <Modal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <GenericForm<Partial<SubcategoryInterface>>
            initialValues={{
              nombre: itemToEdit.nombre || "",
              id_category: itemToEdit.id_category || "",
              estado: itemToEdit.estado,
            }}
            fields={subcategoryFields}
            onSubmit={handleSave}
            onCancel={closeAll}
            submitLabel="Guardar"
            cancelLabel="Cancelar"
          />
        )}
      </Modal>

      {/* Modal Crear */}
      <Modal isOpen={isCreateOpen} onClose={closeAll}>
        <GenericForm<Partial<SubcategoryInterface>>
          initialValues={{
            id_category: "",
            nombre: "",
            estado: true, // Cambié de true a "true" para consistencia
          }}
          fields={subcategoryFields}
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
            <p>¿Seguro que deseas borrar esta subcategoría?</p>
            <GenericTable
              columns={subcategoryColumns}
              data={[itemToDelete]}
              rowKey={(row) => row.id_subcategory}
            />
            <div className="mt-4 text-right">
              <Button onClick={closeAll} className="mr-2">
                Cancelar
              </Button>
              <Button
                isPrimary
                onClick={() => handleConfirmDelete(itemToDelete.id_subcategory)}
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

export default Subcategory;
