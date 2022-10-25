import { CommentProps, Tooltip } from "antd";
import { Proposal, ProposalStatusList } from "entities/proposal";
import moment from "moment";

export const proposalData: Proposal[] = Array(5)
  .fill(0)
  .map((_, i) => ({
    id: String(i + 1),
    title: `Proposal${i + 1}`,
    status: ProposalStatusList[i % ProposalStatusList.length],
    endDate: "2022-11-01",
  }));
