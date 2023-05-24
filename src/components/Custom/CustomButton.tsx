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
  background-color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
`;
