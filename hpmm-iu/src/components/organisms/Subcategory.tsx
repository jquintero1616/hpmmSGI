import React, { useEffect, useState, useMemo } from "react";
import { useCategory } from "../../hooks/use.Category";
import { useSubcategory } from "../../hooks/use.Subcategory";
import { SubcategoryInterface } from "../../interfaces/subcategory.interface";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Hooks y estados locales
const Subcategory: React.FC<{ status?: string }> = ({ status = "Todo" }) => {
  const {
    subcategory,
    GetSubcategoriesContext,
    PostCreateSubcategoryContext,
    PutUpdateSubcategoryContext,
    DeleteSubcategoryContext,
  } = useSubcategory();

  const { category, GetCategoriesContext } = useCategory();

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
  const [saving, setSaving] = useState(false);

  // 1) Columnas de la tabla
  const subcategoryColumns: Column<SubcategoryInterface>[] = [
    { header: "Nombre", accessor: "subcategory_name" },
    { header: "Categoria", 
      accessor: 
      (row) => category.find((c) => c.id_category === row.id_category)?.name || "" },
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
  const subcategoryFields: FieldConfig[] = useMemo(
    () => [
      {
        name: "nombre",
        label: "Nombre",
        type: "text",
        required: true,
      },
      {
        name: "id_category",
        label: "Categoría",
        type: "select",
        options: category.map((c) => ({
          label: c.name,
          value: c.id_category,
        })),
        required: true,
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
    ],
    [category]
  );

  // Validación personalizada para nombre duplicado (case-insensitive)
  const isNameTaken = (nombre: string, excludeId?: string) => {
    return subcategory.some(
      (s) =>
        s.nombre.trim().toLowerCase() === nombre.trim().toLowerCase() &&
        (!excludeId || s.id_subcategory !== excludeId)
    );
  };

  // Validación para crear (sin validación de nombre duplicado)
  const validateCreate = (_values: any) => {
    return {};
  };

  // Validación para editar (sin validación de nombre duplicado)
  const validateEdit = (_values: any) => {
    return {};
  };

  // Filtrado y ordenamiento
  const handleTableContent = (list: SubcategoryInterface[]) => {
    let filtrados = list;
    if (status === "Activos") {
      filtrados = list.filter((s) => s.estado === true);
    } else if (status === "Inactivos") {
      filtrados = list.filter((s) => s.estado === false);
    }
    // Ordenar por nombre, asegurando que siempre sea string
    const ordenados = filtrados.sort((a, b) =>
      (a.nombre ?? "").localeCompare(b.nombre ?? "")
    );
    setFilteredData(ordenados);
  };

  // Manejo de modales
  const closeAll = () => {
    setEditOpen(false);
    setCreateOpen(false);
    setDeleteOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
  };

  const openEdit = (id_subcategory: string) => {
    setItemToEdit(
      subcategory.find((s) => s.id_subcategory === id_subcategory) || null
    );
    setEditOpen(true);
  };

  const openDelete = (id_subcategory: string) => {
    setItemToDelete(
      subcategory.find((s) => s.id_subcategory === id_subcategory) || null
    );
    setDeleteOpen(true);
  };

  // Handlers CRUD
  const handleConfirmDelete = async (id_subcategory: string) => {
    setSaving(true);
    try {
      await DeleteSubcategoryContext(id_subcategory);
      await GetSubcategoriesContext();
      toast.success("Subcategoría eliminada correctamente");
      closeAll();
    } catch (error) {
      toast.error("Error eliminando subcategoría");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (values: any) => {
    if (!itemToEdit) return;

    // Validar si hay cambios
    const hasChanges =
      values.nombre !== itemToEdit.nombre ||
      values.id_category !== itemToEdit.id_category ||
      values.estado !== itemToEdit.estado;

    if (!hasChanges) {
      toast.error("No se detectaron cambios para guardar.");
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<SubcategoryInterface> = {
        ...itemToEdit,
        ...values,
        estado: values.estado === true,
      };
      await PutUpdateSubcategoryContext(itemToEdit.id_subcategory, payload as SubcategoryInterface);
      await GetSubcategoriesContext();
      toast.success(`Subcategoría ${values.nombre} actualizada correctamente`);
      closeAll();
    } catch (error) {
      toast.error("Error actualizando subcategoría");
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async (values: any) => {
    setSaving(true);
    try {
      const payload = {
        ...values,
        estado: values.estado === true,
      };
      await PostCreateSubcategoryContext(payload as SubcategoryInterface);
      await GetSubcategoriesContext();
      toast.success(`Subcategoría ${values.nombre} creada correctamente`);
      closeAll();
    } catch (error) {
      toast.error("Error creando subcategoría");
    } finally {
      setSaving(false);
    }
  };

  // Effects
  useEffect(() => {
    setLoading(true);
    Promise.all([GetSubcategoriesContext(), GetCategoriesContext()]).finally(() =>
      setLoading(false)
    );
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    handleTableContent(subcategory);
    // eslint-disable-next-line
  }, [status, subcategory]);

  // Render condicional
  if (loading) {
    return <div>Cargando subcategorías…</div>;
  }

  // Render principal
  return (
    <div>
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4 text-center">
        Lista de Subcategorías
      </h1>

      <div className="flex justify-end mb-4">
        <Button
          className="bg-hpmm-azul-claro hover:bg-hpmm-azul-oscuro text-white font-bold py-2 px-4 rounded"
          onClick={() => setCreateOpen(true)}
        >
          + Nueva subcategoría
        </Button>
      </div>

      <GenericTable
        columns={subcategoryColumns}
        data={filteredData}
        rowKey={(row) => row.id_subcategory}
        actions={[
          {
            header: "Editar",
            label: "Editar",
            onClick: (row) => openEdit(row.id_subcategory),
          },
          {
            header: "Eliminar",
            label: "Eliminar",
            onClick: (row) => openDelete(row.id_subcategory),
          },
        ]}
        rowClassName={(row) =>
          row.estado === false ? "opacity-40 line-through" : ""
        }
      />

      {/* Modal Editar */}
      <Modal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          
          <GenericForm<Partial<SubcategoryInterface>>
            initialValues={{
              nombre: itemToEdit.subcategory_name ?? "",
              id_category: itemToEdit.id_category ?? "",
              estado: itemToEdit.estado ?? true,
            }}
            
            fields={subcategoryFields}
            onSubmit={handleSave}
            onCancel={closeAll}
            validate={validateEdit}
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
            title="Editar Subcategoría"
            submitDisabled={saving}
          />
        )}
      </Modal>

      {/* Modal Crear */}
      <Modal isOpen={isCreateOpen} onClose={closeAll}>
        <GenericForm<Partial<SubcategoryInterface>>
          initialValues={{
            nombre: "",
            id_category: "",
            estado: true,
          }}
          fields={subcategoryFields.map((f) =>
            f.name === "estado" ? { ...f, disabled: true } : f
          )}
          onSubmit={handleCreate}
          onCancel={closeAll}
          validate={validateCreate}
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
          title="Crear Subcategoría"
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
            <p>¿Seguro que deseas borrar esta subcategoría?</p>
            <GenericTable
              columns={subcategoryColumns}
              data={[itemToDelete]}
              rowKey={(row) => row.id_subcategory}
            />
            <div className="mt-4 text-right gap-2 flex justify-center">
              <Button
                onClick={() => handleConfirmDelete(itemToDelete.id_subcategory)}
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

export default Subcategory;
