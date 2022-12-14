import { Flex } from "components/shared/flex";
import { User, UserSearchForm } from "entities/user";
import React, { useContext, useEffect, useState } from "react";
import { TableParams } from "utils/table_params";
import { GlobalStateContext } from "contexts/global_state_context";
import {
  Avatar,
  Button,
  Card,
  List,
  PageHeader,
  Skeleton,
  Space,
  Tabs,
  Tag,
} from "antd";
import { sleep } from "utils/util";
import { useFetchUsersApi } from "api/user";
import { useEffectSkipFirst, useForm } from "utils/hooks";
import { LikeOutlined, MessageOutlined, StarOutlined } from "@ant-design/icons";

import { ContentBlock } from "components/shared/content_block";

import FullCalendar from "@fullcalendar/react";
import { DatesSetArg } from "@fullcalendar/common";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarOutlined, TableOutlined } from "@ant-design/icons";
import moment from "moment";
import * as H from "history";
import { withRouter } from "react-router";
import { UserListView } from "./user_view";

type Props = {
  history: H.History;
};

const UsersPage = (props: Props): JSX.Element => {
  const globalState = useContext(GlobalStateContext);
  const searchForm = useForm<UserSearchForm>({});
  const usersApi = useFetchUsersApi(searchForm);
  const [tableParams, setTableParams] = useState<TableParams<User>>({
    pagination: {
      current: 1,
      pageSize: 20,
    },
  });

  useEffect(() => {
    usersApi.execute();
  }, [searchForm.object, JSON.stringify(tableParams)]);

  useEffectSkipFirst(() => {
    globalState.setLoading(usersApi.loading);
  }, [usersApi.loading]);

  return (
    <>
      <PageHeader
        style={{
          width: "100%",
          backgroundColor: "inherit",
        }}
        title={"SBTホルダーリスト"}
      >
        <ContentBlock
        // title="勉強会一覧"
        >
          <List
            itemLayout="vertical"
            split={false}
            size={"small"}
            pagination={{
              onChange: (page) => {
                console.log(page);
              },
              pageSize: 5,
            }}
            dataSource={usersApi.response.results}
            renderItem={(item) => (
              <List.Item
                onClick={() => props.history.push(`/users/${item.id}`)}
                key={item.token}
              >
                {UserListView(item)}
              </List.Item>
            )}
          />
        </ContentBlock>
      </PageHeader>
    </>
  );
};

export default withRouter(UsersPage);
