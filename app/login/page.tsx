"use client";

import React from "react";
import LoginForm from "@/components/Auth/LogInForm";
import { Helmet } from "react-helmet-async";
import useAuth from "@/components/Hooks/useAuth";

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
