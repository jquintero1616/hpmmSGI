import React, { useEffect, useState } from "react";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";
import { vendedorInterface } from "../../interfaces/vendedor.interface";
import { useVendedor } from "../../hooks/use.vendedor";
import { useSupplier } from "../../hooks/use.Supplier";
import { suppliersInterface } from "../../interfaces/supplier.interface";

const Vendedor: React.FC<{ status?: string }> = ({ status = "Todo" }) => {
  const {
    vendedor,
    GetVendedorContext,
    PostCreateVendedorContext,
    PutUpdateVendedorContext,
    DeleteVendedorContext,
  } = useVendedor();

  const { suppliers, GetSuppliersContext } = useSupplier();

  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<vendedorInterface[]>([]);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<vendedorInterface | null>(null);
  const [itemToDelete, setItemToDelete] = useState<vendedorInterface | null>(null);

  const vendedorColumns: Column<vendedorInterface>[] = [
    { header: "Proveedor", accessor: "supplier_name" },
    { header: "Nombre Contacto", accessor: "nombre_contacto" },
    { header: "Correo", accessor: "correo" },
    {
      header: "Fecha Creación",
      accessor: (row) =>
        row.created_at ? new Date(row.created_at).toLocaleString() : "",
    },
    { header: "Estado", accessor: (row) => (row.estado ? "Activo" : "Inactivo") },
  ];

  const vendedorFields: FieldConfig[] = React.useMemo(
    () => [
      {
        name: "id_supplier",
        label: "Proveedor",
        type: "select",
        options: suppliers.map((s: suppliersInterface) => ({
          label: s.nombre,
          value: s.id_supplier,
        })),
      },
      { name: "nombre_contacto", label: "Nombre Contacto", type: "text" },
      { name: "correo", label: "Correo", type: "email" },
      {
        name: "estado",
        label: "Estado",
        type: "select",
        options: [
          { label: "Activo", value: "true" },
          { label: "Inactivo", value: "false" },
        ],
      },
    ],
    [suppliers]
  );

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([GetVendedorContext(), GetSuppliersContext()]);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [GetVendedorContext, GetSuppliersContext]);

  useEffect(() => {
    if (!vendedor || vendedor.length === 0) {
      setFilteredData([]);
      return;
    }
    const validVendedores = vendedor.filter(
      (item) => item?.id_vendedor && typeof item.id_vendedor === "string"
    );
    handleTableContent(validVendedores);
  }, [status, vendedor]);

  const closeAll = () => {
    setEditOpen(false);
    setCreateOpen(false);
    setDeleteOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
  };

  const openEdit = (id_vendedor: string) => {
    const item = vendedor.find((v) => v?.id_vendedor === id_vendedor);
    if (item) {
      console.log("Editando item:", item);
      setItemToEdit(item);
      setEditOpen(true);
    } else {
      console.error(`No se encontró el vendedor con ID: ${id_vendedor}`);
    }
  };

  const openDelete = (id_vendedor: string) => {
    const item = vendedor.find((v) => v?.id_vendedor === id_vendedor);
    if (item) {
      console.log("Eliminando item:", item);
      setItemToDelete(item);
      setDeleteOpen(true);
    } else {
      console.error(`No se encontró el vendedor con ID: ${id_vendedor}`);
    }
  };

  const handleConfirmDelete = async (id_vendedor: string) => {
    try {
      await DeleteVendedorContext(id_vendedor);
      await GetVendedorContext();
      closeAll();
    } catch (error) {
      console.error("Error eliminando vendedor:", error);
    }
  };

  const handleTableContent = (list: vendedorInterface[]) => {
    const validList = list.filter(
      (item) => item?.id_vendedor && typeof item.id_vendedor === "string"
    );
    if (status === "Todo") {
      setFilteredData(validList);
    } else {
      const activeItems = validList.filter((item) => item.estado === true);
      console.log("Items activos filtrados:", activeItems);
      setFilteredData(activeItems);
    }
  };

  const handleSave = async (values: any) => {
    if (!itemToEdit) {
      console.error("No hay item para editar");
      return;
    }
    console.log("Valores del formulario:", values);
    console.log("Item original:", itemToEdit);
    try {
      const payload: Partial<vendedorInterface> = {
        ...itemToEdit,
        ...values,
        estado: values.estado === "true" || values.estado === true,
      };
      console.log("Payload para actualizar:", payload);
      await PutUpdateVendedorContext(
        itemToEdit.id_vendedor,
        payload as vendedorInterface
      );
      await GetVendedorContext();
      closeAll();
    } catch (error) {
      console.error("Error actualizando vendedor:", error);
    }
  };

  const handleCreate = async (values: any) => {
    console.log("Valores para crear:", values);
    try {
      const payload = {
        ...values,
        estado: values.estado === "true" || values.estado === true,
      };
      console.log("Payload para crear:", payload);
      await PostCreateVendedorContext(payload as vendedorInterface);
      await GetVendedorContext();
      closeAll();
    } catch (error) {
      console.error("Error creando vendedor:", error);
    }
  };

  if (loading) {
    return <div>Cargando Vendedores...</div>;
  }

  return (
    <div>
      <h1>Lista de Vendedores</h1>
      <Button onClick={() => setCreateOpen(true)}>+ Nuevo Vendedor</Button>


      <GenericTable
        columns={vendedorColumns}
        data={filteredData}
        rowKey={(row) => row?.id_vendedor || ""}
        actions={[
          {
            header: "Editar",
            label: "Editar",
            onClick: (row) => row.id_vendedor && openEdit(row.id_vendedor),
          },
          {
            header: "Eliminar",
            label: "Eliminar",
            onClick: (row) => row.id_vendedor && openDelete(row.id_vendedor),
          },
        ]}
      />

      <Modal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <GenericForm<Partial<vendedorInterface>>
            initialValues={{
              id_supplier: itemToEdit.id_supplier,
              nombre_contacto: itemToEdit.nombre_contacto || "",
              correo: itemToEdit.correo || "",
              estado: itemToEdit.estado,
            }}
            fields={vendedorFields}
            onSubmit={handleSave}
            onCancel={closeAll}
            submitLabel="Guardar"
            cancelLabel="Cancelar"
          />
        )}
      </Modal>
       {/* Modal Crear Vendedor */}
      <Modal isOpen={isCreateOpen} onClose={closeAll}>
        <GenericForm<Partial<vendedorInterface>>
          initialValues={{
            id_supplier: "",
            nombre_contacto: "",
            correo: "",
            estado: true,
          }}
          fields={vendedorFields}
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
            <p>¿Seguro que deseas borrar este vendedor?</p>
            <GenericTable
              columns={vendedorColumns}
              data={[itemToDelete]}
              rowKey={(row) => row.id_vendedor}
            />
            <div className="mt-4 text-right">
              <Button onClick={closeAll} className="mr-2">
                Cancelar
              </Button>
              <Button
                isPrimary
                onClick={() => handleConfirmDelete(itemToDelete.id_vendedor)}
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

export default Vendedor;
