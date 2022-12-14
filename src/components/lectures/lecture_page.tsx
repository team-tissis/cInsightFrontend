import { useParams, withRouter } from "react-router";
import { QuestionCircleOutlined, StopOutlined } from "@ant-design/icons";

import * as H from "history";
import { Flex } from "components/shared/flex";
import { useContext, useEffect, useState } from "react";
import {
  useDeleteLectureApi,
  useFetchLectureApi,
  usePutLectureApi,
} from "api/lecture";
import { LectureCommetnsList } from "components/comments/comments";
import {
  Alert,
  Button,
  Card,
  Col,
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
import {
  getLectureStatus,
  LectureStatusView,
  LectureTagsView,
} from "./lecture_view";
import Countdown from "antd/lib/statistic/Countdown";
import { Lecture } from "entities/lecture";
import moment from "moment";
import { PurchaseMovieModal } from "components/purchase_movie_modal/purchase_movie_modal";
import { StatistcsLikeBlock } from "components/shared/statistics_like_block";
import { sleep } from "utils/util";
import { EditLectureForm } from "./lecture_form";
import { useFetchCommentsApi } from "api/comment";
import { CommentSearchForm } from "entities/comment";
import { addFavos } from "api/fetch_sol/sbt";

type Props = {
  history: H.History;
};

const LecturePage = (props: Props) => {
  const params = useParams<{ id: string }>();
  const lectureApi = useFetchLectureApi();
  const searchForm = useForm<CommentSearchForm>({});
  const globalState = useContext(GlobalStateContext);
  const [movieVisible, setMovieVisible] = useState(false);
  const [openPurchaseModal, setOpenPurchaseModal] = useState(false);
  const [openEditLectureForm, setOpenEditLectureForm] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [applyStatus, setApplyStatus] = useState<
    "open" | "allplyed" | "closed"
  >("allplyed");
  const editLectureForm = useForm<Lecture>({});
  const putLectureApi = usePutLectureApi();
  const deleteLectureApi = useDeleteLectureApi();

  useEffect(() => {
    lectureApi.execute(Number(params.id));
  }, []);

  useEffectSkipFirst(() => {
    globalState.setLoading(lectureApi.loading);
    if (lectureApi.isSuccess()) {
      console.log(lectureApi.response);
    }
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

  console.log(editLectureForm.object);

  return (
    <PageHeader
      onBack={() => props.history.push("/lectures")}
      title={lecture()?.name}
      tags={LectureStatusView(lecture() ?? {})}
      extra={[
        <Popconfirm
          key="delete confirm"
          title="???????????????????????????????????????????????????????????????????????????????????????"
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
            ??????
          </Button>
        </Popconfirm>,
        <Button
          key={"lecture apply button"}
          style={{ width: "100%" }}
          onClick={handleEditModalOpen}
        >
          ??????
        </Button>,
        <EditLectureForm
          open={openEditLectureForm}
          onCancel={() => setOpenEditLectureForm(false)}
          onOk={() => {
            console.log(editLectureForm.object);
            putLectureApi.execute(editLectureForm.object);
            setOpenEditLectureForm(false);
          }}
          key={"new lecture NewLectureForm"}
          form={editLectureForm}
        />,
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
                message: "?????????????????????????????????????????????",
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
          switch (getLectureStatus(lecture() ?? {})) {
            // case "Not Started":
            //   return (

            //   );
            case "Held Now":
              return (
                <Alert message="????????????????????????????????????????????????" type="info" />
              );
            case "End":
              return (
                <Alert message="???????????????????????????????????????" type="success" />
              );

            default:
              break;
          }
        })()}
        <ContentBlock title="????????????">
          <Descriptions column={2}>
            <Descriptions.Item label="?????????">
              {lecture()?.author?.firstName}
            </Descriptions.Item>
            <Descriptions.Item label="??????">
              {LectureTagsView(lecture() ?? {})}
            </Descriptions.Item>
            <Descriptions.Item label="????????????">
              {moment(lecture()?.fromDate).format("yyyy/MM/DD HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="????????????">
              {moment(lecture()?.toDate).format("yyyy/MM/DD HH:mm")}
            </Descriptions.Item>
            {/* <Descriptions.Item label="Remark">empty</Descriptions.Item>
            <Descriptions.Item label="Address">
              No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
            </Descriptions.Item> */}
            <Descriptions.Item span={3} label="??????URL">
              <a
                className={lecture()?.materialUrl && "linked-text"}
                href={lecture()?.materialUrl}
                target="_blank"
                rel="noreferrer"
              >
                {lecture()?.materialUrl ?? "--"}
              </a>
            </Descriptions.Item>
            <Descriptions.Item
              span={3}
              style={{ alignItems: "center" }}
              label="??????URL"
            >
              <a
                className={lecture()?.movieUrl && "linked-text"}
                href={lecture()?.movieUrl}
                target="_blank"
                rel="noreferrer"
              >
                {lecture()?.movieUrl ?? "--"}
              </a>
              {/* {movieVisible ? (
                <a
                  className="linked-text"
                  href={lecture()?.movieUrl ?? ""}
                  target="_blank"
                  rel="noreferrer"
                >
                  {lecture()?.movieUrl ?? ""}
                </a>
              ) : getLectureStatus(lecture() ?? {}) === "End" ? (
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
                    ?????????????????????
                  </Button>
                </Space>
              ) : (
                "--"
              )} */}
            </Descriptions.Item>
          </Descriptions>
        </ContentBlock>
        <ContentBlock title={"??????????????????"}>
          <Typography>
            <Typography.Paragraph>
              {lecture()?.description}
            </Typography.Paragraph>
          </Typography>
        </ContentBlock>
        <ContentBlock title="????????????">
          <Row gutter={16} style={{ width: "100%" }}>
            <Col span={8}>
              <Space direction="vertical">
                <Statistic
                  title="?????????"
                  value={lecture()?.nLike ?? 0}
                  prefix={
                    <LikeOutlined
                      style={{
                        verticalAlign: "middle",
                      }}
                    />
                  }
                />
                <Button
                  key={"lecture like button"}
                  type="primary"
                  disabled={getLectureStatus(lecture() ?? {}) !== "End"}
                  onClick={() => {
                    console.log(lecture()?.author?.eoa);
                    addFavos(lecture()?.author?.eoa, 1);
                  }}
                >
                  ??????????????????????????????
                </Button>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical">
                <Statistic
                  title="????????????/???????????????"
                  value={lecture()?.attendeeNum}
                  suffix={`/ ${lecture()?.attendeeMaxNum}`}
                />
                {(() => {
                  switch (applyStatus) {
                    case "open":
                      return (
                        <Button key={"lecture apply button"} type="ghost">
                          ????????????
                        </Button>
                      );
                    case "closed":
                      return (
                        <Button
                          key={"lecture apply button"}
                          danger
                          type="primary"
                          style={{
                            backgroundColor: "#ff4d4f",
                            border: "0px",
                            color: "#fff",
                          }}
                          icon={
                            <StopOutlined
                              style={{
                                verticalAlign: "text-top",
                              }}
                            />
                          }
                          disabled
                        >
                          ??????
                        </Button>
                      );
                    case "allplyed":
                      return (
                        <Button key={"lecture apply button"} type="primary">
                          ????????????
                        </Button>
                      );
                  }
                })()}
                ,
              </Space>
            </Col>
            <Col span={8}>
              <Countdown
                title={`???????????????`}
                value={lecture()?.fromDate}
                format="D???H??????m???s???"
              />
            </Col>
          </Row>
        </ContentBlock>
        <ContentBlock title="????????????">
          <LectureCommetnsList
            histroy={props.history}
            lectureApi={lectureApi}
          />
        </ContentBlock>
      </Space>
    </PageHeader>
  );
};

export default withRouter(LecturePage);
