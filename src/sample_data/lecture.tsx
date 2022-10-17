import { CommentProps, Tooltip } from "antd";
import { Lecture } from "entities/lecture";
import moment from "moment";

const comments = [
  {
    author: "Han Solo",
    avatar: "https://joeschmoe.io/api/v1/random",
    content: (
      <p>
        We supply a series of design principles, practical patterns and high
        quality design resources (Sketch and Axure), to help people create their
        product prototypes beautifully and efficiently.
      </p>
    ),
    datetime: (
      <Tooltip title="2016-11-22 11:22:33">
        <span>8 hours ago</span>
      </Tooltip>
    ),
  },
  {
    actions: [<span key="comment-list-reply-to-0">Reply to</span>],
    author: "Han Solo",
    avatar: "https://joeschmoe.io/api/v1/random",
    content: (
      <p>
        We supply a series of design principles, practical patterns and high
        quality design resources (Sketch and Axure), to help people create their
        product prototypes beautifully and efficiently.
      </p>
    ),
    datetime: (
      <Tooltip title="2016-11-22 10:22:33">
        <span>9 hours ago</span>
      </Tooltip>
    ),
  },
];

export const lectureData: Lecture[] = Array(100)
  .fill(0)
  .map((_, i) => ({
    id: String(i + 1),
    date: "2022-11-02",
    name: `勉強会${i + 1}`,
    author: {
      firstName: "nisshimo",
    },
    nLike: i + 1,
    createdAt: "2022-01-02",
    status: i % 3 == 0 ? "Not Started" : i % 3 == 1 ? "Held Now" : "End",
    comments: comments,
    tags: i % 3 == 0 ? ["物理", "数学"] : ["英語", "国語"],
    perticipants: 21,
    maxPerticipants: 100,
    materialUrl: "http://localhost:3000/lectures/3",
    movieUrl:
      "https://www.youtube.com/watch?v=SSo_EIwHSd4&ab_channel=SimplyExplained",
    moviePrice: 98,
  }));
