import { BaseSearchForm } from "entities";
import { Transaction } from "./transaction";
import { User } from "./user";

export const ProposalStatusList = [
  "Active",
  "Canceled",
  "Defeated",
  "Executed",
] as const;

export type ProposalStatus = typeof ProposalStatusList[number];

export type Proposal = {
  id?: string;
  title?: string;

  transaction?: string;
  description?: string;
  quorum?: number; // threshold of votes
  proposedTransactions?: Transaction;
  createdAt?: string;
  updatedAt?: string;

  proposerEoa?: string;
  status?: ProposalStatus;
  snapshot?: number;
  endDate?: string;
  forCount?: number;
  againstCount?: number;
  targets?: string;
  values?: string;
  signatures?: string;
  datas?: string;
  datatypes?: string;
  calldatas?: string; // uniquely determined from datas and datatypes
};

export type ProposalSearchForm = BaseSearchForm & Proposal;

export type ProposalForm = Proposal;
