import { atom } from "recoil";

export const selectBookState = atom({
  key: "selectBookState",
  default: {},
});

export const selectMyBookState = atom({
  key: "selectMyBookState",
  default: {},
});
