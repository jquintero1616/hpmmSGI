import {useContext} from 'react';
import {DetallePactosContext} from '../contexts/DetallePactos.context';

export const useDetallePactos = () => {
  const {
    detallePactos,
    GetDetallePactosContext,
    GetDetallePactosByIdContext,
    PostCreateDetallePactosContext,
    PutUpdateDetallePactosContext,
    DeleteDetallePactosContext
  } = useContext(DetallePactosContext);

  if (
    !detallePactos ||
    !GetDetallePactosContext ||
    !GetDetallePactosByIdContext ||
    !PostCreateDetallePactosContext ||
    !PutUpdateDetallePactosContext ||
    !DeleteDetallePactosContext
  ) {
    throw new Error(`useDetallePactos must be used within a DetallePactosProvider ${detallePactos}`);
  }

  return {
    detallePactos,
    GetDetallePactosContext,
    GetDetallePactosByIdContext,
    PostCreateDetallePactosContext,
    PutUpdateDetallePactosContext,
    DeleteDetallePactosContext
  };
};