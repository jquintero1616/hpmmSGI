import React, { useEffect, useState } from "react";
import { useKardex } from "../../hooks/use.Kardex";
import {
  KardexDetail,
  kardexInterface,
} from "../../interfaces/kardex.interface";
import Button from "../../components/atoms/Buttons/Button";
import Modal from "../../components/molecules/GenericModal";
import GenericForm, {
  FieldConfig,
} from "../../components/molecules/GenericForm";
import GenericTable, { Column } from "../../components/molecules/GenericTable";
import { useProducts } from "../../hooks/use.Product";

const Kardex: React.FC<{ status: string }> = ({ status = "Todo" }) => {
  // 1. HOOKS (al inicio)
  const {
    kardex,
    kardexDetail,
    GetKardexContext,
    PostCreateKardexContext,
    PutUpdateKardexContext,
    DeleteKardexContext,
  } = useKardex();
  const { products, GetProductsContext, PutUpdateProductContext } = useProducts();
  

  // 2. ESTADOS (agrupados por función)
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState(kardexDetail);

  // Estados de modales
  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  // Estados de items seleccionados
  const [itemToEdit, setItemToEdit] = useState<kardexInterface | null>(null);
  const [itemToDelete, setItemToDelete] = useState<KardexDetail | null>(null);

  // 3. CONFIGURACIONES (constantes que no cambian)
  const kardexColumns: Column<KardexDetail>[] = [
    { header: "Numero de Orden", accessor: "shopping_order_id" },
    { header: "Tipo de movimiento", accessor: "tipo_movimiento" },
    { header: "Factura", accessor: "numero_factura" },
    { header: "Producto", accessor: "nombre" },
    {
      header: "Nombre del Solicitante de Compra",
      accessor: "nombre_empleado_sc",
    },
    {
      header: "Nombre del Solicitante de Fusion",
      accessor: "nombre_empleado_sf",
    },
    { header: "Descripción del producto", accessor: "descripcion" },
    { header: "Nombre del Proveedor", accessor: "nombre_proveedor" },
    { header: "Vendedor", accessor: "nombre_contacto_vendedor" },
    {
      header: "Fecha de Ingreso",
      accessor: (row) => new Date(row.fecha_movimiento).toLocaleString(),
    },
    { header: "Tipo de solicitud", accessor: "tipo_solicitud" },
    { header: "Cantidad", accessor: "cantidad" },
    { header: "Precio unitario", accessor: "precio_unitario" },
    { header: "Stock actual", accessor: "stock_actual" },
    { header: "Stock máximo", accessor: "stock_maximo" },
    { header: "Numero de lote", accessor: "numero_lote" },

    { header: "Estado", accessor: "tipo" },
    {
      header: "Fecha de Creación de Solicitud",
      accessor: (row) => new Date(row.created_at).toLocaleString(),
    },
  ];
  // Campos del formulario para crear/editar kardex
  const kardexFields: FieldConfig[] = [
    {
      name: "shopping_order_id",
      label: "Orden de Compra",
      type: "text",
    },
    {
      name: "id_shopping",
      label: "ID de Compra",
      type: "text",
    },
    {
      name: "tipo_movimiento",
      label: "Tipo de Movimiento",
      type: "select",
      options: ["Entrada", "Salida"],
    },
    {
      name: "id_product",
      label: "Nombre del Producto",
      type: "select",
      options: products.map((p) => ({ label: p.nombre, value: p.id_product })),
    },
    { name: "anio_creacion", label: "Año Compra", type: "number" },

    { name: "fecha_movimiento", label: "Fecha", type: "date" },
    { name: "numero_factura", label: "Numero deFactura", type: "text" },
    { name: "cantidad", label: "Cantidad", type: "number" },
    { name: "precio_unitario", label: "Precio", type: "number" },
    {
      name: "tipo_solicitud",
      label: "Solicitud",
      type: "select",
      options: ["Requisicion", "Pacto"],
    },
    { name: "requisicion_numero", label: "Req No.", type: "text" },
    {
      name: "tipo",
      label: "Tipo",
      type: "select",
      options: ["Pendiente", "Aprobado", "Rechazado", "Cancelado"],
    },
    { name: "observacion", label: "Obs.", type: "text" },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      options: ["true", "false"],
    },
  ];

  // 4. EFFECTS
  useEffect(() => {
    // Carga productos y kardex al montar
    Promise.all([GetKardexContext(), GetProductsContext()]).finally(() =>
      setLoading(false)
    );
  }, [GetKardexContext, GetProductsContext]);

  useEffect(() => {
    handleTableContent(kardexDetail);
  }, [kardexDetail, status]);

  // 5. HANDLERS (agrupados por función)

  // Handlers de UI
  const closeAll = () => {
    setEditOpen(false);
    setCreateOpen(false);
    setDeleteOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
  };

  const openEdit = (kd_id: string) => {
    const item = kardex.find((k) => k.id_kardex === kd_id);
    setItemToEdit(item);
    setEditOpen(true);
  };

  const openDelete = (id: string) => {
    const item = kardexDetail.find((k) => k.id_kardex === id) || null;
    setItemToDelete(item);
    setDeleteOpen(true);
  };

  // Handlers de datos
  const handleTableContent = (kd: KardexDetail[]) => {
    if (status === "Todo") {
      setFilteredData(kd);
    } else {
      setFilteredData(kd.filter((item) => item.tipo === status));
    }
  };

  const handleConfirmDelete = async (id: string) => {
    await DeleteKardexContext(id);
    await GetKardexContext();
    closeAll();
  };

  const handleSave = async (values: any) => {
    if (!itemToEdit) return;
    await PutUpdateKardexContext(itemToEdit.id_kardex, values);
    /* await PutUpdateProductContext(itemToEdit.id_product, {
      stock_actual: itemToEdit.stock_actual + values.cantidad,
    }); */
    await GetKardexContext();
    closeAll();
  };

  const handleCreate = async (values: any) => {
    await PostCreateKardexContext(values);
    await PutUpdateProductContext(values.id_product, {
      stock_actual: values.cantidad,
    });
    await GetKardexContext();
    closeAll();
  };

  // Handlers específicos
  // Función helper para cambiar estado del kardex
  const changeKardexStatus = (row: KardexDetail, newStatus: string) => {
    const item = kardex.find((k) => k.id_kardex === row.id_kardex);
    if (item) {
      setItemToEdit({ ...item, tipo: newStatus });
      setEditOpen(true);
    }
  };

  // Configuración de acciones por estado usando el formato correcto
  const getActionsForStatus = (status: string) => {
    switch (status) {
      case "Rechazado":
        return [
          {
            header: "Acciones",
            label: "Recuperar",
            onClick: (row: KardexDetail) =>
              changeKardexStatus(row, "Pendiente"),
          },
        ];

      case "Pendiente":
        return [
          {
            header: "Acciones",
            label: "Editar",
            onClick: (row: KardexDetail) => openEdit(row.id_kardex),
          },
          {
            header: "Acciones",
            label: "Cancelar",
            onClick: (row: KardexDetail) =>
              changeKardexStatus(row, "Cancelado"),
          },
          {
            header: "Acciones",
            label: "Eliminar",
            onClick: (row: KardexDetail) => openDelete(row.id_kardex),
          },
        ];

      case "Aprobado":
      case "Cancelado":
        return [
          {
            header: "Acciones",
            label: "Ver",
            onClick: (row: KardexDetail) => openEdit(row.id_kardex),
          },
        ];

      default:
        return [
          {
            header: "Acciones",
            label: "Editar",
            onClick: (row: KardexDetail) => openEdit(row.id_kardex),
          },
          {
            header: "Acciones",
            label: "Eliminar",
            onClick: (row: KardexDetail) => openDelete(row.id_kardex),
          },
        ];
    }
  };

  // 6. EARLY RETURNS
  if (loading) return <div>Cargando kardex…</div>;

  // 7. RENDER
  return (
    <div>
      <h2>Gestión de Kardex</h2>
      <Button onClick={() => setCreateOpen(true)}>+ Nuevo movimiento</Button>

      <GenericTable
        columns={kardexColumns}
        data={filteredData}
        rowKey={(row) => row.id_kardex}
        actions={getActionsForStatus(status)}
      />

      {/* Modal Editar */}
      <Modal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <GenericForm
            initialValues={itemToEdit}
            fields={kardexFields}
            onSubmit={handleSave}
            onCancel={closeAll}
            submitLabel="Guardar"
            cancelLabel="Cancelar"
          />
        )}
      </Modal>

      {/* Modal Crear */}
      <Modal isOpen={isCreateOpen} onClose={closeAll}>
        <GenericForm
          initialValues={{
            id_product: null,
            id_shopping: null,
            anio_creacion: 0,
            tipo_movimiento: "Entrada",
            fecha_movimiento: new Date().toISOString().slice(0, 10),
            numero_factura: "",
            cantidad: 0,
            precio_unitario: 0,
            tipo_solicitud: "Requisicion",
            requisicion_numero: "",
            tipo: "Pendiente",
            observacion: "",
            estado: true,
          }}
          fields={kardexFields}
          onSubmit={handleCreate}
          onCancel={closeAll}
          submitLabel="Crear"
          cancelLabel="Cancelar"
        />
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={closeAll}>
        {itemToDelete && (
          <>
            <h3 className="text-xl font-semibold mb-4">
              Confirmar Eliminación
            </h3>
            <p>¿Seguro que deseas borrar este registro?</p>
            <GenericTable
              columns={kardexColumns}
              data={[itemToDelete]}
              rowKey={(row) => row.id_kardex}
            />
            <div className="mt-4 text-right">
              <Button onClick={closeAll} className="mr-2">
                Cancelar
              </Button>
              <Button
                isPrimary
                onClick={() => handleConfirmDelete(itemToDelete.id_kardex)}
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

export default Kardex;
