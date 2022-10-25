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
  //   const perPage = CookieManager.getPerPage(apiPath);
  const api = useIndexApi<ProposalsResponse>(new HttpClient(), {
    initialState: { page: 1, perPage: 50 },
    initialResponse: { count: 0, results: [] },
  });

  const execute = (): void => {
    // api.execute(apiPath, { params: searchForm.object });

    sleep(
      1,
      () => {
        api.setLoading(true);
      },
      () => {
        const results = CookieManager.getProposalsData();
        api.setResponse({ results, count: 50 });
        api.setLoading(false);
      }
    );
  };

  useEffectSkipFirst(() => {
    searchForm.update((f) => {
      if (api.pageSet.page) f.page = api.pageSet.page;
      if (api.pageSet.perPage) f.perPage = api.pageSet.perPage;
    });
    // CookieManager.savePerPage("proposals", api.pageSet.perPage);
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
    // const apiPath = `proposals/${id}/`;
    // api.execute(apiPath);
    sleep(
      0.5,
      () => {
        api.setLoading(true);
      },
      () => {
        const proposals = CookieManager.getProposalsData();
        api.setResponse({
          proposal: proposals.find((l) => Number(l.id) === id) ?? {},
        });
        api.setLoading(false);
      }
    );
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
    // const apiPath = `proposals/`;
    // api.execute(apiPath, form);
    sleep(
      0.5,
      () => {
        api.setLoading(true);
      },
      () => {
        const proposals = CookieManager.getProposalsData();
        const newId =
          proposals.length === 0
            ? "1"
            : String(Math.max(...proposals.map((l) => Number(l.id))) + 1);
        CookieManager.saveProposalsData([
          ...proposals,
          { id: newId, ...form.object },
        ]);
        api.setLoading(false);
      }
    );
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
    // const apiPath = `proposals/${object.id}/`;
    // api.execute(apiPath, object);
    sleep(
      0.5,
      () => {
        api.setLoading(true);
      },
      () => {
        const proposals = CookieManager.getProposalsData();
        CookieManager.saveProposalsData(
          proposals
            .map((l) => (l.id !== object.id ? l : object))
            .map((l) => ({ ...l, comments: undefined }))
        );
        api.setLoading(false);
      }
    );
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
    // const apiPath = `tags/${id}/`;
    // api.execute(apiPath);
    sleep(
      1.5,
      () => {
        api.setLoading(true);
      },
      () => {
        const proposals = CookieManager.getProposalsData();
        const proposal = proposals.find((l) => l.id === id);
        CookieManager.saveProposalsData(proposals.filter((l) => l.id !== id));
        !!proposal &&
          notification.open({
            message: `(${proposal.id})を削除しました`,
          });
        api.setLoading(false);
      }
    );
  };

  return {
    ...api,
    isSuccess: () => !api.loading && !api.isError,
    execute: execute,
  };
}
