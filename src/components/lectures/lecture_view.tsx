import { Space, Tag, TagProps } from "antd";
import { Lecture } from "entities/lecture";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { CSSProperties } from "styled-components";

export const LectureStatusView = (lecture: Lecture) => {
  const tagProps: TagProps = {};
  switch (lecture.status) {
    case "Not Started":
      tagProps.color = "default";
      tagProps.icon = (
        <ClockCircleOutlined
          style={{
            verticalAlign: "middle",
          }}
        />
      );
      tagProps.children = "Not Started";
      break;
    case "Held Now":
      tagProps.color = "processing";
      tagProps.icon = (
        <SyncOutlined
          style={{
            verticalAlign: "middle",
          }}
          spin
        />
      );
      tagProps.children = "Held Now!";
      break;
    case "End":
      tagProps.color = "success";
      tagProps.icon = (
        <CheckCircleOutlined
          style={{
            verticalAlign: "middle",
          }}
        />
      );
      tagProps.children = "End";
      break;
  }
  return <Tag {...tagProps} />;
};

export const LectureTagsView = (lecture: Lecture) => {
  return (
    <Space size={1}>
      {lecture.tags?.map((t, i) => (
        <Tag key={i}>{t}</Tag>
      ))}
    </Space>
  );
};
