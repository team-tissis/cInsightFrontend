import { Flex } from "components/shared/flex";
import { lectureData } from "sample_data/lecture";
import { Lecture } from "entities/lecture";
import React, { useEffect, useState } from "react";
import { TableParams } from "utils/table_params";
import { LecturesTable } from "./lectures_table";

export const LecturesPage: React.FC = () => {
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
    fetchData();
  }, [JSON.stringify(tableParams)]);

  return (
    <Flex flexDirection="column">
      <h4 style={{ padding: 10 }}>勉強会一覧</h4>
      <LecturesTable
        data={data}
        loading={loading}
        tableParams={tableParams}
        setTableParams={setTableParams}
      />
    </Flex>
  );
};
