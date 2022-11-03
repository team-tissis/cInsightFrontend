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
import { withRouter } from "react-router";
import { useCheckHasSbtApi } from "api/meta_mask";
import { BooleanSwitchField } from "components/shared/input";
import {
  fetchConnectedAccountInfo,
  fetchMonthlyDistributedFavoNum,
} from "api/fetch_sol/sbt";

type UserPageProps = {
  history: H.History;
  isMyPage?: boolean;
};

export const UserPage = (props: UserPageProps): JSX.Element => {
  return (
    <PageHeader
      onBack={() => props.history.push("/users")}
      style={{
        width: "100%",
        backgroundColor: "inherit",
      }}
      title={"利用者"}
    >
      <UserPageContent />
    </PageHeader>
  );
};

type UserPageContentProps = {
  isMyPage?: boolean;
};

export const UserPageContent = (props: UserPageContentProps): JSX.Element => {
  const user: User = {
    avatorUrl: "https://joeschmoe.io/api/v1/random",
    firstName: "にしもと",
    mail: "shozemi.nishimotp@icloud.com",
  };
  const [openEditUserForm, setOpenEditUserForm] = useState(false);
  const editUserForm = useForm<User>(user);
  const [openReferalForm, setOpenRefaralForm] = useState(false);
  const referalForm = useForm<ReferalForm>({});

  const [favo, setFavo] = useState();
  const [grade, setGrade] = useState();
  const [makiMemory, setMakiMemory] = useState();
  const [referral, setReferral] = useState();
  const [monthlyDistributedFavoNum, setMonthlyDistributedFavoNum] = useState();

  useEffect(() => {
    (async function () {
      setFavo(await fetchConnectedAccountInfo("favoOf"));
      setGrade(await fetchConnectedAccountInfo("gradeOf"));
      setMakiMemory(await fetchConnectedAccountInfo("makiMemoryOf"));
      setReferral(await fetchConnectedAccountInfo("referralOf"));
      setMonthlyDistributedFavoNum(await fetchMonthlyDistributedFavoNum());
    })();
  }, []);

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
            extra: props.isMyPage && [
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
        <ContentBlock title="SBT INFO">
          <Row>
            <Col span={8}>
              <Statistic
                title="Grade"
                value={grade}
                valueStyle={{ color: "#3f8600" }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Current Rate"
                value={makiMemory}
                valueStyle={{ color: "#3f8600" }}
              />
              <div style={{ fontSize: 14, paddingTop: 10 }}>
                翌月にgradeに反映されます
              </div>
            </Col>
            <Col span={8}>
              <StatistcsLikeBlock title="今月のいいね付与数">
                <Space direction="vertical">
                  <Space style={{ alignItems: "center" }}>
                    <LikeOutlined
                      style={{
                        verticalAlign: 2,
                      }}
                    />
                    {favo} / {monthlyDistributedFavoNum}
                  </Space>
                </Space>
                <div style={{ fontSize: 14, paddingTop: 10 }}>
                  翌月にリセットされます
                </div>
              </StatistcsLikeBlock>
            </Col>
          </Row>
        </ContentBlock>
        {props.isMyPage && (
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
        )}
      </Space>
    </>
  );
};

export default withRouter(UserPage);
