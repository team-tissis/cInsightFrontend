import { Flex } from "components/shared/flex";
import { lectureData } from "sample_data/lecture";
import { Lecture, LectureSearchForm } from "entities/lecture";
import React, { useContext, useEffect, useState } from "react";
import { TableParams } from "utils/table_params";
import { LecturesTable } from "./lectures_table";
import { GlobalStateContext } from "contexts/global_state_context";
import { Button, PageHeader } from "antd";
import { sleep } from "utils/util";
import { NewLectureForm } from "./lecture_form";
import { useFetchLecturesApi, usePostLectureApi } from "api/lecture";
import { useEffectSkipFirst, useForm } from "utils/hooks";
import { CookieManager } from "utils/cookie_manager";

export const LecturesPage: React.FC = () => {
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
        <LecturesTable
          data={lecturesApi.response.results}
          loading={loading}
          tableParams={tableParams}
          setTableParams={setTableParams}
        />
      </PageHeader>
    </>
  );
};
