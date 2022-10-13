import { Comment, CommentProps, List } from "antd";

export type DiscussionListProps = {
  data: CommentProps[];
};

export const DiscussionList = (props: DiscussionListProps) => {
  return (
    <div style={{ backgroundColor: "#fff", padding: 30 }}>
      <div style={{ fontSize: 20 }}>Discussions</div>
      <List
        header={`${props.data.length} replies`}
        itemLayout="horizontal"
        dataSource={props.data}
        renderItem={(item: CommentProps) => (
          <li>
            <Comment
              actions={item.actions}
              author={item.author}
              avatar={item.avatar}
              content={item.content}
              datetime={item.datetime}
            />
          </li>
        )}
      />
    </div>
  );
};
