import {
  Button,
  Col,
  Form,
  PageHeader,
  Row,
  Skeleton,
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
import { useEffectSkipFirst, useForm } from "utils/hooks";
import * as H from "history";
import { useCheckHasSbtApi } from "api/meta_mask";
import { UserPage, UserPageContent } from "./user_page";
import { withRouter } from "react-router";
import { mint } from "api/fetch_sol/sbt";
import { fetchConnectedAccountInfo } from "api/fetch_sol/sbt";
import { getCurrentAccountAddress } from "api/fetch_sol/utils";
import { usePostUserApi } from "api/user";

type Props = {
  history: H.History;
};

export const MyPage = (props: Props) => {
  // const checkHasSbtApi = useCheckHasSbtApi();

  const [hasSbt, setHasSbt] = useState();
  useEffect(() => {
    (async function () {
      setHasSbt(await fetchConnectedAccountInfo("gradeOf"));
    })();
  }, []);

  // useEffect(() => {
  //   checkHasSbtApi.execute();
  // }, []);

  return (
    <PageHeader
      style={{
        width: "100%",
        backgroundColor: "inherit",
      }}
      title={"マイページ"}
    // extra={[
    //   <Form.Item label="SBT" key="switch has sbt flag">
    //     <Switch
    //       checkedChildren={"Exist"}
    //       unCheckedChildren={"Not Exist"}
    //       checked={checkHasSbtApi.response?.hasSbt}
    //       onChange={(hasSbt) => {
    //         checkHasSbtApi.setResponse({ hasSbt });
    //       }}
    //     />
    //   </Form.Item>,
    // ]}
    >
      {/* {checkHasSbtApi.response?.hasSbt ? ( */}
      {/* <Skeleton loading={hasSbt === undefined}> */}
      {hasSbt != 0 ? <UserPageContent isMyPage /> : <MyPageWithoutSbt />}
      {/* </Skeleton> */}
    </PageHeader>
  );
};

export default withRouter(MyPage);

const MyPageWithoutSbt = () => {
  const [openCreateUserSbtForm, setOpenCreateUserSbtForm] = useState(false);
  const createUserSbtForm = useForm<User>({});
  const [account, setAccount] = useState<string | undefined>(undefined);
  const postUserApi = usePostUserApi();

  useEffect(() => {
    (async () => setAccount(await getCurrentAccountAddress()))();
  }, []);

  useEffectSkipFirst(() => {
    if (createUserSbtForm.object.eoa) {
      postUserApi.execute(createUserSbtForm);
    }
  }, [createUserSbtForm.object.eoa]);

  return (
    <>
      <CreateUserSbtForm
        open={openCreateUserSbtForm}
        form={createUserSbtForm}
        onCancel={() => setOpenCreateUserSbtForm(false)}
        onOk={() => {
          console.log({ user: account });
          // postする処理
          try {
            mint(createUserSbtForm.object.referencerAddress);
            createUserSbtForm.updateObject("eoa", account);
          } catch (e) {
            console.error(e);
          }
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
