import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <ul>
      <li>
        <Link href="/">홈</Link>
      </li>
      <li>
        <Link href="/banking">입금 내역</Link>
      </li>
      <li>
        <Link href="/banking/deposit">입금하기</Link>
      </li>
    </ul>
  );
};

export default Header;
