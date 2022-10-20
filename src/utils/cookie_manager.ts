import Cookies from "js-cookie";

enum Key {
  UserToken = "user_token",
  DisplaySettingsToken = "display_settings",
}

export class CookieManager {
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
