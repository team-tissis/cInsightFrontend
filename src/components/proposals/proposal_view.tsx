import { Card, Space, Tag, TagProps } from "antd";
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
          <div>#{proposal.id}</div>
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
