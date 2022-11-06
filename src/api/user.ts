import {
  ApiSet,
  BaseResponse,
  IndexApiSet,
  useDeleteApi,
  useDownloadApi,
  useIndexApi,
  useShowApi,
  usePostApi,
  usePutApi,
} from "utils/network/api_hooks";
import { Form, useEffectSkipFirst } from "utils/hooks";
import { HttpClient } from "../utils/network/axios";

import { User, UserForm, UserSearchForm } from "entities/user";
import { PagingResponse } from "entities";

export type UserResponse = BaseResponse & {
  user: User;
  count?: number;
};

export function useFetchUserApi(): ApiSet<UserResponse> & {
  execute: (id: number) => void;
} {
  const api = useShowApi<UserResponse>(new HttpClient(), {
    initialResponse: { user: {} },
  });

  const execute = (id: number): void => {
    const apiPath = `users/${id}/`;
    api.execute(apiPath);
  };

  return {
    ...api,
    isSuccess: () => !api.loading && !api.isError,
    execute: execute,
  };
}

export function useFetchUserByAccountAddressApi(): ApiSet<UserResponse> & {
  execute: (accountAddress: string) => void;
} {
  const api = useShowApi<UserResponse>(new HttpClient(), {
    initialResponse: { user: {} },
  });

  const execute = (accountAddress: string): void => {
    const apiPath = `users/fetch_by_account_address/`;
    api.execute(apiPath, { accountAddress });
  };

  return {
    ...api,
    isSuccess: () => !api.loading && !api.isError,
    execute: execute,
  };
}

type UsersResponse = PagingResponse & {
  results: User[];
};

export function useFetchUsersApi(
  searchForm?: Form<UserSearchForm>
): IndexApiSet<UsersResponse> & { execute: () => void } {
  const apiPath = "users/";
  const api = useIndexApi<UsersResponse>(new HttpClient(), {
    initialResponse: { count: 0, results: [] },
    initialState: {
      page: searchForm?.object?.page || 1,
      perPage: searchForm?.object?.perPage || 100000000,
    },
  });

  const execute = (): void => {
    api.execute(apiPath);
  };

  return { ...api, execute: execute };
}

export function useFetchLoginUserApi(): IndexApiSet<UserResponse> & {
  execute: () => void;
} {
  const apiPath = "users/login_user/";
  const api = useIndexApi<UserResponse>(new HttpClient(), {
    initialResponse: { count: 0, user: {} },
  });

  const execute = (): void => {
    api.execute(apiPath);
  };

  return { ...api, execute: execute };
}

export function usePostUserApi(): ApiSet<BaseResponse> & {
  execute: (form: Form<UserForm>) => void;
} {
  const api = usePostApi<BaseResponse, UserForm>(
    new HttpClient(),
    {
      initialResponse: {},
    },
    { formatJson: true }
  );

  const execute = (form: Form<UserForm>) => {
    const apiPath = `users/`;
    api.execute(apiPath, form);
  };

  return {
    ...api,
    isSuccess: () => !api.loading && !api.isError,
    execute: execute,
  };
}

export function usePutUserApi(): ApiSet<BaseResponse> & {
  execute: (object: User) => void;
} {
  const api = usePutApi<BaseResponse, UserForm>(
    new HttpClient(),
    {
      initialResponse: {},
    },
    { formatJson: true }
  );

  const execute = (object: User) => {
    const apiPath = `users/${object.id}/`;
    api.execute(apiPath, object);
  };

  return {
    ...api,
    isSuccess: () => !api.loading && !api.isError,
    execute: execute,
  };
}
