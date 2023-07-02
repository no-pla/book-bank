import React from "react";
import { createPortal } from "react-dom";
import {
  Modal,
  ModalButtonContainer,
  ModalContainer,
  ModalContent,
  ModalTitle,
} from "./ConfirmModal";
import styled from "@emotion/styled";

const ErrorModal = ({ title, content, toggle }: any) => {
  return (
    <>
      {createPortal(
        <ModalContainer>
          <Modal>
            <ModalTitle>{title}</ModalTitle>
            <ModalContent>{content}</ModalContent>
            <ModalButtonContainer>
              <ErrorModalButton onClick={toggle}>닫기</ErrorModalButton>
            </ModalButtonContainer>
          </Modal>
        </ModalContainer>,
        document.getElementById("portal")!
      )}
    </>
  );
};

export default ErrorModal;

const ErrorModalButton = styled.button`
  height: 100%;
  width: 100%;
  border: none;
  border-top: 1px solid lightgray;
  cursor: pointer;
  background-color: transparent;
  font-size: 1.2rem;
`;
