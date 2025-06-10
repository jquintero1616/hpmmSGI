import { useContext } from "react";
import { CategoryContext } from "../contexts/Category.context";

export const useCategory = () => {
  const {
    category,
    GetCategoriesContext,
    GetCategoryByIdContext,
    PostCreateCategoryContext,
    PutUpdateCategoryContext,
    DeleteCategoryContext
  } = useContext(CategoryContext);
  if (
    !category ||
    !GetCategoriesContext ||
    !GetCategoryByIdContext ||
    !PostCreateCategoryContext ||
    !PutUpdateCategoryContext ||
    !DeleteCategoryContext
  ) {
    throw new Error("useCategory se usa dentro de un CategoryProvider");
  }
  return {
    category,
    GetCategoriesContext,
    GetCategoryByIdContext,
    PostCreateCategoryContext,
    PutUpdateCategoryContext,
    DeleteCategoryContext
  };
};
