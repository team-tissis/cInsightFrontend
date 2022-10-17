import { Avatar, Button, Comment, CommentProps, Form, List } from "antd";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";
import { useEffect, useState } from "react";
import { useEffectSkipFirst } from "utils/hooks";

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

export type DiscussionListProps = {
  data: CommentProps[];
};

export const DiscussionList = (props: DiscussionListProps) => {
  const [comments, setComments] = useState<CommentProps[]>(props.data);

  useEffectSkipFirst(() => {
    setComments(props.data);
  }, [props.data]);

  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState("");
  const handleSubmit = () => {
    if (!value) return;

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setValue("");
      setComments([
        ...comments,
        {
          author: "Han Solo",
          avatar: "https://joeschmoe.io/api/v1/random",
          content: <p>{value}</p>,
          datetime: moment("2016-11-22").fromNow(),
        },
      ]);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };
  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={comments}
        renderItem={(item: CommentProps) => (
          <li>
            <Comment
              actions={[<span key="comment-list-reply-to-0">Reply to</span>]}
              author={item.author}
              avatar={item.avatar}
              content={item.content}
              datetime={item.datetime}
            />
          </li>
        )}
      />
      <Comment
        avatar={
          <Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />
        }
        content={
          <Editor
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitting={submitting}
            value={value}
          />
        }
      />
    </>
  );
};
