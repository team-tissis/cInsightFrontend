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
import * as H from "history";
import { useCheckHasSbtApi } from "api/meta_mask";
import { UserPage, UserPageContent } from "./user_page";
import { withRouter } from "react-router";

type Props = {
  history: H.History;
};

export const MyPage = (props: Props) => {
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
        <UserPageContent isMyPage />
      ) : (
        <MyPageWithoutSbt />
      )}
    </PageHeader>
  );
};

export default withRouter(MyPage);

const MyPageWithoutSbt = () => {
  const user: User = {
    avatorUrl: "https://joeschmoe.io/api/v1/random",
    firstName: "にしもと",
    mail: "shozemi.nishimotp@icloud.com",
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
