export const subMenuVisibility = {
  kardex: {
    Administrador: ["/kardex", "/KardexHistorico"],
    "Jefe Almacen": ["/kardex", "/KardexPendiente","/KardexCancelada","/KardexHistorico"],
    "Tecnico Almacen": ["/kardex", "/KardexPendiente","/KardexCancelada"],
    "Super Admin": ["/kardex", "/KardexRechazadas", "/KardexPendiente", "/KardexCancelada", "/KardexHistorico"],
    "Jefe de Logistica": ["/KardexHistorico"],
  },
  requisiciones: {
    Administrador: ["/requisicionPendiente", "/requisicionAprobado", "/requisicionRechazado", "/requisicionCancelado", "/requisicionHistorico", "/requisicionSeguimiento"],
    
    "Super Admin": ["/requisicionPendiente", "/requisicionAprobado", "/requisicionRechazado", "/requisicionCancelado", "/requisicionHistorico", "/requisicionSeguimiento"],
    "Usuario": ["/requisicionPendiente", "/requisicionAprobado", "/requisicionRechazado", "/requisicionCancelado", "/requisicionSeguimiento"],
  },
  comprasProductos: {
    Administrador: ["/solicitud_compras", "/shopping", "/ProductRequisition"],
    "Super Admin": ["/solicitud_compras", "/shopping", "/ProductRequisition"],
    "Jefe de Logistica": ["/solicitud_compras", "/shopping"],
  },
  pacts: {
    "Jefe Almacen": ["/pacts", "/detalle_pactos"],
    "Tecnico Almacen": ["/pacts", "/detalle_pactos"],
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
    "Jefe Almacen": ["/suppliers", "/vendedor"],
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
    Administrador: ["/Report","/dashboard"],
    "Jefe Almacen": ["/Report","/dashboard"],
    "Tecnico Almacen": ["/Report","/dashboard"],
    "Super Admin": ["/Report","/dashboard"],
    "Jefe de Logistica": ["/Report","/dashboard"],
    "Usuario": ["/Report","/dashboard"],
  },
};