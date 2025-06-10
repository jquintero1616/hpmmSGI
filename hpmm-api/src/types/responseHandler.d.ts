import { Response } from 'express';
import { Contact } from './contacts';

export interface PayloadHandler {
  status: number;
  payload: any[] | any;
  entityName: ENTITY_NAME;
  res: Response;
  operationType: OPERATION_TYPE;
}
