import {
  Button,
  Col,
  Form,
  PageHeader,
  Row,
  Space,
  Statistic,
  Switch,
} from "antd";
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
import { useEffect, useState } from "react";
import { CreateUserSbtForm, EditUserForm, ReferalForm } from "./user_form";
import { useForm } from "utils/hooks";
import { useCheckHasSbtApi } from "api/meta_mask";
import { BooleanSwitchField } from "components/shared/input";

export const UserPage = () => {
  const checkHasSbtApi = useCheckHasSbtApi();

  useEffect(() => {
    checkHasSbtApi.execute();
  }, []);

  return (
    <PageHeader
      style={{
        width: "100%",
        backgroundColor: "inherit",
      }}
      title={"マイページ"}
      extra={[
        <Form.Item label="SBT" key="switch has sbt flag">
          <Switch
            checkedChildren={"Exist"}
            unCheckedChildren={"Not Exist"}
            checked={checkHasSbtApi.response?.hasSbt}
            onChange={(hasSbt) => {
              checkHasSbtApi.setResponse({ hasSbt });
            }}
          />
        </Form.Item>,
      ]}
    >
      {checkHasSbtApi.response?.hasSbt ? (
        <UserPageWithSbt />
      ) : (
        <UserPageWithoutSbt />
      )}
    </PageHeader>
  );
};

const UserPageWithSbt = () => {
  const user: User = {
    avatorUrl: "https://joeschmoe.io/api/v1/random",
    firstName: "にしもと",
    email: "shozemi.nishimotp@icloud.com",
  };
  const [openEditUserForm, setOpenEditUserForm] = useState(false);
  const editUserForm = useForm<User>(user);
  const [openReferalForm, setOpenRefaralForm] = useState(false);
  const referalForm = useForm<ReferalForm>({});
  return (
    <>
      <EditUserForm
        open={openEditUserForm}
        form={editUserForm}
        onCancel={() => setOpenEditUserForm(false)}
        onOk={() => setOpenEditUserForm(false)}
      />
      <ReferalForm
        open={openReferalForm}
        form={referalForm}
        onCancel={() => setOpenRefaralForm(false)}
        onOk={() => setOpenRefaralForm(false)}
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
        <ContentBlock title="リファラル">
          <StatistcsLikeBlock title="累計リファラル数">
            100人
          </StatistcsLikeBlock>
          <Button
            type="primary"
            style={{ marginTop: 20 }}
            onClick={() => {
              setOpenRefaralForm(true);
            }}
          >
            新規リファラル
          </Button>
        </ContentBlock>
      </Space>
    </>
  );
};

const UserPageWithoutSbt = () => {
  const user: User = {
    avatorUrl: "https://joeschmoe.io/api/v1/random",
    firstName: "にしもと",
    email: "shozemi.nishimotp@icloud.com",
  };
  const [openCreateUserSbtForm, setOpenCreateUserSbtForm] = useState(false);
  const editUserForm = useForm<User>(user);
  return (
    <>
      <CreateUserSbtForm
        open={openCreateUserSbtForm}
        form={editUserForm}
        onCancel={() => setOpenCreateUserSbtForm(false)}
        onOk={() => {
          // postする処理
          setOpenCreateUserSbtForm(false);
        }}
      />
      <Space size={20} direction="vertical" style={{ width: "100%" }}>
        <ContentBlock title="SBTの発行">
          <Button
            onClick={() => {
              setOpenCreateUserSbtForm(true);
            }}
            type="primary"
          >
            SBTを発行する
          </Button>
        </ContentBlock>
      </Space>
    </>
  );
};
