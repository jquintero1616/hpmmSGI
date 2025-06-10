import { useContext } from "react";
import { UserContext } from "../contexts/User.context";

export const useUser = () => {
    const {
        users,
        GetUsersContext,
        PostCreateUserContext,
        DeleteUserContext,
        PutUpdateUserContext,
        
    } = useContext(UserContext);
    if (
      !users ||
      !GetUsersContext ||
      !PostCreateUserContext ||
      !DeleteUserContext ||
      !PutUpdateUserContext
    ) {
      throw new Error("useUser must be used within a UserProvider");
    }
    return {
        users,
        GetUsersContext,
        PostCreateUserContext,
        PutUpdateUserContext,
        DeleteUserContext
    };
};
