import { Flex } from "components/shared/flex";
import { proposalData } from "sample_data/proposal";
import { Proposal, ProposalSearchForm } from "entities/proposal";
import React, { useContext, useEffect, useState } from "react";
import { TableParams } from "utils/table_params";
import { GlobalStateContext } from "contexts/global_state_context";
import { Button, List, PageHeader, Space, Tabs, Tag } from "antd";
import { sleep } from "utils/util";
import { NewProposalForm } from "./proposal_form";
import { useFetchProposalsApi, usePostProposalApi } from "api/proposal";
import { useEffectSkipFirst, useForm } from "utils/hooks";

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
import { ProposalListView } from "./proposal_view";

type Props = {
  history: H.History;
};

const ProposalsPage = (props: Props): JSX.Element => {
  const globalState = useContext(GlobalStateContext);
  const newProposalForm = useForm<Proposal>({});
  const searchForm = useForm<ProposalSearchForm>({});
  const proposalsApi = useFetchProposalsApi(searchForm);
  const postProposalApi = usePostProposalApi();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams<Proposal>>({
    pagination: {
      current: 1,
      pageSize: 20,
    },
  });
  const [openNewProposalForm, setOpenNewProposalForm] = useState(false);

  useEffect(() => {
    proposalsApi.execute();
  }, [searchForm.object, JSON.stringify(tableParams)]);

  useEffectSkipFirst(() => {
    globalState.setLoading(proposalsApi.loading);
  }, [proposalsApi.loading]);

  useEffectSkipFirst(() => {
    globalState.setLoading(postProposalApi.loading);
    if (postProposalApi.isSuccess()) {
      proposalsApi.execute();
    }
  }, [postProposalApi.loading]);

  return (
    <>
      <PageHeader
        style={{
          width: "100%",
          backgroundColor: "inherit",
        }}
        title={"Proposal"}
        extra={[
          <Button
            onClick={() => {
              setOpenNewProposalForm(true);
            }}
            type="primary"
            key="new proposal NewProposalForm button"
          >
            Proposalの新規作成
          </Button>,
          <NewProposalForm
            open={openNewProposalForm}
            onCancel={() => setOpenNewProposalForm(false)}
            onOk={() => {
              postProposalApi.execute(newProposalForm);
              newProposalForm.resetForm();
              setOpenNewProposalForm(false);
            }}
            key={"new proposal NewProposalForm"}
            form={newProposalForm}
          />,
        ]}
      >
        <ContentBlock
        // title="Proposal一覧"
        >
          <List
            split={false}
            size={"small"}
            itemLayout="vertical"
            dataSource={proposalsApi.response.results}
            renderItem={(item) => (
              <List.Item
                onClick={() => props.history.push(`/proposals/${item.id}`)}
              >
                {ProposalListView(item)}
              </List.Item>
            )}
          />
        </ContentBlock>
      </PageHeader>
    </>
  );
};

export default withRouter(ProposalsPage);
