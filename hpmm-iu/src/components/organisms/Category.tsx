import React, { useEffect, useState } from "react";
import { useCategory } from "../../hooks/use.Category";
import { CategoryInterface } from "../../interfaces/Category.interface";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";

const Category: React.FC<{ status?: string }> = ({ status = "Todo" }) => {
  const {
    category,
    GetCategoriesContext,
    PostCreateCategoryContext,
    PutUpdateCategoryContext,
    DeleteCategoryContext,
  } = useCategory();

  // Estados locales para manejar la UI
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<CategoryInterface[]>([]);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<CategoryInterface | null>(null);
  const [itemToDelete, setItemToDelete] = useState<CategoryInterface | null>(null);

  // 1) Columnas de la tabla
  const categoryColumns: Column<CategoryInterface>[] = [
    { header: "Nombre", accessor: "name" },
    { header: "Descripción", accessor: "descripcion" },
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

  // 2) Campos para el formulario - Memo para evitar recreaciones innecesarias
  const categoryFields: FieldConfig[] = React.useMemo(
    () => [
      { name: "name", label: "Nombre", type: "text" },
      { name: "descripcion", label: "Descripción", type: "text" },
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
        await GetCategoriesContext();
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [GetCategoriesContext]);

  // Filtrar datos cuando cambie el status o category
  useEffect(() => {
    if (!category || category.length === 0) {
      setFilteredData([]);
      return;
    }

    // Filtrar elementos válidos antes de procesar
    const validCategories = category.filter(
      (item) =>
        item && item.id_category && typeof item.id_category === "string"
    );

    handleTableContent(validCategories);
  }, [status, category]);

  // ------------------------------------------------------------------------------------
  const closeAll = () => {
    setEditOpen(false);
    setCreateOpen(false);
    setDeleteOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
  };
  // ------------------------------------------------------------------------------------
  const openEdit = (id_category: string) => {
    if (!category || category.length === 0) {
      return;
    }

    const item = category.find(
      (item) => item && item.id_category === id_category
    );

    if (item) {
    
      setItemToEdit(item);
      setEditOpen(true);
    } else {
      console.error("No se encontró la categoría con ID:", id_category);
    }
  };

  const openDelete = (id_category: string) => {
    if (!category || category.length === 0) {
      return;
    }

    const item = category.find(
      (item) => item && item.id_category === id_category
    );

    if (item) {
      setItemToDelete(item);
      setDeleteOpen(true);
    } else {
      console.error("No se encontró la categoría con ID:", id_category);
    }
  };
  //-----------------------------------------------------------------------------------------
  const handleConfirmDelete = async (id_category: string) => {
    try {
      await DeleteCategoryContext(id_category);
      await GetCategoriesContext();
      closeAll();
    } catch (error) {
      console.error("Error eliminando categoría:", error);
    }
  };

  const handleTableContent = (list: CategoryInterface[]) => {
    // Asegurar que todos los elementos sean válidos
    const validList = list.filter(
      (item) =>
        item && item.id_category && typeof item.id_category === "string"
    );

    if (status === "Todo") {
      setFilteredData(validList);
    } else {
      // Filtrar solo activos
      const activeItems = validList.filter((item) => item.estado === true);
   
      setFilteredData(activeItems);
    }
  };

  const handleSave = async (values: any) => {
    if (!itemToEdit) {
      return;
    }

   

    try {
      
      const payload: Partial<CategoryInterface> = {
        ...itemToEdit,
        ...values,
        estado: values.estado === "true" || values.estado === true,
      };

     

      await PutUpdateCategoryContext(
        itemToEdit.id_category,
        payload as CategoryInterface
      );
      await GetCategoriesContext();
      closeAll();
    } catch (error) {
      console.error("Error actualizando categoría:", error);
    }
  };

  const handleCreate = async (values: any) => {
    try {
      const payload = {
        ...values,
        estado: values.estado === "true" || values.estado === true,
      };

    

      await PostCreateCategoryContext(payload as CategoryInterface);
      await GetCategoriesContext();
      closeAll();
    } catch (error) {
      console.error("Error creando categoría:", error);
    }
  };

  if (loading) {
    return <div>Cargando Categorías...</div>;
  }

  return (
    <div>
      <h1>Lista de Categorías</h1>
      <Button onClick={() => setCreateOpen(true)}>+ Nueva Categoría</Button>

      <GenericTable
        columns={categoryColumns}
        data={filteredData.filter((item) => item && item.id_category)} // Filtro adicional de seguridad
        rowKey={(row) => row?.id_category || ""}
        actions={[
          {
            header: "Editar",
            label: "Editar",
            onClick: (row) =>
              row?.id_category && openEdit(row.id_category),
          },
          {
            header: "Eliminar",
            label: "Eliminar",
            onClick: (row) =>
              row?.id_category && openDelete(row.id_category),
          },
        ]}
      />

      {/* Modal Editar */}
      <Modal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <GenericForm<Partial<CategoryInterface>>
            initialValues={{
              name: itemToEdit.name || "",
              descripcion: itemToEdit.descripcion || "",
              estado: itemToEdit.estado,
            }}
            fields={categoryFields}
            onSubmit={handleSave}
            onCancel={closeAll}
            submitLabel="Guardar"
            cancelLabel="Cancelar"
          />
        )}
      </Modal>

      {/* Modal Crear */}
      <Modal isOpen={isCreateOpen} onClose={closeAll}>
        <GenericForm<Partial<CategoryInterface>>
          initialValues={{
            name: "",
            descripcion: "",
            estado: true,
          }}
          fields={categoryFields}
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
            <p>¿Seguro que deseas borrar esta categoría?</p>
            <GenericTable
              columns={categoryColumns}
              data={[itemToDelete]}
              rowKey={(row) => row.id_category}
            />
            <div className="mt-4 text-right">
              <Button onClick={closeAll} className="mr-2">
                Cancelar
              </Button>
              <Button
                isPrimary
                onClick={() => handleConfirmDelete(itemToDelete.id_category)}
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

export default Category;