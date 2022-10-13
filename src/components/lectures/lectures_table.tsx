import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Flex } from "components/shared/flex";
import { Lecture } from "entities/lecture";
import { TableParams } from "utils/table_params";
import { HeartFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";

const columns: ColumnsType<Lecture> = [
  {
    title: "Name",
    width: "20%",
    sorter: true,
    render: (object: Lecture) => (
      <Link style={{ textDecoration: "auto" }} to={`lectures/${object.id}`}>
        {object.name}
      </Link>
    ),
  },
  {
    title: "Author",
    sorter: true,
    width: "20%",
    render: (object: Lecture) => `${object.author?.firstName}`,
  },
  {
    title: "Date",
    dataIndex: "date",
    width: "20%",
    sorter: true,
  },
  {
    title: "Number of Likes",
    width: "20%",
    render: (object: Lecture) => (
      <Flex alignItems="center">
        <HeartFilled style={{ color: "#f67578" }} />
        <div style={{ marginLeft: 5, color: "#f67578" }}>{object.nLike}</div>
      </Flex>
    ),
    sorter: true,
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    width: "20%",
    sorter: true,
  },
];

export type LecturesTableProps = {
  data: Lecture[];
  loading: boolean;
  tableParams: TableParams;
  setTableParams: (tableParams: TableParams) => void;
};

export const LecturesTable = (props: LecturesTableProps) => {
  return (
    <Table
      style={{ width: "100%" }}
      columns={columns}
      rowKey={(object) => String(object.id)}
      dataSource={props.data}
      pagination={props.tableParams.pagination}
      loading={props.loading}
      scroll={{ y: "calc(100vh - 280px)" }}
    />
  );
};
