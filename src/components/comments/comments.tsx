import {
  Alert,
  Avatar,
  Button,
  Comment as AntdComment,
  Form,
  List,
  message,
  notification,
  Tooltip,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { Comment, CommentForm } from "entities/comment";
import { User } from "entities/user";
import { FavoriteForm, Favorite } from "entities/favorite";
import React, { createElement, useEffect, useState } from "react";
import { useEffectSkipFirst, useForm } from "utils/hooks";
import { useFavoCommentApi, usePostCommentApi } from "api/comment";
import { useCreateFavoriteApi, useDeleteFavoriteApi } from "api/favorite";
import { ApiSet } from "utils/network/api_hooks";
import { LectureResponse } from "api/lecture";
import { useParams } from "react-router";
import moment from "moment";
import {
  DislikeFilled,
  DislikeOutlined,
  LikeFilled,
  LikeOutlined,
} from "@ant-design/icons";
import { fetchAccountImageUrl, addFavos } from "api/fetch_sol/sbt";
import { getCurrentAccountAddress } from "api/fetch_sol/utils";
import { useFetchUserApi, useFetchUserByAccountAddressApi } from "api/user";
import { AvatorView } from "components/user/user_view";
import * as H from "history";

export type EditorProps = {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  submitting: boolean;
  value: string;
};

const Editor = ({ onChange, onSubmit, submitting, value }: EditorProps) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        Add Comment
      </Button>
    </Form.Item>
  </>
);

export type LectureCommentsListProps = {
  lectureApi: ApiSet<LectureResponse> & { execute: (id: number) => void };
  histroy: H.History;
};

export const LectureCommetnsList = (props: LectureCommentsListProps) => {
  const postCommentApi = usePostCommentApi();
  const favoCommentApi = useFavoCommentApi();
  const favoriteApi = useCreateFavoriteApi();
  const userApi = useFetchUserByAccountAddressApi();
  const params = useParams<{ id: string }>();
  const commentForm = useForm<CommentForm>({ lectureId: params.id });
  // const favoriteForm = useForm<Favorite | undefined>(undefined)
  const [account, setAccount] = useState<string | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<User>();
  const favoriteForm = useForm<Favorite>({user: undefined, comment: undefined})

  useEffect(() => {
    (async () => setAccount(await getCurrentAccountAddress()))();
  }, []);

  useEffectSkipFirst(() => {
    if (account !== undefined) {
      userApi.execute(account);
      // commentForm.updateObject("commenterEoa", account);
    }
  }, [account]);

  useEffectSkipFirst(() => {
    if (userApi.isSuccess()) {
      console.log(userApi.response.user);
      setCurrentUser(userApi.response.user)
      commentForm.updateObject("commenterId", userApi.response.user.id);
      // commentForm.updateObject("commenter", userApi.response.user);
    }
  }, [userApi.loading]);

  useEffectSkipFirst(() => {
    if (postCommentApi.isSuccess()) {
      props.lectureApi.execute(Number(props.lectureApi.response.lecture.id));
    }
  }, [postCommentApi.loading]);

  useEffectSkipFirst(() => {
    if (favoCommentApi.isSuccess()) {
      props.lectureApi.execute(Number(props.lectureApi.response.lecture.id));
    }
  }, [favoCommentApi.loading]);

  // function handlePostFavo(comment: Comment){
  //   const favoriteForm = useForm<FavoriteForm>({ comment: comment, user: currentUser! });
  //   console.log({POSTしようとしているデータ: favoriteForm})
  //   favoriteApi.execute(favoriteForm)
  // }
  const handlePostFavo = (
    comment: Comment
  ) => {
    console.log("POSTしようとしている...")
    favoriteForm.update((f) => {
      f!.user = currentUser!
      f!.comment = comment
    });
    favoriteApi.execute(favoriteForm!)
  };

  return (
    <>
      {!!(props.lectureApi.response.lecture.comments ?? []).length && (
        <List
          itemLayout="horizontal"
          dataSource={props.lectureApi.response.lecture.comments ?? []}
          renderItem={(item: Comment) => {
            const action =
              Number(item.id) % 3 === 0
                ? "liked"
                : Number(item.id) % 3 === 1
                ? "disliked"
                : undefined;
            return (
              <li>
                <AntdComment
                  actions={[
                    <Tooltip key="comment-basic-like" title="Like">
                      <span
                        onClick={() => {
                          if (item.commenter?.eoa === account) {
                            notification.config({
                              maxCount: 1,
                            });
                            notification["error"]({
                              message: "自分のコメントにはいいねを押せません",
                              style: {
                                backgroundColor: "#FFF2F0",
                              },
                            });
                          } else {
                            console.log(item);
                            addFavos(item.commenter?.eoa, 1);
                            notification.config({
                              maxCount: 1,
                            });
                            notification["info"]({
                              message: "コメントに「いいね」を押しました",
                              style: {
                                backgroundColor: "#E6F7FF",
                              },
                            });
                            handlePostFavo(item)
                            // favoCommentApi.execute(item);
                          }
                        }}
                      >
                        <LikeOutlined
                          style={{
                            verticalAlign: "middle",
                          }}
                        />
                        <span className="comment-action">{item.favo ?? 0}</span>
                      </span>
                    </Tooltip>,
                  ]}
                  author={item.commenter?.eoa}
                  avatar={AvatorView(item.commenter?.eoa)}
                  content={item.content}
                  datetime={moment(item.createdAt).fromNow()}
                />
              </li>
            );
          }}
        />
      )}
      <AntdComment
        avatar={AvatorView(account)}
        content={
          <Editor
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              commentForm.updateObject("content", e.target.value);
            }}
            onSubmit={() => {
              if (commentForm.object.content?.length) {
                postCommentApi.execute(commentForm);
              }
            }}
            submitting={postCommentApi.loading}
            value={commentForm.object.content ?? ""}
          />
        }
      />
    </>
  );
};
