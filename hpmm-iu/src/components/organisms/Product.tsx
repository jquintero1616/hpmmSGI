// src/components/organisms/Products.tsx

import React, { useEffect, useState } from "react";
import { useProducts } from "../../hooks/use.Product";
import {
  ProductInterface,
  ProductDetail,
} from "../../interfaces/product.interface";
import Button from "../atoms/Buttons/Button";
import GenericModal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";
import { useSubcategory } from "../../hooks/use.Subcategory";

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

  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<ProductDetail[]>([]);

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ProductInterface | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ProductDetail | null>(null);

  // Columnas para tu GenericTable
  // asegúrate de tener tu componente Button

  const productColumns: Column<ProductDetail>[] = [
    { header: "Nombre", accessor: "nombre" },
    { header: "Cat.", accessor: "category_name" },
    { header: "Subcat.", accessor: "subcategory_name" },
    { header: "Desc.", accessor: "descripcion" },

    { header: "Exist.", accessor: (row) => String(row.stock_actual) },
    { header: "Máx.", accessor: (row) => String(row.stock_maximo) },

    {
      header: "Vence",
      accessor: (row) => new Date(row.fecha_vencimiento).toLocaleDateString(),
    },
    { header: "Lote", accessor: "numero_lote" },
    {
      header: "Estado",
      accessor: (row) => (row.estado ? "Activo" : "Inactivo"),
    },
  ];

  const productFieldsNoEstado: FieldConfig[] = [
    {
      name: "id_subcategory",
      label: "Subcategoría",
      type: "select",
      options: subcategory.map((s) => ({
        label: s.nombre,
        value: s.id_subcategory,
      })),
    },
    { name: "nombre", label: "Nombre", type: "text" },
    { name: "descripcion", label: "Descripción", type: "text" },
    { name: "stock_actual", label: "Stock Actual", type: "number" },
    { name: "stock_maximo", label: "Stock Máximo", type: "number" },
    { name: "fecha_vencimiento", label: "Fecha Vencimiento", type: "date" },
    { name: "numero_lote", label: "No.Lote", type: "text" },
  ];

  // Carga inicial de productos
  useEffect(() => {
    Promise.all([GetProductsContext(), GetSubcategoriesContext()]).finally(() =>
      setLoading(false)
    );
  }, [GetProductsContext, GetSubcategoriesContext]);

  // Filtrar productos cada vez que cambian 'products' o 'status'
  useEffect(() => {
    handleTableContet(ProductDetail);
  }, [products, status]);

  const closeAll = () => {
    setCreateOpen(false);
    setEditOpen(false);
    setDeleteOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
  };

  const openEdit = (id: string) => {
    const found = Array.isArray(products)
      ? products.find((p) => p.id_product === id) || null
      : null;
    setItemToEdit(found);
    setEditOpen(true);
  };

  const handleTableContet = (pd: ProductDetail[]) => {
    if (status === "Todo") {
      setFilteredData(pd);
    } else {
      setFilteredData(
        pd.filter((item) => item.estado === (status === "Activo"))
      );
      console.log("Filtrado por estado:", status);
    }
  };

  // Función para abrir el modal de eliminación
  const openDelete = (id: string) => {
    const found = products.find((p) => p.id_product === id) || null;
    setItemToDelete(found);
    setDeleteOpen(true);
  };
  // Función para manejar el cierre de todos los modales
  const handleCreate = async (values: any) => {
    await PostCreateProductContext({
      ...values,
      estado: values.estado === "true",
      fecha_vencimiento: new Date(values.fecha_vencimiento),
    } as ProductInterface);
    await GetProductsContext();
    closeAll();
  };
  // Función para manejar la edición de un producto
  const handleSave = async (values: any) => {
  if (!itemToEdit) return;
  await PutUpdateProductContext(itemToEdit.id_product, {
    ...itemToEdit,
    ...values,
  });
  await GetProductsContext();
  closeAll();
};
  // Función para confirmar la eliminación de un producto
  const handleConfirmDelete = async (id: string) => {
    try {
      await DeleteProductContext(id);
      await GetProductsContext();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    } finally {
      closeAll();
    }
  };

  if (loading) {
    return <div>Cargando productos…</div>;
  }

  // Ahora label acepta React.ReactNode, así podemos pasar icono

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Gestión de Productos</h2>
      <Button onClick={() => setCreateOpen(true)}>+ Nuevo producto</Button>

      {Array.isArray(filteredData) && filteredData.length > 0 ? (
        <GenericTable
          columns={productColumns}
          data={filteredData}
          rowKey={(row) => row.id_product}
          actions={[
            {
              header: "Acciones",
              label: "Editar",
              onClick: (row) => openEdit(row.id_product),
            },
            {
              header: "Eliminar",
              label: "Eliminar",
              onClick: (row) => openDelete(row.id_product),
            },
          ]}
        />
      ) : (
        <p className="mt-4 text-gray-600">No hay productos para mostrar.</p>
      )}

      {/* Modal Crear */}
      <GenericModal isOpen={isCreateOpen} onClose={closeAll}>
        <h3 className="text-xl font-semibold mb-4">Crear Producto</h3>
        <GenericForm
          initialValues={{
            id_subcategory: "",
            nombre: "",
            descripcion: "",
            stock_actual: 0,
            stock_maximo: 0,
            fecha_vencimiento: new Date().toISOString().slice(0, 10),
            numero_lote: "",
            estado: "true",
          }}
          fields={productFieldsNoEstado}
          onSubmit={handleCreate}
          onCancel={closeAll}
          submitLabel="Crear"
          cancelLabel="Cancelar"
        />
      </GenericModal>

      {/* Modal Editar */}
      <GenericModal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <>
            <GenericForm
              initialValues={{
                id_subcategory: itemToEdit.id_subcategory,
                nombre: itemToEdit.nombre,
                descripcion: itemToEdit.descripcion,
                stock_actual: itemToEdit.stock_actual,
                stock_maximo: itemToEdit.stock_maximo,
                fecha_vencimiento: new Date(itemToEdit.fecha_vencimiento)
                  .toISOString()
                  .slice(0, 10),
                numero_lote: itemToEdit.numero_lote,
              }}
              fields={productFieldsNoEstado}
              onSubmit={handleSave}
              onCancel={closeAll}
              submitLabel="Guardar"
              cancelLabel="Cancelar"
            />
          </>
        )}
      </GenericModal>

      {/* Modal Eliminar */}
      <GenericModal isOpen={isDeleteOpen} onClose={closeAll}>
        {itemToDelete ? (
          <>
            <h3 className="text-xl font-semibold mb-4">
              Confirmar Eliminación
            </h3>
            <p>
              ¿Seguro que deseas borrar este producto {""}
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
