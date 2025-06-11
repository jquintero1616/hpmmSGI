import React, { useEffect, useState } from "react";
import { useVendedor } from "../../hooks/use.vendedor";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";
// 
import { useShopping } from "../../hooks/use.Shopping";
import { ShoppingInterface } from "../../interfaces/shopping.interface";


const Shopping: React.FC<{ status?: string }> = ({ status = "Todo" }) => {
  const {
    shopping,
    GetShoppingContext,
    PostShoppingContext,
    PutShoppingContext,
    DeleteShoppingContext,
  } = useShopping();

  const { vendedor, GetVendedorContext } = useVendedor();

  // Estados locales para manejar la UI
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<ShoppingInterface[]>([]);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ShoppingInterface | null>(
    null
  );
  const [itemToDelete, setItemToDelete] = useState<ShoppingInterface | null>(
    null
  );

  // 1) Columnas de la tabla
  const shoppingColumns: Column<ShoppingInterface>[] = [
    
    { header: "ID Solicitud", accessor: "id_scompra" },
    { header: "Vendedor", accessor: "vendedor_nombre" },
    {
      header: "Fecha Compra",
      accessor: (row) =>
        row.fecha_compra ? new Date(row.fecha_compra).toLocaleDateString() : ""
    },
    { header: "Numero Orden", accessor: "shopping_order_id" },
    { header: "Total", accessor: "total" },
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

  // 2) Campos para el formulario - Memo para evitar recreaciones innecesarias
  const shoppingFields: FieldConfig[] = React.useMemo(
    () => [
      { name: "id_scompra", label: "Solicitud de compra", type: "text" },
      {
        name: "id_vendedor",
        label: "Vendedor",
        type: "select",
        options: vendedor.map((v) => ({ label: v.nombre_contacto, value: v.id_vendedor })),
      },
      { name: "fecha_compra", label: "Fecha Compra", type: "date" },
      { name: "shopping_order_id", label: "Numero Orden", type: "text" },
      { name: "total", label: "Total", type: "number" },
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
    [vendedor]
  );

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([GetShoppingContext(), GetVendedorContext()]);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [GetShoppingContext, GetVendedorContext]);

  // Filtrar datos cuando cambie el status o shopping
  useEffect(() => {
    if (!shopping || shopping.length === 0) {
      setFilteredData([]);
      return;
    }

    // Filtrar elementos válidos antes de procesar
    const validShoppings = shopping.filter(
      (item) =>
        item && item.id_shopping && typeof item.id_shopping === "string"
    );

    handleTableContent(validShoppings);
  }, [status, shopping]);

// ------------------------------------------------------------------------------------
  const closeAll = () => {
    setEditOpen(false);
    setCreateOpen(false);
    setDeleteOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
  };
  // ------------------------------------------------------------------------------------
  const openEdit = (id_shopping: string) => {
    if (!shopping || shopping.length === 0) {
      return;
    }

    const item = shopping.find(
      (item) => item && item.id_shopping === id_shopping
    );

    if (item) {
      console.log("Item a editar:", item);
      setItemToEdit(item);
      setEditOpen(true);
    } else {
      console.error("No se encontró la compra con ID:", id_shopping);
    }
  };

  const openDelete = (id_shopping: string) => {
    if (!shopping || shopping.length === 0) {
      return;
    }

    const item = shopping.find(
      (item) => item && item.id_shopping === id_shopping
    );

    if (item) {
      setItemToDelete(item);
      setDeleteOpen(true);
    } else {
      console.error("No se encontró la compra con ID:", id_shopping);
    }
  };
  //-----------------------------------------------------------------------------------------
  const handleConfirmDelete = async (id_shopping: string) => {
    try {
      await DeleteShoppingContext(id_shopping);
      await GetShoppingContext();
      closeAll();
    } catch (error) {
      console.error("Error eliminando compra:", error);
    }
  };

  const handleTableContent = (list: ShoppingInterface[]) => {
    // Asegurar que todos los elementos sean válidos
    const validList = list.filter(
      (item) =>
        item && item.id_shopping && typeof item.id_shopping === "string"
    );

    if (status === "Todo") {
      setFilteredData(validList);
    } else {
      // Filtrar solo activos
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
      // Arma el objeto de actualización
      const payload: Partial<ShoppingInterface> = {
        ...itemToEdit,
        ...values,
        estado: values.estado === "true" || values.estado === true,
        total: parseFloat(values.total) || 0,
        fecha_compra: new Date(values.fecha_compra),
      };

      console.log("Payload para actualizar:", payload);

      await PutShoppingContext(
        itemToEdit.id_shopping,
        payload as ShoppingInterface
      );
      await GetShoppingContext();
      closeAll();
    } catch (error) {
      console.error("Error actualizando compra:", error);
    }
  };

  const handleCreate = async (values: any) => {
    try {
      const payload = {
        ...values,
        estado: values.estado === "true" || values.estado === true,
        total: parseFloat(values.total) || 0,
        fecha_compra: new Date(values.fecha_compra),
      };

      console.log("Payload para crear:", payload);

      await PostShoppingContext(payload as ShoppingInterface);
      await GetShoppingContext();
      closeAll();
    } catch (error) {
      console.error("Error creando compra:", error);
    }
  };

  if (loading) {
    return <div>Cargando Compras...</div>;
  }

  return (
    <div>
      <h1>Lista de Compras</h1>
      <Button onClick={() => setCreateOpen(true)}>+ Nueva Compra</Button>

      <GenericTable
        columns={shoppingColumns}
        data={filteredData.filter((item) => item && item.id_shopping)} // Filtro adicional de seguridad
        rowKey={(row) => row?.id_shopping || ""}
        actions={[
          {
            header: "Editar",
            label: "Editar",
            onClick: (row) =>
              row?.id_shopping && openEdit(row.id_shopping),
          },
          {
            header: "Eliminar",
            label: "Eliminar",
            onClick: (row) =>
              row?.id_shopping && openDelete(row.id_shopping),
          },
        ]}
      />

      {/* Modal Editar */}
      <Modal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <GenericForm<Partial<ShoppingInterface>>
            initialValues={{
              id_scompra: itemToEdit.id_scompra || "",
              id_vendedor: itemToEdit.id_vendedor || "",
              fecha_compra: itemToEdit.fecha_compra || new Date(),
              shopping_order_id: itemToEdit.shopping_order_id || "",
              total: itemToEdit.total || 0,
              estado: itemToEdit.estado,
            }}
            fields={shoppingFields}
            onSubmit={handleSave}
            onCancel={closeAll}
            submitLabel="Guardar"
            cancelLabel="Cancelar"
          />
        )}
      </Modal>

      {/* Modal Crear */}
      <Modal isOpen={isCreateOpen} onClose={closeAll}>
        <GenericForm<Partial<ShoppingInterface>>
          initialValues={{
            id_scompra: "",
            id_vendedor: "",
            fecha_compra: new Date(),
            shopping_order_id: "",
            total: 0,
            estado: true,
          }}
          fields={shoppingFields}
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
            <p>¿Seguro que deseas borrar esta compra?</p>
            <GenericTable
              columns={shoppingColumns}
              data={[itemToDelete]}
              rowKey={(row) => row.id_shopping}
            />
            <div className="mt-4 text-right">
              <Button onClick={closeAll} className="mr-2">
                Cancelar
              </Button>
              <Button
                isPrimary
                onClick={() => handleConfirmDelete(itemToDelete.id_shopping)}
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

export default Shopping;