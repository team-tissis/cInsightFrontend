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
import { Lecture, LectureForm, LectureSearchForm } from "entities/lecture";
import { CookieManager } from "utils/cookie_manager";
import { comments, lectureData } from "sample_data/lecture";
import { sleep } from "utils/util";
import { message, notification } from "antd";

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

    sleep(
      1,
      () => {
        api.setLoading(true);
      },
      () => {
        const results = CookieManager.getLecturesData();
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
    // CookieManager.savePerPage("lectures", api.pageSet.perPage);
  }, [api.pageSet.page, api.pageSet.perPage]);

  return {
    ...api,
    isSuccess: () => !api.loading && !api.isError,
    execute: execute,
  };
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
    sleep(
      0.5,
      () => {
        api.setLoading(true);
      },
      () => {
        const lectures = CookieManager.getLecturesData();
        api.setResponse({
          lecture:
            {
              ...lectures.find((l) => Number(l.id) === id),
              comments: comments,
            } ?? {},
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

export function usePostLectureApi(): ApiSet<BaseResponse> & {
  execute: (form: Form<LectureForm>) => void;
} {
  const api = usePostApi<BaseResponse, LectureForm>(
    new HttpClient(),
    {
      initialResponse: {},
    },
    { formatJson: true }
  );

  const execute = (form: Form<LectureForm>) => {
    // const apiPath = `lectures/`;
    // api.execute(apiPath, form);
    sleep(
      0.5,
      () => {
        api.setLoading(true);
      },
      () => {
        const lectures = CookieManager.getLecturesData();
        const newId =
          lectures.length === 0
            ? "1"
            : String(Math.max(...lectures.map((l) => Number(l.id))) + 1);
        CookieManager.saveLecturesData([
          ...lectures,
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

export function usePutLectureApi(): ApiSet<BaseResponse> & {
  execute: (object: Lecture) => void;
} {
  const api = usePutApi<BaseResponse, LectureForm>(
    new HttpClient(),
    {
      initialResponse: {},
    },
    { formatJson: true }
  );

  const execute = (object: Lecture) => {
    // const apiPath = `lectures/${object.id}/`;
    // api.execute(apiPath, object);
    sleep(
      0.5,
      () => {
        api.setLoading(true);
      },
      () => {
        const lectures = CookieManager.getLecturesData();
        CookieManager.saveLecturesData(
          lectures
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

export function useDeleteLectureApi(): ApiSet<BaseResponse> & {
  execute: (id: string) => void;
} {
  const api = useDeleteApi<BaseResponse>(new HttpClient(), {
    initialResponse: {},
  });

  const execute = (id: string): void => {
    // const apiPath = `comments/${id}/`;
    // api.execute(apiPath);
    sleep(
      1.5,
      () => {
        api.setLoading(true);
      },
      () => {
        const lectures = CookieManager.getLecturesData();
        const lecture = lectures.find((l) => l.id === id);
        CookieManager.saveLecturesData(lectures.filter((l) => l.id !== id));
        !!lecture &&
          notification.open({ message: `${lecture.name}を削除しました` });
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
