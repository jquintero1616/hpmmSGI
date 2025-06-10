import { useContext } from "react";
import { DirectionContext } from "../contexts/Direction.context";


export const useDirection = () => {
  const {
    directions,
    GetDirectionsContext,
    GetDirectionByIdContext,
    PostCreateDirectionContext,
    PutUpdateDirectionContext,
    DeleteDirectionContext
  } = useContext(DirectionContext);

  if (
    !directions ||
    !GetDirectionsContext ||
    !GetDirectionByIdContext ||
    !PostCreateDirectionContext ||
    !PutUpdateDirectionContext ||
    !DeleteDirectionContext
  ) {
    throw new Error(`useDirection must be used within a DirectionProvider ${directions}`);
  }

  return {
    directions,
    GetDirectionsContext,
    GetDirectionByIdContext,
    PostCreateDirectionContext,
    PutUpdateDirectionContext,
    DeleteDirectionContext
  };
}