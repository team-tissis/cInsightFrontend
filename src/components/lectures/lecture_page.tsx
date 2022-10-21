import { useParams, withRouter } from "react-router";
import { QuestionCircleOutlined } from "@ant-design/icons";

import * as H from "history";
import { Flex } from "components/shared/flex";
import { useContext, useEffect, useState } from "react";
import {
  useDeleteLectureApi,
  useFetchLectureApi,
  usePutLectureApi,
} from "api/lecture";
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
} from "antd";
import { LikeOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { GlobalStateContext } from "contexts/global_state_context";
import { useEffectSkipFirst, useForm } from "utils/hooks";
import { ContentBlock } from "components/shared/content_block";
import { LectureStatusView, LectureTagsView } from "./lecture_view";
import Countdown from "antd/lib/statistic/Countdown";
import { Lecture } from "entities/lecture";
import moment from "moment";
import { PurchaseMovieModal } from "components/purchase_movie_modal/purchase_movie_modal";
import { StatistcsLikeBlock } from "components/shared/statistics_like_block";
import { sleep } from "utils/util";
import { EditLectureForm } from "./lecture_form";

type Props = {
  history: H.History;
};

const LecturePage = (props: Props) => {
  const params = useParams<{ id: string }>();
  const lectureApi = useFetchLectureApi();
  const globalState = useContext(GlobalStateContext);
  const [movieVisible, setMovieVisible] = useState(false);
  const [openPurchaseModal, setOpenPurchaseModal] = useState(false);
  const [openEditLectureForm, setOpenEditLectureForm] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const editLectureForm = useForm<Lecture>({});
  const putLectureApi = usePutLectureApi();
  const deleteLectureApi = useDeleteLectureApi();

  useEffect(() => {
    lectureApi.execute(Number(params.id));
  }, []);

  useEffectSkipFirst(() => {
    globalState.setLoading(lectureApi.loading);
  }, [lectureApi.loading]);

  useEffectSkipFirst(() => {
    globalState.setLoading(putLectureApi.loading);
    if (putLectureApi.isSuccess()) {
      lectureApi.execute(Number(params.id));
    }
  }, [putLectureApi.loading]);

  useEffectSkipFirst(() => {
    globalState.setLoading(deleteLectureApi.loading);
    if (deleteLectureApi.isSuccess()) {
      setOpenDeleteConfirm(false);
      lectureApi.execute(Number(params.id));
      props.history.push("/lectures");
    }
  }, [deleteLectureApi.loading]);

  const lecture = (): Lecture | undefined => {
    return lectureApi.response?.lecture;
  };

  const handleEditModalOpen = () => {
    setOpenEditLectureForm(true);
    editLectureForm.set(() => lecture() ?? {});
  };

  return (
    <PageHeader
      onBack={() => props.history.push("/lectures")}
      title={lecture()?.name}
      tags={LectureStatusView(lecture() ?? {})}
      extra={[
        <Popconfirm
          key="delete confirm"
          title="この処理は取り消せません。本当に削除してもよろしいですか？"
          icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          open={openDeleteConfirm}
          onConfirm={() => {
            deleteLectureApi.execute(String(lecture()?.id));
          }}
          okButtonProps={{ loading: deleteLectureApi.loading }}
          onCancel={() => setOpenDeleteConfirm(false)}
        >
          <Button
            key={"lecture apply button"}
            type="primary"
            style={{ width: "100%" }}
            danger
            onClick={() => setOpenDeleteConfirm(true)}
          >
            削除
          </Button>
        </Popconfirm>,
        <Button
          key={"lecture apply button"}
          type="primary"
          style={{ width: "100%" }}
          onClick={handleEditModalOpen}
        >
          編集
        </Button>,
        <EditLectureForm
          open={openEditLectureForm}
          onCancel={() => setOpenEditLectureForm(false)}
          onOk={() => {
            putLectureApi.execute(editLectureForm.object);
            setOpenEditLectureForm(false);
          }}
          key={"new lecture NewLectureForm"}
          form={editLectureForm}
        />,
        <Button
          key={"lecture apply button"}
          type="primary"
          style={{ width: "100%" }}
        >
          この勉強会に応募する
        </Button>,
      ]}
      // subTitle="This is a subtitle"
    >
      <PurchaseMovieModal
        open={openPurchaseModal}
        onOk={() => {
          sleep(
            0.5,
            () => globalState.setLoading(true),
            () => {
              globalState.setLoading(false);
              setMovieVisible(true);
              setOpenPurchaseModal(false);
              notification.open({
                message: "勉強会の動画が解除されました！",
                icon: <UnlockOutlined style={{ color: "#108ee9" }} />,
                placement: "top",
              });
              lectureApi.execute(Number(params.id));
            }
          );
        }}
        onCancel={() => setOpenPurchaseModal(false)}
        lecture={lecture()}
      />
      <Space size={20} direction="vertical">
        {(() => {
          switch (lecture()?.status) {
            // case "Not Started":
            //   return (

            //   );
            case "Held Now":
              return (
                <Alert message="この勉強会はただいま開催中です。" type="info" />
              );
            case "End":
              return (
                <Alert message="この勉強会は終了しました。" type="success" />
              );

            default:
              break;
          }
        })()}
        <ContentBlock title="基本情報">
          <Descriptions>
            <Descriptions.Item label="主催者">
              {lecture()?.author?.firstName}
            </Descriptions.Item>
            <Descriptions.Item label="タグ">
              {LectureTagsView(lecture() ?? {})}
            </Descriptions.Item>
            <Descriptions.Item label="開催日">
              {moment(lecture()?.date).format("yyyy/MM/DD")}
            </Descriptions.Item>
            {/* <Descriptions.Item label="Remark">empty</Descriptions.Item>
            <Descriptions.Item label="Address">
              No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
            </Descriptions.Item> */}
            <Descriptions.Item span={3} label="資料URL">
              <a
                className="linked-text"
                href={lecture()?.materialUrl ?? ""}
                target="_blank"
                rel="noreferrer"
              >
                {lecture()?.materialUrl ?? ""}
              </a>
            </Descriptions.Item>
            <Descriptions.Item
              span={3}
              style={{ alignItems: "center" }}
              label="動画URL"
            >
              {movieVisible ? (
                <a
                  className="linked-text"
                  href={lecture()?.movieUrl ?? ""}
                  target="_blank"
                  rel="noreferrer"
                >
                  {lecture()?.movieUrl ?? ""}
                </a>
              ) : lecture()?.status === "End" ? (
                <Space style={{ alignItems: "center", paddingBottom: 10 }}>
                  <Button
                    type="primary"
                    size="small"
                    icon={
                      <LockOutlined
                        style={{
                          verticalAlign: "text-top",
                        }}
                      />
                    }
                    shape="round"
                    onClick={() => setOpenPurchaseModal(true)}
                  >
                    動画を解除する
                  </Button>
                </Space>
              ) : (
                "--"
              )}
            </Descriptions.Item>
          </Descriptions>
        </ContentBlock>
        <ContentBlock title="統計情報">
          <Row gutter={16} style={{ width: "100%" }}>
            <Col span={8}>
              <Statistic
                title="いいね"
                value={lecture()?.nLike ?? 0}
                prefix={
                  <LikeOutlined
                    style={{
                      verticalAlign: "middle",
                    }}
                  />
                }
              />
            </Col>
            <Col span={8}>
              <Space>
                <Statistic
                  title="参加人数/参加可能枠"
                  value={lecture()?.perticipants}
                  suffix={`/ ${lecture()?.maxPerticipants}`}
                />
              </Space>
            </Col>
            <Col span={8}>
              <Countdown
                title={`開催日まで`}
                value={lecture()?.date}
                format="D日H時間m分s秒"
              />
            </Col>
          </Row>
        </ContentBlock>
        <ContentBlock title="コメント">
          <DiscussionList data={lecture()?.comments ?? []} />
        </ContentBlock>
      </Space>
    </PageHeader>
  );
};

export default withRouter(LecturePage);
