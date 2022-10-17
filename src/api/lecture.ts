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
import { Lecture, LectureSearchForm } from "entities/lecture";
import { CookieManager } from "utils/cookie_manager";
import { lectureData } from "sample_data/lecture";

type LecturesResponse = PagingResponse & {
  results: Lecture[];
};

export function useFetchLecturesApi(
  searchForm: Form<LectureSearchForm>
): IndexApiSet<LecturesResponse> & { execute: () => void } {
  const apiPath = "lectures/";
  //   const perPage = CookieManager.getPerPage(apiPath);
  const api = useIndexApi<LecturesResponse>(new HttpClient(), {
    initialState: { page: 1, perPage: 50 },
    initialResponse: { count: 0, results: [] },
  });

  const execute = (): void => {
    // api.execute(apiPath, { params: searchForm.object });
    setTimeout(() => {}, 1000);
    api.setResponse({ results: lectureData, count: 50 });
  };

  useEffectSkipFirst(() => {
    searchForm.update((f) => {
      if (api.pageSet.page) f.page = api.pageSet.page;
      if (api.pageSet.perPage) f.perPage = api.pageSet.perPage;
    });
    // CookieManager.savePerPage("lectures", api.pageSet.perPage);
  }, [api.pageSet.page, api.pageSet.perPage]);

  useEffectSkipFirst(() => {
    execute();
  }, [searchForm.object]);

  return { ...api, execute: execute };
}

export type LectureResponse = BaseResponse & {
  lecture: Lecture;
};

export function useFetchLectureApi(): ApiSet<LectureResponse> & {
  execute: (id: number) => void;
} {
  const api = useShowApi<LectureResponse>(new HttpClient(), {
    initialResponse: { lecture: {} },
  });

  const execute = (id: number): void => {
    // const apiPath = `lectures/${id}/`;
    // api.execute(apiPath);
    api.setResponse({
      lecture: lectureData.find((l) => Number(l.id) === id) ?? {},
    });
  };

  return { ...api, execute: execute };
}
