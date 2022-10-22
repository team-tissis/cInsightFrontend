import { CommentProps, TagProps } from "antd";
import { BaseSearchForm } from "entities";
import { User } from "./user";

export type LectureStatus = "Not Started" | "Held Now" | "End";

export type Lecture = {
  id?: string;
  date?: [string, string];
  name?: string;
  author?: User;
  nLike?: number;
  createdAt?: string;
  comments?: CommentProps[];
  tags?: string[];
  perticipants?: number;
  maxPerticipants?: number;
  status?: LectureStatus;
  materialUrl?: string;
  movieUrl?: string;
  moviePrice?: number;
  description?: string;
};

export type LectureSearchForm = BaseSearchForm & Lecture;

export type LectureForm = Lecture;
