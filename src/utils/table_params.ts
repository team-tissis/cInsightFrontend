import { TablePaginationConfig } from "antd";
import { FilterValue } from "antd/lib/table/interface";

export type TableParams = {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue | null>;
};
