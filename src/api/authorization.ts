import { ApiSet, BaseResponse, usePostApi } from "utils/network/api_hooks";
import { Form } from "utils/hooks";
import { HttpClient } from "../utils/network/axios";

export type AuthorizationForm = {
  username: string;
  password: string;
};

type AuthorizationResponse = BaseResponse & {
  token: string;
};

/**
 * 認証Api
 */
export const useAuthorizationApi = (): ApiSet<AuthorizationResponse> & {
  execute: (form: Form<AuthorizationForm>) => void;
} => {
  const apiPath = "authorizations/";
  const apiSet = usePostApi<AuthorizationResponse, AuthorizationForm>(
    new HttpClient(),
    {
      initialResponse: { token: "" },
    }
  );

  const execute = (form: Form<AuthorizationForm>) => {
    apiSet.execute(apiPath, form);
  };

  return { ...apiSet, execute: execute };
};
