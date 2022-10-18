import React from "react";
import { Route, Switch } from "react-router-dom";
import Error404Page from "../components/shared/error_404";
import Layout from "components/shared/layout";
import { MyPage } from "components/mypage/my_page";
import LecturePage from "components/lectures/lecture_page";
import { LecturesPage } from "components/lectures/lectures_page";
import UserAuth from "containers/user_auth";
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
  public static lectures = (): string => AppRouteHelper.basePath("lectures");
  public static lecture = (): string => AppRouteHelper.basePath("lectures/:id");
  public static login = (): string => AppRouteHelper.basePath("login");
  public static main = (): string => AppRouteHelper.basePath("main");

  public static myPage = (): string => AppRouteHelper.basePath("mypage");
}
