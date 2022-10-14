import { Button, Result } from "antd";
import * as H from "history";
import { GlobalStateContext } from "contexts/global_state_context";
import React, { useContext } from "react";
import { withRouter } from "react-router-dom";
import { Flex } from "./flex";

type Props = {
  history: H.History;
};

const Error404Page = (props: Props): JSX.Element => {
  const globalState = useContext(GlobalStateContext);
  return (
    <div style={{ width: "100%", alignItems: "center" }}>
      <Result
        style={{
          transition: "all 0.2s",
          width: globalState.collapsed
            ? globalState.dimension.width - 120
            : globalState.dimension.width - 240,
        }}
        status="404"
        title="404 Not found."
        subTitle="お探しのページは見つかりませんでした。"
        extra={
          <Button onClick={() => props.history.push("/mypage")} type="primary">
            ホームへ戻る
          </Button>
        }
      />
    </div>
  );
};

export default withRouter(Error404Page);
