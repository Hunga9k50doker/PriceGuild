import { BaseModel } from "model/base";

export class Collection extends BaseModel {
  id: number;
  setName: string;
  setYear: number;
  publisherName: string;
  sportName: string;
  url_image: string;
  blurhash: string;
  url: string;
  title: string;

  constructor(json?: { [key: string]: any }) {
    super();
    json = json ?? {};

    this.id = json.id ?? 0;
    this.setName = json.setName ?? "";
    this.url = json.url ?? "";
    this.title = json.title ?? "";
    this.setYear = json.setYear ?? 0;
    this.publisherName = json.publisherName ?? "";
    this.sportName = json.sportName ?? "";
    this.url_image = json.url_image ?? "";
    this.blurhash = json.blurhash;
  }

  get fullWebName(): string {
    return `${this.setYear} ${this.publisherName} ${this.setName} ${this.sportName}`;
  }

  toJson(): { [key: string]: any } {
    return {
      id: this.id,
      setName: this.setName,
      setYear: this.setYear,
      publisherName: this.publisherName,
      sportName: this.sportName,
      url: this.url,
      title: this.title
    };
  }
}
