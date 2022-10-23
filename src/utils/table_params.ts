import { TablePaginationConfig } from "antd";
import {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from "antd/lib/table/interface";

export type TableParams<T> = {
  pagination?: TablePaginationConfig;
  filters?: Record<string, FilterValue | null>;
  sorter?: SorterResult<T> | SorterResult<T>[];
  extra?: TableCurrentDataSource<T>;
};
