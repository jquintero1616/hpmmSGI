import React, { useEffect, useState } from "react";
import { useProductRequisi } from "../../hooks/use.Product_requisi";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";
// Importar hooks y tipos necesarios
import { useProducts } from "../../hooks/use.Product";
import { useRequisicion } from "../../hooks/use.Requisicion";
import { Requi_x_ProductInterface } from "../../interfaces/Product_Requisi_interface";

const ProductRequisition: React.FC<{ status?: string }> = ({ status = "Todo" }) => {
  const {
    productRequisition,
    GetRequiProductContext,
    PostCreateProductRequisitionContext,
    PutUpdateProductRequisitionContext,
    DeleteProductRequisitionContext,
  } = useProductRequisi();

  const { products, GetProductsContext } = useProducts();
  const { requisitions, GetRequisicionesContext } = useRequisicion();

  // Estados locales para manejar la UI
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<Requi_x_ProductInterface[]>([]);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Requi_x_ProductInterface | null>(
    null
  );
  const [itemToDelete, setItemToDelete] = useState<Requi_x_ProductInterface | null>(
    null
  );

  // 1) Columnas de la tabla
  const productRequisitionColumns: Column<Requi_x_ProductInterface>[] = [
    { header: "Requisición", accessor: "id_requisi" },
    { header: "Producto", accessor: "id_product" },
    { header: "Cantidad", accessor: "cantidad" },
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
  const productRequisitionFields: FieldConfig[] = React.useMemo(
    () => [
      {
        name: "id_requisi",
        label: "Requisición",
        type: "select",
        options: requisitions.map((r) => ({ label: r.id_requisi, value: r.id_requisi })),
      },
      {
        name: "id_product",
        label: "Producto",
        type: "select",
        options: products.map((p) => ({ label: p.nombre, value: p.id_product })),
      },
      { name: "cantidad", label: "Cantidad", type: "number" },
    ],
    [requisitions, products]
  );

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([GetRequiProductContext(), GetProductsContext(), GetRequisicionesContext()]);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtrar datos cuando cambie el status o productRequisition
  useEffect(() => {
    if (!productRequisition || productRequisition.length === 0) {
      setFilteredData([]);
      return;
    }

    // Filtrar elementos válidos antes de procesar
    const validProductRequisitions = productRequisition.filter(
      (item) =>
        item && item.id_requisi_x_product && typeof item.id_requisi_x_product === "string"
    );

    handleTableContent(validProductRequisitions);
  }, [status, productRequisition]);

// ------------------------------------------------------------------------------------
  const closeAll = () => {
    setEditOpen(false);
    setCreateOpen(false);
    setDeleteOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
  };
  // ------------------------------------------------------------------------------------
  const openEdit = (id_requisi_x_product: string) => {
    if (!productRequisition || productRequisition.length === 0) {
      return;
    }

    const item = productRequisition.find(
      (item) => item && item.id_requisi_x_product === id_requisi_x_product
    );

    if (item) {
     
      setItemToEdit(item);
      setEditOpen(true);
    } else {
      console.error("No se encontró el producto requisición con ID:", id_requisi_x_product);
    }
  };

  const openDelete = (id_requisi_x_product: string) => {
    if (!productRequisition || productRequisition.length === 0) {
      return;
    }

    const item = productRequisition.find(
      (item) => item && item.id_requisi_x_product === id_requisi_x_product
    );

    if (item) {
      setItemToDelete(item);
      setDeleteOpen(true);
    } else {
      console.error("No se encontró el producto requisición con ID:", id_requisi_x_product);
    }
  };
  //-----------------------------------------------------------------------------------------
  const handleConfirmDelete = async (id_requisi_x_product: string) => {
    try {
      await DeleteProductRequisitionContext(id_requisi_x_product);
      await GetRequiProductContext();
      closeAll();
    } catch (error) {
      console.error("Error eliminando producto requisición:", error);
    }
  };

  const handleTableContent = (list: Requi_x_ProductInterface[]) => {
    // Asegurar que todos los elementos sean válidos
    const validList = list.filter(
      (item) =>
        item && item.id_requisi_x_product && typeof item.id_requisi_x_product === "string"
    );

    if (status === "Todo") {
      setFilteredData(validList);
    } else {
      // Filtrar solo activos si aplica
      setFilteredData(validList);
    }
  };

  const handleSave = async (values: any) => {
    if (!itemToEdit) {
      console.error("No hay item para editar");
      return;
    }



    try {
      // Arma el objeto de actualización
      const payload: Partial<Requi_x_ProductInterface> = {
        ...itemToEdit,
        ...values,
        cantidad: Number(values.cantidad),
      };

    

      await PutUpdateProductRequisitionContext(
        itemToEdit.id_requisi_x_product,
        payload as Requi_x_ProductInterface
      );
      await GetRequiProductContext();
      closeAll();
    } catch (error) {
      console.error("Error actualizando producto requisición:", error);
    }
  };

  const handleCreate = async (values: any) => {
    try {
      const payload = {
        ...values,
        cantidad: Number(values.cantidad),
      };


      await PostCreateProductRequisitionContext(payload as Requi_x_ProductInterface);
      await GetRequiProductContext();
      closeAll();
    } catch (error) {
      console.error("Error creando producto requisición:", error);
    }
  };

  if (loading) {
    return <div>Cargando Productos Requisición...</div>;
  }

  return (
    <div>
      <h1>Lista de Productos por Requisición</h1>
      <Button onClick={() => setCreateOpen(true)}>+ Nuevo Producto Requisición</Button>

      <GenericTable
        columns={productRequisitionColumns}
        data={filteredData.filter((item) => item && item.id_requisi_x_product)} // Filtro adicional de seguridad
        rowKey={(row) => row?.id_requisi_x_product || ""}
        actions={[
          {
            header: "Editar",
            label: "Editar",
            onClick: (row) =>
              row?.id_requisi_x_product && openEdit(row.id_requisi_x_product),
          },
          {
            header: "Eliminar",
            label: "Eliminar",
            onClick: (row) =>
              row?.id_requisi_x_product && openDelete(row.id_requisi_x_product),
          },
        ]}
      />

      {/* Modal Editar */}
      <Modal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <GenericForm<Partial<Requi_x_ProductInterface>>
            initialValues={{
              id_requisi: itemToEdit.id_requisi || "",
              id_product: itemToEdit.id_product || "",
              cantidad: itemToEdit.cantidad,
            }}
            fields={productRequisitionFields}
            onSubmit={handleSave}
            onCancel={closeAll}
            submitLabel="Guardar"
            cancelLabel="Cancelar"
          />
        )}
      </Modal>

      {/* Modal Crear */}
      <Modal isOpen={isCreateOpen} onClose={closeAll}>
        <GenericForm<Partial<Requi_x_ProductInterface>>
          initialValues={{
            id_requisi: "",
            id_product: "",
            cantidad: 0,
          }}
          fields={productRequisitionFields}
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
            <p>¿Seguro que deseas borrar este producto requisición?</p>
            <GenericTable
              columns={productRequisitionColumns}
              data={[itemToDelete]}
              rowKey={(row) => row.id_requisi_x_product}
            />
            <div className="mt-4 text-right">
              <Button onClick={closeAll} className="mr-2">
                Cancelar
              </Button>
              <Button
                isPrimary
                onClick={() => handleConfirmDelete(itemToDelete.id_requisi_x_product)}
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

export default ProductRequisition;