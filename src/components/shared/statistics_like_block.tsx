import { ReactNode, useContext } from "react";

export type StatistcsLikeBlockProps = {
  children?: ReactNode;
  title?: ReactNode;
};

export const StatistcsLikeBlock = (props: StatistcsLikeBlockProps) => {
  return (
    <div className="ant-statistic">
      <div className="ant-statistic-title">{props.title}</div>
      <span style={{ fontSize: 24 }} className="ant-statistic-content-value">
        {props.children}
      </span>
    </div>
  );
};
