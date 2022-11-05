import { useParams, withRouter } from "react-router";
import { QuestionCircleOutlined, StopOutlined } from "@ant-design/icons";

import * as H from "history";
import { Flex } from "components/shared/flex";
import { useContext, useEffect, useState } from "react";
import { useFetchProposalApi, usePutProposalApi } from "api/proposal";
import {
  Alert,
  Button,
  Card,
  Col,
  Comment,
  Descriptions,
  Form,
  Modal,
  ModalProps,
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
import { red, green, grey } from "@ant-design/colors";
import { ProposalStatusView, ProposalVoteView } from "./proposal_view";
import { SelectRadioField } from "components/shared/input";
const { Title, Paragraph, Text, Link } = Typography;

type Props = {
  history: H.History;
};

const ProposalPage = (props: Props) => {
  const params = useParams<{ id: string }>();
  const proposalApi = useFetchProposalApi();
  const globalState = useContext(GlobalStateContext);

  const [openEditProposalForm, setOpenEditProposalForm] = useState(false);
  const [openCancelConfirm, setOpenCancelConfirm] = useState(false);
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [applyStatus, setApplyStatus] = useState<
    "open" | "allplyed" | "closed"
  >("allplyed");
  const editProposalForm = useForm<Proposal>({
    proposerEoa: "nisshimo",
  });
  const putProposalApi = usePutProposalApi();

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
      tags={[ProposalStatusView(proposal()!)]}
      extra={[
        <Popconfirm
          key="delete confirm"
          title="この処理は取り消せません。本当にProposalをCancelしてもよろしいですか？"
          icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          open={openCancelConfirm}
          okButtonProps={{ danger: true }}
          okText="OK"
          cancelText="戻る"
          onConfirm={() => {
            putProposalApi.execute({ ...proposal(), status: "Canceled" });
          }}
          onCancel={() => setOpenCancelConfirm(false)}
        >
          <Button
            key={"proposal apply button"}
            type="primary"
            style={{ width: "100%" }}
            danger
            disabled={proposal()?.status !== "Active"}
            onClick={() => setOpenCancelConfirm(true)}
          >
            Cancel
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
    >
      <Space style={{ width: "100%" }} size={20} direction="vertical">
        <Space size={20}>
          <ContentBlock
            title="投票"
            style={{
              width: 268,
              minHeight: 344,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ padding: 10 }}>{ProposalVoteView(proposal()!)}</div>
              <Button
                size="large"
                type="primary"
                disabled={proposal()?.status !== "Active"}
                onClick={() => {
                  setVoteModalOpen(true);
                }}
              >
                投票
              </Button>
              <VoteModal
                proposal={proposal() ?? {}}
                title="投票"
                open={voteModalOpen}
                onCancel={() => setVoteModalOpen(false)}
              />
            </div>
          </ContentBlock>
          <ContentBlock
            style={{
              minHeight: 344,
              width: globalState.collapsed
                ? globalState.dimension.width - 128 - 248 - 40
                : globalState.dimension.width - 248 - 248 - 40,
            }}
            title="統計情報"
          >
            <Row>
              <Col span={12}>
                <StatistcsLikeBlock title="投票締切日">
                  {proposal()?.endDate}
                </StatistcsLikeBlock>
              </Col>
              <Col>
                <Countdown
                  title={`投票締め切りまで`}
                  value={proposal()?.endDate + " 23:59:59"}
                  format="D日H時間m分s秒"
                />
              </Col>
            </Row>
            <Row style={{ marginTop: 30 }}>
              <Col span={12}>
                <StatistcsLikeBlock title="トランザクション">
                  <div
                    style={{
                      fontSize: 20,
                      whiteSpace: "pre-line",
                      lineHeight: 1.2,
                    }}
                  >
                    {proposal()?.transaction}
                  </div>
                </StatistcsLikeBlock>
              </Col>
            </Row>
          </ContentBlock>
        </Space>
        <ContentBlock
          style={{
            width: "100%",
          }}
          title="提案内容の詳細"
        >
          <Typography>
            <Paragraph style={{ whiteSpace: "pre-line" }}>
              {proposal()?.description}
            </Paragraph>
          </Typography>
        </ContentBlock>
      </Space>
    </PageHeader>
  );
};

export default withRouter(ProposalPage);

type VoteModalProps = ModalProps & {
  proposal: Proposal;
};

const VoteModal = (props: VoteModalProps) => {
  type VoteForm = {
    proposal: Proposal;
    voteResult?: "for" | "against" | "abstention";
  };
  const voteForm = useForm<VoteForm>({
    proposal: props.proposal,
  });

  useEffect(() => {
    voteForm.updateObject("proposal", props.proposal);
  }, [JSON.stringify(props.proposal)]);
  return (
    <Modal {...props}>
      <Form>
        <SelectRadioField
          form={voteForm}
          attr="voteResult"
          direction="vertical"
          selectItems={[
            {
              label: "賛成",
              value: "for",
            },
            {
              label: "反対",
              value: "against",
            },
            {
              label: "棄権",
              value: "abstention",
            },
          ]}
        />
      </Form>
    </Modal>
  );
};
