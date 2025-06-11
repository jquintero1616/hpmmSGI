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

function AppRoutes() {
  const location = useLocation();

  const renderRoute = (route: any) => {
    if (route.children) {
      return (
        <Route key={route.path} path={route.path} element={route.element}>
          {route.children.map((child: any) => (
            <Route key={child.path} path={child.path} element={child.element} />
          ))}
        </Route>
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
                                  <Router>
                                    <AppRoutes />
                                  </Router>
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
