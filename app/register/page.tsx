"use client";

import SignUpForm from "@/components/Auth/SignUpForm";
import useAuth from "@/components/Hooks/useAuth";
import React from "react";
import { Helmet } from "react-helmet-async";

const Page = () => {
  const _ = useAuth();

  return (
    <>
      <Helmet>
        <title>Book Bank / 회원가입</title>
      </Helmet>
      <SignUpForm />
    </>
  );
};

export default Page;
