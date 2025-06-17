import React, { useEffect, useState } from "react";
import { useDetallePactos } from "../../hooks/use.DetallePactos";
import { DetallePactInterface } from "../../interfaces/DetallePactos.intefaces.d";
import Button from "../atoms/Buttons/Button";
import Modal from "../molecules/GenericModal";
import GenericForm, { FieldConfig } from "../molecules/GenericForm";
import GenericTable, { Column } from "../molecules/GenericTable";
import { useUnit } from "../../hooks/use.Unit";
import { usePacts } from "../../hooks/use.Pacts";
import { useProducts } from "../../hooks/use.Product";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DetallePactos: React.FC<{ status?: string }> = ({ status = "Todo" }) => {
  // Hooks
  const {
    detallePactos,
    GetDetallePactosContext,
    PostCreateDetallePactosContext,
    PutUpdateDetallePactosContext,
    DeleteDetallePactosContext,
  } = useDetallePactos();

  const { units, GetUnitsContext } = useUnit();
  const { pacts, GetPactsContext } = usePacts();
  const { products, GetProductsContext } = useProducts();

  // Estados locales para manejar la UI
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<DetallePactInterface[]>([]);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<DetallePactInterface | null>(
    null
  );
  const [itemToDelete, setItemToDelete] = useState<DetallePactInterface | null>(
    null
  );
  const [saving, setSaving] = useState(false);

  // Estado local para el filtro
  const [estadoFiltro] = useState<string>("Todo");

  // Función para validar si la combinación ya existe
  const isCombinationTaken = (
    units: string,
    pacts: string,
    product: string,
    excludeId?: string
  ) => {
    return detallePactos.some(
      (d) =>
        d.id_units === units &&
        d.id_pacts === pacts &&
        d.id_product === product &&
        (!excludeId || d.id_units_x_pacts !== excludeId)
    );
  };

  // Validación para el formulario de crear detalle pacto
  const validateCreate = (values: any) => {
    const errors: any = {};
    if (
      isCombinationTaken(
        values.id_units,
        values.id_pacts,
        values.id_product
      )
    ) {
      errors.id_units =
        "Esta combinación de Unidad, Pacto y Producto ya existe.";
    }
    return errors;
  };

  // Validación para el formulario de editar detalle pacto
  const validateEdit = (values: any) => {
    const errors: any = {};
    if (
      itemToEdit &&
      (values.id_units !== itemToEdit.id_units ||
        values.id_pacts !== itemToEdit.id_pacts ||
        values.id_product !== itemToEdit.id_product) &&
      isCombinationTaken(
        values.id_units,
        values.id_pacts,
        values.id_product,
        itemToEdit.id_units_x_pacts
      )
    ) {
      errors.id_units =
        "Esta combinación de Unidad, Pacto y Producto ya existe.";
    }
    return errors;
  };

  // Columnas de la tabla
  const detallePactosColumns: Column<DetallePactInterface>[] = [
    {
      header: "Pacto",
      accessor: "pact_name",
    },
    {
      header: "Unidad",
      accessor: "unit_name",
    },
    {
      header: "Producto",
      accessor: "nombre",
    },
    {
      header: "Cantidad",
      accessor: "cantidad",
    },
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

  // Campos para el formulario
  const detallePactosFields: FieldConfig[] = [
    {
      name: "id_units",
      label: "Unidad",
      type: "select",
      options: units.map((u) => ({ label: u.name ?? "", value: u.id_units })),
      required: true,
    },
    {
      name: "id_pacts",
      label: "Pacto",
      type: "select",
      options: pacts.map((p) => ({ label: p.name ?? "", value: p.id_pacts })),
      required: true,
    },
    {
      name: "id_product",
      label: "Producto",
      type: "select",
      options: products.map((p) => ({
        label: p.nombre ?? "",
        value: p.id_product,
      })),
      required: true,
    },
    {
      name: "cantidad",
      label: "Cantidad",
      type: "number",
      required: true,
      min: 1,
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

  // Función para manejar el contenido de la tabla
  const handleTableContent = (list: DetallePactInterface[]) => {
    // Filtrar elementos que tengan id_units_x_pacts válido
    let filtrados = list.filter((d) => d && d.id_units_x_pacts);

    if (estadoFiltro === "Activos") {
      filtrados = filtrados.filter((d) => d.estado === true);
    } else if (estadoFiltro === "Inactivos") {
      filtrados = filtrados.filter((d) => d.estado === false);
    }

    // Ordenar por id de forma segura
    const ordenados = filtrados.sort((a, b) => {
      // Verificar que ambos elementos tengan id_units_x_pacts
      const aId = a.id_units_x_pacts || "";
      const bId = b.id_units_x_pacts || "";
      return aId.localeCompare(bId);
    });

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

  const openEdit = (id_units_x_pacts: string) => {
    setItemToEdit(
      detallePactos.find((d) => d.id_units_x_pacts === id_units_x_pacts) || null
    );
    setEditOpen(true);
  };

  const openDelete = (id_units_x_pacts: string) => {
    setItemToDelete(
      detallePactos.find((d) => d.id_units_x_pacts === id_units_x_pacts) || null
    );
    setDeleteOpen(true);
  };

  // Handlers de CRUD
  const handleConfirmDelete = async (id_units_x_pacts: string) => {
    await DeleteDetallePactosContext(id_units_x_pacts);
    await GetDetallePactosContext();
    toast.success("Detalle de pacto eliminado correctamente");
    closeAll();
  };

  const handleSave = async (values: any) => {
    if (!itemToEdit) return;

    // Validar si hay cambios
    const hasChanges =
      values.id_units !== itemToEdit.id_units ||
      values.id_pacts !== itemToEdit.id_pacts ||
      values.id_product !== itemToEdit.id_product ||
      values.estado !== itemToEdit.estado ||
      values.cantidad !== itemToEdit.cantidad;

    if (!hasChanges) {
      toast.error("No se detectaron cambios para guardar.");
      return;
    }

    // Validar si la combinación cambió y ya existe
    if (
      (values.id_units !== itemToEdit.id_units ||
        values.id_pacts !== itemToEdit.id_pacts ||
        values.id_product !== itemToEdit.id_product) &&
      isCombinationTaken(
        values.id_units,
        values.id_pacts,
        values.id_product,
        itemToEdit.id_units_x_pacts
      )
    ) {
      toast.error(
        "Esta combinación de Unidad, Pacto y Producto ya existe."
      );
      return;
    }

    setSaving(true);
    const payload: Partial<DetallePactInterface> = {
      ...itemToEdit,
      ...values,
      estado: values.estado === true,
    };

    await PutUpdateDetallePactosContext(
      itemToEdit.id_units_x_pacts,
      payload as DetallePactInterface
    );
    await GetDetallePactosContext();
    setSaving(false);
    toast.success("Detalle de pacto actualizado correctamente");
    closeAll();
  };

  const handleCreate = async (values: any) => {
    // Validar si la combinación ya existe
    if (
      isCombinationTaken(
        values.id_units,
        values.id_pacts,
        values.id_product
      )
    ) {
      toast.error(
        "Esta combinación de Unidad, Pacto y Producto ya existe."
      );
      return;
    }

    setSaving(true);
    await PostCreateDetallePactosContext(values as DetallePactInterface);
    await GetDetallePactosContext();
    setSaving(false);
    toast.success("Detalle de pacto creado correctamente");
    closeAll();
  };

  // Effects
  useEffect(() => {
    setLoading(true);
    Promise.all([
      GetDetallePactosContext(),
      GetUnitsContext(),
      GetPactsContext(),
      GetProductsContext(),
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Solo ejecutar si detallePactos tiene datos válidos
    if (detallePactos && Array.isArray(detallePactos)) {
      handleTableContent(detallePactos);
    }
  }, [estadoFiltro, detallePactos, status]);

  // Render condicional
  if (loading) {
    return <div>Cargando detalles de pactos…</div>;
  }

  // Render principal
  return (
    <div>
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4 text-center">
        Lista de Detalles de Pactos
      </h1>

      <div className="flex justify-end mb-4">
        <Button
          className="bg-hpmm-azul-claro hover:bg-hpmm-azul-oscuro text-white font-bold py-2 px-4 rounded"
          onClick={() => setCreateOpen(true)}
        >
          + Nuevo detalle de pacto
        </Button>
      </div>

      <GenericTable
        columns={detallePactosColumns}
        data={filteredData}
        rowKey={(row) => row.id_units_x_pacts}
        actions={[
          {
            header: "Editar",
            label: "Editar",
            onClick: (row) => openEdit(row.id_units_x_pacts),
          },
          {
            header: "Eliminar",
            label: "Eliminar",
            onClick: (row) => openDelete(row.id_units_x_pacts),
          },
        ]}
        rowClassName={(row) =>
          row.estado === false ? "opacity-40 line-through" : ""
        }
      />

      {/* Modal Editar */}
      <Modal isOpen={isEditOpen} onClose={closeAll}>
        {itemToEdit && (
          <GenericForm<Partial<DetallePactInterface>>
            initialValues={{
              id_units_x_pacts: itemToEdit.id_units_x_pacts,
              id_units: itemToEdit.id_units ?? "",
              id_pacts: itemToEdit.id_pacts ?? "",
              id_product: itemToEdit.id_product ?? "",
              cantidad: itemToEdit.cantidad ?? 1,
              estado: true,
            }}
            fields={detallePactosFields}
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
            title="Editar Detalle de Pacto"
            submitDisabled={saving}
          />
        )}
      </Modal>

      {/* Modal Crear */}
      <Modal isOpen={isCreateOpen} onClose={closeAll}>
        <GenericForm<Partial<DetallePactInterface>>
          initialValues={{
            id_units: "",
            id_pacts: "",
            id_product: "",
            cantidad: 1,
            estado: true,
          }}
          fields={detallePactosFields.map((f) =>
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
          title="Crear Detalle de Pacto"
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

            <p>¿Seguro que deseas borrar este detalle de pacto?</p>

            <GenericTable
              rowKey={(row) => row.id_units_x_pacts}
              data={[itemToDelete]}
              columns={detallePactosColumns}
            />

            <div className="mt-4 text-right gap-2 flex justify-center">
              <Button
                onClick={() =>
                  handleConfirmDelete(itemToDelete.id_units_x_pacts)
                }
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

export default DetallePactos;
