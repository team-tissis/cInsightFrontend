import { BaseResponse } from "utils/network/api_hooks";

/**
 * IDのtype alias
 */
export type ID = number;

/**
 * Entityのベース
 */
export type BaseEntity = {
  id?: ID;
  createdAt?: string;
  updatedAt?: string;
};

export type FileAttachment = {
  name: string;
  url: string;
};

export type Truncate = "year" | "month" | "week" | "day";

export type GroupingSearchForm = {
  truncate?: Truncate;
  truncDateColumn?: string;
  truncDateColumnType?: "datetime" | "date";
  groupBy?: string;
  aggregate?: string; // example: 合計: Sum('price'), 集計: Count('id'), 計算: F(Max('price') - Min('price'))
  aggregateAlias?: string;
  groupOrdering?: string;
  groupingValues?: string;
};

export type BaseSearchForm = GroupingSearchForm & {
  ordering?: string;
  page?: number;
  perPage?: number;
};

/**
 * ページングされたレスポンス
 */
export type PagingResponse = BaseResponse & {
  count: number;
  next?: string;
  previous?: string;
};

export type Group = Record<string, any>;

export type GroupByResponse = BaseResponse & {
  groups: Record<string, any>[];
};

export type AggregateResponse = BaseResponse & {
  aggregate: Record<string, any>;
};
