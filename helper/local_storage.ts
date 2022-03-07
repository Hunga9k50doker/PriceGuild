import { User } from "model/user";
import { getCookie, setCookie } from "utils/helper";
const ISSERVER = typeof window === "undefined";

export class MyStorage {
  static readonly USER_KEY = "USER";
  static readonly TOKEN_KEY = "TOKEN_KEY";
  static readonly LANG_CODE_KEY = "langCode";

  /**
   * @type {User}
   */
  static get user(): User {
    if (!ISSERVER) {
      return new User(
        JSON.parse(
          localStorage.getItem(MyStorage.USER_KEY) ?? new User().toString()
        )
      );
    }
    return new User();
  }

  static set user(data: User) {
    if (!ISSERVER) {
      localStorage.setItem(MyStorage.USER_KEY, data.toString());
    }
  }

  /**Lấy token của user:
   * - Nếu không tồn tại sẽ tả về rỗng.
   */
  // @ts-ignore
  static get token(): string {
    if (!ISSERVER) {
      return localStorage.getItem(MyStorage.TOKEN_KEY) ?? "";
    }
  }

  static set token(token: string) {
    if (!ISSERVER) {
      setCookie(MyStorage.TOKEN_KEY, token, 36000)
      localStorage.setItem(MyStorage.TOKEN_KEY, token);
    }
  }

  /**Lấy token của user:
   * - Mặc định: ```en```
   */
  // @ts-ignore
  static get langCode(): string {
    if (!ISSERVER) {
      return localStorage.getItem(MyStorage.LANG_CODE_KEY) ?? "en";
    }
  }

  static set langCode(langCode: string) {
    if (!ISSERVER) {
      localStorage.setItem(MyStorage.LANG_CODE_KEY, langCode);
    }
  }

  static remove(key: string) {
    if (!ISSERVER) {
      localStorage.removeItem(key);
    }
  }

  /** Gỡ bỏ các dữ liệu đã lưu ở local (```localStorage```) */
  static resetWhenLogout() {
    this.remove(MyStorage.USER_KEY);
    this.remove(MyStorage.TOKEN_KEY);
    this.remove(MyStorage.LANG_CODE_KEY);
    setCookie(MyStorage.TOKEN_KEY, '', 36000)
  }
}
