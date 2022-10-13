import React, { useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import * as H from "history";
import { CookieManager } from "utils/cookie_manager";
import { GlobalStateContext } from "contexts/global_state_context";
import { Flex } from "components/shared/flex";
import Logo from "components/../../public/logo_h.png";
import Ornament1 from "components/../../public/ornament1.png";
import Ornament2 from "components/../../public/ornament2.png";
import { AuthorizationForm, useAuthorizationApi } from "api/authorization";
import { useForm } from "utils/hooks";
import { Button } from "react-bootstrap";
import { InputField } from "components/shared/input";
import { ThemeContext } from "contexts/theme_context";

type Props = {
  history: H.History;
};

const LoginPage = ({ history }: Props) => {
  const apiSet = useAuthorizationApi();
  const globalState = useContext(GlobalStateContext);
  const theme = useContext(ThemeContext);
  const form = useForm<AuthorizationForm>({ username: "", password: "" });

  useEffect(() => {
    globalState.setLoading(apiSet.loading);
  }, [apiSet.loading]);

  useEffect(() => {
    if (apiSet.response.token) {
      CookieManager.saveUserToken(apiSet.response.token);
      globalState.setLoading(false);
      history.push("/dashboards");
    }
  }, [apiSet.response.token]);

  useEffect(() => {
    globalState.setError(apiSet.apiError);
  }, [apiSet.apiError]);

  const handleClickLoginButton = () => {
    apiSet.execute(form);
  };

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      style={{
        height: "100vh",
        overflow: "hidden",
        background:
          "linear-gradient(270deg, rgba(215,227,118,0.5) 0%, rgba(0, 128, 200, 0.5) 100%)",
        position: "relative",
      }}
    >
      <img
        src={Ornament1}
        style={{
          objectFit: "cover",
          position: "absolute",
          right: 0,
          bottom: -20,
          zIndex: 0,
          width: "50vw",
        }}
        alt="ornament1"
      />
      <img
        src={Ornament2}
        style={{
          objectFit: "cover",
          position: "absolute",
          left: 0,
          bottom: 0,
          zIndex: 0,
          width: "40vw",
        }}
        alt="ornament2"
      />
      <div
        style={{ backgroundColor: theme.white, borderRadius: 3, zIndex: 1 }}
        className="shadow"
      >
        <div style={{ marginBottom: 0, textAlign: "center" }}>
          <img
            src={Logo}
            style={{ height: 150, objectFit: "cover" }}
            alt="logo"
          />
        </div>
        <div style={{ padding: 40, paddingTop: 0 }}>
          <div>
            <div style={{ marginBottom: 20 }}>
              <InputField attr="username" form={form} label="Username" />
            </div>
            <div style={{ marginBottom: 40 }}>
              <InputField
                attr="password"
                form={form}
                label="Password"
                type="password"
              />
            </div>
            <div className="d-grid gap-2">
              <Button
                variant="primary"
                onClick={() => {
                  handleClickLoginButton();
                }}
              >
                ログイン
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Flex>
  );
};

export default withRouter(LoginPage);
