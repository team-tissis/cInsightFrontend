import { PageHeader, PageHeaderProps, Skeleton } from "antd";
import { GlobalStateContext } from "contexts/global_state_context";
import {
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
  useContext,
} from "react";
import { CSSProperties } from "styled-components";

export type ContentBlockProps = {
  title?: ReactNode;
  children: ReactNode;
  style?: CSSProperties;
  pageHeaderProps?: PageHeaderProps;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const ContentBlock = (props: ContentBlockProps) => {
  const globalState = useContext(GlobalStateContext);
  return (
    <PageHeader
      title={props.title && <div style={{ fontSize: 16 }}>{props.title}</div>}
      style={{ width: "100%", backgroundColor: "#fff", ...props.style }}
      {...props.pageHeaderProps}
    >
      {globalState.loading ? (
        <Skeleton style={{ width: globalState.dimension.width - 300 }} />
      ) : (
        props.children
      )}
    </PageHeader>
  );
};
