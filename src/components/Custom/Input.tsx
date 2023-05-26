import React from "react";
import styled from "@emotion/styled";
import { useFormContext } from "react-hook-form";

const Input = ({ placeholder, type, name, validation, defaultValue }: any) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<any>();

  return (
    <>
      <Label htmlFor={name}>{placeholder}</Label>
      {/* placeholder는 스크린 리더가 읽지 못할 수도 있기 때문에 label를 추가해주어야 한다. */}
      <StyledInput
        placeholder={placeholder}
        type={type}
        {...register(name, validation)}
        id={name}
        name={name}
        defaultValue={defaultValue}
      />
      <ErrorMessage>
        {errors[name] && <>{errors[name]?.message?.toString()}</>}
      </ErrorMessage>
    </>
  );
};

const Label = styled.label`
  padding: 4px 0;
  width: 100%;
`;

export const StyledInput = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid lightgray;
  width: 100%;
  color: var(--text-color);
  box-sizing: border-box;
  font-size: 1.2rem;
  font-weight: 200;
`;

export const ErrorMessage = styled.p`
  color: var(--point-color2);
  text-align: left;
  padding: 2px 0 4px 12px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
`;

export default Input;
