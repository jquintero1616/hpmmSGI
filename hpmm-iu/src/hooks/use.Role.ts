import {useContext} from 'react';
import {RoleContext} from '../contexts/Role.context';


export const useRole = () => {
  const {
    roles,
    GetRolesContext,
    GetRoleByIdContext,
    PostCreateRoleContext,
    PutUpdateRoleContext,
    DeleteRoleContext,
  } = useContext(RoleContext);

  if (
    !roles ||
    !GetRolesContext ||
    !GetRoleByIdContext ||
    !PostCreateRoleContext ||
    !PutUpdateRoleContext ||
    !DeleteRoleContext
  ) {
    throw new Error('useRole debe ser utilizado dentro de un RoleProvider');
  }

  return {
    roles,
    GetRolesContext,
    GetRoleByIdContext,
    PostCreateRoleContext,
    PutUpdateRoleContext,
    DeleteRoleContext,
  };
};