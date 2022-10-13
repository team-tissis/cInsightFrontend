import { useParams, withRouter } from "react-router";
import * as H from "history";
import { Flex } from "components/shared/flex";
import { useEffect } from "react";
import { useFetchLectureApi } from "api/lecture";
import { DiscussionList } from "components/discussion/discussion_list";

type Props = {
  history: H.History;
};

const LecturePage = (props: Props) => {
  const params = useParams<{ id: string }>();
  const lectureApi = useFetchLectureApi();

  useEffect(() => {
    lectureApi.execute(Number(params.id));
  }, []);

  const lecture = () => {
    return lectureApi.response.lecture;
  };

  return (
    <Flex flexDirection="column">
      <h4 style={{ padding: 10 }}>{lecture().name}</h4>
      <DiscussionList data={lecture().comments ?? []} />
    </Flex>
  );
};

export default withRouter(LecturePage);
