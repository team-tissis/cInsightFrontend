import type { ColumnsType } from "antd/es/table";
import { Flex } from "components/shared/flex";
import { Lecture } from "entities/lecture";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { GlobalStateContext } from "contexts/global_state_context";
import { LectureStatusView, LectureTagsView } from "./lecture_view";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import * as H from "history";
import moment from "moment";

export type LecturesCalenderProps = {
  data: Lecture[];
  loading: boolean;
  history: H.History;
};

export const LecturesCalender = (props: LecturesCalenderProps) => {
  const globalState = useContext(GlobalStateContext);
  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        initialDate={new Date()}
        locale={"ja"}
        timeZone="Asia/Tokyo"
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
        height={700}
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
        events={props.data.map((lecture) => {
          return {
            id: lecture.id,
            start: moment(lecture.fromDate).format(),
            end: moment(lecture.toDate).format(),
            // backgroundColor:
            //   getLectureStatus(lecture) === "End"
            //     ? "#FAFAFA"
            //     : "#1890FF",
            // borderColor: "rgb(217, 217, 217)",
            // display: "block",
            title: lecture.name,
          };
        })}
      />
    </>
  );
};
