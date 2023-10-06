"use client";

import styled from "@emotion/styled";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const LandingLayout = ({ children }: Props) => {
  const pathname = usePathname();

  return (
    <LayoutContainer>
      <Image
        src="/landing-image.jpg"
        alt="배경 이미지이다. 많은 책들이 가득 쌓여있다."
        fill={true}
        style={{
          objectFit: "cover",
        }}
      />
      <BannerContainer>
        <Icon>📚</Icon>
        <Description>
          회원가입하고
          <br />
          독서를 저금하세요.
        </Description>
        <div>{children}</div>
      </BannerContainer>
    </LayoutContainer>
  );
};

export default LandingLayout;

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
  padding: 24px 32px;
  box-sizing: border-box;
  position: absolute;
`;

const LayoutContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`;
