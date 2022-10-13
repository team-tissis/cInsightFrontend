import React, { ReactNode, useContext, useEffect, useState } from "react";
import { useLocation, withRouter } from "react-router-dom";
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
import { useQuery } from "utils/hooks";
import { GlobalStateContext } from "contexts/global_state_context";

const { Header, Content, Sider } = AntdLayout;

type MenuItem = Required<MenuProps>["items"][number];

type LayoutProps = {
  children?: ReactNode;
  history: H.History;
};
const Layout = (props: LayoutProps): JSX.Element => {
  const globalState = useContext(GlobalStateContext);
  console.log(globalState.collapsed);
  const location = useLocation();
  const items1: MenuItem[] = [
    {
      key: "/mypage",
      label: "マイページ",
      icon: <UserOutlined />,
      onClick: () => {
        props.history.push("/mypage");
      },
    },
    {
      key: "/lectures",
      label: "勉強会",
      icon: <NotificationOutlined />,
      onClick: () => {
        props.history.push("/lectures");
      },
    },
  ];

  return (
    <AntdLayout style={{ width: "100vw", height: "100vh" }}>
      <Sider
        collapsible
        onCollapse={() => globalState.setCollapsed(!globalState.collapsed)}
        width={200}
        className="site-layout-background"
        collapsed={globalState.collapsed}
      >
        <Flex style={{ padding: 20 }} alignItems="center">
          <FireTwoTone
            twoToneColor="#f66"
            style={{
              marginLeft: globalState.collapsed ? 10 : 0,
              fontSize: 30,
              alignItems: "center",
              transition: "0.2s",
            }}
          />
          {!globalState.collapsed && (
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
          )}
        </Flex>
        <Menu
          selectedKeys={[location.pathname]}
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
