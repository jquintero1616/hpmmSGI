// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { routes } from "./routes/RouterConfig";
import { AuthProvider } from "./contexts/Auth.context";
import { UserProvider } from "./contexts/User.context";
import { PactProvider } from "./contexts/Pacts.context";
import { KardexProvider } from "./contexts/Kardex.context";
import { ProductProvider } from "./contexts/Product.context";
import { CategoryProvider } from "./contexts/Category.context";
import { SupplierProvider } from "./contexts/Supplier.context";
import { RoleProvider } from "./contexts/Role.context";
import { EmployeProvider } from "./contexts/Employes.context";
import { SubcategoryProvider } from "./contexts/Subcategory.context";
import { VendedorProvider } from "./contexts/Vendedor.context";
import { DirectionProvider } from "./contexts/Direction.context";
import { SubdireccionProvider } from "./contexts/Subdireccion.context";
import { UnitProvider } from "./contexts/Unit.context";
import { ShoppingProvider } from "./contexts/Shopping.context";
import { ProductRequisitionProvider } from "./contexts/Product_requisi.context";
import { RequisicionProvider } from "./contexts/Requisicion.contex";
import { BitacoraProvider } from "./contexts/Bitacora.context";
import { SolicitudComprasProvider } from "./contexts/SolicitudCompras.context";
import { DetallePactosProvider } from "./contexts/DetallePactos.context";
import { ReportProvider } from "./contexts/Report.context";
import PrivateRouteValidation from "./routes/PrivateRoute";

function AppRoutes() {
  const location = useLocation();

  const renderRoute = (route: any) => {
    // Si la ruta tiene hijos (children)
    if (route.children) {
      return (
        <Route key={route.path} path={route.path} element={route.element}>
          {route.children.map((child: any) => {
            // Si la ruta hija tiene roles válidos, envuelve con PrivateRouteValidation
            if (child.valid && child.valid.roles) {
              return (
                <Route
                  key={child.path}
                  path={child.path}
                  element={
                    <PrivateRouteValidation validRoles={child.valid.roles}>
                      {child.element}
                    </PrivateRouteValidation>
                  }
                />
              );
            }
            // Si no, solo renderiza normalmente
            return (
              <Route key={child.path} path={child.path} element={child.element} />
            );
          })}
        </Route>
      );
    }
    // Para rutas sin hijos, igual verifica roles
    if (route.valid && route.valid.roles) {
      return (
        <Route
          key={route.path}
          path={route.path}
          element={
            <PrivateRouteValidation validRoles={route.valid.roles}>
              {route.element}
            </PrivateRouteValidation>
          }
        />
      );
    }
    return (
      <Route
        key={route.path}
        path={route.path}
        element={route.element}
      />
    );
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {routes.map(renderRoute)}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <PactProvider>
          <KardexProvider>
            <CategoryProvider>
              <SubcategoryProvider>
              <ProductProvider>
                <SupplierProvider>
                  <RoleProvider>
                    <EmployeProvider>
                      <VendedorProvider>
                        <DirectionProvider>
                        <SubdireccionProvider>  
                          <UnitProvider>
                            <ShoppingProvider>
                              <ProductRequisitionProvider>
                                <RequisicionProvider>
                                  <BitacoraProvider>
                                    <SolicitudComprasProvider>
                                      <DetallePactosProvider>
                                        <ReportProvider>
                                          <Router>
                                            <AppRoutes />
                                          </Router>
                                        </ReportProvider>
                                      </DetallePactosProvider>
                                    </SolicitudComprasProvider>
                                  </BitacoraProvider>
                                </RequisicionProvider>
                              </ProductRequisitionProvider>
                            </ShoppingProvider>
                          </UnitProvider>
                        </SubdireccionProvider>
                        </DirectionProvider>
                      </VendedorProvider>
                    </EmployeProvider>
                  </RoleProvider>
                  </SupplierProvider>
                </ProductProvider>
              </SubcategoryProvider>
            </CategoryProvider>
          </KardexProvider>
        </PactProvider>
      </UserProvider>
    </AuthProvider>
  );
}
