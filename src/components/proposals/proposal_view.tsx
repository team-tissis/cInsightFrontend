import { Card, Progress, Space, Tag, TagProps } from "antd";
import { Proposal, ProposalStatus } from "entities/proposal";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { CSSProperties } from "styled-components";
import moment from "moment";
import { Flex } from "components/shared/flex";
import { useState } from "react";
import { ContentBlock } from "components/shared/content_block";

export const ProposalListView = (proposal: Proposal) => {
  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };
  return (
    <Card
      style={{
        backgroundColor: isHover ? "#fafafa" : "#fff",
      }}
      onMouseOver={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Flex justifyContent="space-between">
        <Space>
          <div>#{proposal.web3Id}</div>
          <div>{proposal.title}</div>
        </Space>
        {ProposalStatusView(proposal)}
      </Flex>
    </Card>
  );
};

export const ProposalStatusView = (proposal: Proposal) => {
  switch (proposal.status as ProposalStatus) {
    case "Active":
      return <Tag color="success">{proposal.status}</Tag>;
    case "Canceled":
      return <Tag color="default">{proposal.status}</Tag>;
    case "Defeated":
      return <Tag color="error">{proposal.status}</Tag>;
    case "Executed":
      return <Tag color="processing">{proposal.status}</Tag>;
  }
};

export const ProposalVoteView = (proposal: Proposal) => {
  const forPercent = Math.round(
    (100 * (proposal.forCount ?? 0)) /
      (proposal.forCount! + proposal.againstCount! || 1)
  );
  const forColor = forPercent === 100 ? "#52c41a" : "#1890ff";

  return (
    <Space style={{ width: "100%" }}>
      <Progress
        width={200}
        percent={100}
        type="dashboard"
        status="exception"
        success={{ percent: forPercent, strokeColor: forColor }}
        format={(_) => (
          <Space direction="vertical">
            <Space style={{ alignItems: "center" }}>
              <div style={{ color: forColor }}>{proposal.forCount ?? 0}</div>
              <div style={{ color: "#000" }}>vs</div>
              <div>{proposal.againstCount ?? 0}</div>
            </Space>
            <div style={{ color: "#8c8c8c", fontSize: 20 }}>
              定足数: {proposal.quorum ?? 0}
            </div>
          </Space>
        )}
      />

      {/* <ContentBlock title="棄権">
              <Progress
                type="circle"
                status="normal"
                percent={80}
                strokeColor="#d9d9d9"
                format={(p) => `${p} vote`}
              />
            </ContentBlock> */}
    </Space>
  );
};
