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
  status?: ProposalStatus;
  proposedBy?: User;
  forUsers?: User[];
  againstUsers?: User[];
  threashold?: number; // threshold of votes
  endDate?: string;
  snapshot?: number;
  descriptions?: string;
  proposedTransactions?: Transaction;
};

export type ProposalSearchForm = BaseSearchForm & Proposal;

export type ProposalForm = Proposal;
