import { Flex } from "components/shared/flex";
import { lectureData } from "sample_data/lecture";
import { Lecture } from "entities/lecture";
import React, { useContext, useEffect, useState } from "react";
import { TableParams } from "utils/table_params";
import { LecturesTable } from "./lectures_table";
import { GlobalStateContext } from "contexts/global_state_context";
import { Button, PageHeader } from "antd";
import { sleep } from "utils/util";
import { NewLectureForm } from "./lecture_form";
import { usePostLectureApi } from "api/lecture";
import { useForm } from "utils/hooks";

export const LecturesPage: React.FC = () => {
  const globalState = useContext(GlobalStateContext);
  const [data, setData] = useState<Lecture[]>([]);
  const newLectureForm = useForm<Lecture>({});
  const postLectureApi = usePostLectureApi();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 20,
    },
  });
  const [openNewLectureForm, setOpenNewLectureForm] = useState(false);

  const fetchData = () => {
    setLoading(true);
    setData(lectureData);
    setLoading(false);
  };

  useEffect(() => {
    sleep(
      0.5,
      () => globalState.setLoading(true),
      () => globalState.setLoading(false)
    );
    fetchData();
  }, [JSON.stringify(tableParams)]);

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
          data={data}
          loading={loading}
          tableParams={tableParams}
          setTableParams={setTableParams}
        />
      </PageHeader>
    </>
  );
};
