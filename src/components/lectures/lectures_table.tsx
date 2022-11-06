import { Button, Input, InputRef, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Flex } from "components/shared/flex";
import { Lecture } from "entities/lecture";
import { TableParams } from "utils/table_params";
import { HeartFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { GlobalStateContext } from "contexts/global_state_context";
import { LectureStatusView, LectureTagsView } from "./lecture_view";
import { ColumnType } from "antd/lib/table";
import { SearchOutlined } from "@ant-design/icons";
import { FilterConfirmProps } from "antd/lib/table/interface";
import { SorterResult } from "antd/es/table/interface";
import moment from "moment";

export type TableProps<T> = {
  data: Lecture[];
  loading: boolean;
  tableParams: TableParams<T>;
  setTableParams: (tableParams: TableParams<T>) => void;
};

export type LecturesTableProps = TableProps<Lecture>;

export const LecturesTable = <T extends any>(props: LecturesTableProps) => {
  const globalState = useContext(GlobalStateContext);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: keyof Lecture
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (
    dataIndex: keyof Lecture
  ): ColumnType<Lecture> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns: ColumnsType<Lecture> = [
    {
      title: "勉強会名",
      width: "20%",
      key: "name",
      render: (object: Lecture) => (
        <Link style={{ textDecoration: "auto" }} to={`lectures/${object.id}`}>
          {object.name}
        </Link>
      ),
    },
    {
      title: "開催状況",
      width: "20%",
      sortOrder: "descend",
      key: "status",
      render: (lecture) => LectureStatusView(lecture),
    },
    {
      title: "開始日時",
      width: "20%",
      render: (object: Lecture) =>
        moment(object.fromDate).format("YYYY/MM/DD HH:mm"),
    },
    {
      title: "終了日時",
      width: "20%",
      render: (object: Lecture) =>
        moment(object.toDate).format("YYYY/MM/DD HH:mm"),
    },
    // {
    //   title: "Number of Likes",
    //   width: "20%",
    //   render: (object: Lecture) => (
    //     <Flex alignItems="center">
    //       <HeartFilled style={{ color: "#f67578" }} />
    //       <div style={{ marginLeft: 5, color: "#f67578" }}>{object.nLike}</div>
    //     </Flex>
    //   ),
    //   sorter: true,
    // },
    {
      title: "作成日",
      dataIndex: "createdAt",
      width: "20%",
    },
  ];

  return (
    <Table
      columns={columns}
      rowKey={(object) => String(object.id)}
      dataSource={props.data}
      // pagination={props.tableParams.pagination}
      loading={props.loading}
      // onChange={(pagination, filters, sorter, extra) => {
      //   props.setTableParams({
      //     pagination,
      //     filters,
      //     sorter,
      //     extra,
      //   });
      // }}
      scroll={{
        y: "calc(100vh - 280px)",
        x: globalState.dimension.width - 120,
      }}
    />
  );
};
