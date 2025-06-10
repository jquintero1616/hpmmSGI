import { useContext } from "react"; 
import { EmployeeContext } from "../contexts/Employes.context";

export const useEmploye = () => {
  const {
    employes,
    GetEmployeContext,
    GetEmployeByIdContext,
    PostCreateEmployeContext,
    PutUpdateEmployeContext,
    DeleteEmployeContext,
  } = useContext(EmployeeContext);

  if (
    !employes ||
    !GetEmployeContext ||
    !GetEmployeByIdContext ||
    !PostCreateEmployeContext ||
    !PutUpdateEmployeContext ||
    !DeleteEmployeContext
  ) {
    throw new Error("useEmploye debe ser utilizado dentro de un EmployeProvider");
  }

  return {
    employes,
    GetEmployeContext,
    GetEmployeByIdContext,
    PostCreateEmployeContext,
    PutUpdateEmployeContext,
    DeleteEmployeContext,
  };
};  