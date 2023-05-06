import styled from "@emotion/styled";
import React from "react";

const ErrorModal = ({ title, content, toggle, onFunc }: any) => {
  return (
    <Backdrop>
      <Modal>
        <ModalTitle>{title}</ModalTitle>
        <ModalContent>{content}</ModalContent>
        <ModalButtonContainer>
          <ModalButton onClick={toggle}>닫기</ModalButton>
          <ModalButton onClick={onFunc}>확인</ModalButton>
        </ModalButtonContainer>
      </Modal>
    </Backdrop>
  );
};

const Modal = styled.div`
  text-align: center;
  width: calc(min(60vw, 300px));
  background-color: #ffffff;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  height: calc(min(32vw, 140px));
  justify-content: space-between;
`;

const ModalTitle = styled.h3`
  font-weight: 600;
  padding: 16px 0 0 0;
  color: darkred;
`;

const ModalContent = styled.p`
  color: darkgray;
  font-size: 12px;
  line-height: 16px;
`;

const ModalButtonContainer = styled.div`
  background-color: rebeccapurple;
  height: 32%;
  border-radius: 0 0 4px 4px;
  > button:first-of-type {
    border-bottom-left-radius: 4px;
    border-right: none;
  }
  > button:nth-of-type(2) {
    border-bottom-right-radius: 4px;
  }
`;

const ModalButton = styled.button`
  height: 100%;
  width: 50%;
  border: 1px solid lightgray;
  cursor: pointer;
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  background: rgba(159, 159, 159, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  overflow-y: hidden;
`;

export default ErrorModal;
