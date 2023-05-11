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
