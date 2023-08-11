import React from "react";
import styled from "@emotion/styled";
import LandingImage from "../../../public/landing-image.jpg";
import { useRouter } from "next/router";

type ILandingImage = {
  src: string;
};

const FormLayout = ({ children }: any) => {
  const router = useRouter();

  return (
    <LayoutContainer LandingImage={LandingImage}>
      <BannerContainer>
        <Icon>📚</Icon>
        <Description>
          {router.pathname.includes("login") ? "로그인" : "회원가입"}하고
          <br />
          독서를 저금하세요.
        </Description>
        <div>{children}</div>
      </BannerContainer>
    </LayoutContainer>
  );
};

export default FormLayout;

const Icon = styled.div`
  font-size: 3rem;
  text-align: center;
`;

export const Description = styled.p`
  text-align: center;
  margin: 20px 0 40px;
  line-height: 1.3rem;
  font-weight: 800;
`;

const BannerContainer = styled.div`
  background-color: whitesmoke;
  border: 2px solid var(--main-color);
  width: calc(min(90vw, 400px));
  height: fit-content;
  padding: 32px;
  box-sizing: border-box;
`;

const LayoutContainer = styled.div<{ LandingImage: ILandingImage }>`
  background-repeat: no-repeat;
  background-image: url(${(props) => props.LandingImage.src});
  background-position: center;
  background-size: cover;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;
