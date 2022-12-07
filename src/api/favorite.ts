import {
    ApiSet,
    BaseResponse,
    useDeleteApi,
    useIndexApi,
    usePatchApi,
    usePostApi,
    usePutApi,
    useShowApi,
} from "utils/network/api_hooks";
import { Form, useEffectSkipFirst } from "utils/hooks";
import { HttpClient } from "../utils/network/axios";
import { FavoriteForm, Favorite } from "entities/favorite";

export function useCreateFavoriteApi(): ApiSet<BaseResponse> & {
    execute: (object: Form<Favorite>) => void;
  } {
    const api = usePostApi<BaseResponse, FavoriteForm>(
      new HttpClient(),
      {
        initialResponse: {},
      },
      { formatJson: true }
    );
  
    const execute = (object: Form<Favorite>) => {
      console.log("useCreateFavoriteApi execute...")
      const apiPath = `favorites/`;
      api.execute(apiPath, object);
    };
  
    return {
      ...api,
      isSuccess: () => !api.loading && !api.isError,
      execute: execute,
    };
}

export function useDeleteFavoriteApi(): ApiSet<BaseResponse> & {
    execute: (id: string) => void;
  } {
    const api = useDeleteApi<BaseResponse>(new HttpClient(), {
      initialResponse: {},
    });
  
    const execute = (id: string): void => {
      const apiPath = `favorites/${id}/`;
      api.execute(apiPath);
    };
  
    return {
      ...api,
      isSuccess: () => !api.loading && !api.isError,
      execute: execute,
    };
}
export {}
