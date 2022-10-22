import { Avatar, Col, Descriptions, Image, Row, Space } from "antd";
import { User } from "entities/user";

export const UserProfileView = (user: User) => {
  return (
    <Space size={20}>
      <Avatar size={128} src={<Image src={user.avatorUrl} />} />
      <Descriptions column={1} bordered>
        <Descriptions.Item label="名前">{user.firstName}</Descriptions.Item>
        <Descriptions.Item label="メール">{user.email}</Descriptions.Item>
      </Descriptions>
    </Space>
  );
};
