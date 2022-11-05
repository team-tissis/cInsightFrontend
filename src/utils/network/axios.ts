import { CookieManager } from "../cookie_manager";
import { IHttpClient } from "./http_interface";
import FileSaver from "file-saver";

const fCamelToSnake = (p: string): string => {
  //大文字を_+小文字にする(例:A を _a)
  return (
    p.charAt(0).toLowerCase() +
    p
      .substr(1)
      .replace(/([A-Z])/g, (s: string) => "_" + s.charAt(0).toLowerCase())
  );
};

import axiosBase, { AxiosInstance } from "axios";
import isArray from "lodash.isarray";
import isObject from "lodash.isobject";
import camelCase from "lodash.camelcase";
const snakeCase = fCamelToSnake;
import mapValues from "lodash.mapvalues";
import mapKeys from "lodash.mapkeys";
import qs from "qs";
import moment from "moment";

const mapKeysDeep = (
  data: any,
  callback: (value: string, key: string) => void
): any => {
  if (isArray(data)) {
    return data.map((innerData: any) => mapKeysDeep(innerData, callback));
  } else if (isObject(data)) {
    return mapValues(mapKeys(data, callback), (val: any) =>
      mapKeysDeep(val, callback)
    );
  } else {
    return data;
  }
};

export const mapKeysCamelCase = (data: any) => {
  if (data instanceof Array) {
    return data.map((d) =>
      mapKeysDeep(d, (_: string, key: string) => camelCase(key))
    );
  } else {
    return mapKeysDeep(data, (_: string, key: string) => camelCase(key));
  }
};

export const mapKeysSnakeCase = (data: any) => {
  if (data instanceof Array) {
    return data.map((d) =>
      mapKeysDeep(d, (_: string, key: string) => snakeCase(key))
    );
  } else {
    return mapKeysDeep(data, (_: string, key: string) => snakeCase(key));
  }
};

/**
 * axiosは動的に取得する
 * TokenがCookieに無い場合、Tokenにundefinedがセットされた状態で初期化され、
 * ログイン後もそのaxiosが使われるためリロードしないとAuthエラーになりバグるため
 */
export const axios = (option?: {
  download?: boolean;
  formatJson?: boolean;
}): AxiosInstance => {
  const headers: { "Content-Type": string; Authorization?: string } = {
    "Content-Type": "application/json",
  };
  const token = process.env.REACT_APP_TOKEN;
  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }

  const base = axiosBase.create({
    baseURL: `${process.env.REACT_APP_API_HOST}/api/v1`,
    headers: headers,
    responseType: "json",
  });

  base.interceptors.request.use((request: any) => {
    if (request.method === "get" || option?.formatJson) {
      const convertParams = mapKeysSnakeCase(request.params);
      return {
        ...request,
        params: convertParams,
        data: mapKeysSnakeCase(request.data),
      };
    } else {
      return { ...request, data: objectToFormData(request.data) };
    }
  });
  if (!option?.download) {
    base.interceptors.response.use(
      (response: any) => {
        const { data } = response;
        const convertedData = mapKeysCamelCase(data);
        return { ...response, data: convertedData };
      },
      (error: any) => {
        const { data } = error.response;
        const convertData = mapKeysCamelCase(data);
        error.response.data = convertData;
        return Promise.reject(error);
      }
    );
  }
  return base;
};

type TokenResponse = {
  accessToken: string;
};

export const objectToFormData = (
  obj: any,
  form?: FormData,
  namespace?: string
): FormData => {
  const fd = form || new FormData();
  let formKey: string;

  for (const property in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(property)) {
      if (namespace) {
        formKey = snakeCase(namespace) + "[" + snakeCase(property) + "]";
      } else {
        formKey = snakeCase(property);
      }

      // if the property is an object, but not a File,
      // use recursivity.
      if (
        typeof obj[property] === "object" &&
        !(obj[property] instanceof File) &&
        !(obj[property] instanceof Array)
      ) {
        objectToFormData(obj[property], fd, property);
      } else if (obj[property] instanceof Array) {
        if (obj[property].length == 0) {
          fd.append(formKey + "[]", "");
        } else {
          obj[property].forEach((element: any) => {
            if (typeof element === "object") {
              objectToFormData(element, fd, formKey + "[]");
            } else {
              fd.append(formKey + "[]", element);
            }
          });
        }
      } else {
        // if it's a string or a File object
        if (obj[property] != undefined) {
          fd.append(formKey, obj[property]);
        }
      }
    }
  }

  return fd;
};
export class HttpClient implements IHttpClient {
  get: (path: string, params: unknown) => Promise<unknown> = (
    path: string,
    params: unknown
  ): Promise<unknown> => {
    const paramsSerializer = (p: unknown) =>
      qs.stringify(p, { arrayFormat: "brackets" });
    return axios().get(path, {
      params: params,
      paramsSerializer: paramsSerializer,
    });
  };

  post: (
    path: string,
    params: unknown,
    formatJson?: boolean
  ) => Promise<unknown> = (
    path: string,
    params: unknown,
    formatJson?: boolean
  ): Promise<unknown> => {
    return axios({ formatJson: formatJson }).post(path, params, {
      headers: {
        "Content-Type": formatJson
          ? "application/json"
          : "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      },
    });
  };

  put: (
    path: string,
    params: unknown,
    formatJson?: boolean
  ) => Promise<unknown> = async (
    path: string,
    params: unknown,
    formatJson?: boolean
  ): Promise<unknown> => {
    const response = await axios({ formatJson: formatJson }).put(path, params, {
      headers: {
        "Content-Type": formatJson
          ? "application/json"
          : "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      },
    });

    const mineType = response.headers["content-type"];
    if (
      mineType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      mineType === "text/csv"
    ) {
      const name = response.headers["content-disposition"];
      const blob = new Blob([response.data], { type: mineType });
      FileSaver.saveAs(blob, `${moment().format("YYYYMMDDhhmmss")}`);
    }
    return new Promise((resolve) => {
      resolve(response);
    });
  };

  patch: (
    path: string,
    params: unknown,
    formatJson?: boolean
  ) => Promise<unknown> = (
    path: string,
    params: unknown,
    formatJson?: boolean
  ): Promise<unknown> => {
    return axios({ formatJson: formatJson }).patch(path, params, {
      headers: {
        "Content-Type": formatJson
          ? "application/json"
          : "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      },
    });
  };

  delete: (path: string) => Promise<unknown> = (
    path: string
  ): Promise<unknown> => {
    return axios().delete(path);
  };

  download: (
    path: string,
    filename: string,
    params: unknown
  ) => Promise<unknown> = async (
    path: string,
    filename: string,
    params: unknown
  ): Promise<unknown> => {
    const paramsSerializer = (p: unknown) =>
      qs.stringify(p, { arrayFormat: "brackets" });
    const response = await axios({ download: true }).get(path, {
      params: params,
      paramsSerializer: paramsSerializer,
      responseType: "blob",
      headers: { Accept: "application/vnd.ms-excel" },
    });

    const mineType = response.headers["content-type"];
    const name = response.headers["content-disposition"];
    const blob = new Blob([response.data], { type: mineType });
    FileSaver.saveAs(blob, `${moment().format("YYYYMMDDhhmmss")}_${filename}`);
    return new Promise((resolve) => {
      resolve(response);
    });
  };
}
