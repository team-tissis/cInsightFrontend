import { User } from "entities/user";
import { ConfirmOption } from "containers/global_state_container";
import React, { ReactNode, SetStateAction } from "react";

export type NotificationColor = "success" | "danger" | "warning" | "info";

type GlobalState = {
  user: User;
  setUser: (user: User) => void;
  loading: boolean;
  setLoading: (value: SetStateAction<boolean>) => void;
  apiError: { [key: string]: string };
  setError: (value: SetStateAction<{ [key: string]: string }>) => void;
  notificationMessage: { body: string | ReactNode };
  setNotificationMessage: (
    value: SetStateAction<{
      body: string | ReactNode;
      colorType?: NotificationColor;
      title?: string;
      delay?: number;
    }>
  ) => void;
  showConfirm: (
    message: ReactNode,
    callback?: () => void,
    option?: ConfirmOption
  ) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};

export const initialGlobalState: GlobalState = {
  user: {},
  setUser: () => {},
  loading: false,
  setLoading: () => {},
  apiError: {},
  setError: () => {},
  notificationMessage: { body: "" },
  setNotificationMessage: () => {},
  showConfirm: () => {},
  collapsed: false,
  setCollapsed: () => {},
};

export const GlobalStateContext = React.createContext(initialGlobalState);
