// src/components/pages/Kardex.tsx
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
import { useShopping } from "../../hooks/use.Shopping";
import { useDetallePactos } from "../../hooks/use.DetallePactos";
import { ToastContainer, toast } from "react-toastify"; // Si no lo tienes ya

type KardexRow = KardexDetail & { calculado_stock?: number };

const Kardex: React.FC<{ status: string }> = ({ status = "Todo" }) => {
  const {
    kardex,
    kardexDetail,
    GetKardexContext,
    PostCreateKardexContext,
    PutUpdateKardexContext,
    DeleteKardexContext,
  } = useKardex();
  const { shopping, GetShoppingContext } = useShopping();
  const { products, GetProductsContext, PutUpdateProductContext } = useProducts();
  const { detallePactos, GetDetallePactosContext } = useDetallePactos();


  // 2. ESTADOS (agrupados por función)
  const [loading, setLoading] = useState(true);
  const [displayData, setDisplayData] = useState<KardexRow[]>([]);

  // Estados de modales
  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  // Estados de items seleccionados
  const [itemToEdit, setItemToEdit] = useState<kardexInterface | null>(null);
  const [itemToDelete, setItemToDelete] = useState<KardexDetail | null>(null);

  // NUEVOS ESTADOS para la lista temporal en el modal de creación
  const [dataListForm, setDataListForm] = useState<any[]>([]);
  const [itemToEditList, setItemToEditList] = useState<any | null>(null);

  // 3. CONFIGURACIONES 
  const kardexColumns: Column<KardexRow>[] = [
    {
      header: "Numero de Orden",
      accessor: (row) =>
        row.nombre_de_factura ? row.nombre_de_factura : "N/A",
    },
    {
      header: "Tipo de Solicitud",
      accessor: (row) => (row.id_units_x_pacts ? "Pacto" : "Requisición"),
    },
    { header: "T. Movimiento", accessor: "tipo_movimiento" },
    { header: "Factura", accessor: "numero_factura" },
    { header: "Producto", accessor: "nombre_producto" },
    { header: "Unidad", accessor: "nombre_unidad" },
    {
      header: "Solicitante de Compra",
      accessor: "nombre_empleado_sc",
    },

    {
      header: "Solicitante de Fusion",
      accessor: "nombre_empleado_sf",
    },
    { header: "Descripción del producto", accessor: "descripcion" },
    { header: "Proveedor", accessor: (row) => row.nombre_proveedor || "N/A" },
    {
      header: "Vendedor",
      accessor: (row) => row.nombre_contacto_vendedor || "N/A",
    },
    {
      header: "Fecha de Ingreso",
      accessor: (row) => new Date(row.fecha_movimiento).toLocaleString(),
    },
    {
      header: "Cantidad Ingresada",
      accessor: (row) => {
        const quantity = Number(row.cantidad);
        return <span className="font-medium">{quantity.toFixed(2)}</span>;
      },
    },
    {
      header: "Precio Unitario",
      accessor: (row) => {
        const price = Number(row.precio_unitario);
        return <span className="font-medium">{`L.${price.toFixed(2)}`}</span>;
      },
    },
    {
      header: "Total",
      accessor: (row) => {
        const total = Number(row.cantidad) * Number(row.precio_unitario);
        return (
          <span className="font-semibold text-blue-600">{`L.${total.toFixed(
            2
          )}`}</span>
        );
      },
    },
    {
      header: "Existencias",
      accessor: (row) => (
        <span className="font-semibold text-green-600">
          {row.calculado_stock?.toFixed(2)}
        </span>
      ),
    },
  ];

  const kardexFields: FieldConfig[] = [
    {
      name: "tipo_solicitud",
      label: "Solicitud",
      type: "select",
      options: ["Requisicion", "Pacto"],
    },
    {
      name: "id_detalle_pacto",
      label: "Pactos",
      type: "select",
      options: detallePactos.map((pacto) => ({
        label: pacto.id_units_x_pacts,
        value: pacto.id_units_x_pacts,
      })),
    },
    {
      name: "nombre_de_factura",
      label: "Orden de Compra",
      type: "text",
    },
    {
      name: "id_shopping",
      label: "ID de Compra",
      type: "select",
      options: shopping.map((shopping) => ({
          label: shopping.shopping_order_id,
          value: shopping.id_shopping,
        })),
    },
    {
      name: "tipo_movimiento",
      label: "Tipo de Movimiento",
      type: "select",
      options: ["Entrada", "Salida"],
    },
    {
      name: "id_producto",
      label: "Nombre del Producto",
      type: "select",
      options: products.map((p) => ({ label: p.nombre, value: p.id_product })),
    },
    { name: "anio_creacion", label: "Año Compra", type: "number" },

    { name: "fecha_movimiento", label: "Fecha", type: "date" },
    { name: "numero_factura", label: "Numero deFactura", type: "text" },
    { name: "cantidad", label: "Cantidad", type: "number" },
    { name: "precio_unitario", label: "Precio", type: "number" },
    { name: "requisicion_numero", label: "Req No.", type: "text" },
    {
      name: "tipo",
      label: "Tipo",
      type: "select",
      options: ["Pendiente", "Aprobado", "Rechazado", "Cancelado"],
      required: true,
    },
    { name: "observacion", label: "Obs.", type: "text" },
    { name: "descripcion", label: "Descripción", type: "text" },
    { name: "fecha_vencimiento", label: "Fecha de Vencimiento", type: "date" },
    { name: "numero_lote", label: "Numero de Lote", type: "text" },
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
    Promise.all([GetKardexContext(), GetProductsContext(),GetShoppingContext(), GetDetallePactosContext()]).finally(() =>
      setLoading(false)
    );
  }, []);

  
  useEffect(() => {
    let data = [...kardexDetail];
    if (status !== "Todo") data = data.filter(item => item.tipo === status);
    data.sort((a, b) => new Date(a.fecha_movimiento).getTime() - new Date(b.fecha_movimiento).getTime());

    const runningStock: Record<string, number> = {};
    const processed: KardexRow[] = data.map(row => {
      const key = `${row.id_producto}-${row.nombre_de_factura}`;
      if (runningStock[key] === undefined) runningStock[key] = 0;
      const qty = Number(row.cantidad);
      const delta = row.tipo_movimiento === 'Entrada' ? qty : -qty;
      runningStock[key] += delta;
      return { ...row, calculado_stock: runningStock[key] };
    });

    setDisplayData(processed);
  }, [kardexDetail, status]); 

  if (loading) return <div>Cargando kardex…</div>;

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

  // NUEVA función para eliminar de la lista temporal
  const deleteItemList = (id_temp: string) => {
    setDataListForm((prev) => prev.filter((p) => p.id_temp !== id_temp));
  };

  // NUEVA función para crear varios movimientos
  const handleCreateBatch = async () => {
    if (dataListForm.length === 0) {
      toast.error("Debes agregar al menos un movimiento a la lista.");
      return;
    }
    try {
      await Promise.all(
        dataListForm.map(async (item) => {
          await PostCreateKardexContext(item);
        })
      );
      toast.success("Movimientos agregados con éxito.");
    } catch (error) {
      toast.error("Error al agregar movimientos: " + error);
      return;
    }
    setDataListForm([]);
    await GetKardexContext();
    closeAll();
  };

  // Handlers específicos
  // Función helper para cambiar estado del kardex
  const changeKardexStatus = (
    row: KardexDetail, 
    newStatus: string) => {
    const item = kardex.find((k) => k.id_kardex === row.id_kardex);
    if (item) {
      setItemToEdit({ ...item, tipo: newStatus });
      setEditOpen(true);
    }
  };


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
      <ToastContainer />
      <Button onClick={() => setCreateOpen(true)}>+ Nuevo movimiento</Button>

      <GenericTable
        columns={kardexColumns as Column<KardexDetail>[]}
        data={displayData}
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

      {/* Modal Crear con lista temporal */}
      <Modal isOpen={isCreateOpen} onClose={closeAll} title="Agregar movimientos a Kardex">
        <div className="p-2 md:p-4">
          <GenericForm
            initialValues={
              itemToEditList
                ? itemToEditList
                : {
                    id_producto: null,
                    id_shopping: null,
                    id_units_x_pacts: null,
                    anio_creacion: 2025,
                    tipo_movimiento: "Entrada",
                    fecha_movimiento: new Date().toISOString().slice(0, 10),
                    numero_factura: "",
                    cantidad: 0,
                    precio_unitario: 0,
                    tipo_solicitud: "",
                    requisicion_numero: "",
                    tipo: "Pendiente",
                    observacion: "",
                    descripcion: "",
                    fecha_vencimiento: new Date().toISOString().slice(0, 10),
                    numero_lote: "",
                    estado: true,
                  }
            }
            fields={kardexFields}
            onSubmit={(item) => {
              if (itemToEditList) {
                setDataListForm((prev) =>
                  prev.map((p) =>
                    p.id_temp === itemToEditList.id_temp
                      ? { ...item, id_temp: itemToEditList.id_temp }
                      : p
                  )
                );
                setItemToEditList(null);
              } else {
                setDataListForm((prev) => [
                  ...prev,
                  { ...item, id_temp: crypto.randomUUID() },
                ]);
              }
            }}
            onCancel={() => {
              setItemToEditList(null);
              setDataListForm([]);
              closeAll();
            }}
            submitLabel={itemToEditList ? "Actualizar" : "Agregar a lista"}
            cancelLabel="Cancelar"
          />

          <div className="mt-6">
            <h4 className="font-semibold mb-2">Movimientos a agregar</h4>
            <GenericTable
              columns={kardexColumns}
              data={dataListForm}
              rowKey={(row: any) => row.id_temp}
              actions={[
                {
                  header: "Acciones",
                  label: "Editar",
                  onClick: (row: any) => setItemToEditList(row),
                },
                {
                  header: "Eliminar",
                  label: "Eliminar",
                  onClick: (row: any) => deleteItemList(row.id_temp),
                },
              ]}
            />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button isPrimary onClick={handleCreateBatch}>
              Guardar todos
            </Button>
            <Button onClick={closeAll}>Cerrar</Button>
          </div>
        </div>
      </Modal>

      {/* Modal Eliminar */}
      <Modal isOpen={isDeleteOpen} onClose={closeAll}>
        {itemToDelete && (
          <>
            <h3 className="text-xl font-semibold mb-4">
              Confirmar Eliminación
            </h3>
            <p>¿Seguro que deseas borrar este registro?</p>
            <GenericTable
              columns={kardexColumns}
              data={[itemToDelete as KardexDetail]}
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
