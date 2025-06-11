// src/components/organisms/Employees.tsx

import React, { useEffect, useState } from "react";
import { useEmploye } from "../../hooks/use.Employe";
import { EmployesInterface } from "../../interfaces/Employe.interface";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";
import { useUser } from "../../hooks/use.User";
// import { useUnits } from "../../hooks/use.Units"; // Necesitas crear este hook
// import { useSubdireccion } from "../../hooks/use.Subdireccion"; // Necesitas crear este hook  
// import { useDirection } from "../../hooks/use.Direction"; // Necesitas crear este hook

const Employe: React.FC<{ status?: string }> = ({ status = "Todo" }) => {
  const {
    employes,
    GetEmployeContext,
    PostCreateEmployeContext,
    PutUpdateEmployeContext,
    DeleteEmployeContext,
  } = useEmploye();

  const { users, GetUsersContext } = useUser();
  // const { units, GetUnitsContext } = useUnits(); // Agregar
  // const { subdirecciones, GetSubdireccionesContext } = useSubdireccion(); // Agregar
  // const { directions, GetDirectionsContext } = useDirection(); // Agregar

  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<EmployesInterface[]>([]);

  // Para formularios
  const [isEditOpen, setEditOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<EmployesInterface | null>(null);

  const [isCreateOpen, setCreateOpen] = useState(false);

  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<EmployesInterface | null>(
    null
  );

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

  const employeeFields: FieldConfig[] = React.useMemo(
    () => [
      {
        name: "id_user",
        label: "Usuario",
        type: "select",
        options: users.map((user) => ({
          label: user.username || user.nombre, // Ajustar según tu interface
          value: user.id_user,
        })),
      },
      // {
      //   name: "id_units",
      //   label: "Unidad",
      //   type: "select", 
      //   options: units.map((unit) => ({
      //     label: unit.name,
      //     value: unit.id_units,
      //   })),
      // },
      // {
      //   name: "id_subdireccion",
      //   label: "Subdirección",
      //   type: "select",
      //   options: subdirecciones.map((sub) => ({
      //     label: sub.nombre,
      //     value: sub.id_subdireccion,
      //   })),
      // },
      // {
      //   name: "id_direction",
      //   label: "Dirección", 
      //   type: "select",
      //   options: directions.map((dir) => ({
      //     label: dir.nombre,
      //     value: dir.id_direction,
      //   })),
      // },
      { name: "name", label: "Nombre", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "telefono", label: "Teléfono", type: "text" },
      { name: "puesto", label: "Puesto", type: "text" },
      {
        name: "estado",
        label: "Estado",
        type: "select",
        options: [
          { label: "Activo", value: true }, // Usar boolean
          { label: "Inactivo", value: false },
        ],
      },
    ],
    [users] // Todas las dependencias
  );

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          GetEmployeContext(),
          GetUsersContext(),
        ]);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // <- Quita las dependencias GetEmployeContext, GetUsersContext

  useEffect(() => {
    if (!employes || employes.length === 0) {
      setFilteredData([]);
      return;
    }

    // Filtrar elementos válidos antes de procesar
    const validEmployees = employes.filter(
      (item) =>
        item && item.id_employes && typeof item.id_employes === "string"
    );

    handleTableContent(validEmployees);
  }, [status, employes]); // <- Mantén solo estas dependencias

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

  const openDelete = (id: string) => {
    const item = employes.find((e) => e.id_employes === id) || null;
    setItemToDelete(item);
    setDeleteOpen(true);
  };

  const handleTableContent = (emp: EmployesInterface[]) => {
    // Verificar que emp existe y tiene elementos
    if (!emp || emp.length === 0) {
      setFilteredData([]);
      return;
    }

    // Filtrar elementos válidos antes de procesar
    const validEmployees = emp.filter(
      (item) =>
        item && item.id_employes && typeof item.id_employes === "string"
    );

    if (status === "Todo") {
      setFilteredData(validEmployees);
    } else if (status === "Activo") {
      setFilteredData(validEmployees.filter((item) => item.estado === true));
    } else if (status === "Inactivo") {
      setFilteredData(validEmployees.filter((item) => item.estado === false));
    } else {
      setFilteredData(validEmployees);
    }
  };

  const handleConfirmDelete = async (id: string) => {
    await DeleteEmployeContext(id);
    await GetEmployeContext();
    closeAll();
  };

  const handleSave = async (values: any) => {
    if (!itemToEdit) {
      console.error("No hay item para editar");
      return;
    }

    try {
      const payload: Partial<EmployesInterface> = {
        ...itemToEdit,
        ...values,
        estado: values.estado === "true" || values.estado === true,
      };

      await PutUpdateEmployeContext(itemToEdit.id_employes, payload as EmployesInterface);
      await GetEmployeContext();
      closeAll();
    } catch (error) {
      console.error("Error actualizando empleado:", error);
    }
  };

  const handleCreate = async (values: any) => {
    try {
      const payload = {
        ...values,
        estado: values.estado === "true" || values.estado === true,
      };

      await PostCreateEmployeContext(payload as EmployesInterface);
      await GetEmployeContext();
      closeAll();
    } catch (error) {
      console.error("Error creando empleado:", error);
    }
  };

  if (loading) return <div>Cargando empleados…</div>;

  return (
    <div>
      <h2>Gestión de Empleados</h2>
      <Button onClick={() => setCreateOpen(true)}>+ Nuevo empleado</Button>

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
      />

      {/* Modal Editar */}
      <Modal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <GenericForm<Partial<EmployesInterface>>
            initialValues={{
              usuario: itemToEdit.usuario || "",
              //id_units: itemToEdit.id_units || "",
              //id_subdireccion: itemToEdit.id_subdireccion || "",
              //id_direction: itemToEdit.id_direction || "",
              name: itemToEdit.name || "",
              email: itemToEdit.email || "",
              telefono: itemToEdit.telefono || "",
              puesto: itemToEdit.puesto || "",
              estado: itemToEdit.estado,
            }}
            fields={employeeFields}
            onSubmit={handleSave}
            onCancel={closeAll}
            submitLabel="Guardar"
            cancelLabel="Cancelar"
          />
        )}
      </Modal>

      {/* Modal Crear */}
      <Modal isOpen={isCreateOpen} onClose={closeAll}>
        <GenericForm<Partial<EmployesInterface>>
          initialValues={{
            usuario: "",
            //id_units: "",
            //id_subdireccion: "",
            //id_direction: "",
            name: "",
            email: "",
            telefono: "",
            puesto: "",
            estado: true, // Boolean, no string
          }}
          fields={employeeFields}
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
            <p>
              ¿Seguro que deseas borrar el empleado{" "}
              <strong>{itemToDelete.name}</strong>?
            </p>
            <GenericTable
              columns={employeeColumns}
              data={[itemToDelete]}
              rowKey={(row) => row.id_employes}
            />
            <div className="mt-4 text-right">
              <Button onClick={closeAll} className="mr-2">
                Cancelar
              </Button>
              <Button
                isPrimary
                onClick={() => handleConfirmDelete(itemToDelete.id_employes)}
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

export default Employe;
