import {
  Avatar,
  Card,
  Col,
  Descriptions,
  Image,
  List,
  Row,
  Skeleton,
  Space,
} from "antd";
import SkeletonButton from "antd/lib/skeleton/Button";
import { User } from "entities/user";
import { useState } from "react";

export const UserProfileView = (user: User) => {
  return (
    <Space size={20}>
      <Avatar size={128} src={<Image src={user.avatorUrl} />} />
      <Descriptions column={1} bordered>
        <Descriptions.Item label="名前">{user.firstName}</Descriptions.Item>
        <Descriptions.Item label="メール">{user.mail}</Descriptions.Item>
      </Descriptions>
    </Space>
  );
};

export const UserListView = (user: User, loading = false) => {
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
      <Skeleton avatar title={false} loading={loading} active>
        <List.Item.Meta
          avatar={<Avatar src={user.avatorUrl} />}
          title={user.name}
          description={<div>token: {user.token}</div>}
        />
      </Skeleton>
    </Card>
  );
};
