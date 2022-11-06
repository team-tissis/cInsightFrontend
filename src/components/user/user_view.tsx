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
  Spin,
} from "antd";
import SkeletonButton from "antd/lib/skeleton/Button";
import { fetchAccountImageUrl } from "api/fetch_sol/sbt";
import { User } from "entities/user";
import { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";

export const UserProfileView = (user: User) => {
  return (
    <Space size={20}>
      {AvatorView(user.eoa, 180)}
      <Descriptions
        labelStyle={{ width: 140 }}
        style={{ minWidth: 400 }}
        column={1}
        bordered
      >
        <Descriptions.Item label="アカウント">{user.eoa}</Descriptions.Item>
        <Descriptions.Item label="名前">{user.name}</Descriptions.Item>
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
          avatar={AvatorView(user.eoa)}
          title={user.name}
          description={<div>token: {user.eoa}</div>}
        />
      </Skeleton>
    </Card>
  );
};

export const AvatorView = (address?: string, size?: number) => {
  const [src, setSrc] = useState<string | undefined>(address);
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  useEffect(() => {
    (async () => {
      // const srcResponse = await fetchAccountImageUrl(address);
      // setSrc(srcResponse);
      setSrc(
        "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
      );
    })();
  }, []);
  return src === undefined ? (
    <Spin indicator={antIcon} />
  ) : (
    <Avatar src={src} size={size} />
  );
};
