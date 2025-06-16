// src/components/organisms/Employees.tsx

import React, { useEffect, useState } from "react";
import { useEmploye } from "../../hooks/use.Employe";
import { EmployesInterface } from "../../interfaces/Employe.interface";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";
import { useUser } from "../../hooks/use.User";
import { useUnit } from "../../hooks/use.Unit";
import { useSubdireccion } from "../../hooks/use.subdireccion";
import { useDirection } from "../../hooks/use.Direction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Employe: React.FC<{ status?: string }> = ({ status = "Todo" }) => {
  // 1. HOOKS
  const {
    employes,
    GetEmployeContext,
    PostCreateEmployeContext,
    PutUpdateEmployeContext,
    DeleteEmployeContext,
  } = useEmploye();

  const { users, GetUsersContext } = useUser();
  const { units, GetUnitsContext } = useUnit();
  const { subdireccion, GetSubdireccionesContext } = useSubdireccion();
  const { directions, GetDirectionsContext } = useDirection();

  // 2. ESTADOS LOCALES
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<EmployesInterface[]>([]);
  const [isEditOpen, setEditOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<EmployesInterface | null>(null);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<EmployesInterface | null>(null);
  const [saving, setSaving] = useState(false);

  // 3. FUNCIONES DE VALIDACIÓN
  const isEmailTaken = (email: string, excludeId?: string) => {
    return employes.some(
      (e) =>
        e.email.trim().toLowerCase() === email.trim().toLowerCase() &&
        (!excludeId || e.id_employes !== excludeId)
    );
  };

  const validateCreate = (values: any) => {
    const errors: any = {};
    if (isEmailTaken(values.email)) {
      errors.email = "El correo ya está registrado en otro empleado.";
    }
    return errors;
  };

  const validateEdit = (values: any) => {
    const errors: any = {};
    if (
      itemToEdit &&
      values.email.trim().toLowerCase() !==
        itemToEdit.email.trim().toLowerCase() &&
      isEmailTaken(values.email, itemToEdit.id_employes)
    ) {
      errors.email = "El correo ya está registrado en otro empleado.";
    }
    return errors;
  };

  // 4. CONFIGURACIÓN DE COLUMNAS Y CAMPOS
  const employeeColumns: Column<EmployesInterface>[] = [
    { header: "Usuario", accessor: "usuario" },
    { header: "Unidad", accessor: "unidad" },
    { header: "Subdirección", accessor: "subdireccion" },
    { header: "Dirección", accessor: "direccion" },
    { header: "Nombre", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Teléfono", accessor: "telefono" },
    { header: "Puesto", accessor: "puesto" },
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

  const employeeFields: FieldConfig[] = [
    {
      name: "id_user",
      label: "Usuario",
      type: "select",
      options: users.map((user) => ({
        label: user.username,
        value: user.id_user,
      })),
      required: true,
    },
    {
      name: "id_units",
      label: "Unidad",
      type: "select",
      options: units.map((unit) => ({
        label: unit.name,
        value: unit.id_units,
      })),
      required: true,
    },
    {
      name: "id_subdireccion",
      label: "Subdirección",
      type: "select",
      options: subdireccion.map((sub) => ({
        label: sub.nombre,
        value: sub.id_subdireccion,
      })),
      required: true,
    },
    {
      name: "id_direction",
      label: "Dirección",
      type: "select",
      options: directions.map((dir) => ({
        label: dir.nombre,
        value: dir.id_direction,
      })),
      required: true,
    },
    { name: "name", label: "Nombre", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    {
      name: "telefono",
      label: "Teléfono",
      type: "tel",
      required: true,
      pattern: "^[0-9+\\-()\\s]{7,}$",
    },
    { name: "puesto", label: "Puesto", type: "text", required: true },
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
  ];

  // 5. FUNCIÓN PARA MANEJAR CONTENIDO DE TABLA
  const handleTableContent = (list: EmployesInterface[]) => {
    let filtrados = list;
    if (status === "Activo") {
      filtrados = list.filter((e) => e.estado === true);
    } else if (status === "Inactivo") {
      filtrados = list.filter((e) => e.estado === false);
    }
    // Ordenar por nombre del empleado
    const ordenados = filtrados.sort((a, b) =>
      a.name.localeCompare(b.name)
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

  const openEdit = (id: string) => {
    const item = employes.find((e) => e.id_employes === id);
    setItemToEdit(item);
    setEditOpen(true);
  };

  const openDelete = (id_employes: string) => {
    setItemToDelete(employes.find((e) => e.id_employes === id_employes) || null);
    setDeleteOpen(true);
  };

  // 7. HANDLERS DE CRUD
  const handleCreate = async (values: any) => {
   
    
    if (isEmailTaken(values.email)) {
      toast.error("El correo ya está registrado en otro empleado.");
      return;
    }

    setSaving(true);
    await PostCreateEmployeContext(values as EmployesInterface);
    await GetEmployeContext();
    setSaving(false);
    toast.success("Empleado creado correctamente");
    closeAll();

    // Esperar un momento para que React actualice
    setTimeout(() => {
    
    }, 100);
  };

  const handleSave = async (values: any) => {
    if (!itemToEdit) return;
    setSaving(true);
    try {
      await PutUpdateEmployeContext(itemToEdit.id_employes, {
        ...itemToEdit,
        ...values,
        estado: values.estado === "true" || values.estado === true,
      } as EmployesInterface);
      await GetEmployeContext();
      toast.success("Empleado actualizado correctamente");
      closeAll();
    } catch (error) {
      toast.error("Error actualizando empleado");
    }
    setSaving(false);
  };

  const handleConfirmDelete = async (id: string) => {
    await DeleteEmployeContext(id);
    await GetEmployeContext();
    toast.success("Empleado eliminado correctamente");
    closeAll();
  };

  // 8. EFFECTS
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          GetEmployeContext(),
          GetUsersContext(),
          GetUnitsContext(),
          GetSubdireccionesContext(),
          GetDirectionsContext(),
        ]);
      } catch (error) {
        toast.error("Error cargando datos");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!employes || employes.length === 0) {
      setFilteredData([]);
      return;
    }
    const validEmployees = employes.filter(
      (item) => item && item.id_employes && typeof item.id_employes === "string"
    );
    handleTableContent(validEmployees);
  }, [status, employes]);

  // 9. RENDER CONDICIONAL
  if (loading) return <div>Cargando empleados…</div>;

  // 10. RENDER PRINCIPAL
  return (
    <div>
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4 text-center">Gestión de Empleados</h2>
      <div className="flex justify-end mb-4">
        <Button
          className="bg-hpmm-azul-claro hover:bg-hpmm-azul-oscuro text-white font-bold py-2 px-4 rounded"
          onClick={() => setCreateOpen(true)}
        >
          + Nuevo empleado
        </Button>
      </div>

      <GenericTable
        columns={employeeColumns}
        data={filteredData}
        rowKey={(row) => row.id_employes}
        actions={[
          {
            header: "Acciones",
            label: "Editar",
            onClick: (row) => openEdit(row.id_employes),
          },
          {
            header: "Eliminar",
            label: "Eliminar",
            onClick: (row) => openDelete(row.id_employes),
          },
        ]}
        rowClassName={(row) =>
          row.estado === false ? "opacity-40 line-through" : ""
        }
      />

      {/* Modal Editar */}
      <Modal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <GenericForm<Partial<EmployesInterface>>
            initialValues={{
              id_user: itemToEdit.id_user ?? "",
              id_units: itemToEdit.id_units ?? "",
              id_subdireccion: itemToEdit.id_subdireccion ?? "",
              id_direction: itemToEdit.id_direction ?? "",
              name: itemToEdit.name ?? "",
              email: itemToEdit.email ?? "",
              telefono: itemToEdit.telefono ?? "",
              puesto: itemToEdit.puesto ?? "",
              estado: itemToEdit.estado ?? true,
            }}
            fields={employeeFields}
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
            title="Editar Empleado"
            submitDisabled={saving}
          />
        )}
      </Modal>

      {/* Modal Crear */}
      <Modal isOpen={isCreateOpen} onClose={closeAll}>
        <GenericForm<Partial<EmployesInterface>>
          initialValues={{
            id_user: "",
            id_units: "",
            id_subdireccion: "",
            id_direction: "",
            name: "",
            email: "",
            telefono: "",
            puesto: "",
            estado: true,
          }}
          fields={employeeFields.map(f =>
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
          title="Crear Empleado"
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
            <p>
              ¿Seguro que deseas borrar el empleado{" "}
              <strong>{itemToDelete.name}</strong>?
            </p>
            <GenericTable
              columns={employeeColumns}
              data={[itemToDelete]}
              rowKey={(row) => row.id_employes}
            />
            <div className="mt-4 text-right gap-2 flex justify-center">
              <Button
                onClick={() => handleConfirmDelete(itemToDelete.id_employes)}
                className="bg-hpmm-rojo-claro hover:bg-hpmm-rojo-oscuro text-white font-bold py-2 px-4 rounded"
              >
                Eliminar
              </Button>
              <Button
                onClick={closeAll}
                className="mr-2 bg-hpmm-amarillo-claro hover:bg-hpmm-amarillo-oscuro text-gray-800 font-bold py-2 px-4 rounded"
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

export default Employe;
