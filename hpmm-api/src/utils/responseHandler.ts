import { HTTP_STATUS } from '../constants/httpStatus';
import { PayloadHandler } from '../types/responseHandler';

export const responseHandler = (payloadHandler: PayloadHandler) => {
  const { res, status, payload, entityName, operationType } = payloadHandler;

  if (status === HTTP_STATUS.OK) {
    return res.status(status).send({
      msg: `Proceso de ${operationType} ejecutado correctamente, ${entityName}`,
      payload,
    });
  } else if (status === HTTP_STATUS.BAD_REQUEST) {
    return res.status(status).send({
      msg: `Error: Error al ejecutar el llamado con las variables.`,
      payload,
    });
  } else if (status === HTTP_STATUS.NOT_FOUND) {
    return res.status(status).send({
      msg: `No se encontro un registro de la propiedad ${entityName}`,
      payload,
    });
  } else if (status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    return res.status(status).send({
      msg: `Error: En el proceso de ${operationType} de la propiedad ${entityName}`,
      payload,
    });
  } else if (status === HTTP_STATUS.CONFLICT) {
    res.status(status).send({
      msg: `Error: Registro Duplicado en ${operationType} de la propiedad ${entityName}`,
      payload,
    });
  } else {
    res.status(status).send({
      msg: `Error: Desconocido en ${operationType} de la propiedad ${entityName}`,
      payload,
    });
  }
};
