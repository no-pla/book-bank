import React from "react";
import styled from "@emotion/styled";
import LandingImage from "../../../public/landing-image.jpg";

const FormLayout = ({ children }: any) => {
  return (
    <LayoutContainer LandingImage={LandingImage}>{children}</LayoutContainer>
  );
};

export default FormLayout;

const LayoutContainer = styled.div<{ LandingImage: any }>`
  display: flex;
  background-repeat: no-repeat;
  background-image: url(${(props) => props.LandingImage.src});
  background-position: center;
  background-size: cover;
  width: 100%;
`;

const Landing = styled.div<{ LandingImage: any }>`
  height: 100vh;
  background-repeat: no-repeat;
  background-image: url(${(props) => props.LandingImage.src});
  background-position: center;
  background-size: cover;
  position: relative;
`;

const LandingText = styled.h1`
  color: #393b4c;
  font-weight: 700;
  font-size: 38px;
  position: absolute;
  top: 28%;
  left: 12%;
`;
