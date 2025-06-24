import {useContext} from 'react';
import {RequisicionContext} from '../contexts/Requisicion.contex';

export const useRequisicion = () => {
  const {
    requisitions,
    requisiDetail,
    GetRequisicionesContext,
    GetRequisicionByIdContext,
    PostCreateRequisicionContext,
    PutUpdateRequisicionContext,
    DeleteRequisicionContext,
    GetRequisiDetailsContext
  } = useContext(RequisicionContext);

  if (
    !requisitions ||
    !requisiDetail ||
    !GetRequisicionesContext ||
    !GetRequisicionByIdContext ||
    !PostCreateRequisicionContext ||
    !PutUpdateRequisicionContext ||
    !DeleteRequisicionContext ||
    !GetRequisiDetailsContext
  ) {
    throw new Error('useRequisicion debe ser utilizado dentro de un RequisicionProvider');
  }

  return {
    requisitions,
    requisiDetail,
    GetRequisicionesContext,
    GetRequisicionByIdContext,
    PostCreateRequisicionContext,
    PutUpdateRequisicionContext,
    DeleteRequisicionContext,
    GetRequisiDetailsContext
  };
};