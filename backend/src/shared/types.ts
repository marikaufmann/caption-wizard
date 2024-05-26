export type UserType = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  picture?: string;
  createdAt: Date;
  updatedAt: Date;
  credits: number;
  payments: PaymentType[];
};

export type SessionType = {
  _id: string;
  user: UserType["_id"];
  valid: boolean;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
};
export type SingleWordCaptionsType = {
  word: string;
  start: number;
  end: number;
  confidence: number;
  punctuated_word: string;
};
export type LineCaptionsType = {
  text: string;
  start: number;
  end: number;
};
export type SentenceCaptionsType = {
  text: string;
  start: number;
  end: number;
};
export type CaptionsType = {
  singleWordCaptions: SingleWordCaptionsType[];
  lineCaptions: LineCaptionsType[];
  sentenceCaptions: SentenceCaptionsType[];
};
export type VideoType = {
  _id: string;
  user: UserType["_id"];
  name: string;
  thumbnail: string;
  duration: number;
  width: number;
  height: number;
  size: string;
  language: string;
  frame_rate: number;
  downloadUrl: string;
  videoOriginalUrl: string;
  videoOriginalPublicId: string;
  videoWithCaptionslUrl: string;
  videoWithCaptionsPublicId: string;
  captions: CaptionsType[];
  createdAt: Date;
  updatedAt: Date;
};

export type PaymentType = {
  _id: string;
  userId: UserType["_id"];
  name: string;
  email: string;
  total: number;
  creditsAmount: number;
  status: string;
  receipt: string;
  refunded: boolean;
  createdAt: Date;
  updatedAt: Date;
};
