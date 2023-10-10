"use client";

import React from "react";
import { Helmet } from "react-helmet-async";
import useAuth from "../../src/components/Hooks/useAuth";
import LoginForm from "../../src/components/Auth/LogInForm";

const Page = () => {
  const _ = useAuth();

  return (
    <>
      <Helmet>
        <title>Book Bank / 로그인</title>
      </Helmet>
      <LoginForm />
    </>
  );
};

export default Page;
