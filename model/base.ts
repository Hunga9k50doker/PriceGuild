export interface BaseResponse {
  status: number;
  message?: string;
  success: boolean;
  show_captcha?: boolean;
}

export abstract class BaseModel {
  abstract toJson(): { [key: string]: any };
  toString(): string {
    return `${this}`;
  }
}

export interface BaseResponseData<T> {
  data: T[];
}

export interface NewBaseResponse<T> extends BaseResponse {
  data: T;
}