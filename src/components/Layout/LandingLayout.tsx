import React from "react";
import styled from "@emotion/styled";
import LandingImage from "../../../public/landing-image.jpg";

const FormLayout = ({ children }: any) => {
  return (
    <LayoutContainer LandingImage={LandingImage}>
      <BannerContainer>
        <Banner>
          <Description>당신의 독서를 저금하세요.</Description>
          <Title>북 뱅크</Title>
          <Icon>📚</Icon>
        </Banner>
        <div>{children}</div>
      </BannerContainer>
    </LayoutContainer>
  );
};

export default FormLayout;

export const Icon = styled.div`
  font-size: 4rem;
  @media (max-width: 375px) {
    display: none;
  }
`;

export const Description = styled.p`
  font-size: 1.2rem;
  font-weight: 200;
  margin-bottom: 12px;
`;

export const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
  @media (max-width: 375px) {
    margin-bottom: 0;
  }
`;

const Banner = styled.div`
  text-align: center;
`;

const BannerContainer = styled.div`
  width: min(80%, 800px);
  background: #8067a999;
  border-radius: 20px;
  height: min(70%, 700px);
  display: flex;
  align-items: center;
  gap: 8px;
  > div {
    flex: 1;
    padding: 20px;
  }
  @media (max-width: 768px) {
    height: fit-content;
    flex-direction: column;
    height: min-content;
    > div {
      padding: 8px;
    }
  }
`;

const LayoutContainer = styled.div<{ LandingImage: any }>`
  background-repeat: no-repeat;
  background-image: url(${(props) => props.LandingImage.src});
  background-position: center;
  background-size: cover;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: scroll;
  color: whitesmoke;
`;
