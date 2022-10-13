import { useState, ReactNode, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
import { CookieManager } from "../utils/cookie_manager";
import { AppRouteHelper } from "../routes/app";
import { useFetchLoginUserApi, useFetchUsersApi } from "api/user";
import { GlobalStateContext } from "contexts/global_state_context";

type UserAuthProps = {
  children: ReactNode;
};

const UserAuth = ({ children }: UserAuthProps): JSX.Element => {
  const [isAuthenticated] = useState(CookieManager.hasUserToken());
  const fetchLoginUserApi = useFetchLoginUserApi();
  const userApi = useFetchUsersApi();
  const globalState = useContext(GlobalStateContext);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLoginUserApi.execute();
      userApi.execute();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (fetchLoginUserApi.isSuccess()) {
      globalState.setUser(fetchLoginUserApi.response.user);
    }
  }, [fetchLoginUserApi.loading]);

  return globalState.user.id && isAuthenticated ? (
    <>{children}</>
  ) : isAuthenticated ? (
    <div></div>
  ) : (
    <Redirect to={{ pathname: AppRouteHelper.login() }} />
  );
};

export default UserAuth;
