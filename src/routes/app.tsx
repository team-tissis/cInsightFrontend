import React from "react";
import { Route, Switch } from "react-router-dom";
import Error404Page from "../components/shared/error_404";
import Layout from "components/shared/layout";
import UserPage from "components/user/user_page";
import MyPage from "components/user/my_page";
import UsersPage from "components/user/users_page";
import LecturePage from "components/lectures/lecture_page";
import LecturesPage from "components/lectures/lectures_page";
import ProposalPage from "components/proposals/proposal_page";
import ProposalsPage from "components/proposals/proposals_page";
import LandingPage from "components/landing/landing_page";

const AppRoutes: React.FC = () => {
  return (
    <Switch>
      <Route exact path={AppRouteHelper.root()}>
        <LandingPage />
      </Route>
      <Route exact path={AppRouteHelper.main()}>
        <LandingPage />
      </Route>
      <Route path={"/"}>
        <Layout>
          {/* <UserAuth> */}
          <Switch>
            <Route exact path={AppRouteHelper.main()}>
              <MyPage />
            </Route>
            <Route exact path={AppRouteHelper.myPage()}>
              <MyPage />
            </Route>
            <Route exact path={AppRouteHelper.lectures()}>
              <LecturesPage />
            </Route>
            <Route exact path={AppRouteHelper.lecture()}>
              <LecturePage />
            </Route>
            <Route exact path={AppRouteHelper.proposals()}>
              <ProposalsPage />
            </Route>
            <Route exact path={AppRouteHelper.proposal()}>
              <ProposalPage />
            </Route>
            <Route exact path={AppRouteHelper.users()}>
              <UsersPage />
            </Route>
            <Route exact path={AppRouteHelper.user()}>
              <UserPage />
            </Route>
            <Route>
              <Error404Page />
            </Route>
          </Switch>
        </Layout>
        {/* </UserAuth> */}
      </Route>
    </Switch>
  );
};

export default AppRoutes;

/**
 * ルート定義
 */
export class AppRouteHelper {
  static basePath = (path: string): string => `/${path}`;

  public static root = (): string => "/";

  // 勉強会一覧
  public static proposals = (): string => AppRouteHelper.basePath("proposals");
  public static proposal = (): string =>
    AppRouteHelper.basePath("proposals/:id");
  public static lectures = (): string => AppRouteHelper.basePath("lectures");
  public static lecture = (): string => AppRouteHelper.basePath("lectures/:id");
  public static users = (): string => AppRouteHelper.basePath("users");
  public static user = (): string => AppRouteHelper.basePath("users/:id");
  public static login = (): string => AppRouteHelper.basePath("login");
  public static main = (): string => AppRouteHelper.basePath("main");

  public static myPage = (): string => AppRouteHelper.basePath("mypage");
}
