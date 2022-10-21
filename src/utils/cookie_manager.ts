import { Lecture } from "entities/lecture";
import Cookies from "js-cookie";

enum Key {
  UserToken = "user_token",
  DisplaySettingsToken = "display_settings",
  LecturesData = "lectures_data",
}

export class CookieManager {
  public static saveLecturesData = (lectures: Lecture[]): void => {
    const json = JSON.stringify(lectures);
    console.log(json);
    Cookies.set(Key.LecturesData, json);
  };

  public static getLecturesData = (): Lecture[] => {
    const json = Cookies.get(Key.LecturesData) as string;
    if (!json) {
      return [];
    }
    return JSON.parse(json);
  };

  public static saveUserToken(token: string): void {
    Cookies.set(Key.UserToken, token, { expires: 60 });
  }

  public static getUserToken(): string {
    return Cookies.get(Key.UserToken) as string;
  }

  public static removeUserToken(): void {
    Cookies.remove(Key.UserToken);
  }

  public static hasUserToken(): boolean {
    return !CookieManager.getUserToken() ? false : true;
  }

  public static saveDisplaySettings(
    pageName: string,
    tableName: string,
    hiddenList: number[]
  ): void {
    const json: string = JSON.stringify(hiddenList);
    Cookies.set(`${pageName}_${tableName}`, json);
  }

  public static getDisplaySettings(
    pageName: string,
    tableName: string
  ): number[] | undefined {
    const json = Cookies.get(`${pageName}_${tableName}`);
    if (!json) {
      return;
    }
    return JSON.parse(json) as number[];
  }
}
