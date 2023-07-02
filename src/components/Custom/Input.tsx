import React from "react";
import styled from "@emotion/styled";
import { useFormContext } from "react-hook-form";

type INickName = {
  maxLength?: {
    value: number;
    message: string;
  };
  minLength?: {
    value: number;
    message: string;
  };
  required: {
    value: boolean;
    message: string;
  };
  pattern?: {
    value: any;
    message: string;
  };
  validate?: any;
};

type IInputProps = {
  placeholder: string;
  type: string;
  name: string;
  validation: INickName;
};

const Input = ({ placeholder, type, name, validation }: IInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<any>();
  const error = errors[name];

  return (
    <>
      <Label htmlFor={name}>{placeholder}</Label>
      {/* placeholder는 스크린 리더가 읽지 못할 수도 있기 때문에 label를 추가해주어야 한다. */}
      <StyleInput
        placeholder={placeholder}
        type={type}
        {...register(name, validation)}
        id={name}
        name={name}
      />
      <ErrorMessage>{error && error?.message?.toString()}</ErrorMessage>
    </>
  );
};

const Label = styled.label`
  width: 100%;
  font-size: 0.9rem;
`;

export const StyleInput = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid lightgray;
  width: 100%;
  color: var(--text-color);
  box-sizing: border-box;
  margin-top: 4px;
`;

const ErrorMessage = styled.p`
  color: var(--point-color2);
  text-align: left;
  padding: 8px 0 8px 4px;
  font-size: 0.7rem;
  width: 100%;
  line-height: 0.9rem;
`;

export default Input;
