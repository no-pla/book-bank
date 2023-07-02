import React from "react";
import styled from "@emotion/styled";

const CustomButton = ({ value, type, onClick, disabled }: any) => {
  return (
    <Button onClick={onClick} type={type} disabled={disabled}>
      {value}
    </Button>
  );
};

export default CustomButton;

const Button = styled.button`
  padding: 8px 16px;
  background-color: whitesmoke;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  &:disabled {
    background-color: #e2e2e2;
  }
`;
