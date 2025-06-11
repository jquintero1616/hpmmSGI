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
  GetRoleByIdContext: (id_role: string) => Promise<Role | undefined>;
  PostCreateRoleContext: (role: Role) => Promise<Role>;
  PutUpdateRoleContext: (id_role: string, role: Role) => Promise<void>;
  DeleteRoleContext: (id_role: string) => Promise<void>;
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

export interface ProviderProps {
  children: React.ReactNode;
}