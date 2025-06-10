import { useContext } from "react";
import { UnitContext } from "../contexts/Unit.context";


export const useUnit = () => {
  const {
    units,
    GetUnitsContext,
    GetUnitByIdContext,
    PostCreateUnitContext,
    PutUpdateUnitContext,
    DeleteUnitContext
  } = useContext(UnitContext);

  if (
    !units ||
    !GetUnitsContext ||
    !GetUnitByIdContext ||
    !PostCreateUnitContext ||
    !PutUpdateUnitContext ||
    !DeleteUnitContext
  ) {
    throw new Error("useUnit must be used within a UnitProvider");
  }

  return {
    units,
    GetUnitsContext,
    GetUnitByIdContext,
    PostCreateUnitContext,
    PutUpdateUnitContext,
    DeleteUnitContext
  };
}