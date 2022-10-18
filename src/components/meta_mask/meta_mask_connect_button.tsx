import { Button, ButtonProps, notification } from "antd";
import * as H from "history";
import {
  BaseMetaMaskApiSet,
  checkMetaMaskInstalledApiResponse,
  FetchMetaMaskAccountsApiResponse,
  RequestMetaMaskAccountsApiResponse,
} from "api/meta_mask";

type MetaMaskConnectButtonProps = ButtonProps & {
  history: H.History;
  fetchAccountsApi: BaseMetaMaskApiSet<FetchMetaMaskAccountsApiResponse>;
  requestAccountsApi: BaseMetaMaskApiSet<RequestMetaMaskAccountsApiResponse>;
  checkMetaMaskInstalledApi: BaseMetaMaskApiSet<checkMetaMaskInstalledApiResponse>;
};

export const MetaMaskConnectButton = (props: MetaMaskConnectButtonProps) => {
  const {
    fetchAccountsApi,
    requestAccountsApi,
    checkMetaMaskInstalledApi,
    ...buttonProps
  } = props;
  const onClickConnect = () => {
    if (!props.checkMetaMaskInstalledApi.response?.metaMaskInstalled) {
      // pass
    } else if (!fetchAccountsApi.response?.accounts.length) {
      requestAccountsApi.execute();
    } else {
      props.history.push("/mypage");
    }
  };
  return (
    <Button onClick={onClickConnect} {...buttonProps}>
      {checkMetaMaskInstalledApi.response?.metaMaskInstalled
        ? fetchAccountsApi.response?.accounts.length
          ? "Continue"
          : "Connect"
        : "Please install MetaMask"}
    </Button>
  );
};
