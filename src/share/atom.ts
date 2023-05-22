import { atom } from "recoil";

export const selectBookState = atom({
  key: "selectBookState",
  default: {},
});

export const selectMyBookState = atom({
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
