import { useState } from "react";

const useModal = () => {
  const [isShowing, setIsShowing] = useState<boolean>(false);
  const toggle = () => setIsShowing((prev) => !prev);
  return {
    isShowing,
    toggle,
  };
};

export default useModal;
