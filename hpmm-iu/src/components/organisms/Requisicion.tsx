import React, { useEffect, useState } from "react";
import { useRequisicion } from "../../hooks/use.Requisicion";
import {
  RequisiInterface,
  RequisiDetail,
} from "../../interfaces/Requisition.interface";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";
import { useEmploye } from "../../hooks/use.Employe";
import { useProducts } from "../../hooks/use.Product";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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

  // 2. ESTADOS LOCALES
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<RequisiDetail[]>([]);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<RequisiInterface | null>(null);
  const [itemToDelete, setItemToDelete] = useState<RequisiDetail | null>(null);
  const [saving, setSaving] = useState(false);

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
  const requisicionColumns: Column<RequisiDetail>[] = [
    
    { header: "Empleado", accessor: "employee_name" },
    { header: "Producto", accessor: "product_name" },
    { header: "Cantidad", accessor: "cantidad" },
    {
      header: "Fecha de Solicitud",
      accessor: (row) => new Date(row.fecha).toLocaleDateString(),
    },
    { header: "Estado", accessor: "estado" },
    {
      header: "Fecha ",
      accessor: (row) =>
        row.created_at ? new Date(row.created_at).toLocaleString() : "",
    },
    {
      header: "Fecha Actualización",
      accessor: (row) =>
        row.updated_at ? new Date(row.updated_at).toLocaleString() : "",
    },
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
      name: "estado",
      label: "Estado",
      type: "select",
      options: [
        { label: "Pendiente", value: "Pendiente" },     
        { label: "Aprobado", value: "Aprobado" },
        { label: "Rechazado", value: "Rechazado" },
      ],
      required: true,
    },
    {
      name: "quantity",
      label: "Cantidad",
      type: "number",
      required: true,
    },
  ];

  // 5. FUNCIÓN PARA MANEJAR EL CONTENIDO DE LA TABLA
  const handleTableContent = (list: RequisiDetail[]) => {
    let filtrados = [...list];

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

  const handleCreate = async (values: any) => {
    setSaving(true);
    try {
      await PostCreateRequisicionContext(values);
      await GetRequisicionesContext();
      toast.success("Requisición creada correctamente");
      closeAll();
    } catch (error) {
      toast.error("Error al crear la requisición");
    } finally {
      setSaving(false);
    }
  };

  // Handlers específicos para cambiar estado
  const changeRequisicionStatus = async (row: RequisiDetail, newStatus: string) => {
    const item = requisitions.find((r) => r.id_requisi === row.id_requisi);
    if (item) {
      setSaving(true);
      try {
        await PutUpdateRequisicionContext(item.id_requisi, {
          ...item,
          estado: newStatus as "Pendiente" | "Aprobado" | "Rechazado",
        });
        await GetRequisicionesContext();
        toast.success(`Estado cambiado a ${newStatus}`);
      } catch (error) {
        toast.error("Error al cambiar el estado");
      } finally {
        setSaving(false);
      }
    }
  };

  // Configuración de acciones por estado
  const getActionsForStatus = (status: string) => {
    switch (status) {
      case "Rechazado":
        return [
          {
            header: "Acciones",
            label: "Recuperar",
            onClick: (row: RequisiDetail) =>
              changeRequisicionStatus(row, "Pendiente"),
          },
        ];

      case "Pendiente":
        return [
          {
            header: "Acciones",
            label: "Editar",
            onClick: (row: RequisiDetail) => openEdit(row.id_requisi),
          },
          {
            header: "Acciones",
            label: "Aprobar",
            onClick: (row: RequisiDetail) =>
              changeRequisicionStatus(row, "Aprobado"),
          },
          {
            header: "Acciones",
            label: "Rechazar",
            onClick: (row: RequisiDetail) =>
              changeRequisicionStatus(row, "Rechazado"),
          },
        ];

      case "Aprobado":
        return [
          {
            header: "Acciones",
            label: "Ver",
            onClick: (row: RequisiDetail) => openEdit(row.id_requisi),
          },
          {
            header: "Acciones",
            label: "Rechazar",
            onClick: (row: RequisiDetail) =>
              changeRequisicionStatus(row, "Rechazado"),
          },
        ];

      default:
        return [
          {
            header: "Acciones",
            label: "Editar",
            onClick: (row: RequisiDetail) => openEdit(row.id_requisi),
          },
          {
            header: "Acciones",
            label: "Eliminar",
            onClick: (row: RequisiDetail) => openDelete(row.id_requisi),
          },
        ];
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

  // 10. RENDER PRINCIPAL
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
              id_employes: itemToEdit.id_employes ?? "",
              fecha: itemToEdit.fecha ? new Date(itemToEdit.fecha) : new Date(),
              estado: itemToEdit.estado ?? "Pendiente",
              cantidad: itemToEdit.cantidad ?? 0,
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
        <GenericForm<Partial<RequisiDetail>>
          initialValues={{
            id_product: "",
            id_employes: "",
            fecha: itemToEdit?.fecha ? new Date(itemToEdit.fecha) : new Date(),
            estado: "Pendiente",
            cantidad: 0,
          }}
          fields={requisicionFields.map((f) =>
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
          title="Crear Requisición"
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
    </div>
  );
};

export default Requisicion;
