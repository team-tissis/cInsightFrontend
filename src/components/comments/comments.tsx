import { Avatar, Button, Comment as AntdComment, Form, List } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { Comment, CommentForm } from "entities/comment";
import { useState } from "react";
import { useEffectSkipFirst, useForm } from "utils/hooks";
import { usePostCommentApi } from "api/comment";
import { ApiSet } from "utils/network/api_hooks";
import { LectureResponse } from "api/lecture";
import { useParams } from "react-router";
import moment from "moment";

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
};

export const LectureCommetnsList = (props: LectureCommentsListProps) => {
  const postCommentApi = usePostCommentApi();
  const params = useParams<{ id: string }>();
  const commentForm = useForm<CommentForm>({ lectureId: params.id });
  const [comments, setComments] = useState<Comment[]>(
    props.lectureApi.response.lecture.comments ?? []
  );

  useEffectSkipFirst(() => {
    if (postCommentApi.isSuccess()) {
      props.lectureApi.execute(Number(props.lectureApi.response.lecture.id));
    }
  }, [postCommentApi.loading]);

  return (
    <>
      {!!comments.length && (
        <List
          itemLayout="horizontal"
          dataSource={comments}
          renderItem={(item: Comment) => (
            <li>
              <AntdComment
                author={item.commenterEoa}
                avatar={
                  <Avatar
                    src="https://joeschmoe.io/api/v1/random"
                    alt="Han Solo"
                  />
                }
                content={item.content}
                datetime={moment(item.createdAt).fromNow()}
              />
            </li>
          )}
        />
      )}
      <AntdComment
        avatar={
          <Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />
        }
        content={
          <Editor
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              commentForm.updateObject("content", e.target.value);
            }}
            onSubmit={() => {
              postCommentApi.execute(commentForm);
            }}
            submitting={postCommentApi.loading}
            value={commentForm.object.content ?? ""}
          />
        }
      />
    </>
  );
};
