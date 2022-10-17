import { PageHeader } from "antd";
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import { CSSProperties } from "styled-components";

export type ContentBlockProps = {
  title: ReactNode;
  children: ReactNode;
  style?: CSSProperties;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const ContentBlock = (props: ContentBlockProps) => {
  return (
    <PageHeader
      title={<div style={{ fontSize: 16 }}>{props.title}</div>}
      style={{ width: "100%", backgroundColor: "#fff", ...props.style }}
    >
      {props.children}
    </PageHeader>
  );
};
