import { Flex } from "components/shared/flex";
import { lectureData } from "sample_data/lecture";
import { Lecture } from "entities/lecture";
import React, { useContext, useEffect, useState } from "react";
import { TableParams } from "utils/table_params";
import { LecturesTable } from "./lectures_table";
import { GlobalStateContext } from "contexts/global_state_context";

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
    fetchData();
  }, [JSON.stringify(tableParams)]);

  const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  };
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  useEffect(() => {
    const onResize = () => {
      setWindowDimensions(getWindowDimensions());
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <Flex flexDirection="column">
      <h4 style={{ padding: 10 }}>勉強会</h4>

      <div
        style={{
          overflowX: "scroll",
          maxWidth: globalState.collapsed
            ? windowDimensions.width - 120
            : windowDimensions.width - 240,
          transition: "all 0.2s",
        }}
      >
        <LecturesTable
          data={data}
          loading={loading}
          tableParams={tableParams}
          setTableParams={setTableParams}
        />
      </div>
    </Flex>
  );
};
