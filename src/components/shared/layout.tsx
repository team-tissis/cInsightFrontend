import React, { ReactNode, useContext, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import * as H from "history";
import { Flex } from "./flex";
import {
  Breadcrumb,
  Button,
  Layout as AntdLayout,
  Menu,
  MenuProps,
} from "antd";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  FireTwoTone,
} from "@ant-design/icons";

const { Header, Content, Sider } = AntdLayout;

type MenuItem = Required<MenuProps>["items"][number];

const items1: MenuItem[] = [
  {
    key: "マイページ",
    label: "マイページ",
    icon: <UserOutlined />,
    onClick: () => window.location.replace("/mypage"),
  },
  {
    key: "勉強会一覧",
    label: "勉強会一覧",
    icon: <NotificationOutlined />,
    onClick: () => window.location.replace("/lectures"),
  },
];

type LayoutProps = {
  children?: ReactNode;
  history: H.History;
};
const Layout = (props: LayoutProps): JSX.Element => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AntdLayout style={{ width: "100vw", height: "100vh" }}>
      <Sider
        collapsible
        onCollapse={() => setCollapsed(!collapsed)}
        width={200}
        className="site-layout-background"
        collapsed={collapsed}
      >
        <Flex style={{ padding: 20 }} alignItems="center">
          <FireTwoTone twoToneColor="#f66" style={{ fontSize: 20 }} />
          <div
            style={{
              marginLeft: 10,
              width: 200,
              color: "#fff",
              fontWeight: 500,
            }}
          >
            Daofication
          </div>
          {/* <Menu
            style={{ width: "100%" }}
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["勉強会一覧"]}
            items={items1}
          /> */}
        </Flex>
        <Menu
          defaultOpenKeys={["sub1"]}
          defaultSelectedKeys={["勉強会一覧"]}
          mode="inline"
          theme="dark"
          // style={{ height: "100%", borderRight: 0 }}
          items={items1}
        />
      </Sider>
      <AntdLayout style={{ padding: 20 }}>
        <Flex flexDirection="column">
          <Flex style={{ width: "100%" }} justifyContent="flex-end">
            <Button shape="round">Connect</Button>
          </Flex>
          <Content
            className="site-layout-background"
            style={{
              margin: 0,
              height: "calc(100vh-64px)",
            }}
          >
            {props.children}
          </Content>
        </Flex>
      </AntdLayout>
    </AntdLayout>
  );
};

export default withRouter(Layout);
