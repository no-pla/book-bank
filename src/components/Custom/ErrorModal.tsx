import React from "react";
import { createPortal } from "react-dom";
import {
  Modal,
  ModalButton,
  ModalButtonContainer,
  ModalContainer,
  ModalContent,
  ModalTitle,
} from "./ConfirmModal";

const ErrorModal = ({ title, content, toggle }: any) => {
  return (
    <>
      {createPortal(
        <ModalContainer>
          <Modal>
            <ModalTitle>{title}</ModalTitle>
            <ModalContent>{content}</ModalContent>
            <ModalButtonContainer>
              <ModalButton onClick={toggle}>닫기</ModalButton>
            </ModalButtonContainer>
          </Modal>
        </ModalContainer>,
        document.getElementById("portal")!
      )}
    </>
  );
};

export default ErrorModal;
