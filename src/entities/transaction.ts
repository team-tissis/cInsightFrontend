import { BaseSearchForm } from "entities";
import { User } from "./user";

export type TransactionStatus = "Not Started" | "Held Now" | "End";

export type Transaction = {
  code?: string;
  url?: string;
};

export type TransactionSearchForm = BaseSearchForm & Transaction;

export type TransactionForm = Transaction;
