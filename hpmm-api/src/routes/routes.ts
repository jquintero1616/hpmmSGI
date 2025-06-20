// src/routes.ts
import { Router } from "express";
import * as UserControllers from "../controllers/user.controller";
import * as RolControllers from "../controllers/rol.controller";
import * as EmployesControllers from "../controllers/employes.controller";
import * as UnitsControllers from "../controllers/unit.controller";
import * as pactsController from "../controllers/pacts.controller";
import * as NotiControllers from "../controllers/noti.controller";
import * as RequisiControllers from "../controllers/requisi.controller";
import * as ScomprasControllers from "../controllers/scompras.controller";
import * as UnitsPactsControllers from "../controllers/units_x_pacts.controller";
import * as ShoppingControllers from "../controllers/shopping.controller";
import * as SupplierControllers from "../controllers/supplier.controller";
import * as CategoryControllers from "../controllers/category.controller";
import * as SubcategoryControllers from "../controllers/subcategory.controller";
import * as KardexControllers from "../controllers/kardex.controller";
import * as ProductControllers from "../controllers/product.controller";
import * as VendedorControllers from "../controllers/vendedor.controller";
import * as SubdireccionControllers from "../controllers/subdireccion.controller";
import * as RequiXproductControllers from "../controllers/requisi.x.product.controller";
import * as DirectionControllers from "../controllers/direction.controller";
import * as BitacoraControllers from "../controllers/bitacora.controller";
import * as ReportControllers from "../controllers/report.controller";

import * as AuthControllers from "../controllers/auth.controller";

//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
// intercepttor de bitacora
import { bitacoraInterceptor } from "../middlewares/bitacora.middleware";
import { pagination } from "../middlewares/pagination.middleware";
import { bitOpts } from "../config/bitacora.config";
import { authenticateSession } from "../middlewares/auth.middleware";

const router = Router(); //


router.get(
  "/reports/stock-bajo",
  authenticateSession,
  bitacoraInterceptor(bitOpts.reports),
  ReportControllers.getProductosStockBajoController
);
router.get(
  "/reports",
  authenticateSession,
  bitacoraInterceptor(bitOpts.reports),
  ReportControllers.getAllReportsController
);
router.get(
  "/reports/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.reports),
  ReportControllers.getReportByIdController
);
router.post(
  "/reports",
  authenticateSession,
  bitacoraInterceptor(bitOpts.reports),
  ReportControllers.createReportController
);
router.put(
  "/reports/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.reports),
  ReportControllers.updateReportController
);
router.delete(
  "/reports/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.reports), 
  ReportControllers.deleteReportController
);

// Create router users
router.get(
  "/users",
  authenticateSession,
  bitacoraInterceptor(bitOpts.users),
  UserControllers.fetchAllUsersController
);
router.get(
  "/users/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.users),
  UserControllers.fetchUserByIdController
);
router.post(
  "/users",
  authenticateSession,
  bitacoraInterceptor(bitOpts.users),
  UserControllers.registerUserController
);
router.put(
  "/users/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.users),
  UserControllers.editUserController
);
router.delete(
  "/users/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.users),
  UserControllers.removeUserController
);

// Create router roles
router.get(
  "/roles",
  authenticateSession,
  bitacoraInterceptor(bitOpts.roles),
  RolControllers.getAllController
);
router.get(
  "/roles/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.roles),
  RolControllers.getByIdController
);
router.post(
  "/roles",
  authenticateSession,
  bitacoraInterceptor(bitOpts.roles),
  RolControllers.registerRolesController
);
router.put(
  "/roles/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.roles),
  RolControllers.editRolController
);
router.delete(
  "/roles/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.roles),
  RolControllers.deleteRolController
);

// Create router employes
router.get(
  "/employes",
  authenticateSession,
  bitacoraInterceptor(bitOpts.employes),
  EmployesControllers.getAllController
);
router.get(
  "/employes/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.employes),
  EmployesControllers.getByIdController
);
router.post(
  "/employes",
  authenticateSession,
  bitacoraInterceptor(bitOpts.employes),
  EmployesControllers.registerEmployesController
);
router.put(
  "/employes/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.employes),
  EmployesControllers.UpdateEmployeController
);
router.delete(
  "/employes/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.employes),
  EmployesControllers.deleteEmployeController
);

// Create router units
router.get(
  "/units",
  authenticateSession,
  bitacoraInterceptor(bitOpts.units),
  UnitsControllers.getAllUnitsController
);
router.get(
  "/units/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.units),
  UnitsControllers.getUnitByIdController
);
router.post(
  "/units",
  authenticateSession,
  bitacoraInterceptor(bitOpts.units),
  UnitsControllers.registerUnitController
);
router.put(
  "/units/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.units),
  UnitsControllers.editUnitController
);
router.delete(
  "/units/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.units),
  UnitsControllers.deleteUnitController
);

// create routers pacts

router.get(
  "/pacts",
  authenticateSession,
  bitacoraInterceptor(bitOpts.pacts),
  pactsController.getAllPactsController
);
router.get(
  "/pacts/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.pacts),
  pactsController.getPactByIdController
);
router.post(
  "/pacts",
  authenticateSession,
  bitacoraInterceptor(bitOpts.pacts),
  pactsController.createPactController
);
router.put(
  "/pacts/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.pacts),
  pactsController.updatePactController
);
router.delete(
  "/pacts/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.pacts),
  pactsController.deletePactController
);

// create router noti

router.get(
  "/noti",
  authenticateSession,
  bitacoraInterceptor(bitOpts.noti),
  NotiControllers.getAllNotiController
);
router.get(
  "/noti/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.noti),
  NotiControllers.getNotiByIdController
);
router.post(
  "/noti",
  authenticateSession,
  bitacoraInterceptor(bitOpts.noti),
  NotiControllers.createNotiController
);
router.put(
  "/noti/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.noti),
  NotiControllers.updateNotiController
);
router.delete(
  "/noti/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.noti),
  NotiControllers.deleteNotiController
);

// create router requisi

router.get(
  "/requisi/detail",
  authenticateSession,
  pagination(20, 100),
  RequisiControllers.getRequisiDetailsController
);
router.get(
  "/requisi",
  authenticateSession,
  bitacoraInterceptor(bitOpts.requisi),
  RequisiControllers.getAllRequisiController
);
router.get(
  "/requisi/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.requisi),
  RequisiControllers.getRequisiByController
);
router.post(
  "/requisi",
  authenticateSession,
  bitacoraInterceptor(bitOpts.requisi),
  RequisiControllers.createRequisiController
);
router.put(
  "/requisi/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.requisi),
  RequisiControllers.UpdateRequisiController
);
//router.delete("/requisi/:id", bitacoraInterceptor(bitOpts.requisi),RequisiControllers.deleteRequisiController);

// create router scompras
router.get(
  "/scompras",
  authenticateSession,
  bitacoraInterceptor(bitOpts.scompras),
  ScomprasControllers.getAllScomprasController
);
router.get(
  "/scompras/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.scompras),
  ScomprasControllers.getScomprasByIDController
);
router.post(
  "/scompras",
  authenticateSession,
  bitacoraInterceptor(bitOpts.scompras),
  ScomprasControllers.createdScomprasController
);
router.put(
  "/scompras/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.scompras),
  ScomprasControllers.updateScompraController
);
router.delete(
  "/:id_scompras", 
  authenticateSession,
  bitacoraInterceptor(bitOpts.scompras),
  ScomprasControllers.deleteScomprasController
);

// create router units_pacts
router.get(
  "/unitPacts",
  authenticateSession,
  bitacoraInterceptor(bitOpts.units_x_pacts),
  UnitsPactsControllers.getAllController
);
router.get(
  "/unitPacts/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.units_x_pacts),
  UnitsPactsControllers.getByIdController
);
router.post(
  "/unitPacts",
  authenticateSession,
  bitacoraInterceptor(bitOpts.units_x_pacts),
  UnitsPactsControllers.registerUnitPactController
);
router.put(
  "/unitPacts/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.units_x_pacts),
  UnitsPactsControllers.editUnitPacts
);
router.delete(
  "/unitPacts/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.units_x_pacts),
  UnitsPactsControllers.deleteUnitPactController
);

// create router Shopping
router.get(
  "/shopping",
  authenticateSession,
  bitacoraInterceptor(bitOpts.shopping),
  ShoppingControllers.getAllShoppingController
);
router.get(
  "/shopping/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.shopping),
  ShoppingControllers.getByIdShoppingController
);
router.post(
  "/shopping",
  authenticateSession,
  bitacoraInterceptor(bitOpts.shopping),
  ShoppingControllers.createShoppingController
);
router.put(
  "/shopping/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.shopping),
  ShoppingControllers.UpdateShoppingController
);
router.delete(
  "/shopping/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.shopping),
  ShoppingControllers.deleteController
);

//create router vendedor

router.get(
  "/vendedor",
  authenticateSession,
  bitacoraInterceptor(bitOpts.vendedor),
  VendedorControllers.getAllVendedorController
);
router.get(
  "/vendedor/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.vendedor),
  VendedorControllers.getVendedorByIdController
);
router.post(
  "/vendedor",
  authenticateSession,
  bitacoraInterceptor(bitOpts.vendedor),
  VendedorControllers.createVendedorController
);
router.put(
  "/vendedor/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.vendedor),
  VendedorControllers.updateVendedorController
);
router.delete(
  "/vendedor/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.vendedor),
  VendedorControllers.deleteVendedorController
);

// create router supplier
router.get(
  "/supplier",
  authenticateSession,
  bitacoraInterceptor(bitOpts.supplier),
  SupplierControllers.getAllSuppliersController
);
router.get(
  "/supplier/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.supplier),
  SupplierControllers.getSuppliersByIdController
);
router.post(
  "/supplier",
  authenticateSession,
  bitacoraInterceptor(bitOpts.supplier),
  SupplierControllers.createSuppliersController
);
router.put(
  "/supplier/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.supplier),
  SupplierControllers.updateSuppliersController
);
router.delete(
  "/supplier/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.supplier),
  SupplierControllers.deleteSuppliersController
);
// create router category
router.get(
  "/category",
  authenticateSession,
  bitacoraInterceptor(bitOpts.category),
  CategoryControllers.getAllCategoryController
);
router.get(
  "/category/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.category),
  CategoryControllers.getCategoryByIdController
);
router.post(
  "/category",
  authenticateSession,
  bitacoraInterceptor(bitOpts.category),
  CategoryControllers.createCategoryController
);
router.put(
  "/category/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.category),
  CategoryControllers.updateCategoryController
);
router.delete(
  "/category/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.category),
  CategoryControllers.deleteCategoryController
);

// create router subcategory

router.get(
  "/subcategory",
  authenticateSession,
  bitacoraInterceptor(bitOpts.subcategory),
  SubcategoryControllers.getAllsubcategoryController
);
router.get(
  "/subcategory/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.subcategory),
  SubcategoryControllers.getsubcategoryByidcontroller
);
router.post(
  "/subcategory",
  authenticateSession,
  bitacoraInterceptor(bitOpts.subcategory),
  SubcategoryControllers.createSubcategoryController
);
router.put(
  "/subcategory/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.subcategory),
  SubcategoryControllers.updateSubcategoryController
);
router.delete(
  "/subcategory/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.subcategory),
  SubcategoryControllers.deleteSubcategoryController
);

// create router Kardex

router.get(
  "/kardex/detail",
  authenticateSession,
  pagination(20, 100),
  KardexControllers.getKardexDetailsController
);
router.get(
  "/kardex",
  authenticateSession,
  bitacoraInterceptor(bitOpts.kardex),
  KardexControllers.getAllKardexController
);
router.get(
  "/kardex/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.kardex),
  KardexControllers.getByIdController
);
router.post(
  "/kardex",
  authenticateSession,
  bitacoraInterceptor(bitOpts.kardex),
  KardexControllers.createKardexController
);
router.put(
  "/kardex/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.kardex),
  KardexControllers.updateKardexController
);
router.delete(
  "/kardex/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.kardex),
  KardexControllers.deleteKardexController
);

// create router Product

router.get(
  "/product/detail",
  authenticateSession,
  pagination(20, 100),
  ProductControllers.getProductDetailsController
);
router.get(
  "/product",
  authenticateSession,
  bitacoraInterceptor(bitOpts.product),
  ProductControllers.getAllProductController
);
router.get(
  "/product/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.product),
  ProductControllers.getByIdProductoController
);
router.post(
  "/product",
  authenticateSession,
  bitacoraInterceptor(bitOpts.product),
  ProductControllers.createProductController
);
router.put(
  "/product/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.product),
  ProductControllers.updateProductController
);
router.delete(
  "/product/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.product),
  ProductControllers.deleteProductController
);

// create router subdireccion

router.get(
  "/subdireccion",
  authenticateSession,
  bitacoraInterceptor(bitOpts.subdireccion),
  SubdireccionControllers.getAllSubdireccionesController
);
router.get(
  "/subdireccion/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.subdireccion),
  SubdireccionControllers.getSubdireccionByIdController
);
router.post(
  "/subdireccion",
  authenticateSession,
  bitacoraInterceptor(bitOpts.subdireccion),
  SubdireccionControllers.CreateSubdireccionController
);
router.put(
  "/subdireccion/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.subdireccion),
  SubdireccionControllers.UpdateSubdireccionController
);
router.delete(
  "/subdireccion/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.subdireccion),
  SubdireccionControllers.deleteSubdireccionController
);

// create router requisicion y productos

router.get(
  "/requiXproduct",
  authenticateSession,
  bitacoraInterceptor(bitOpts.requiXproduct),
  RequiXproductControllers.getAllRequisiProductController
);
router.get(
  "/requiXproduct/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.requiXproduct),
  RequiXproductControllers.getByIdController
);
router.post(
  "/requiXproduct",
  authenticateSession,
  bitacoraInterceptor(bitOpts.requiXproduct),
  RequiXproductControllers.createRequisiProductController
);
router.put(
  "/requiXproduct/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.requiXproduct),
  RequiXproductControllers.UpdateRequisiProductController
);
//router.delete("/requiXproduct/:id",authenticateSession, bitacoraInterceptor(bitOpts.requiXproduct), RequiXproductControllers);

//create router direction
router.get(
  "/direction",
  authenticateSession,
  bitacoraInterceptor(bitOpts.direction),
  DirectionControllers.getAllDirectionController
);
router.get(
  "/direction/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.direction),
  DirectionControllers.getDirectionByIdController
);
router.post(
  "/direction",
  authenticateSession,
  bitacoraInterceptor(bitOpts.direction),
  DirectionControllers.CreateDirectionController
);
router.put(
  "/direction/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.direction),
  DirectionControllers.UpdateDirectionController
);
router.delete(
  "/direction/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.direction),
  DirectionControllers.deleteDirectionController
);

// create router Bitacora

router.get(
  "/bitacora",
  authenticateSession,
  bitacoraInterceptor(bitOpts.bitacora),
  BitacoraControllers.getAllBitacoraController
);
router.get(
  "/bitacora/:id",
  authenticateSession,
  bitacoraInterceptor(bitOpts.bitacora),
  BitacoraControllers.getBitacoraByIdController
);
/*router.post("/bitacora", authenticateSession, bitacoraInterceptor(bitOpts.bitacora),BitacoraControllers.createBitacoraController);
router.put("/bitacora/:id", authenticateSession, bitacoraInterceptor(bitOpts.bitacora),BitacoraControllers.UpdateBitacoraController);
router.delete("/bitacora/:id", authenticateSession, bitacoraInterceptor(bitOpts.bitacora),BitacoraControllers.deleteBitacoraController);
*/

export default router;
