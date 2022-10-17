import { Flex } from "components/shared/flex";
import { lectureData } from "sample_data/lecture";
import { Lecture } from "entities/lecture";
import React, { useContext, useEffect, useState } from "react";
import { TableParams } from "utils/table_params";
import { LecturesTable } from "./lectures_table";
import { GlobalStateContext } from "contexts/global_state_context";
import { PageHeader } from "antd";
import { sleep } from "utils/util";

export const LecturesPage: React.FC = () => {
  const globalState = useContext(GlobalStateContext);
  const [data, setData] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 20,
    },
  });

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
