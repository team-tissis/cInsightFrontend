import React, { ReactNode, useContext, useEffect, useState } from "react";
import {
  GlobalStateContext,
  NotificationColor,
} from "contexts/global_state_context";
import { ApiError } from "utils/network/api_hooks";
import { Button, Form, Modal, Toast, ToastContainer } from "react-bootstrap";
import ScaleLoader from "react-spinners/ScaleLoader";
import { useEffectSkipFirst } from "utils/hooks";
import { NestedModal } from "components/shared/widget";
import { User } from "entities/user";
import { ThemeContext } from "contexts/theme_context";
import { Spin } from "antd";

export type ConfirmOption = {
  confirmWord?: string;
  backdropStatic?: boolean;
  onCancel?: () => void;
  hideCancel?: boolean;
};

export type Dimension = {
  width: number;
  height: number;
};

type GlobalStateContainerProps = {
  children: ReactNode;
};

const GlobalStateContainer: React.FC<GlobalStateContainerProps> = (
  props: GlobalStateContainerProps
) => {
  const [user, setUser] = React.useState<User>({});
  const [collapsed, setCollapsed] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(false);
  const [apiError, setApiError] = React.useState<ApiError>({});
  const [notificationMessage, setNotificationMessage] = React.useState<{
    body: string | ReactNode;
    colorType?: NotificationColor;
    title?: string;
    delay?: number;
  }>({ body: "" });
  const [confirm, setConfirm] = React.useState<{
    message: ReactNode;
    callback?: () => void;
    option?: ConfirmOption;
  }>({
    message: <></>,
    callback: () => { },
  });
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [showToast, setShowToast] = React.useState(false);
  const [confirmWord, setConfirmWord] = React.useState("");
  const theme = useContext(ThemeContext);

  const getWindowDimensions = (): Dimension => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  };
  const [dimension, setDimension] = useState<Dimension>(getWindowDimensions());

  useEffect(() => {
    const onResize = () => {
      setDimension(getWindowDimensions());
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const showConfirm = (
    message: ReactNode,
    callback?: () => void,
    option?: ConfirmOption
  ) => {
    setConfirm({ message: message, callback: callback, option: option });
    setOpenConfirm(true);
  };

  const handleClose = () => {
    setConfirmWord("");
    setOpenConfirm(false);
    if (confirm.option?.onCancel) {
      confirm.option.onCancel();
    }
  };

  const handleOk = () => {
    setConfirmWord("");
    if (confirm.callback) {
      confirm.callback();
    }
    setOpenConfirm(false);
  };

  useEffectSkipFirst(() => {
    if (notificationMessage.body) {
      setShowToast(true);
    }
  }, [notificationMessage.body]);

  useEffectSkipFirst(() => {
    if (!showToast) {
      setNotificationMessage({ body: "" });
    }
  }, [showToast]);

  useEffectSkipFirst(() => {
    if (apiError?.message) {
      setNotificationMessage({
        body: apiError.message,
        colorType: "danger",
        delay: 15000,
      });
    }
  }, [apiError]);

  return (
    <GlobalStateContext.Provider
      value={{
        user: user,
        setUser: setUser,
        loading: loading,
        setLoading: setLoading,
        apiError: apiError,
        setError: setApiError,
        notificationMessage: notificationMessage,
        setNotificationMessage: setNotificationMessage,
        showConfirm: showConfirm,
        collapsed: collapsed,
        setCollapsed: setCollapsed,
        dimension: dimension,
        setDimension: setDimension,
      }}
    >
      <div>
        <div style={{ position: "fixed", top: 20, right: 20 }}>
          {/* <ToastContainer className="d-inline-block m-1" position={'top-end'} style={{ zIndex: 1000000 }}> */}
          <Toast
            onClose={() => setShowToast(false)}
            show={showToast}
            autohide
            delay={notificationMessage.delay || 5000}
            bg={notificationMessage.colorType}
          >
            <Toast.Header>
              {/* <img src={Logo} style={{ width: 20, height: 20 }} alt="" /> */}
              <strong className="me-auto">
                {notificationMessage.colorType?.toUpperCase()}!
              </strong>
              {/* <small>11 mins ago</small> */}
            </Toast.Header>
            <Toast.Body
              className={
                notificationMessage.colorType === "warning" ? "" : "text-white"
              }
            >
              {typeof notificationMessage.body === "string"
                ? notificationMessage.body
                  .split("\n")
                  .map((line, index) => (
                    <div key={"message-line-" + index}>{line}</div>
                  ))
                : notificationMessage.body}
            </Toast.Body>
          </Toast>
          {/* </ToastContainer> */}
        </div>
        {loading && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#8888",
              zIndex: 1000000,
            }}
          >
            <Spin size="large" />
          </div>
        )}

        <NestedModal open={openConfirm} onCancel={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>確認</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {confirm.message}
            {confirm.option?.confirmWord && (
              <Form.Control
                style={{ marginTop: 15 }}
                value={confirmWord}
                onChange={(e) => {
                  setConfirmWord(e.target.value);
                }}
                placeholder={`${confirm.option?.confirmWord}`}
              />
            )}
            <div></div>
          </Modal.Body>

          <Modal.Footer>
            {!confirm.option?.hideCancel && confirm.callback && (
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
            )}
            <Button
              variant="primary"
              onClick={handleOk}
              disabled={
                !!confirm.option?.confirmWord &&
                confirm.option?.confirmWord !== confirmWord
              }
            >
              OK
            </Button>
          </Modal.Footer>
        </NestedModal>
        {props.children}
      </div>
    </GlobalStateContext.Provider>
  );
};

export default GlobalStateContainer;
