import { CommentProps } from "antd";
import { BaseSearchForm } from "entities";
import { User } from "./user";

export type Lecture = {
  id?: string;
  date?: string;
  name?: string;
  author?: User;
  nLike?: number;
  createdAt?: string;
  comments?: CommentProps[];
};

export type LectureSearchForm = BaseSearchForm & Lecture;
