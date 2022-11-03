import {
  ApiSet,
  BaseResponse,
  IndexApiSet,
  useDeleteApi,
  useDownloadApi,
  useIndexApi,
  usePatchApi,
  usePostApi,
  usePutApi,
  useShowApi,
} from "utils/network/api_hooks";
import { Form, useEffectSkipFirst } from "utils/hooks";
import { HttpClient } from "../utils/network/axios";
import { PagingResponse } from "entities";
import { Proposal, ProposalForm, ProposalSearchForm } from "entities/proposal";
import { CookieManager } from "utils/cookie_manager";
import { proposalData } from "sample_data/proposal";
import { sleep } from "utils/util";
import { message, notification } from "antd";

type ProposalsResponse = PagingResponse & {
  results: Proposal[];
};

export function useFetchProposalsApi(
  searchForm: Form<ProposalSearchForm>
): IndexApiSet<ProposalsResponse> & { execute: () => void } {
  const apiPath = "proposals/";
  // const perPage = CookieManager.getPerPage(apiPath);
  const api = useIndexApi<ProposalsResponse>(new HttpClient(), {
    initialState: { page: 1, perPage: 50 },
    initialResponse: { count: 0, results: [] },
  });

  const execute = (): void => {
    api.execute(apiPath, { params: searchForm.object });
  };

  useEffectSkipFirst(() => {
    searchForm.update((f) => {
      if (api.pageSet.page) f.page = api.pageSet.page;
      if (api.pageSet.perPage) f.perPage = api.pageSet.perPage;
    });
  }, [api.pageSet.page, api.pageSet.perPage]);

  return {
    ...api,
    isSuccess: () => !api.loading && !api.isError,
    execute: execute,
  };
}

export type ProposalResponse = BaseResponse & {
  proposal: Proposal;
};

export function useFetchProposalApi(): ApiSet<ProposalResponse> & {
  execute: (id: number) => void;
} {
  const api = useShowApi<ProposalResponse>(new HttpClient(), {
    initialResponse: { proposal: {} },
  });

  const execute = (id: number): void => {
    const apiPath = `proposals/${id}/`;
    api.execute(apiPath);
  };

  return {
    ...api,
    isSuccess: () => !api.loading && !api.isError,
    execute: execute,
  };
}

export function usePostProposalApi(): ApiSet<BaseResponse> & {
  execute: (form: Form<ProposalForm>) => void;
} {
  const api = usePostApi<BaseResponse, ProposalForm>(
    new HttpClient(),
    {
      initialResponse: {},
    },
    { formatJson: true }
  );

  const execute = (form: Form<ProposalForm>) => {
    const apiPath = `proposals/`;
    api.execute(apiPath, form);
  };

  return {
    ...api,
    isSuccess: () => !api.loading && !api.isError,
    execute: execute,
  };
}

export function usePutProposalApi(): ApiSet<BaseResponse> & {
  execute: (object: Proposal) => void;
} {
  const api = usePutApi<BaseResponse, ProposalForm>(
    new HttpClient(),
    {
      initialResponse: {},
    },
    { formatJson: true }
  );

  const execute = (object: Proposal) => {
    const apiPath = `proposals/${object.id}/`;
    api.execute(apiPath, object);
  };

  return {
    ...api,
    isSuccess: () => !api.loading && !api.isError,
    execute: execute,
  };
}

export function useDeleteProposalApi(): ApiSet<BaseResponse> & {
  execute: (id: string) => void;
} {
  const api = useDeleteApi<BaseResponse>(new HttpClient(), {
    initialResponse: {},
  });

  const execute = (id: string): void => {
    const apiPath = `tags/${id}/`;
    api.execute(apiPath);
  };

  return {
    ...api,
    isSuccess: () => !api.loading && !api.isError,
    execute: execute,
  };
}
