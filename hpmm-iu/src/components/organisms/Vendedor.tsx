import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";
import { vendedorInterface } from "../../interfaces/vendedor.interface";
import { useVendedor } from "../../hooks/use.vendedor";
import { useSupplier } from "../../hooks/use.Supplier";
import { suppliersInterface } from "../../interfaces/supplier.interface";
import "react-toastify/dist/ReactToastify.css";

const Vendedor: React.FC<{ status?: string }> = ({ status = "Todo" }) => {
  // Hooks
  const {
    vendedor,
    GetVendedorContext,
    PostCreateVendedorContext,
    PutUpdateVendedorContext,
    DeleteVendedorContext,
  } = useVendedor();

  const { suppliers, GetSuppliersContext } = useSupplier();

  // Estados locales
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<vendedorInterface[]>([]);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<vendedorInterface | null>(null);
  const [itemToDelete, setItemToDelete] = useState<vendedorInterface | null>(null);
  const [saving, setSaving] = useState(false);

  // Funciones de validación
  const validateCreate = (values: any) => {
    const errors: any = {};
    if (isEmailTaken(values.correo)) {
      errors.correo = "El correo ya está registrado en otro vendedor.";
    }
    return errors;
  };

  const validateEdit = (values: any) => {
    const errors: any = {};
    if (
      itemToEdit &&
      values.correo.trim().toLowerCase() !==
        itemToEdit.correo.trim().toLowerCase() &&
      isEmailTaken(values.correo, itemToEdit.id_vendedor)
    ) {
      errors.correo = "El correo ya está registrado en otro vendedor.";
    }
    return errors;
  };

  // Función para validar si el correo ya existe
  const isEmailTaken = (email: string, excludeVendedorId?: string) => {
    return vendedor.some(
      (v) =>
        v.correo.trim().toLowerCase() === email.trim().toLowerCase() &&
        (!excludeVendedorId || v.id_vendedor !== excludeVendedorId)
    );
  };

  // Configuración de columnas
  const vendedorColumns: Column<vendedorInterface>[] = [
    { header: "Proveedor", accessor: "supplier_name" },
    { header: "Nombre Contacto", accessor: "nombre_contacto" },
    { header: "Correo Electrónico", accessor: "correo" },
    { header: "Teléfono", accessor: "telefono" },
    { header: "Identidad", accessor: "identidad" },

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

  // Configuración de campos
  const vendedorFields: FieldConfig[] = [
    {
      name: "id_supplier",
      label: "Proveedor",
      type: "select",
      options: suppliers.map((s: suppliersInterface) => ({
        label: s.nombre,
        value: s.id_supplier,
      })),
      required: true,
      colSpan: 2,
    },
    {
      name: "nombre_contacto",
      label: "Nombre Contacto",
      type: "text",
      required: true,
    },
    {
      name: "correo",
      label: "Correo Electrónico",
      type: "email",
      required: true,
      pattern: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$",
    },
    {
      name: "telefono",
      label: "Teléfono",
      type: "number",
      required: true,
    },
    {
      name: "identidad",
      label: "Identidad",
      type: "text",
      required: true,
    },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      options: [
        { label: "Activo", value: true },
        { label: "Inactivo", value: false },
      ],
      required: true,
      colSpan: 2,
    },
  ];

  // Función handleTableContent
  const handleTableContent = (list: vendedorInterface[]) => {
    let filtrados = list;
    if (status === "Activos") {
      filtrados = list.filter((v) => v.estado === true);
    } else if (status === "Inactivos") {
      filtrados = list.filter((v) => v.estado === false);
    }
    // Ordenar por nombre_contacto
    const ordenados = filtrados.sort((a, b) =>
      a.nombre_contacto.localeCompare(b.nombre_contacto)
    );
    setFilteredData(ordenados);
  };

  // Funciones de manejo de modales
  const closeAll = () => {
    setEditOpen(false);
    setCreateOpen(false);
    setDeleteOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
  };

  const openEdit = (id_vendedor: string) => {
    if (!vendedor || vendedor.length === 0) {
      return
    }
    const item = vendedor.find (
      (item) => item && item.id_vendedor === id_vendedor
    );

    if(item) {
      setItemToEdit(item);
      setEditOpen(true);
    } else {
      toast.error("Vendedor no encontrado.");
    }
  }

  const openDelete = (id_vendedor: string) => {
    setItemToDelete(vendedor.find((v) => v.id_vendedor === id_vendedor) || null);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async (id_vendedor: string) => {
    try {
      // En vez de eliminar, solo actualiza el estado a inactivo
      await PutUpdateVendedorContext(id_vendedor, { estado: false });
      await GetVendedorContext();
      closeAll();
      toast.success("Vendedor eliminado correctamente.");
    } catch (error) {
      console.error("Error al inactivar el vendedor:", error);
      toast.error("Error al inactivar el vendedor. Inténtalo de nuevo.");
    }
  };

  // Handlers de CRUD
  const handleSave = async (values: any) => {
    if (!itemToEdit) return;

    // Validar si hay cambios
    const hasChanges =
      values.id_supplier !== itemToEdit.id_supplier ||
      values.nombre_contacto !== itemToEdit.nombre_contacto ||
      values.correo !== itemToEdit.correo ||
      values.telefono !== itemToEdit.telefono ||
      values.identidad !== itemToEdit.identidad ||
      values.estado !== itemToEdit.estado;

    if (!hasChanges) {
      toast.error("No se detectaron cambios para guardar.");
      return;
    }

    // Solo validar si el correo cambió
    if (
      values.correo.trim().toLowerCase() !==
        itemToEdit.correo.trim().toLowerCase() &&
      isEmailTaken(values.correo, itemToEdit.id_vendedor)
    ) {
      toast.error("El correo ya está registrado en otro vendedor.");
      return;
    }

    setSaving(true);
    const payload: Partial<vendedorInterface> = {
      ...itemToEdit,
      ...values,
      estado: values.estado === true,
    };

    await PutUpdateVendedorContext(itemToEdit.id_vendedor, payload as vendedorInterface);
    await GetVendedorContext();
    setSaving(false);
    toast.success(`Vendedor ${values.nombre_contacto} actualizado correctamente`);
    closeAll();
  };

  const handleCreate = async (values: any) => {
    // Validar si el correo ya existe
    if (isEmailTaken(values.correo)) {
      toast.error("El correo ya está registrado en otro vendedor.");
      return;
    }

    setSaving(true);
    await PostCreateVendedorContext(values as vendedorInterface);
    await GetVendedorContext();
    setSaving(false);
    toast.success(`Vendedor ${values.nombre_contacto} creado correctamente`);
    closeAll();
  };

  // Effects
  useEffect(() => {
    setLoading(true);
    GetVendedorContext().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    handleTableContent(vendedor);
  }, [status, vendedor]);

  useEffect(() => {
    setLoading(true);
    Promise.all([GetVendedorContext(), GetSuppliersContext()]).finally(() =>
      setLoading(false)
    );
  }, []);

  // Render condicional
  if (loading) {
    return <div>Cargando vendedores…</div>;
  }

  // Render principal
  return (
    <div>
      <ToastContainer />
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Gestión de Vendedores
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Administra los vendedores asociados a proveedores
          </p>
        </div>
        <Button
          className="bg-hpmm-azul-claro hover:bg-hpmm-azul-oscuro text-white font-bold py-2 px-4 rounded-lg"
          onClick={() => setCreateOpen(true)}
        >
          + Nuevo vendedor
        </Button>
      </div>

      <GenericTable
        columns={vendedorColumns}
        data={filteredData}
        rowKey={(row) => row.id_vendedor}
        actions={[
          {
            header: "Acciones",
            label: "Editar",
            actionType: "editar" as const,
            tooltip: "Editar vendedor",
            onClick: (row) => openEdit(row.id_vendedor),
          },
          {
            header: "Acciones",
            label: "Eliminar",
            actionType: "eliminar" as const,
            tooltip: "Eliminar vendedor",
            onClick: (row) => openDelete(row.id_vendedor),
          },
        ]}
        rowClassName={(row) =>
          row.estado === false ? "opacity-40 line-through" : ""
        }
      />

      {/* Modal Editar */}
      <Modal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <GenericForm<Partial<vendedorInterface>>
            columns={2}
            initialValues={{
              id_supplier: itemToEdit.id_supplier , 
              nombre_contacto: itemToEdit.nombre_contacto,
              correo: itemToEdit.correo,
              telefono: itemToEdit.telefono,
              identidad: itemToEdit.identidad,
              estado: true, 
            }}
            fields={vendedorFields}
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
            title="Editar Vendedor"
            submitDisabled={saving}
          />
        )}
      </Modal>

      {/* Modal Crear */}
      <Modal isOpen={isCreateOpen} onClose={closeAll}>
        <GenericForm<Partial<vendedorInterface>>
          columns={2}
          initialValues={{
            id_supplier: "",
            nombre_contacto: "",
            correo: "",
            estado: true,
          }}
          fields={vendedorFields.map((f) =>
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
          title="Crear Vendedor"
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

            <p>¿Seguro que deseas borrar este vendedor?</p>

            <GenericTable
              rowKey={(row) => row.id_vendedor}
              data={[itemToDelete]}
              columns={vendedorColumns}
            />

            <div className="mt-4 text-right gap-2 flex justify-center">
              <Button
                onClick={() => handleConfirmDelete(itemToDelete.id_vendedor)}
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

export default Vendedor;
