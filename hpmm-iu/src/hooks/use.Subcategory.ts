import {useContext} from 'react';
import {SubcategoryContext} from '../contexts/Subcategory.context';

export const useSubcategory = () => {
  const {
    subcategory,
    GetSubcategoriesContext,
    GetSubcategoryByIdContext,
    PostCreateSubcategoryContext,
    PutUpdateSubcategoryContext,
    DeleteSubcategoryContext
  } = useContext(SubcategoryContext);

  if (
    !subcategory ||
    !GetSubcategoriesContext ||
    !GetSubcategoryByIdContext ||
    !PostCreateSubcategoryContext ||
    !PutUpdateSubcategoryContext ||
    !DeleteSubcategoryContext
  ) {
    throw new Error(`useSubcategory must be used within a SubcategoryProvider ${subcategory}`);
  }

  return {
    subcategory,
    GetSubcategoriesContext,
    GetSubcategoryByIdContext,
    PostCreateSubcategoryContext,
    PutUpdateSubcategoryContext,
    DeleteSubcategoryContext
  };
};  