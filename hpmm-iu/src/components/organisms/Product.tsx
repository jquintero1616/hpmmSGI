import React, { useEffect, useState } from "react";
import { useProducts } from "../../hooks/use.Product";
import {
  ProductInterface,
  ProductDetail,
} from "../../interfaces/product.interface";
import { useSubcategory } from "../../hooks/use.Subcategory";
import { useKardex } from "../../hooks/use.Kardex";
import Button from "../atoms/Buttons/Button";
import GenericModal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";
import Select from "../atoms/Inputs/Select";
import { useCategory } from "../../hooks/use.Category";
import { ToastContainer, toast } from "react-toastify";

const Products: React.FC<{ status?: string }> = ({ status = "Todo" }) => {
  const {
    products,
    ProductDetail,
    GetProductsContext,
    PostCreateProductContext,
    PutUpdateProductContext,
    DeleteProductContext,
  } = useProducts();

  const { subcategory, GetSubcategoriesContext } = useSubcategory();
  const { kardex, GetKardexContext } = useKardex();
  const { category } = useCategory();

  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<ProductDetail[]>([]);
  const [dataListForm, setDataListForm] = useState<any[]>([]);

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ProductInterface | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ProductDetail | null>(null);
  const [itemToEditList, setItemToEditList] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");

  // 1) Fetch inicial
  useEffect(() => {
    Promise.all([
      GetProductsContext(),
      GetSubcategoriesContext(),
      GetKardexContext(),
    ]).finally(() => setLoading(false));
  }, []);

  // 2) Calcula stock solo con movimientos "Aprobado"
  const computeStock = (productId: string): number => {
    return kardex
      .filter((k) => k.id_product === productId && k.tipo === "Aprobado")
      .reduce((acc, k) => {
        const qty = parseFloat(k.cantidad);
        return acc + (k.tipo_movimiento === "Entrada" ? qty : -qty);
      }, 0);
  };

  // 3) Refiltra cuando cambian datos o estado
  useEffect(() => {
    let data = ProductDetail.map((d) => ({
      ...d,
      stock_actual: computeStock(d.id_product),
    }));

    // filtro por estado (Activo/Inactivo)
    if (status !== "Todo") {
      data = data.filter((d) => d.estado === (status === "Activo"));
    }

    setFilteredData(data);
  }, [ProductDetail, kardex, status]);

  // Función para formatear el nombre con números en negrita
  const formatProductName = (name: string) => {
    // Regex para encontrar secuencias de números
    const parts = name.split(/(\d+)/);

    return (
      <span>
        {parts.map((part, index) => {
          // Si la parte es un número, la mostramos en negrita
          if (/^\d+$/.test(part)) {
            return <strong key={index}>{part}</strong>;
          }
          return part;
        })}
      </span>
    );
  };

  // Columnas
  const productColumns: Column<ProductDetail>[] = [
    {
      header: "Nombre",
      accessor: (row) => formatProductName(row.nombre),
    },
    { header: "Cat.", accessor: "category_name" },
    { header: "Subcat.", accessor: "subcategory_name" },

    {
      header: "Existencias",
      accessor: (row) => {
        const actual = row.stock_actual;
        const max = row.stock_maximo;
        const exceeded = actual > max;
        const noExist = actual <= 0;
        const inStock = actual > 0 && actual <= max;
        return (
          <div className="flex items-center gap-2">
            <span
              className={
                noExist
                  ? "text-red-600 font-semibold"
                  : exceeded
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 dark:text-gray-300"
              }
            >
              {actual}
            </span>
            {inStock && (
              <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                EN STOCK
              </span>
            )}
            {exceeded && (
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                EXCEDE MÁX
              </span>
            )}
            {noExist && (
              <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                SIN STOCK
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: "Máx.",
      accessor: (row) => String(row.stock_maximo),
    },

    {
      header: "Estado",
      accessor: (row) => (row.estado ? "Activo" : "Inactivo"),
    },
    
    {
      header: "Fecha Actualización",
      accessor: (row) =>
        row.updated_at ? new Date(row.updated_at).toLocaleString() : "",
    },
  ];

  const productFormListColumns: Column<ProductDetail>[] = [
    {
      header: "Categoria",
      accessor: (row) =>
        category.find((c) => c.id_category === row.id_category)?.name || "N/A",
    },
    {
      header: "Subcategoria",
      accessor: (row) =>
        subcategory.find((s) => s.id_subcategory === row.id_subcategory)
          ?.subcategory_name || "N/A",
    },
    {
      header: "Nombre",
      accessor: (row) => formatProductName(row.nombre),
    },

    {
      header: "Existencias",
      accessor: (row) => {
        const actual = row.stock_actual;
        const max = row.stock_maximo;
        const exceeded = actual > max;
        const noExist = actual <= 0;
        const inStock = actual > 0 && actual <= max;
        return (
          <div className="flex items-center gap-2">
            <span
              className={
                noExist
                  ? "text-red-600 font-semibold"
                  : exceeded
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 dark:text-gray-300"
              }
            >
              {actual}
            </span>
            {inStock && (
              <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                EN STOCK
              </span>
            )}
            {exceeded && (
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                EXCEDE MÁX
              </span>
            )}
            {noExist && (
              <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                SIN STOCK
              </span>
            )}
          </div>
        );
      },
    },
  ];

  // Campos del formulario
  const productFieldsNoEstado: FieldConfig[] = [
    {
      name: "id_category",
      label: "Categoría",
      type: "select",
      options: category.map((c) => ({
        label: c.name, // <-- Cambia aquí
        value: c.id_category,
      })),
      // NO required
    },
    {
      name: "id_subcategory",
      label: "Subcategoría",
      type: "select",
      options: subcategory.map((sub) => ({
        label: sub.subcategory_name,
        value: sub.id_subcategory,
      })),
      // NO required
    },
    { name: "nombre", label: "Nombre Producto", type: "text", required: true, colSpan: 2 },
    { name: "stock_actual", label: "Stock Actual", type: "number", required: true },
    { name: "stock_maximo", label: "Stock Máximo", type: "number", required: true },
    
  ];

  // Modales y CRUD
  const closeAll = () => {
    setCreateOpen(false);
    setEditOpen(false);
    setDeleteOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
    setDataListForm([]);
  };

  const openEdit = (id: string) => {
    const found = products.find((p) => p.id_product === id) || null;
    setItemToEdit(found);
    setEditOpen(true);
  };

  const openDelete = (id: string) => {
    const found = products.find((p) => p.id_product === id) || null;
    setItemToDelete(found);
    setDeleteOpen(true);
  };

  const deleteItemList = (nombre: string) => {
    const found = dataListForm.filter((p) => p.nombre !== nombre);
    setDataListForm(found);
  };

  const handleCreate = async (values: any) => {
    toast.info("Creando productos, por favor espere...");
    if (dataListForm.length === 0) {
      toast.error("Debes agregar al menos un producto a la lista.");
      return;
    }
    try {
      await Promise.all(
        dataListForm.map(async (item) => {
          await PostCreateProductContext({
            ...item,
            estado: values.estado === "true",
            fecha_vencimiento: new Date(values.fecha_vencimiento),
          } as ProductInterface);
        })
      );
      toast.info("Productos creados con éxito.");
    } catch (error) {
      toast.error("Error al crear productos: " + error);
      return;
    }

    setDataListForm([]); // Limpiar la lista después de crear
    await GetProductsContext();

    closeAll();
  };

  const handleSave = async (values: any) => {
    if (!itemToEdit) return;
    await PutUpdateProductContext(itemToEdit.id_product, {
      ...itemToEdit,
      ...values,
    });
    await GetProductsContext();
    toast.success(`Producto "${values.nombre}" actualizado correctamente`);
    closeAll();
  };

  const handleConfirmDelete = async (id: string) => {
    try {
      await DeleteProductContext(id);
      await GetProductsContext();
    } finally {
      closeAll();
    }
  };

  // Nueva función para validar duplicados en la lista
  const isDuplicateInList = (item: any) => {
    return dataListForm.some(
      (p) =>
        p.nombre.trim().toLowerCase() === item.nombre.trim().toLowerCase() &&
        p.id_category === item.id_category &&
        p.id_subcategory === item.id_subcategory &&
        (!itemToEditList || p.id_product !== itemToEditList.id_product)
    );
  };

  // Handler para agregar o editar en la lista
  const handleAddItem = (item: any) => {
    // Validar duplicados
    if (isDuplicateInList(item)) {
      toast.error("Ya existe un producto con ese nombre, categoría y subcategoría en la lista.");
      return;
    }

    // Asegura que los valores seleccionados estén en el objeto
    const itemWithCategory = {
      ...item,
      id_category: selectedCategory || item.id_category,
      id_subcategory: selectedSubcategory || item.id_subcategory,
    };

    if (itemToEditList) {
      setDataListForm((prev) =>
        prev.map((p) =>
          p.id_product === itemToEditList.id_product
            ? { ...itemWithCategory, id_product: itemToEditList.id_product }
            : p
        )
      );
      setItemToEditList(null);
    } else {
      setDataListForm((prev) => [
        ...prev,
        { ...itemWithCategory, id_product: crypto.randomUUID() },
      ]);
    }
    setSelectedCategory("");
    setSelectedSubcategory("");
  };

  if (loading) return <div>Cargando productos…</div>;

  return (
    <div>
      <ToastContainer />
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Gestión de Productos
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Administra el inventario de productos del hospital
          </p>
        </div>
        <Button
          className="bg-hpmm-azul-claro hover:bg-hpmm-azul-oscuro text-white font-bold py-2 px-4 rounded-lg"
          onClick={() => setCreateOpen(true)}
        >
          + Nuevo producto
        </Button>
      </div>


      {filteredData.length > 0 ? (
        <GenericTable
          columns={productColumns}
          data={filteredData}
          rowKey={(row) => row.id_product}
          actions={[
            {
              header: "Acciones",
              label: "Editar",
              actionType: "editar" as const,
              tooltip: "Editar producto",
              onClick: (row) => openEdit(row.id_product),
            },
            {
              header: "Eliminar",
              label: "Eliminar",
              actionType: "eliminar" as const,
              tooltip: "Eliminar producto",
              onClick: (row) => openDelete(row.id_product),
            },
          ]}
        />
      ) : (
        <p className="mt-4 text-gray-600">No hay productos para mostrar.</p>
      )}

      {/* Modales Crear / Editar / Eliminar */}
      <GenericModal isOpen={isCreateOpen} onClose={closeAll}>
        <h2 className="text-xl font-bold mb-4 text-center">
          {itemToEditList
            ? "Editar producto de la lista"
            : "Agregar producto a la lista"}
        </h2>
        <GenericForm
          columns={2}
          initialValues={
            itemToEditList
              ? itemToEditList
              : {
                  id_category: selectedCategory,
                  id_subcategory: selectedSubcategory,
                  nombre: "",
                  stock_actual: 0,
                  stock_maximo: 0,
                  estado: "true",
                }
          }
          fields={productFieldsNoEstado}
          onSubmit={handleAddItem}
          onCancel={() => {
            setItemToEditList(null);
          }}
          submitLabel={itemToEditList ? "Actualizar" : "Agregar a lista"}
          cancelLabel="Cancelar edición"
          dataList={dataListForm}
          setDataList={setDataListForm}
          extraFields={{
            id_category: (
              <Select
                name="id_category"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory("");
                }}
                options={category.map((c) => ({
                  label: c.name,
                  value: c.id_category,
                }))}
                placeholder="Seleccionar categoría"
              />
            ),
            id_subcategory: (
              <Select
                name="id_subcategory"
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                options={subcategory
                  .filter((sub) => sub.id_category === selectedCategory)
                  .map((sub) => ({
                    label: sub.subcategory_name,
                    value: sub.id_subcategory,
                  }))}
                placeholder="Seleccionar subcategoría"
                disabled={!selectedCategory}
              />
            ),
          }}
        />
        <GenericTable
          columns={productFormListColumns}
          data={dataListForm.map((item) => ({
            ...item,
            category_name:
              category.find((c) => c.id_category === item.id_category)?.name ||
              "N/A",
            subcategory_name:
              subcategory.find((s) => s.id_subcategory === item.id_subcategory)
                ?.subcategory_name || "N/A",
          }))}
          rowKey={(row) => row.id_product}
          actions={[
            {
              header: "Acciones",
              label: "Editar",
              actionType: "editar" as const,
              tooltip: "Editar producto de la lista",
              onClick: (row) => setItemToEditList(row),
            },
            {
              header: "Eliminar",
              label: "Eliminar",
              actionType: "eliminar" as const,
              tooltip: "Eliminar producto de la lista",
              onClick: (row) => deleteItemList(row.nombre),
            },
          ]}
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button
            onClick={handleCreate}
            className="bg-hpmm-azul-claro hover:bg-hpmm-azul-oscuro text-white font-bold py-2 px-4 rounded"
            disabled={dataListForm.length === 0}
          >
            Crear todos
          </Button>
          <Button
            onClick={() => {
              setItemToEditList(null);
              setDataListForm([]);
              closeAll();
            }}
            className="bg-hpmm-amarillo-claro hover:bg-hpmm-amarillo-oscuro text-gray-800 font-bold py-2 px-4 rounded"
          >
            Cancelar
          </Button>
        </div>
      </GenericModal>

      <GenericModal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <GenericForm
            columns={2}
            initialValues={{
              id_subcategory: itemToEdit.id_subcategory,
              nombre: itemToEdit.nombre,

              stock_actual: itemToEdit.stock_actual,
              stock_maximo: itemToEdit.stock_maximo,
            }}
            fields={productFieldsNoEstado}
            onSubmit={handleSave}
            onCancel={closeAll}
            submitLabel="Guardar"
            cancelLabel="Cancelar"
          />
        )}
      </GenericModal>

      <GenericModal isOpen={isDeleteOpen} onClose={closeAll}>
        {itemToDelete ? (
          <>
            <h3 className="text-xl font-semibold mb-4">
              Confirmar Eliminación
            </h3>
            <p>
              ¿Seguro que deseas borrar este producto{" "}
              <strong>{itemToDelete.nombre}</strong>?
            </p>
            <GenericTable
              columns={productColumns}
              data={[itemToDelete]}
              rowKey={(row) => row.id_product}
            />
            <div className="mt-4 text-right">
              <Button onClick={closeAll} className="mr-2">
                Cancelar
              </Button>
              <Button
                isPrimary
                onClick={() => handleConfirmDelete(itemToDelete.id_product)}
              >
                Eliminar
              </Button>
            </div>
          </>
        ) : (
          <p>Producto no encontrado para eliminar.</p>
        )}
      </GenericModal>
    </div>
  );
};

export default Products;
