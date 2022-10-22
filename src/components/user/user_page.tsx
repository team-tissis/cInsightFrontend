import { Button, Col, PageHeader, Row, Space, Statistic } from "antd";
import { ContentBlock } from "components/shared/content_block";
import {
  LikeOutlined,
  ArrowUpOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import Countdown from "antd/lib/statistic/Countdown";
import { UserProfileView } from "./user_view";
import { User } from "entities/user";
import { StatistcsLikeBlock } from "components/shared/statistics_like_block";
import { useState } from "react";
import { EditUserForm } from "./user_form";
import { useForm } from "utils/hooks";

export const UserPage = () => {
  const user: User = {
    avatorUrl: "https://joeschmoe.io/api/v1/random",
    firstName: "にしもと",
    email: "shozemi.nishimotp@icloud.com",
  };
  const [openEditUserForm, setOpenEditUserForm] = useState(false);
  const editUserForm = useForm<User>(user);
  return (
    <PageHeader
      style={{
        width: "100%",
        backgroundColor: "inherit",
      }}
      title={"マイページ"}
    >
      <EditUserForm
        open={openEditUserForm}
        form={editUserForm}
        onCancel={() => setOpenEditUserForm(false)}
        onOk={() => setOpenEditUserForm(false)}
      />
      <Space size={20} direction="vertical" style={{ width: "100%" }}>
        <ContentBlock
          title="基本情報"
          pageHeaderProps={{
            extra: [
              <Button
                key={"edit user"}
                onClick={() => setOpenEditUserForm(true)}
              >
                編集
              </Button>,
            ],
          }}
        >
          {UserProfileView(user)}
        </ContentBlock>
        <ContentBlock title="統計情報">
          <Row>
            <Col span={8}>
              <StatistcsLikeBlock title="残いいね">
                <Space direction="vertical">
                  <Space style={{ alignItems: "center" }}>
                    <LikeOutlined
                      style={{
                        verticalAlign: 2,
                      }}
                    />
                    10
                  </Space>
                </Space>
                <div style={{ fontSize: 14, paddingTop: 10 }}>
                  次回、2022/11/01に、
                  <Space size={0}>
                    <LikeOutlined
                      style={{
                        verticalAlign: 2,
                      }}
                    />
                    +10
                  </Space>
                  付与
                </div>
              </StatistcsLikeBlock>
            </Col>
            <Col span={8}>
              <Statistic
                title="Rating"
                value={11.28}
                precision={2}
                valueStyle={{ color: "#3f8600" }}
                prefix={<ArrowUpOutlined />}
                suffix="%"
              />
            </Col>
          </Row>
        </ContentBlock>
      </Space>
    </PageHeader>
  );
};
