import { BaseModel } from "model/base";

export class CardModel extends BaseModel {
  code: string;
  webName: string;
  firstname: string;
  lastname: string;
  sport: SportType;
  year: number | string;
  note: string;
  portid: number;
  ma28: number;
  group_ref: number;
  /**OnCardCode */
  cardNumber: string;
  publisher: publisherType;

  /**Base/Insert name */
  type: Type;

  /**Collection name */
  set: SetType;

  /**Parallel or color */
  color: ColorType;
  printRun: string;
  onCardCode: string;
  count: string;
  maxPrice: number;
  minPrice: number;
  lastPrice: number;
  averagePrice: number;
  portfolio: number;
  wishlist: number;
  imgArr: string[];
  id: string;
  memo?: number;
  auto?: number;
  grade_display_value_short?: string;
  grade_display_value?: string;
  cardFrontImage: CardImage;

  constructor(json?: { [key: string]: any }) {
    super();
    json = json ?? {};
    this.code = json.code ?? "";
    this.webName = json.webName ?? "";
    this.firstname = json.firstname ?? "";
    this.lastname = json.lastname ?? "";
    this.note = json.note ?? "";
    this.sport = json.sport ?? {};
    this.year = json.year ?? 0;
    this.ma28 = json.ma28 ?? 0;
    this.cardFrontImage = json.cardFrontImage ?? {};
    this.group_ref = json.group_ref ?? 0;
    this.cardNumber = json.OnCardCode ?? "";
    this.portid = json.portid ?? "";
    this.onCardCode = json.OnCardCode ?? json.onCardCode;
    this.grade_display_value_short = json.grade_display_value_short ?? "";
    this.grade_display_value = json.grade_display_value ?? "";
    this.publisher = json.publisher ?? {};
    
    this.type = json.type ?? {};
    this.set = json.set
      ? {
          id: typeof json.set === "object" ? json.set.id : json.set,
          name: typeof json.set === "object" ? json.set.name : "",
          url: typeof json.set === "object" ? json.set.url : "",
          title: typeof json.set === "object" ? json.set.title: "",
        }
      : { id: 0, name: "", url: "" , title: ""};
    this.color = json.color ?? {};
    this.id = json.id ?? 0;
    this.printRun = json.printRun ?? "";
    this.count = json.count ?? "";
    this.maxPrice = json.maxPrice ?? 0;
    this.minPrice = json.minPrice ?? 0;
    this.lastPrice = json.lastPrice ?? 0;
    this.averagePrice = json.averagePrice ?? 0;
    this.portfolio = json.portfolio ?? 0;
    this.wishlist = json.wishlist ?? 0;
    this.imgArr = json.imgArr ?? [];
    this.memo = json.memo ?? 0;
    this.auto = json.auto ?? 0;
  }

  get fullWebName(): string {
    return `${this.webName}${
      this.cardNumber.length === 0 ? "" : " - #" + this.cardNumber
    }`;
  }

  get slugCard() :string {
    return `${this.webName.replace(/-/g,'').replace(/  /g,' ').replace(/'/g,'').replace(/#/g,'').replace(/ /g,'-').toLowerCase()}${
      this.cardNumber.length === 0 ? "" : "-" + this.cardNumber
    }`;
  }

  get fullName(): string {
    return `${this.firstname}${
      this.firstname === "" || this.lastname === "" ? "" : " "
    }${this.lastname}`;
  }

  get fullNameWithCode(): string {
    return `${this.firstname}${
      this.firstname === "" || this.lastname === "" ? "" : " "
    }${this.lastname}${
      this.cardNumber.length === 0 ? "" : " #" + this.cardNumber
    }`;
  }

  toJson(): { [key: string]: any } {
    throw new Error("Method not implemented.");
  }
}

type SetType = {
  id: number;
  name: string;
  url: string;
  title: string;
};
type publisherType = {
  id: number;
  name: string;
};

type ColorType = {
  code: number;
  name: string;
  url: string;
};

type Type = {
  id: number;
  name: string;
};

type CardImage = {
  id: number;
  img: string;
}

type SportType = {
  id: number;
  name: string;
};

/**Sale point data */
export class SaleData extends BaseModel {
  cardID: number;
  id: number;
  link?: string | null;
  date: string;
  price: number;
  grade_company?: string | null;
  grade_value: string;
  img?: string | null;

  constructor(json?: { [key: string]: any }) {
    super();
    json = json ?? {};
    this.cardID = json.cardID ?? 0;
    this.id = json.id ?? 0;
    this.link = json.link;
    this.date = json.date ?? new Date(Date.now()).toISOString();
    this.price = json.price ?? "";
    this.grade_company = json.grade_company;
    this.grade_value = json.grade_value ?? "0";
    this.img = json.img;
  }

  toJson(): { [key: string]: any } {
    return {
      cardID: this.cardID,
      id: this.id,
      link: this.link,
      date: this.date,
      price: this.price,
      grade_company: this.grade_company,
      grade_value: this.grade_value,
      img: this.img,
    }
  }
}

enum ReviewStatus {
  notReview = 0,
  review = 1,
}

export class ImageLibrary extends BaseModel {
  url: string;
  userName: string;
  userId: number;
  dateUploaded: string;
  status: ReviewStatus;
  fullUrl?: string;
  blurHash?: string;

  constructor(json?: { [key: string]: any }) {
    super();
    json = json ?? {};
    this.url = json.url ?? "";
    this.userName = json.uploaded_by_username ?? "";
    this.userId = json.uploaded_by_userid ?? 0;
    this.dateUploaded = json.uploaded_date ?? "";
    this.status = json.review_status ?? ReviewStatus.notReview;
    this.blurHash = json.blurhash;
  }

  toJson(): { [key: string]: any } {
    throw new Error("Method not implemented.");
  }
}
