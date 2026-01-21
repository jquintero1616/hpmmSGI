// src/components/organisms/Suppliers.tsx

import React, { useEffect, useState } from "react";
import { useSupplier } from "../../hooks/use.Supplier";
import { suppliersInterface } from "../../interfaces/supplier.interface";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Suppliers: React.FC<{ status?: string }> = ({ status = "Todo" }) => {
  // Hooks
  const {
    suppliers,
    GetSuppliersContext,
    PostCreateSupplierContext,
    PutUpdateSupplierContext,
    DeleteSupplierContext,
  } = useSupplier();

  // Estados locales
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<suppliersInterface[]>([]);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<suppliersInterface | null>(null);
  const [itemToDelete, setItemToDelete] = useState<suppliersInterface | null>(null);
  const [saving, setSaving] = useState(false);

  // Estado local para el filtro
  const [estadoFiltro] = useState<string>("Todo");

  // Funciones de validación
  const isEmailTaken = (email: string, excludeSupplierId?: string) => {
    return suppliers.some(
      (s) =>
        s.correo.trim().toLowerCase() === email.trim().toLowerCase() &&
        (!excludeSupplierId || s.id_supplier !== excludeSupplierId)
    );
  };

  const validateCreate = (values: any) => {
    const errors: any = {};
    if (isEmailTaken(values.correo)) {
      errors.correo = "El correo ya está registrado en otro proveedor.";
    }
    return errors;
  };

  const validateEdit = (values: any) => {
    const errors: any = {};
    if (
      itemToEdit &&
      values.correo.trim().toLowerCase() !==
        itemToEdit.correo.trim().toLowerCase() &&
      isEmailTaken(values.correo, itemToEdit.id_supplier)
    ) {
      errors.correo = "El correo ya está registrado en otro proveedor.";
    }
    return errors;
  };

  // Configuración de columnas y campos
  const supplierColumns: Column<suppliersInterface>[] = [
    { header: "Nombre", accessor: "nombre" },
    { header: "Teléfono", accessor: "numero_contacto" },
    { header: "Correo Electrónico", accessor: "correo" },
    { header: "RTN", accessor: "rtn" },
    { header: "Estado", accessor: (row) => (row.estado ? "Activo" : "Inactivo") },
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

  const supplierFields: FieldConfig[] = [
    { name: "nombre", 
      label: "Nombre proveedor",
      type: "text",
      required: true,
      colSpan: 2,
    },
    {
      name: "numero_contacto",
      label: "Teléfono",
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
      name: "rtn",
      label: "RTN",
      type: "number",
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
    },
  ];

  // Función handleTableContent
  const handleTableContent = (list: suppliersInterface[]) => {
    // Asegurar que list sea un array válido
    if (!Array.isArray(list)) {
      setFilteredData([]);
      return;
    }

    // Filtrar elementos undefined o null
    let filtrados = list.filter(supplier => supplier && supplier.id_supplier);
    
    if (estadoFiltro === "Activos") {
      filtrados = filtrados.filter((s) => s.estado === true);
    } else if (estadoFiltro === "Inactivos") {
      filtrados = filtrados.filter((s) => s.estado === false);
    }
    // Ordenar por nombre
    const ordenados = filtrados.sort((a, b) =>
      a.nombre.localeCompare(b.nombre)
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

  const openEdit = (id: string) => {
    const found = Array.isArray(suppliers)
      ? suppliers.find((s) => s.id_supplier === id) || null
      : null;
    setItemToEdit(found);
    setEditOpen(true);
  };

  const openDelete = (id: string) => {
    const found = Array.isArray(suppliers)
      ? suppliers.find((s) => s.id_supplier === id) || null
      : null;
    setItemToDelete(found);
    setDeleteOpen(true);
  };

  // Handlers de CRUD
  const handleCreate = async (values: any) => {
    // Validar si el correo ya existe
    if (isEmailTaken(values.correo)) {
      toast.error("El correo ya está registrado en otro proveedor.");
      return;
    }

    setSaving(true);
    try {
      await PostCreateSupplierContext({
        nombre: values.nombre,
        numero_contacto: values.numero_contacto,
        correo: values.correo,
        rtn: values.rtn, 
        estado: true,
      });
      
      await GetSuppliersContext();
      toast.success(`Proveedor ${values.nombre} creado correctamente`);
      closeAll();
    } catch (error) {
      console.error("Error al crear proveedor:", error);
      toast.error("Error al crear el proveedor");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (values: any) => {
    if (!itemToEdit) return;

    // Validar si hay cambios
    const hasChanges =
      values.nombre !== itemToEdit.nombre ||
      values.numero_contacto !== itemToEdit.numero_contacto ||
      values.correo !== itemToEdit.correo ||
      values.rtn !== itemToEdit.rtn ||
      values.estado !== itemToEdit.estado;

    if (!hasChanges) {
      toast.error("No se detectaron cambios para guardar.");
      return;
    }

    // Solo validar si el correo cambió
    if (
      values.correo.trim().toLowerCase() !==
        itemToEdit.correo.trim().toLowerCase() &&
      isEmailTaken(values.correo, itemToEdit.id_supplier)
    ) {
      toast.error("El correo ya está registrado en otro proveedor.");
      return;
    }

    setSaving(true);
    try {
      await PutUpdateSupplierContext(itemToEdit.id_supplier, {
        ...itemToEdit,
        nombre: values.nombre,
        numero_contacto: values.numero_contacto,
        correo: values.correo,
        rtn: values.rtn,
        estado: values.estado === true,
      });

      await GetSuppliersContext();
      toast.success(`Proveedor ${values.nombre} actualizado correctamente`);
      closeAll();
    } catch (error) {
      console.error("Error al actualizar proveedor:", error);
      toast.error("Error al actualizar el proveedor");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async (id: string) => {
    try {
      setSaving(true);
      await DeleteSupplierContext(id);
      await GetSuppliersContext();
      toast.success("Proveedor desactivado correctamente");
      closeAll();
    } catch (error) {
      console.error("Error al desactivar proveedor:", error);
      toast.error("Error al desactivar el proveedor");
    } finally {
      setSaving(false);
    }
  };

  // Effects
  useEffect(() => {
    setLoading(true);
    GetSuppliersContext().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    handleTableContent(suppliers);
  }, [status, suppliers]);

  useEffect(() => {
    handleTableContent(suppliers);
  }, [estadoFiltro, suppliers]);

  // Render condicional
  if (loading) {
    return <div>Cargando proveedores…</div>;
  }

  // Render principal
  return (
    <div>
      <ToastContainer />
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Gestión de Proveedores
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Administra los proveedores del hospital
          </p>
        </div>
        <Button
          className="bg-hpmm-azul-claro hover:bg-hpmm-azul-oscuro text-white font-bold py-2 px-4 rounded-lg"
          onClick={() => setCreateOpen(true)}
        >
          + Nuevo proveedor
        </Button>
      </div>

      <GenericTable
        columns={supplierColumns}
        data={filteredData}
        rowKey={(row) => row?.id_supplier || ""}
        actions={[
          {
            header: "Acciones",
            label: "Editar",
            actionType: "editar" as const,
            tooltip: "Editar proveedor",
            onClick: (row) => openEdit(row.id_supplier),
          },
          {
            header: "Acciones",
            label: "Eliminar",
            actionType: "eliminar" as const,
            tooltip: "Eliminar proveedor",
            onClick: (row) => openDelete(row.id_supplier),
          },
        ]}
        rowClassName={(row) =>
          row?.estado === false ? "opacity-40 line-through" : ""
        }
      />

      {/* Modal Crear */}
      <Modal isOpen={isCreateOpen} onClose={closeAll}>
        <GenericForm<Partial<suppliersInterface>>
          columns={2}
          initialValues={{
            nombre: "",
            numero_contacto: "",
            correo: "",
            rtn: "",
            estado: true,
          }}
          fields={supplierFields.map((f) =>
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
          title="Crear Proveedor"
          submitDisabled={saving}
        />
      </Modal>

      {/* Modal Editar */}
      <Modal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <GenericForm<Partial<suppliersInterface>>
            columns={2}
            initialValues={{
              nombre: itemToEdit.nombre ?? "",
              numero_contacto: itemToEdit.numero_contacto ?? "",
              correo: itemToEdit.correo ?? "",
              rtn: itemToEdit.rtn ?? "",
              estado: true,
            }}
            fields={supplierFields}
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
            title="Editar Proveedor"
            submitDisabled={saving}
          />
        )}
      </Modal>

      {/* Modal Eliminar */}
      <Modal isOpen={isDeleteOpen} onClose={closeAll}>
        {itemToDelete && (
          <>
            <h3 className="text-xl font-semibold mb-4">
              Confirmar Desactivación
            </h3>

            <p>
              ¿Seguro que deseas Eliminar el proveedor{" "}
              <strong>{itemToDelete.nombre}</strong>?
            </p>

            <GenericTable
              columns={supplierColumns}
              data={[itemToDelete]}
              rowKey={(row) => row?.id_supplier || "delete-item"}
            />

            <div className="mt-4 text-right gap-2 flex justify-center">
              <Button
                onClick={() => handleConfirmDelete(itemToDelete.id_supplier)}
                className="bg-hpmm-rojo-claro hover:bg-hpmm-rojo-oscuro text-white font-bold py-2 px-4 rounded"
                disabled={saving}
              >
                {saving ? (
                  <span>
                    <span className="animate-spin inline-block mr-2">⏳</span>
                    Desactivando...
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

export default Suppliers;
