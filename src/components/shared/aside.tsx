import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarContent,
} from "react-pro-sidebar";

import * as H from "history";

import Logo from "components/../../public/logo_h.png";
import { Flex } from "./flex";
import { GlobalStateContext } from "contexts/global_state_context";

type Props = {
  collapsed: boolean;
  history: H.History;
};
const Aside = (props: Props) => {
  // const [toggled, setToggled] = useState<boolean>(true)

  const globalState = useContext(GlobalStateContext);

  const stopPropagation = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    onClick: () => void
  ) => {
    onClick();
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <ProSidebar
      className="no-print"
      collapsed={props.collapsed}
      breakPoint="md"
      width={240}
    >
      <SidebarHeader>
        <Flex flexDirection="column">
          <div
            style={{
              height: 100,
              position: "relative",
              width: "100%",
            }}
          >
            <img
              src={Logo}
              style={{
                width: "100%",
                objectFit: "cover",
                // position: 'absolute',
                filter:
                  "invert(50%) sepia(100%) saturate(0%) brightness(1000%) contrast(101%)",
              }}
            />
            <div
              style={{
                width: "100%",
                position: "absolute",
                top: 73,
                left: 16,
                fontWeight: "bold",
                fontSize: 14,
              }}
            >
              {`ようこそ ${globalState.user.fullName}さん`}
            </div>
          </div>
        </Flex>
      </SidebarHeader>

      <SidebarContent>
        <Menu iconShape="circle">あいうおえ</Menu>
      </SidebarContent>
    </ProSidebar>
  );
};

export default Aside;
