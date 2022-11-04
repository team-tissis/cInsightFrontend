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
import { CreateUserSbtForm, EditUserForm, ReferralForm } from "./user_form";
import { useForm } from "utils/hooks";
import * as H from "history";
import { withRouter } from "react-router";
import { useCheckHasSbtApi } from "api/meta_mask";
import {
  fetchConnectedAccountImageUrl,
  fetchConnectedAccountInfo,
  fetchConnectedAccountReferralNum,
  fetchMonthlyDistributedFavoNum,
  refer
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
    avatorUrl: "https://raw.githubusercontent.com/theChainInsight/theChainInsight.github.io/main/sbt/img/hackathondemo/1.gif",
    firstName: "hoge",
    mail: "hoge",
  };
  const [openEditUserForm, setOpenEditUserForm] = useState(false);
  const editUserForm = useForm<User>(user);
  const [openReferralForm, setOpenRefaralForm] = useState(false);
  const referralForm = useForm<ReferralForm>({});

  const [userState, setUserState] = useState<any>(); // errorハンドリング
  const [favo, setFavo] = useState();
  const [grade, setGrade] = useState();
  const [makiMemory, setMakiMemory] = useState();
  const [referral, setReferral] = useState();
  const [referralRemain, setReferralRemain] = useState();
  const [monthlyDistributedFavoNum, setMonthlyDistributedFavoNum] = useState();

  async function setUser() {
    const url = await fetchConnectedAccountImageUrl();
    const user: User = {
      avatorUrl: url,
      firstName: "hoge",
      mail: "",
    };
    console.log({ url: url });
    return user;
  }

  useEffect(() => {
    (async function () {
      // setUserState(await setUser());
      setFavo(await fetchConnectedAccountInfo("favoOf"));
      setGrade(await fetchConnectedAccountInfo("gradeOf"));
      setMakiMemory(await fetchConnectedAccountInfo("makiMemoryOf"));
      setReferral(await fetchConnectedAccountInfo("referralOf"));
      setReferralRemain(await fetchConnectedAccountReferralNum());
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
      <ReferralForm
        open={openReferralForm}
        form={referralForm}
        onCancel={() => setOpenRefaralForm(false)}
        onOk={() => {
          refer(referralForm.object.walletAddress);
          setOpenRefaralForm(false)
        }
        }
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
          {/* {UserProfileView(userState)} */}
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
            <StatistcsLikeBlock title="リファラル数（翌月にリセットされます）">
              {referral} / {referralRemain}
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
      </Space >
    </>
  );
};

export default withRouter(UserPage);
