// src/components/organisms/Suppliers.tsx

import React, { useEffect, useState } from "react";
import { useSupplier } from "../../hooks/use.Supplier";
import Button from "../atoms/Buttons/Button";
import GenericModal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";
import { suppliersInterface } from "../../interfaces/supplier.interface";

const supplierColumns: Column<suppliersInterface>[] = [
  { header: "Nombre", accessor: "nombre" },
  { header: "Teléfono", accessor: "numero_contacto" },
  { header: "Correo", accessor: "correo" },
  { header: "Estado", accessor: (row) => (row.estado ? "Activo" : "Inactivo") },
  {
    header: "Fecha Creación",
    accessor: (row) =>
      // Cambia "created_at" si tu API usa otro nombre
      row.created_at ? new Date(row.created_at).toLocaleString() : "",
  },
  {
    header: "Fecha Actualización",
    accessor: (row) =>
      row.updated_at ? new Date(row.updated_at).toLocaleString() : "",
  },
];

const supplierFields: FieldConfig[] = [
  { name: "nombre", label: "Nombre", type: "text" },
  { name: "numero_contacto", label: "Teléfono", type: "text" },
  { name: "correo", label: "Correo", type: "text" },
];

const Suppliers: React.FC<{ status?: string }> = ({ status = "Todo" }) => {
  const {
    suppliers,
    GetSuppliersContext,
    PostCreateSupplierContext,
    PutUpdateSupplierContext,
    DeleteSupplierContext,
  } = useSupplier();

  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<suppliersInterface[]>([]);

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<suppliersInterface | null>(null);
  const [itemToDelete, setItemToDelete] = useState<suppliersInterface | null>(
    null
  );

  useEffect(() => {
    GetSuppliersContext()
    .finally(() => setLoading(false));
  }, [GetSuppliersContext]);
      
  

  useEffect(() => {
    if (suppliers && suppliers.length > 0) {
      handleTableContent(suppliers);
    }
  }, [status, suppliers]);

  const closeAll = () => {
    setCreateOpen(false);
    setEditOpen(false);
    setDeleteOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
  };

  const handleTableContent = (emp: suppliersInterface[]) => {
    // Verificar que emp existe y tiene elementos
    if (!emp || emp.length === 0) {
      setFilteredData([]);
      return;
    }

    const rowContent = emp.filter((item) => {
      // Verificar que el item existe y tiene la propiedad estado
      return (
        item && item.estado !== undefined && item.estado === (status === "Todo")
      );
    });
    setFilteredData(rowContent);
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

  // ───── 3) Crear proveedor ─────
  const handleCreate = async (values: any) => {
    try {
      setLoading(true);
      await PostCreateSupplierContext({
        nombre: values.nombre,
        numero_contacto: values.numero_contacto,
        correo: values.correo,
        estado: true, 
      });
      
      await GetSuppliersContext();
    } catch (error) {
      console.error("Error al crear proveedor:", error);
    } finally {
      setLoading(false);
      closeAll();
    }
  };

  
  const handleSave = async (values: any) => {
    if (!itemToEdit) return;

    try {
      setLoading(true);
      await PutUpdateSupplierContext(itemToEdit.id_supplier, {
        ...itemToEdit,
        nombre: values.nombre,
        numero_contacto: values.numero_contacto,
        correo: values.correo,
        estado: itemToEdit.estado,
      });

      await GetSuppliersContext();
    } catch (error) {
      console.error("Error al actualizar proveedor:", error);
    } finally {
      setLoading(false);
      closeAll();
    }
  };

  // ───── 5) Desactivar (soft‐delete) ─────
  const handleConfirmDelete = async (id: string) => {
    try {
      setLoading(true);
      await DeleteSupplierContext(id); 
      await GetSuppliersContext();
    } catch (error) {
      console.error("Error al desactivar proveedor:", error);
    } finally {
      setLoading(false);
      closeAll();
    }
  };

  // ───── Mientras está “loading” no mostramos la tabla ─────
  if (loading) {
    return <div>Cargando proveedores…</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Gestión de Proveedores</h2>
      <Button onClick={() => setCreateOpen(true)}>+ Nuevo proveedor</Button>

      {filteredData.length > 0 ? (
        <GenericTable
          columns={supplierColumns}
          data={filteredData}
          rowKey={(row) => row.id_supplier}
          actions={[
            {
              header: "Acciones",
              label: "Editar",
              onClick: (row) => openEdit(row.id_supplier),
            },
            {
              header: "Eliminar",
              label: "Eliminar",
              onClick: (row) => openDelete(row.id_supplier),
            },
          ]}
        />
      ) : (
        <p className="mt-4 text-gray-600">No hay proveedores activos.</p>
      )}

      {/* ─── Modal Crear Proveedor ─── */}
      <GenericModal isOpen={isCreateOpen} onClose={closeAll}>
        <h3 className="text-xl font-semibold mb-4">Crear Proveedor</h3>
        <GenericForm
          initialValues={{
            nombre: "",
            numero_contacto: "",
            correo: "",
            estado: true,
          }}
          fields={supplierFields}
          onSubmit={handleCreate}
          onCancel={closeAll}
          submitLabel="Crear"
          cancelLabel="Cancelar"
        />
      </GenericModal>

      {/* ─── Modal Editar Proveedor ─── */}
      <GenericModal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <>
            <h3 className="text-xl font-semibold mb-4">Editar Proveedor</h3>
            <GenericForm
              initialValues={{
                nombre: itemToEdit.nombre,
                numero_contacto: itemToEdit.numero_contacto,
                correo: itemToEdit.correo,
                estado: itemToEdit.estado ? "true" : "false",
              }}
              fields={supplierFields}
              onSubmit={handleSave}
              onCancel={closeAll}
              submitLabel="Guardar"
              cancelLabel="Cancelar"
            />
          </>
        )}
      </GenericModal>

      {/* ─── Modal Desactivar Proveedor ─── */}
      <GenericModal isOpen={isDeleteOpen} onClose={closeAll}>
        {itemToDelete && (
          <>
            <h3 className="text-xl font-semibold mb-4">
              Confirmar Desactivación
            </h3>
            <p>
              ¿Seguro que deseas desactivar el proveedor{" "}
              <strong>{itemToDelete.nombre}</strong>?
            </p>
            <GenericTable
              columns={supplierColumns}
              data={[itemToDelete]}
              rowKey={(row) => row.id_supplier}
            />
            <div className="mt-4 text-right">
              <Button onClick={closeAll} className="mr-2">
                Cancelar
              </Button>
              <Button
                isPrimary
                onClick={() => handleConfirmDelete(itemToDelete.id_supplier)}
              >
                Desactivar
              </Button>
            </div>
          </>
        )}
      </GenericModal>
    </div>
  );
};

export default Suppliers;
