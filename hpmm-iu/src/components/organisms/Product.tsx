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

type StockFilter = "Todas" | "Bajas" | "Excedidas" | "Normales";

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

  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<ProductDetail[]>([]);
  const [stockFilter, setStockFilter] = useState<StockFilter>("Todas");

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ProductInterface | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ProductDetail | null>(null);

  // 1) Fetch inicial
  useEffect(() => {
    Promise.all([
      GetProductsContext(),
      GetSubcategoriesContext(),
      GetKardexContext(),
    ]).finally(() => setLoading(false));
  }, [GetProductsContext, GetSubcategoriesContext, GetKardexContext]);

  // 2) Calcula stock solo con movimientos "Aprobado"
  const computeStock = (productId: string): number => {
    return kardex
      .filter((k) => k.id_product === productId && k.tipo === "Aprobado")
      .reduce((acc, k) => {
        const qty = parseFloat(k.cantidad);
        return acc + (k.tipo_movimiento === "Entrada" ? qty : -qty);
      }, 0);
  };

  // 3) Refiltra cuando cambian datos, estado o filtro de stock
  useEffect(() => {
    let data = ProductDetail.map((d) => ({
      ...d,
      stock_actual: computeStock(d.id_product),
    }));

    // filtro por estado (Activo/Inactivo)
    if (status !== "Todo") {
      data = data.filter((d) => d.estado === (status === "Activo"));
    }

    // filtro por stock
    if (stockFilter === "Bajas") {
      data = data.filter(
        (d) => d.stock_maximo > 0 && d.stock_actual / d.stock_maximo < 0.3 // menos del 30%, incluye 0
      );
    } else if (stockFilter === "Excedidas") {
      data = data.filter((d) => d.stock_actual > d.stock_maximo);
    } else if (stockFilter === "Normales") {
      data = data.filter(
        (d) =>
          d.stock_maximo > 0 &&
          d.stock_actual / d.stock_maximo >= 0.3 && // desde 30%
          d.stock_actual <= d.stock_maximo // hasta el máximo
      );
    }

    setFilteredData(data);
  }, [ProductDetail, kardex, status, stockFilter]);

  // Columnas
  const productColumns: Column<ProductDetail>[] = [
    { header: "Nombre", accessor: "nombre" },
    { header: "Cat.", accessor: "category_name" },
    { header: "Subcat.", accessor: "subcategory_name" },
    { header: "Desc.", accessor: "descripcion" },
    {
      header: "Exist.",
      accessor: (row) => {
        const actual = row.stock_actual;
        const max = row.stock_maximo;
        const exceeded = actual > max;
        const noExist = actual <= 0;
        return (
          <div className="flex items-center">
            <span
              className={exceeded ? "text-green-600 font-semibold" : undefined}
            >
              {actual}
            </span>
            {exceeded && (
              <span className="ml-2 px-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                MAX
              </span>
            )}
            {noExist && (
              <span className="ml-2 px-1 text-xs font-medium bg-red-100 text-red-800 rounded">
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
      header: "Vence",
      accessor: (row) => new Date(row.fecha_vencimiento).toLocaleDateString(),
    },
    { header: "Lote", accessor: "numero_lote" },
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
    { name: "numero_lote", label: "No. Lote", type: "text" },
  ];

  // Modales y CRUD
  const closeAll = () => {
    setCreateOpen(false);
    setEditOpen(false);
    setDeleteOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
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

  const handleCreate = async (values: any) => {
    await PostCreateProductContext({
      ...values,
      estado: values.estado === "true",
      fecha_vencimiento: new Date(values.fecha_vencimiento),
    } as ProductInterface);
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

  if (loading) return <div>Cargando productos…</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Gestión de Productos</h2>

      {/* Controles: Nuevo + Filtro de stock */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <Button onClick={() => setCreateOpen(true)}>+ Nuevo producto</Button>

        <div className="flex items-center">
          <label htmlFor="stockFilter" className="mr-2 font-medium">
            Filtro de stock:
          </label>
          <Select
            name="stockFilter"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as StockFilter)}
            options={[
              { label: "Todas", value: "Todas" },
              { label: "Bajas existencias", value: "Bajas" },
              { label: "Excedidas", value: "Excedidas" },
              { label: "Stock normales", value: "Normales" },
            ]}
            placeholder="Todas"
            className="w-48"
          />
        </div>
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

      {/* Modales Crear / Editar / Eliminar */}
      <GenericModal isOpen={isCreateOpen} onClose={closeAll}>
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

      <GenericModal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
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
