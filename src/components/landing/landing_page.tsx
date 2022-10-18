import { Image, PageHeader } from "antd";
import {
  usecheckMetaMaskInstalledApi,
  useFetchMetaMaskAccountsApi,
  useRequestMetaMaskAccountsApi,
} from "api/meta_mask";
import * as H from "history";
import { MetaMaskConnectButton } from "components/meta_mask/meta_mask_connect_button";
import { useEffect, useState } from "react";
import Fire from "components/../../public/fire.gif";
import { withRouter } from "react-router";

type Props = {
  history: H.History;
};

export const LandingPage = (props: Props) => {
  const fetchAccountsApi = useFetchMetaMaskAccountsApi();
  const requestAccountsApi = useRequestMetaMaskAccountsApi();
  const checkMetaMaskInstalledApi = usecheckMetaMaskInstalledApi();

  useEffect(() => {
    fetchAccountsApi.execute();
  }, []);

  useEffect(() => {
    if (fetchAccountsApi.isSuccess()) {
      checkMetaMaskInstalledApi.execute();
    }
  }, [fetchAccountsApi.loading]);

  useEffect(() => {
    if (requestAccountsApi.isSuccess()) {
      fetchAccountsApi.execute();
    }
  }, [requestAccountsApi.loading]);

  useEffect(() => {
    if (fetchAccountsApi.isSuccess()) {
      console.log(fetchAccountsApi.response?.accounts);
    }
  }, [fetchAccountsApi.loading]);

  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          backgroundImage: `url(${Fire})`,
          position: "absolute",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundSize: "contain",
          width: "100vw",
          height: "100vh",
        }}
      />
      <div
        style={{
          backgroundColor: "#000",
          width: "100%",
          height: "100%",
          opacity: 0.8,
          position: "absolute",
        }}
      />
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "block",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: "#fff",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translateY(-50%) translateX(-50%)",
          }}
        >
          <div
            style={{
              fontSize: 50,
              width: "100%",
              fontWeight: "bold",
            }}
          >
            Daofied Study Sessions
          </div>
          <div
            style={{
              fontSize: 25,
              width: "100%",
              marginBottom: 40,
              // fontWeight: "bold",
            }}
          >
            Self-propelled amazing study session community.
          </div>
          <MetaMaskConnectButton
            history={props.history}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              borderColor: "#fff",
              color: "#fff",
              boxShadow: isHover
                ? "0 0 10px rgb(255 100 100)"
                : "0 0 0 transparent",
              transition:
                "background .45s cubic-bezier(.215,.61,.355,1),box-shadow .45s cubic-bezier(.215,.61,.355,1)",
              fontWeight: "bold",
              width: 200,
              height: 50,
              fontSize: 20,
            }}
            checkMetaMaskInstalledApi={checkMetaMaskInstalledApi}
            fetchAccountsApi={fetchAccountsApi}
            requestAccountsApi={requestAccountsApi}
            type="ghost"
            color="#fff"
            size="large"
          />
        </div>
      </div>
    </div>
  );
};

export default withRouter(LandingPage);
