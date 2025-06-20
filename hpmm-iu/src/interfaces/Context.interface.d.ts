import { Users } from "./user.interface";
import { Pacts } from "./pacts.interface";
import { Kardex, KardexDetail } from "./kardex.interface";
import { Product } from "./product.interface";
import { Category} from "./Category.interface"
import { Supplier } from "./supplier.interface";
import { Role } from "./role.interface";
import { Employes } from "./employee.interface";
import { Vendedor } from "./vendedor.interface";
import { Subcategory } from "./subcategory.interface";
import { Subdireccion } from "./subdireccion.interface";
import { Unit } from "./unit.interface";
import { Direction} from "./direction.interface";
import { Shopping } from "./shopping.interface";
import { Requi_x_Product } from "./requi_x_product.interface";
import { Requisicion } from "./requisicion.interface";
import { Bitacora } from "./Bitacora.interface";
import { Scompras } from "./SolicitudCompras.inteface";
import { DetallePactos } from "./DetallePactos.interface";
import { Report} from "./Report.interface";


export interface AuthContextType {
  username?: string;
  idRol?: string;
  userId?: string;
  roleName?: string;
  employeName?: string;
  authenticate: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// USER CONTEXT TYPE USUARIOS
export interface UserContextType {
  users: User[];
  GetUsersContext: () => Promise<User[] | null>;
  GetUserByIdContext: (id_user: string) => Promise<User | undefined>;
  PostCreateUserContext: (user: NewUser) => Promise<User>;
  PutUpdateUserContext: (id_user: string, user: User) => Promise<void>;
  DeleteUserContext: (id_user: string) => Promise<void>;
}

export interface CategoryContextType {
  category: Category[];
  GetCategoriesContext: () => Promise<Category[] | null>;
  GetCategoryByIdContext: (id_category: string) => Promise<Category | undefined>;
  PostCreateCategoryContext: (category: Category) => Promise<Category>;
  PutUpdateCategoryContext: (id_category: string, category: Category) => Promise<void>;
  DeleteCategoryContext: (id_category: string) => Promise<void>;
}

// USER CONTEXT TYPE PACTOS
export interface PactContextType {
  pacts: Pacts[];
  GetPactsContext: () => Promise<Pacts[] | null>;
  GetPactByIdContext: (id_pacts: string) => Promise<Pacts | undefined>;
  PostCreatePactContext: (pact: Pacts) => Promise<Pacts>;
  PutUpdatePactContext: (id_pacts: string, pact: Pacts) => Promise<void>;
  DeletePactContext: (id_pacts: string) => Promise<void>;
}

// USER CONTEXT TYPE KARDEx
export interface KardexContextType {
  kardex: Kardex[];
  kardexDetail: KardexDetail[];
  GetKardexContext: () => Promise<Kardex[] | null>;
  GetKardexByIdContext: (id_kardex: string) => Promise<Kardex | undefined>;
  /// - GetKardexDetailsContext
  GetKardexDetailsContext: () => Promise<KardexDetail[] | null>;
  PostCreateKardexContext: (kardex: Kardex) => Promise<Kardex>;
  PutUpdateKardexContext: (id_kardex: string, kardex: Kardex) => Promise<void>;
  DeleteKardexContext: (id_kardex: string) => Promise<void>;
}

export interface ProductContextType {
  products: Product[];
  ProductDetail: ProductDetail[];
  GetProductDetailContext: () => Promise<ProductDetail[] | null>;
  GetProductsContext: () => Promise<Product[] | null>;
  GetProductByIdContext: (id_product: string) => Promise<Product | undefined>;
  PostCreateProductContext: (product: Product) => Promise<Product>;
  PutUpdateProductContext: (id_product: string, product: Product) => Promise<void>;
  DeleteProductContext: (id_product: string) => Promise<void>;
}

export interface SupplierContextType {
  suppliers: Supplier[];
  GetSuppliersContext: () => Promise<Supplier[] | null>;
  GetSupplierByIdContext: (id_supplier: string) => Promise<Supplier | undefined>;
  PostCreateSupplierContext: (supplier: Supplier) => Promise<Supplier>;
  PutUpdateSupplierContext: (id_supplier: string, supplier: Supplier) => Promise<void>;
  DeleteSupplierContext: (id_supplier: string) => Promise<void>;
} 

export interface RoleContextType {
  roles: Role[];
  GetRolesContext: () => Promise<Role[] | null>;
  GetRoleByIdContext: (id_rol: string) => Promise<Role | undefined>;
  PostCreateRoleContext: (role: Role) => Promise<Role>;
  PutUpdateRoleContext: (id_rol: string, role: Role) => Promise<void>;
  DeleteRoleContext: (id_rol: string) => Promise<void>;
}

export interface EmployeeContextType {
  employes: Employes[];
  GetEmployeContext: () => Promise<Employes[] | null>;
  GetEmployeByIdContext: (id_employee: string) => Promise<Employes | undefined>;
  PostCreateEmployeContext: (employee: Employes) => Promise<Employes>;
  PutUpdateEmployeContext: (id_employee: string, employee: Employes) => Promise<void>;
  DeleteEmployeContext: (id_employee: string) => Promise<void>;
}

export interface VendedorContextType {
  vendedor: Vendedor[];
  GetVendedorContext: () => Promise<Vendedor[] | null>;
  GetVendedorByIdContext: (id_vendedor: string) => Promise<Vendedor | undefined>;
  PostCreateVendedorContext: (Vendedor: Vendedor) => Promise<Vendedor>;
  PutUpdateVendedorContext: (id_vendedor: string, Vendedor: Vendedor) => Promise<void>;
  DeleteVendedorContext: (id_vendedor: string) => Promise<void>;
}

export interface SubcategoryContextType {
  subcategory: Subcategory[];
  GetSubcategoriesContext: () => Promise<Subcategory[] | null>;
  GetSubcategoryByIdContext: (id_subcategory: string) => Promise<Subcategory | undefined>;
  PostCreateSubcategoryContext: (subcategory: Subcategory) => Promise<Subcategory>;
  PutUpdateSubcategoryContext: (id_subcategory: string, subcategory: Subcategory) => Promise<void>;
  DeleteSubcategoryContext: (id_subcategory: string) => Promise<void>;
}

export interface SubdireccionContextType {
  subdireccion: Subdireccion[];
  GetSubdireccionesContext: () => Promise<Subdireccion[] | null>;
  GetSubdireccionByIdContext: (id_subdireccion: string) => Promise<Subdireccion | undefined>;
  PostCreateSubdireccionContext: (subdireccion: Subdireccion) => Promise<Subdireccion>;
  PutUpdateSubdireccionContext: (id_subdireccion: string, subdireccion: Subdireccion) => Promise<void>;
  DeleteSubdireccionContext: (id_subdireccion: string) => Promise<void>;
}

export interface UnitContextType {
  units: Unit[];
  GetUnitsContext: () => Promise<Unit[] | null>;
  GetUnitByIdContext: (id_unit: string) => Promise<Unit | undefined>;
  PostCreateUnitContext: (unit: Unit) => Promise<Unit>;
  PutUpdateUnitContext: (id_unit: string, unit: Unit) => Promise<void>;
  DeleteUnitContext: (id_unit: string) => Promise<void>;  
}

export interface DirectionContextType {
  directions: Direction[];
  GetDirectionsContext: () => Promise<Direction[] | null>;
  GetDirectionByIdContext: (id_direction: string) => Promise<Direction | undefined>;
  PostCreateDirectionContext: (direction: Direction) => Promise<Direction>;
  PutUpdateDirectionContext: (id_direction: string, direction: Direction) => Promise<void>;
  DeleteDirectionContext: (id_direction: string) => Promise<void>;
}

export interface ShoppingContextType {
  shopping: Shopping[];
  GetShoppingContext: () => Promise<Shopping[] | null>;
  GetShoppingByIdContext: (id_shopping: string) => Promise<Shopping | undefined>;
  PostShoppingContext: (shopping: Shopping) => Promise<Shopping>;
  PutShoppingContext: (id_shopping: string, shopping: Shopping) => Promise<void>;
  DeleteShoppingContext: (id_shopping: string) => Promise<void>;
}

export interface ProductRequisiContextType {
  productRequisition: Requi_x_Product[];
  GetRequiProductContext: () => Promise<Requi_x_Product[] | null>;
  GetRequiProductByIdContext: (id_requisi_x_product: string) => Promise<Requi_x_Product | undefined>;
  PostCreateProductRequisitionContext: (requiProduct: Requi_x_Product) => Promise<Requi_x_Product>;
  PutUpdateProductRequisitionContext: (id_requisi_x_product: string, requiProduct: Requi_x_Product) => Promise<void>;
  DeleteProductRequisitionContext: (id_requisi_x_product: string) => Promise<void>;
}

export interface RequisicionContextType {
  requisitions: Requisicion[];
  requisiDetail: RequisicionDetail[];
  GetRequisiDetailsContext: () => Promise<RequisicionDetail[] | null>;
  GetRequisicionesContext: () => Promise<Requisicion[] | null>;
  GetRequisicionByIdContext: (id_requisi: string) => Promise<Requisicion | undefined>;
  PostCreateRequisicionContext: (requisicion: Requisicion) => Promise<Requisicion>;
  PutUpdateRequisicionContext: (id_requisi: string, requisicion: Requisicion) => Promise<void>;
  DeleteRequisicionContext: (id_requisi: string) => Promise<void>;
}

export interface BitacoraContextType {
  bitacoras: Bitacora[];
  GetBitacorasContext: () => Promise<Bitacora[] | null>;
  GetBitacoraByIdContext: (id_bitacora: string) => Promise<Bitacora | undefined>;
}

export interface SolicitudComprasContextType {
  scompras: Scompras[];
  GetSolicitudesComprasContext: () => Promise<Scompras[] | null>;
  GetSolicitudCompraByIdContext: (id_scompra: string) => Promise<Scompras | undefined>;
  PostCreateSolicitudCompraContext: (scompra: Scompras) => Promise<Scompras>;
  PutUpdateSolicitudCompraContext: (id_scompra: string, scompra: Scompras) => Promise<void>;
  DeleteSolicitudCompraContext: (id_scompra: string) => Promise<void>;
}

export interface DetallePactosContextType {
  detallePactos: DetallePactos[];
  GetDetallePactosContext: () => Promise<DetallePactos[] | null>;
  GetDetallePactosByIdContext: (id: string) => Promise<DetallePactos | undefined>;
  PostCreateDetallePactosContext: (detallePacto: DetallePactos) => Promise<void>;
  PutUpdateDetallePactosContext: (id: string, detallePacto: DetallePactos) => Promise<void>;
  DeleteDetallePactosContext: (id: string) => Promise<void>;
}

export interface ReportContextType {
  report: Report[];
  GetReportsContext: () => Promise<Report[] | null>;
  GetReportByIdContext: (id_report: string) => Promise<Report | undefined>;
  PostCreateReportContext: (report: Report) => Promise<Report>;
  PutUpdateReportContext: (id_report: string, report: Report) => Promise<void>;
  DeleteReportContext: (id_report: string) => Promise<void>;

}

export interface ProviderProps {
  children: React.ReactNode;
}