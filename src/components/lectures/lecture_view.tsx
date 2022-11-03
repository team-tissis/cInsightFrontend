import { Space, Tag, TagProps } from "antd";
import { Lecture, LectureStatus } from "entities/lecture";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import moment from "moment";

export const LectureStatusView = (lecture: Lecture) => {
  const tagProps: TagProps = {};

  switch (getLectureStatus(lecture)) {
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

export const LectureTagsView = (lecture?: Lecture) => {
  return !lecture?.tags?.length ? (
    "--"
  ) : (
    <Space size={1}>
      {lecture.tags?.map((t, i) => (
        <Tag key={i}>{t}</Tag>
      ))}
    </Space>
  );
};

export const getLectureStatus = (lecture: Lecture): LectureStatus => {
  const now = moment();
  const start = moment(lecture.fromDate);
  const end = moment(lecture.toDate);
  if (now < start) return "Not Started";
  else if (start <= now && now <= end) return "Held Now";
  else return "End";
};
