import { useParams, withRouter } from "react-router";
import { QuestionCircleOutlined, StopOutlined } from "@ant-design/icons";

import * as H from "history";
import { Flex } from "components/shared/flex";
import { useContext, useEffect, useState } from "react";
import {
  useDeleteProposalApi,
  useFetchProposalApi,
  usePutProposalApi,
} from "api/proposal";
import { DiscussionList } from "components/discussion/discussion_list";
import {
  Alert,
  Button,
  Card,
  Col,
  Comment,
  Descriptions,
  notification,
  PageHeader,
  Popconfirm,
  Progress,
  Row,
  Skeleton,
  Space,
  Statistic,
  Tag,
  Typography,
} from "antd";
import { LikeOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { GlobalStateContext } from "contexts/global_state_context";
import { useEffectSkipFirst, useForm } from "utils/hooks";
import { ContentBlock } from "components/shared/content_block";

import Countdown from "antd/lib/statistic/Countdown";
import { Proposal } from "entities/proposal";
import moment from "moment";
import { StatistcsLikeBlock } from "components/shared/statistics_like_block";
import { sleep } from "utils/util";
import { EditProposalForm } from "./proposal_form";

type Props = {
  history: H.History;
};

const ProposalPage = (props: Props) => {
  const params = useParams<{ id: string }>();
  const proposalApi = useFetchProposalApi();
  const globalState = useContext(GlobalStateContext);

  const [openEditProposalForm, setOpenEditProposalForm] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [applyStatus, setApplyStatus] = useState<
    "open" | "allplyed" | "closed"
  >("allplyed");
  const editProposalForm = useForm<Proposal>({
    proposedBy: { token: "nisshimo" },
  });
  const putProposalApi = usePutProposalApi();
  const deleteProposalApi = useDeleteProposalApi();

  useEffect(() => {
    proposalApi.execute(Number(params.id));
  }, []);

  useEffectSkipFirst(() => {
    globalState.setLoading(proposalApi.loading);
  }, [proposalApi.loading]);

  useEffectSkipFirst(() => {
    globalState.setLoading(putProposalApi.loading);
    if (putProposalApi.isSuccess()) {
      proposalApi.execute(Number(params.id));
    }
  }, [putProposalApi.loading]);

  useEffectSkipFirst(() => {
    globalState.setLoading(deleteProposalApi.loading);
    if (deleteProposalApi.isSuccess()) {
      setOpenDeleteConfirm(false);
      proposalApi.execute(Number(params.id));
      props.history.push("/proposals");
    }
  }, [deleteProposalApi.loading]);

  const proposal = (): Proposal | undefined => {
    return proposalApi.response?.proposal;
  };

  const handleEditModalOpen = () => {
    setOpenEditProposalForm(true);
    editProposalForm.set(() => proposal() ?? {});
  };

  return (
    <PageHeader
      onBack={() => props.history.push("/proposals")}
      title={`Proposal ${proposal()?.id}: ${proposal()?.title}`}
      extra={[
        <Popconfirm
          key="delete confirm"
          title="この処理は取り消せません。本当に削除してもよろしいですか？"
          icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          open={openDeleteConfirm}
          onConfirm={() => {
            deleteProposalApi.execute(String(proposal()?.id));
          }}
          okButtonProps={{ loading: deleteProposalApi.loading }}
          onCancel={() => setOpenDeleteConfirm(false)}
        >
          <Button
            key={"proposal apply button"}
            type="primary"
            style={{ width: "100%" }}
            danger
            onClick={() => setOpenDeleteConfirm(true)}
          >
            削除
          </Button>
        </Popconfirm>,
        <Button
          key={"proposal apply button"}
          style={{ width: "100%" }}
          onClick={handleEditModalOpen}
        >
          編集
        </Button>,
        <EditProposalForm
          open={openEditProposalForm}
          onCancel={() => setOpenEditProposalForm(false)}
          onOk={() => {
            putProposalApi.execute(editProposalForm.object);
            setOpenEditProposalForm(false);
          }}
          key={"new proposal NewProposalForm"}
          form={editProposalForm}
        />,
      ]}
      // subTitle="This is a subtitle"
    ></PageHeader>
  );
};

export default withRouter(ProposalPage);
