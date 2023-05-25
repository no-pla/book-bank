import React, { useState } from "react";

const useDisabled = () => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const toggleDisabled = () => setIsDisabled((prev) => !prev);
  return {
    isDisabled,
    toggleDisabled,
  };
};

export default useDisabled;
