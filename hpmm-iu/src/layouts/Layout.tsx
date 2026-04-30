// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Footer } from "./Footer";
import { Sidebar } from "./SideBar";
import { UserProvider } from "../contexts/User.context";
import { PactProvider } from "../contexts/Pacts.context";
import { KardexProvider } from "../contexts/Kardex.context";
import { ProductProvider } from "../contexts/Product.context";
import { CategoryProvider } from "../contexts/Category.context";
import { SupplierProvider } from "../contexts/Supplier.context";
import { RoleProvider } from "../contexts/Role.context";
import { EmployeProvider } from "../contexts/Employes.context";
import { SubcategoryProvider } from "../contexts/Subcategory.context";
import { VendedorProvider } from "../contexts/Vendedor.context";
import { DirectionProvider } from "../contexts/Direction.context";
import { SubdireccionProvider } from "../contexts/Subdireccion.context";
import { UnitProvider } from "../contexts/Unit.context";
import { ShoppingProvider } from "../contexts/Shopping.context";
import { ProductRequisitionProvider } from "../contexts/Product_requisi.context";
import { RequisicionProvider } from "../contexts/Requisicion.contex";
import { BitacoraProvider } from "../contexts/Bitacora.context";
import { SolicitudComprasProvider } from "../contexts/SolicitudCompras.context";
import { DetallePactosProvider } from "../contexts/DetallePactos.context";
import { ReportProvider } from "../contexts/Report.context";
import { NotificacionProvider } from "../contexts/Notificacion.context";
import { DonanteProvider } from "../contexts/Donante.context";

export default function Layout() {
  return (
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
                                            <NotificacionProvider>
                                              <DonanteProvider>
                                                <div className="flex flex-col h-screen">
                                                  <Header />
                                                  <div className="flex flex-1 overflow-hidden">
                                                    <aside className="flex-shrink-0">
                                                      <Sidebar />
                                                    </aside>
                                                    <main className="flex-1 overflow-auto bg-gray-50 transition-all duration-300">
                                                      <Outlet />
                                                    </main>
                                                  </div>
                                                  <Footer />
                                                </div>
                                              </DonanteProvider>
                                            </NotificacionProvider>
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
  );
}
