import { useContext } from "react";
import { ShoppingContext } from "../contexts/Shopping.context";


export const useShopping = () => {
  const {
    shopping,
    GetShoppingContext,
    GetShoppingByIdContext,
    PostShoppingContext,
    PutShoppingContext,
    DeleteShoppingContext
  } = useContext(ShoppingContext);

  if (
    !shopping ||
    !GetShoppingContext ||
    !GetShoppingByIdContext ||
    !PostShoppingContext ||
    !PutShoppingContext ||
    !DeleteShoppingContext
  ) {
    throw new Error(`useShopping must be used within a ShoppingProvider ${shopping}`);
  }

  return {
    shopping,
    GetShoppingContext,
    GetShoppingByIdContext,
    PostShoppingContext,
    PutShoppingContext,
    DeleteShoppingContext
  };
}