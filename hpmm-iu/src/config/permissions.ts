export const subMenuVisibility = {
  kardex: {
    Administrador: ["/kardex", "/KardexHistorico"],
    "Jefe Almacen": ["/kardex", "/KardexPendiente", "/KardexHistorico"],
    "Tecnico Almacen": ["/kardex"],
    "Super Admin": ["/kardex", "/KardexRechazadas", "/KardexPendiente", "/KardexCancelada", "/KardexHistorico"],
    "Jefe de Logistica": ["/kardex", "/KardexRechazadas", "/KardexPendiente","/KardexHistorico"],
  },
  requisiciones: {
    Administrador: ["/requisicionPendiente", "/requisicionAprobado", "/requisicionRechazado", "/requisicionCancelado", "/requisicionHistorico"],
    "Jefe Almacen": ["/requisicionPendiente", "/requisicionAprobado"],
    "Super Admin": ["/requisicionPendiente", "/requisicionAprobado", "/requisicionRechazado", "/requisicionCancelado", "/requisicionHistorico"],
    "Usuario": ["/requisicionPendiente", "/requisicionAprobado", "/requisicionRechazado", "/requisicionCancelado", "/requisicionSeguimiento"],
  },
  comprasProductos: {
    Administrador: ["/solicitud_compras", "/shopping", "/ProductRequisition"],
    "Super Admin": ["/solicitud_compras", "/shopping", "/ProductRequisition"],
    "Jefe de Logistica": ["/solicitud_compras", "/shopping"],
  },
  pacts: {
    "Jefe Almacen": ["/pacts", "/detalle_pactos"],
    "Tecnico Almacen": ["/pacts"],
    "Super Admin": ["/pacts", "/detalle_pactos"],
  },
  inventario: {
    Administrador: ["/products", "/category", "/subcategory", "/stock-critico"],
    "Jefe Almacen": ["/products", "/category"],
    "Super Admin": ["/products", "/category", "/subcategory", "/stock-critico"],
    "Jefe de Logistica": ["/products", "/category", "/subcategory", "/stock-critico"],
  },
  providers: {
    Administrador: ["/suppliers", "/vendedor"],
    "Jefe Almacen": ["/suppliers"],
    "Super Admin": ["/suppliers", "/vendedor"],
    "Jefe de Logistica": ["/suppliers", "/vendedor"],
  },
  usersRoles: {
    "Super Admin": ["/users", "/roles", "/employees", "/direction", "/subdireccion", "/unit"],
  },
  bitacora: {
    "Super Admin": ["/bitacora"],
  },
  report: {
    Administrador: ["/Report"],
    "Jefe Almacen": ["/Report"],
    "Tecnico Almacen": ["/Report"],
    "Super Admin": ["/Report"],
    "Jefe de Logistica": ["/Report"],
    "Usuario": ["/Report"],
  },
};