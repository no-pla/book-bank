import React from "react";
import { Helmet } from "react-helmet";
import LoginForm from "@/components/Auth/LogInForm";
import FormLayout from "@/components/Layout/LandingLayout";

const Login = () => {
  return (
    <FormLayout>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content="독서 기록 남기기" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="독서, 독후감, 독서 기록, 독서기록장" />
        <title>Book Bank / 로그인</title>
      </Helmet>
      <LoginForm />
    </FormLayout>
  );
};

export default Login;
