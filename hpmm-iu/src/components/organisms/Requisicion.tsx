import React, { useEffect, useState } from "react";

import {
  RequisiInterface,
  RequisiDetail,
} from "../../interfaces/Requisition.interface";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useProductRequisi } from "../../hooks/use.Product_requisi";
import { useRequisicion } from "../../hooks/use.Requisicion";
import { useEmploye } from "../../hooks/use.Employe";
import { useProducts } from "../../hooks/use.Product";
import { useSolicitudCompras } from "../../hooks/use.SolicitudCompras";
import { useAuth } from "../../hooks/use.Auth"; // Asegúrate de tener este hook
import { formattedDate } from "../../helpers/formatData";

const Requisicion: React.FC<{ status: string }> = ({ status = "Todo" }) => {
  // 1. HOOKS
  const {
    requisitions,
    requisiDetail,
    GetRequisicionesContext,
    PostCreateRequisicionContext,
    PutUpdateRequisicionContext,
    DeleteRequisicionContext,
  } = useRequisicion();

  const { employes, GetEmployeContext } = useEmploye();
  const { products, GetProductsContext } = useProducts();

  const { PostCreateProductRequisitionContext } = useProductRequisi();
  const { PostCreateSolicitudCompraContext } = useSolicitudCompras();

  // 2. ESTADOS LOCALES
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<RequisiDetail[]>([]);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<RequisiInterface | null>(null);
  const [itemToDelete, setItemToDelete] = useState<RequisiDetail | null>(null);
  const [saving, setSaving] = useState(false);
  const [isDetailOpen, setDetailOpen] = useState(false);
  const [itemToView, setItemToView] = useState<RequisiDetail | null>(null);

  // NUEVOS ESTADOS PARA LISTA DE REQUISICIONES
  const [dataListForm, setDataListForm] = useState<any[]>([]);
  const [itemToEditList, setItemToEditList] = useState<any | null>(null);

  // Obtén userId y roleName del contexto de autenticación
  const { userId, roleName, idEmployes } = useAuth();

  // 3. FUNCIONES DE VALIDACIÓN
  const validateCreate = (values: any) => {
    const errors: any = {};
    // Aquí puedes agregar validaciones específicas si necesitas
    // Por ejemplo, validar fechas o lógica de negocio
    return errors;
  };

  const validateEdit = (values: any) => {
    const errors: any = {};
    // Aquí puedes agregar validaciones específicas si necesitas
    return errors;
  };

  // 4. CONFIGURACIÓN DE COLUMNAS Y CAMPOS
  const requisicionColumns: Column<any>[] = [
    { header: "Empleado", accessor: "employee_name" },
    { header: "Unidad", accessor: "unit_name" },
    { header: "Producto", accessor: "product_name" },
    { header: "Cantidad", accessor: "cantidad" },
    {
      header: "Fecha de Solicitud",
      accessor: (row) =>
        row.fecha ? new Date(row.fecha).toLocaleDateString() : "",
    },
    { header: "Descripción", accessor: "descripcion" },

    { header: "Estado", accessor: "estado" },
    
  ];


    const requisicionListColumns: Column<any>[] = [
    { header: "Empleado", accessor: "employee_name" },
    { header: "Producto", accessor: "product_name" },
    { header: "Cantidad", accessor: "cantidad" },
    {
      header: "Fecha de Solicitud",
      accessor: (row) =>
        row.fecha ? new Date(row.fecha).toLocaleDateString() : "",
    },
    { header: "Descripción", accessor: "descripcion" },

  
    
  ];
  const requisicionFields: FieldConfig[] = [
    {
      name: "id_product",
      label: "Producto",
      type: "select",
      options: products
        .filter((p) => p.id_product)
        .map((p) => ({
          label: p.nombre || p.product_name || "Sin nombre",
          value: p.id_product,
        })),
      required: true,
    },
    {
      name: "id_employes",
      label: "Empleado",
      type: "select",
      options: employes
        .filter((e) => e.id_employes)
        .map((e) => ({
          label: e.name || e.employee_name || "Sin nombre",
          value: e.id_employes,
        })),
      required: true,
    },
    {
      name: "fecha",
      label: "Fecha",
      type: "date",
      required: true,
    },
    
    {
      name: "cantidad",
      label: "Cantidad",
      type: "number",
      required: true,
    },
    {
      name: "descripcion",
      label: "Descripción",
      type: "textarea",
      required: false,
    },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      options: [
        { label: "Pendiente", value: "Pendiente" },
        { label: "Aprobado", value: "Aprobado" },
        { label: "Rechazado", value: "Rechazado" },
        { label: "Cancelado", value: "Cancelado" },
      ],
      required: true,
    },
  ];

  // 5. FUNCIÓN PARA MANEJAR EL CONTENIDO DE LA TABLA
  const handleTableContent = (list: RequisiDetail[]) => {
    let filtrados = [...list];

    // Filtrar por usuario si no es Administrador
    if (roleName !== "Administrador" && roleName !== "Super Admin") {
      filtrados = filtrados.filter((item) => item.id_employes === idEmployes);
    }

    // Verificar IDs duplicados
    const ids = filtrados.map((item) => item.id_requisi);
    const uniqueIds = [...new Set(ids)];
    if (ids.length !== uniqueIds.length) {
      // Filtrar duplicados manteniendo solo el primero
      filtrados = filtrados.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.id_requisi === item.id_requisi)
      );
    }

    // Filtrar por estado
    if (status !== "Todo") {
      filtrados = filtrados.filter((item) => item.estado === status);
    }

    // Ordenar por fecha de creación (más recientes primero)
    const ordenados = filtrados.sort(
      (a, b) =>
        new Date(b.created_at || 0).getTime() -
        new Date(a.created_at || 0).getTime()
    );

    setFilteredData(ordenados);
  };

  // 6. FUNCIONES DE MANEJO DE MODALES
  const closeAll = () => {
    setEditOpen(false);
    setCreateOpen(false);
    setDeleteOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
  };

  const openEdit = (id_requisi: string) => {
    const item = requisitions.find((r) => r.id_requisi === id_requisi);
    setItemToEdit(item || null);
    setEditOpen(true);
  };

  const openDelete = (id_requisi: string) => {
    const item = requisiDetail.find((r) => r.id_requisi === id_requisi) || null;
    setItemToDelete(item);
    setDeleteOpen(true);
  };

  const openDetail = (row: RequisiDetail) => {
    setItemToView(row);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setItemToView(null);
    setDetailOpen(false);
  };

  // 7. HANDLERS DE CRUD
  const handleConfirmDelete = async (id_requisi: string) => {
    setSaving(true);
    try {
      await DeleteRequisicionContext(id_requisi);
      await GetRequisicionesContext();
      toast.success("Requisición eliminada correctamente");
      closeAll();
    } catch (error) {
      toast.error("Error al eliminar la requisición");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (values: any) => {
    if (!itemToEdit) return;

    // Validar si hay cambios
    const hasChanges =
      values.id_employes !== itemToEdit.id_employes ||
      values.fecha !== itemToEdit.fecha ||
      values.estado !== itemToEdit.estado ||
      values.cantidad !== itemToEdit.cantidad;

    if (!hasChanges) {
      toast.error("No se detectaron cambios para guardar.");
      return;
    }

    setSaving(true);
    try {
      await PutUpdateRequisicionContext(itemToEdit.id_requisi, values);
      await GetRequisicionesContext();
      toast.success("Requisición actualizada correctamente");
      closeAll();
    } catch (error) {
      toast.error("Error al actualizar la requisición");
    } finally {
      setSaving(false);
    }
  };

  // FUNCIONES PARA AGREGAR, EDITAR Y ELIMINAR DE LA LISTA
  const deleteItemList = (id: string) => {
    setDataListForm((prev) => prev.filter((item) => item.id_requisi !== id));
  };

  const handleAddItem = (item: any) => {
    let fechaISO = "";
    if (
      typeof item.fecha === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(item.fecha)
    ) {
      const [year, month, day] = item.fecha.split("-");

      const localDate = new Date(Number(year), Number(month) - 1, Number(day));
      fechaISO = localDate.toISOString();
    } else if (item.fecha instanceof Date) {
      fechaISO = item.fecha.toISOString();
    } else {
      fechaISO = new Date().toISOString();
    }

    const newItem = { ...item, fecha: fechaISO };

    if (itemToEditList) {
      setDataListForm((prev) =>
        prev.map((p) =>
          p.id_requisi === itemToEditList.id_requisi
            ? { ...newItem, id_requisi: itemToEditList.id_requisi }
            : p
        )
      );
      setItemToEditList(null);
    } else {
      setDataListForm((prev) => [
        ...prev,
        { ...newItem, id_requisi: crypto.randomUUID() },
      ]);
    }
  };

  
  const handleCreate = async (_values: any) => {
    setSaving(true);
    try {
      if (dataListForm.length === 0) {
        toast.error("Debes agregar al menos una requisición a la lista.");
        return;
      }
      await Promise.all(
        dataListForm.map(async (item) => {
          await PostCreateRequisicionContext(item);
          await PostCreateProductRequisitionContext({
            id_product: item.id_product,
            id_requisi: item.id_requisi,
            cantidad: item.cantidad,
          });
        })
      );
      await GetRequisicionesContext();
      toast.success("Requisiciones creadas correctamente");
      setDataListForm([]);
      closeAll();
    } catch (error) {
      toast.error("Error al crear las requisiciones");
    } finally {
      setSaving(false);
    }
  };

  // Handlers específicos para cambiar estado
  const changeRequisicionStatus = async (row: RequisiDetail, newStatus: "Pendiente" | "Aprobado" | "Rechazado" | "Cancelado") => {
    const item = requisitions.find((r) => r.id_requisi === row.id_requisi);
    if (item) {
      setSaving(true);
      try {
        await PutUpdateRequisicionContext(item.id_requisi, {
          ...item,
          estado: newStatus,
        });

        if (newStatus === "Aprobado") {
          await PostCreateSolicitudCompraContext({
            id_requisi: item.id_requisi,
            estado: "Pendiente",
          });
          toast.success(
            "La requisición ha sido APROBADA,se ha creado una solicitud de compra."
          );
        } else {
          toast.success(`Estado cambiado a ${newStatus}`);
        }
        await GetRequisicionesContext();
      } catch (error) {
        toast.error("Error al cambiar el estado");
      } finally {
        setSaving(false);
      }
    }
  };

  // Configuración de acciones por estado
  const getActionsForStatus = (status: string) => {
    const baseActions = [
      {
        header: "Acciones",
        label: "Ver",
        onClick: (row: RequisiDetail) => openDetail(row),
      },
    ];

    switch (status) {
      case "Pendiente":
        return [
          ...baseActions,
          {
            header: "Acciones",
            label: "Editar",
            onClick: (row: RequisiDetail) => openEdit(row.id_requisi),
          },
          {
            header: "Acciones",
            label: "Aprobar",
            onClick: (row: RequisiDetail) => changeRequisicionStatus(row, "Aprobado"),
          },
          {
            header: "Acciones",
            label: "Rechazar",
            onClick: (row: RequisiDetail) => changeRequisicionStatus(row, "Rechazado"),
          },
          {
            header: "Acciones",
            label: "Cancelar",
            onClick: (row: RequisiDetail) => changeRequisicionStatus(row, "Cancelado"),
          },
        ];
      case "Aprobado":
        return [
          ...baseActions,
          {
            header: "Acciones",
            label: "Rechazar",
            onClick: (row: RequisiDetail) => changeRequisicionStatus(row, "Rechazado"),
          },
          {
            header: "Acciones",
            label: "Cancelar",
            onClick: (row: RequisiDetail) => changeRequisicionStatus(row, "Cancelado"),
          },
        ];
      case "Rechazado":
        return baseActions;
      case "Cancelado":
        return baseActions;
      default:
        return baseActions;
    }
  };

  // 8. EFFECTS
  useEffect(() => {
    setLoading(true);
    Promise.all([GetRequisicionesContext(), GetEmployeContext(), GetProductsContext()]).finally(() =>
      setLoading(false)
    );
  }, []);

  useEffect(() => {
    handleTableContent(requisiDetail);
  }, [status, requisiDetail]);

  // 9. RENDER CONDICIONAL
  if (loading) {
    return <div>Cargando requisiciones...</div>;
  }

  

  const dataListFormDisplay = dataListForm.map((item) => {
    const empleado = employes.find((e) => e.id_employes === item.id_employes);
    const producto = products.find((p) => p.id_product === item.id_product);
    return {
      ...item,
      employee_name: empleado?.name || empleado?.employee_name || "Sin nombre",
      product_name: producto?.nombre || producto?.product_name || "Sin nombre",
     
    };
  });

  return (
    <div>
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4 text-center">Gestión de Requisiciones</h1>

      <div className="flex justify-end mb-4">
        <Button
          className="bg-hpmm-azul-claro hover:bg-hpmm-azul-oscuro text-white font-bold py-2 px-4 rounded"
          onClick={() => setCreateOpen(true)}
        >
          + Nueva Requisición
        </Button>
      </div>

      <GenericTable
        columns={requisicionColumns as Column<RequisiDetail>[]}
        data={filteredData}
        rowKey={(row) => row.id_requisi}
        actions={getActionsForStatus(status)}
        rowClassName={(row) =>
          row.estado === "Rechazado" ? "opacity-40 line-through" : ""
        }
      />

      {/* Modal Editar */}
      <Modal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <GenericForm<Partial<RequisiInterface>>
            initialValues={{
              id_product: itemToEdit.id_product ?? "",
              id_employes: itemToEdit.id_employes ?? "",
              fecha: itemToEdit.fecha ?? new Date().toISOString().slice(0, 10),
              estado: itemToEdit.estado ?? "Pendiente",
              cantidad: itemToEdit.cantidad ?? "0",
              descripcion: itemToEdit.descripcion ?? "",
            }}
            fields={requisicionFields}
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
            title="Editar Requisición"
            submitDisabled={saving}
          />
        )}
      </Modal>

      {/* Modal Crear */}
      <Modal isOpen={isCreateOpen} onClose={closeAll}>
        <h2 className="text-xl font-bold mb-4 text-center">
    {itemToEditList ? "Editar requisición de la lista" : "Agregar requisición a la lista"}
  </h2>
        <GenericForm<Partial<RequisiDetail>>
          initialValues={
            itemToEditList
              ? itemToEditList
              : {
                  id_product: "",
                  id_employes: "",
                  fecha: formattedDate(),
                  estado: "Pendiente",
                  descripcion: "",
                  cantidad: "",
                  
                }
          }
          fields={requisicionFields.map((f) =>
            f.name === "estado" ? { ...f, disabled: true } : f
          )}
          onSubmit={handleAddItem}
          onCancel={() => {
            setItemToEditList(null);
          }}
          validate={validateCreate}
          submitLabel={itemToEditList ? "Actualizar" : "Agregar a lista"}
          cancelLabel="Cancelar edición"
          title={
            itemToEditList
              ? "Editar requisición de la lista"
              : "Agregar requisición a la lista"
          }
          submitDisabled={saving}
        />
        <GenericTable
          columns={requisicionListColumns}
          data={dataListFormDisplay}
          rowKey={(row) => row.id_requisi}
          actions={[
            {
              header: "Acciones",
              label: "Editar",
              onClick: (row) => setItemToEditList(row),
            },
            {
              header: "Eliminar",
              label: "Eliminar",
              onClick: (row) => deleteItemList(row.id_requisi),
            },
          ]}
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button
            onClick={handleCreate}
            className="bg-hpmm-azul-claro hover:bg-hpmm-azul-oscuro text-white font-bold py-2 px-4 rounded"
            disabled={saving || dataListForm.length === 0}
          >
            {saving ? (
              <span>
                <span className="animate-spin inline-block mr-2">⏳</span>
                Creando...
              </span>
            ) : (
              "Ingresar Requisiciónes"
            )}
          </Button>
          <Button
            onClick={() => {
              setItemToEditList(null);
              setDataListForm([]);
              closeAll();
            }}
            className="bg-hpmm-amarillo-claro hover:bg-hpmm-amarillo-oscuro text-gray-800 font-bold py-2 px-4 rounded"
            disabled={saving}
          >
            Cancelar 
          </Button>
        </div>
      </Modal>

      {/* Modal Eliminar */}
      <Modal isOpen={isDeleteOpen} onClose={closeAll}>
        {itemToDelete && (
          <>
            <h3 className="text-xl font-semibold mb-4">
              Confirmar Eliminación
            </h3>

            <p>¿Seguro que deseas borrar esta requisición?</p>

            <GenericTable
              columns={requisicionColumns}
              data={[itemToDelete]}
              rowKey={(row) => row.id_requisi}
            />

            <div className="mt-4 text-right gap-2 flex justify-center">
              <Button
                onClick={() => handleConfirmDelete(itemToDelete.id_requisi)}
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

      {/* Modal Detalle */}
      <Modal isOpen={isDetailOpen} onClose={closeDetail} showHeader={false} showFooter={false}>
        {itemToView && (
          <div className="max-w-2xl mx-auto">
            {/* Título */}
            <div className="mb-6">
              <h2 className="text-center text-2xl font-light text-hpmm-azul-oscuro tracking-wide select-none">
                Detalle de la Requisición
              </h2>
              <hr className="mt-3 border-hpmm-azul-claro opacity-40" />
            </div>
            {/* Datos principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 mb-8">
              <div className="space-y-5">
                <div>
                  <div className="text-base font-semibold text-gray-500 uppercase tracking-widest mb-1">Solicitante</div>
                  <div className="text-xl font-bold text-hpmm-azul-oscuro bg-hpmm-azul-claro/10 px-2 py-1 rounded">
                    {itemToView.employee_name}
                  </div>
                </div>
                <div>
                  <div className="text-base font-semibold text-gray-500 uppercase tracking-widest mb-1">Unidad</div>
                  <div className="text-lg text-gray-800">{itemToView.unit_name}</div>
                </div>
                <div>
                  <div className="text-base font-semibold text-gray-500 uppercase tracking-widest mb-1">Estado</div>
                  <span className={`inline-block px-3 py-1 rounded-full text-base font-bold ${
                    itemToView.estado === "Pendiente" ? "bg-yellow-100 text-yellow-800" :
                    itemToView.estado === "Aprobado" ? "bg-green-100 text-green-800" :
                    itemToView.estado === "Rechazado" ? "bg-red-100 text-red-800" :
                    itemToView.estado === "Cancelado" ? "bg-gray-200 text-gray-800" : ""
                  }`}>
                    {itemToView.estado}
                  </span>
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <div className="text-base font-semibold text-gray-500 uppercase tracking-widest mb-1">Producto</div>
                  <div className="text-xl font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                    {itemToView.product_name}
                  </div>
                </div>
                <div>
                  <div className="text-base font-semibold text-gray-500 uppercase tracking-widest mb-1">Cantidad</div>
                  <div className="text-xl font-semibold text-hpmm-azul-oscuro">{Number(itemToView.cantidad).toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-base font-semibold text-gray-500 uppercase tracking-widest mb-1">Fecha de Solicitud</div>
                  <div className="text-lg text-gray-800">{new Date(itemToView.fecha).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
            {/* Descripción */}
            <div className="mb-8">
              <div className="text-base font-semibold text-gray-500 uppercase tracking-widest mb-2">Descripción</div>
              <div className="bg-yellow-50 border-l-4 border-hpmm-amarillo-claro p-4 rounded-lg min-h-[48px] text-base text-gray-900">
                {itemToView.descripcion
                  ? itemToView.descripcion
                  : <span className="italic text-gray-400">Sin descripción</span>}
              </div>
            </div>
            {/* Botón cerrar */}
            <div className="text-right">
              <button
                onClick={closeDetail}
                className="bg-hpmm-azul-claro hover:bg-hpmm-azul-oscuro text-white font-semibold py-2 px-6 rounded transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Requisicion;
