import React from "react";
import { Helmet } from "react-helmet";
import SignUpForm from "@/components/Auth/SignUpForm";
import FormLayout from "@/components/Layout/LandingLayout";

const Register = () => {
  return (
    <FormLayout>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content="독서 기록 남기기" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="독서, 독후감, 독서 기록, 독서기록장" />
        <title>Book Bank / 회원가입</title>
      </Helmet>
      <SignUpForm />
    </FormLayout>
  );
};

export default Register;
