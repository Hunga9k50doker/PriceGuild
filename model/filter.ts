import { BaseModel } from "model/base";
import {FilterType} from "interfaces"

export class FilterModel extends BaseModel {

  id: string| number;
  name: string;
  options?: Array<FilterType>;
  year?: number;
  publisherID?: number;

  constructor(json?: { [key: string]: any }) {
    super();
    json = json ?? {};

    this.id = json.id ?? 0;
    this.name = json.setName ?? '';
    this.options = json.options ?? [];
    this.year = json.year ?? '';
    this.publisherID = json.publisherID ?? '';
  }

  toJson(): { [key: string]: any; } {
    return {
      "id": this.id,
      "name": this.name,
      "options": this.options,
      "year": this.year,
      "publisherID": this.publisherID,
    };
  }
}