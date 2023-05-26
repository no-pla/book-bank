import { atom } from "recoil";

interface ItargetBookData {
  title?: string;
  publisher?: string;
  thumbnail?: string;
  price?: number;
  authors?: string | string[];
}

interface IMyBook {
  title?: string;
  publisher?: string;
  price?: number;
  id?: string;
  authors?: string[];
  createdAt?: number;
  createdDay?: number;
  createdMonth?: number;
  createdYear?: number;
  review?: string;
  thumbnail?: string;
  uid?: string;
}

export const selectBookState = atom<ItargetBookData>({
  key: "selectBookState",
  default: {},
});

export const selectMyBookState = atom<IMyBook>({
  key: "selectMyBookState",
  default: {},
});

export const isFormEdit = atom<boolean>({
  key: "isFormEdit",
  default: false,
});

export const userDirectFormState = atom<boolean>({
  key: "userDirectFormState",
  default: false,
});
