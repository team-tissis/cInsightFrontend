import { CommentProps, TagProps } from "antd";
import { BaseSearchForm } from "entities";
import { User } from "./user";

export type CommentStatus = "Not Started" | "Held Now" | "End";

export type Comment = {
  id?: string;
};

export type CommentSearchForm = BaseSearchForm & Comment;

export type CommentForm = Comment;
