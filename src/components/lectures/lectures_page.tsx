import { Flex } from "components/shared/flex";
import { lectureData } from "sample_data/lecture";
import { Lecture, LectureSearchForm } from "entities/lecture";
import React, { useContext, useEffect, useState } from "react";
import { TableParams } from "utils/table_params";
import { LecturesTable } from "./lectures_table";
import { GlobalStateContext } from "contexts/global_state_context";
import { Button, PageHeader, Space, Tabs, Tag } from "antd";
import { sleep } from "utils/util";
import { NewLectureForm } from "./lecture_form";
import { useFetchLecturesApi, usePostLectureApi } from "api/lecture";
import { useEffectSkipFirst, useForm } from "utils/hooks";

import { ContentBlock } from "components/shared/content_block";

import FullCalendar, { EventContentArg } from "@fullcalendar/react";
import { DatesSetArg } from "@fullcalendar/common";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarOutlined, TableOutlined } from "@ant-design/icons";
import moment from "moment";
import * as H from "history";
import { withRouter } from "react-router";
import { getLectureStatus, LectureStatusView } from "./lecture_view";

type Props = {
  history: H.History;
};

const LecturesPage = (props: Props): JSX.Element => {
  const globalState = useContext(GlobalStateContext);
  const newLectureForm = useForm<Lecture>({});
  const searchForm = useForm<LectureSearchForm>({});
  const lecturesApi = useFetchLecturesApi(searchForm);
  const postLectureApi = usePostLectureApi();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 20,
    },
  });
  const [openNewLectureForm, setOpenNewLectureForm] = useState(false);

  useEffect(() => {
    lecturesApi.execute();
  }, [searchForm.object]);

  useEffectSkipFirst(() => {
    globalState.setLoading(lecturesApi.loading);
  }, [lecturesApi.loading]);

  useEffectSkipFirst(() => {
    globalState.setLoading(postLectureApi.loading);
    if (postLectureApi.isSuccess()) {
      lecturesApi.execute();
    }
  }, [postLectureApi.loading]);

  return (
    <>
      <PageHeader
        style={{
          width: "100%",
          backgroundColor: "inherit",
        }}
        title={"勉強会"}
        extra={[
          <Button
            onClick={() => {
              setOpenNewLectureForm(true);
            }}
            type="primary"
            key="new lecture NewLectureForm button"
          >
            勉強会の新規作成
          </Button>,
          <NewLectureForm
            open={openNewLectureForm}
            onCancel={() => setOpenNewLectureForm(false)}
            onOk={() => {
              postLectureApi.execute(newLectureForm);
              newLectureForm.resetForm();
              setOpenNewLectureForm(false);
            }}
            key={"new lecture NewLectureForm"}
            form={newLectureForm}
          />,
        ]}
      >
        <ContentBlock
        // title="勉強会一覧"
        >
          <Tabs
            type="card"
            defaultActiveKey="calender"
            onChange={(key: string) => console.log(key)}
            items={[
              {
                label: (
                  <span>
                    <TableOutlined
                      style={{
                        verticalAlign: 1,
                      }}
                    />
                    Table
                  </span>
                ),
                key: "table",
                children: (
                  <LecturesTable
                    data={lecturesApi.response.results}
                    loading={loading}
                    tableParams={tableParams}
                    setTableParams={setTableParams}
                  />
                ),
              },
              {
                label: (
                  <span>
                    <CalendarOutlined
                      style={{
                        verticalAlign: "middle",
                      }}
                    />
                    Calender
                  </span>
                ),
                key: "calender",
                children: (
                  <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                    initialView="dayGridMonth"
                    initialDate={new Date()}
                    locale={"ja"}
                    buttonText={{
                      today: "今日",
                      month: "月",
                      week: "週",
                      day: "日",
                    }}
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    eventClick={(arg) => {
                      props.history.push(`/lectures/${arg.event.id}`);
                    }}
                    // eventContent={(eventInfo: EventContentArg) => {
                    //   console.log(eventInfo);
                    //   const lecture = lecturesApi.response.results.find(
                    //     (r) => r.id === eventInfo.event.id
                    //   );
                    //   return (
                    //     <div
                    //       style={{
                    //         paddingLeft: 5,
                    //         color:
                    //           getLectureStatus(lecture!) === "End"
                    //             ? "#000"
                    //             : "#fff",
                    //       }}
                    //     >
                    //       {lecture?.name}
                    //       {(() => {
                    //         switch (getLectureStatus(lecture ?? {})) {
                    //           case "End":
                    //             return "(終了)";
                    //           case "Held Now":
                    //             return "(開催中)";
                    //         }
                    //       })()}
                    //     </div>
                    //   );
                    // }}
                    events={lecturesApi.response.results.map((lecture) => {
                      return {
                        id: lecture.id,
                        start: moment(
                          (lecture?.date ?? [])[0],
                          "YYYY/MM/DD HH:mm"
                        ).format(),
                        end: moment(
                          (lecture?.date ?? [])[1],
                          "YYYY/MM/DD HH:mm"
                        ).format(),
                        // backgroundColor:
                        //   getLectureStatus(lecture) === "End"
                        //     ? "#FAFAFA"
                        //     : "#1890FF",
                        // borderColor: "rgb(217, 217, 217)",
                        // display: "block",
                        title: lecture.name,
                      };
                    })}
                    height={700}
                    // datesSet={(a) => {
                    //   if (a?.endStr !== arg?.endStr) {
                    //     setArg(a);
                    //   }
                    // }}
                    // validRange={{ start: "2022-02-01", end: new Date() }}
                  />
                ),
              },
            ]}
          />
        </ContentBlock>
      </PageHeader>
    </>
  );
};

export default withRouter(LecturesPage);
