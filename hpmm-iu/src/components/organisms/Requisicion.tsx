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

const Requisicion: React.FC<{ status: string }> = ({ status = "Todo" }) => {
  const {
    requisitions,
    requisiDetail,
    GetRequisicionesContext,
    PostCreateRequisicionContext,
    PutUpdateRequisicionContext,
    DeleteRequisicionContext,
  } = useRequisicion();

  const { employes, GetEmployeContext } = useEmploye();

  // 2. ESTADOS (agrupados por función)
  const [loading, setLoading] = useState(true);
  const [displayData, setDisplayData] = useState<RequisiDetail[]>([]);

  // Estados de modales
  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  // Estados de items seleccionados
  const [itemToEdit, setItemToEdit] = useState<RequisiInterface | null>(null);
  const [itemToDelete, setItemToDelete] = useState<RequisiDetail | null>(null);

  // 3. CONFIGURACIONES (constantes que no cambian)
  const requisicionColumns: Column<RequisiDetail>[] = [
    { header: "Empleado", accessor: "employee_name" },
    { header: "Cantidad", accessor: "cantidad" },

    {
      header: "Fecha de ingreso",
      accessor: (row) => new Date(row.fecha).toLocaleDateString(),
    },
    { header: "Estado", accessor: "estado" },
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
    { header: "Acciones", accessor: () => null },
  ];

  const requisicionFields: FieldConfig[] = [
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
    },
    { name: "fecha", label: "Fecha", type: "date" },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      options: [
        { label: "Pendiente", value: "Pendiente" },     
        { label: "Aprobado", value: "Aprobado" },
        { label: "Rechazado", value: "Rechazado" },
      ],
    },
  ];

  // 4. EFFECTS
  useEffect(() => {
    // Carga empleados y requisiciones al montar
    Promise.all([GetRequisicionesContext(), GetEmployeContext()]).finally(() =>
      setLoading(false)
    );
  }, []);

  // Procesar datos: filtrar por estado
  useEffect(() => {
    let data = [...requisiDetail];

    // Verificar IDs duplicados
    const ids = data.map((item) => item.id_requisi);
    const uniqueIds = [...new Set(ids)];
    if (ids.length !== uniqueIds.length) {
      // Filtrar duplicados manteniendo solo el primero
      data = data.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.id_requisi === item.id_requisi)
      );
    }

    if (status !== "Todo") {
      data = data.filter((item) => item.estado === status);
    }
    data.sort(
      (a, b) =>
        new Date(b.created_at || 0).getTime() -
        new Date(a.created_at || 0).getTime()
    );
    setDisplayData(data);
  }, [requisiDetail, status]);

  // Handlers de UI
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

  const handleConfirmDelete = async (id_requisi: string) => {
    await DeleteRequisicionContext(id_requisi);
    await GetRequisicionesContext();
    closeAll();
  };

  const handleSave = async (values: any) => {
    if (!itemToEdit) return;
    await PutUpdateRequisicionContext(itemToEdit.id_requisi, values);
    await GetRequisicionesContext();
    closeAll();
  };

  const handleCreate = async (values: any) => {
    await PostCreateRequisicionContext(values);
    await GetRequisicionesContext();
    closeAll();
  };

  // Handlers específicos para cambiar estado
  const changeRequisicionStatus = async (row: RequisiDetail, newStatus: string) => {
    const item = requisitions.find((r) => r.id_requisi === row.id_requisi);
    if (item) {
      // ✅ Actualizar directamente sin abrir modal
      await PutUpdateRequisicionContext(item.id_requisi, {
        ...item,
        estado: newStatus as "Pendiente" | "Aprobado" | "Rechazado",
      });
      await GetRequisicionesContext(); // Recargar datos
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
              changeRequisicionStatus(row, "Pendiente"), // ✅ Cambiar a Pendiente
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
              changeRequisicionStatus(row, "Aprobado"), // ✅ Cambiar a Aprobado
          },
          {
            header: "Acciones",
            label: "Rechazar",
            onClick: (row: RequisiDetail) =>
              changeRequisicionStatus(row, "Rechazado"), // ✅ Cambiar a Rechazado
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
              changeRequisicionStatus(row, "Rechazado"), // ✅ Cambiar a Rechazado
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

  // 6. EARLY RETURNS
  if (loading) return <div>Cargando requisiciones...</div>;

  // 7. RENDER
  return (
    <div>
      <h2>Gestión de Requisiciones</h2>
      <Button onClick={() => setCreateOpen(true)}>+ Nueva Requisición</Button>

      <GenericTable
        columns={requisicionColumns as Column<RequisiDetail>[]}
        data={displayData}
        rowKey={(row) => row.id_requisi}
        actions={getActionsForStatus(status)}
      />

      {/* Modal Editar */}
      <Modal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <GenericForm
            initialValues={{
              id_employes: itemToEdit.id_employes || "",
              fecha: itemToEdit.fecha
                ? new Date(itemToEdit.fecha).toISOString().split("T")[0]
                : "",
              estado: itemToEdit.estado || "Pendiente",
            }}
            fields={requisicionFields}
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
            id_employes: "",
            fecha: new Date().toISOString().slice(0, 10),
            estado: "Pendiente",
          }}
          fields={requisicionFields}
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
            <p>¿Seguro que deseas borrar esta requisición?</p>
            <GenericTable
              columns={requisicionColumns}
              data={[itemToDelete]}
              rowKey={(row) => row.id_requisi}
            />
            <div className="mt-4 text-right">
              <Button onClick={closeAll} className="mr-2">
                Cancelar
              </Button>
              <Button
                isPrimary
                onClick={() => handleConfirmDelete(itemToDelete.id_requisi)}
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

export default Requisicion;
