import React from "react";
import styled from "@emotion/styled";
import { createPortal } from "react-dom";

const ConfirmModal = ({ title, content, toggle, onFunc }: any) => {
  return (
    <>
      {createPortal(
        <ModalContainer>
          <Modal>
            <ModalTitle>{title}</ModalTitle>
            <ModalContent>{content}</ModalContent>
            <ModalButtonContainer>
              <ModalButton onClick={toggle}>닫기</ModalButton>
              <ModalButton onClick={onFunc}>확인</ModalButton>
            </ModalButtonContainer>
          </Modal>
        </ModalContainer>,
        document.getElementById("portal")!
      )}
    </>
  );
};

export const ModalContainer = styled.div`
  z-index: 1;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(159, 159, 159, 0.6);
`;

export const Modal = styled.div`
  text-align: center;
  width: calc(min(90vw, 300px));
  background-color: #ffffff;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: space-between;
  z-index: 10;
`;

export const ModalTitle = styled.h3`
  font-weight: 600;
  padding: 16px 0 0 0;
  color: var(--point-color2);
  font-size: 1.1rem;
`;

export const ModalContent = styled.p`
  color: darkgray;
  line-height: 16px;
  font-size: 0.8rem;
  padding: 12px 8px;
`;

export const ModalButtonContainer = styled.div`
  height: 32%;
  border-radius: 0 0 4px 4px;
  > button:first-of-type {
    border-bottom-left-radius: 4px;
    border-right: none;
    color: var(--point-color2);
    font-weight: 700;
  }
  > button:nth-of-type(2) {
    border-bottom-right-radius: 4px;
    color: var(--point-color1);
    font-weight: 700;
  }
`;

export const ModalButton = styled.button`
  height: 100%;
  width: 50%;
  border: 1px solid lightgray;
  border-bottom: none;
  background-color: transparent;
  font-size: 1rem;
  padding: 12px 0;
`;

export default ConfirmModal;
