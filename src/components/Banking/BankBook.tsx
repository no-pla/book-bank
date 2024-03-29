import styled from "@emotion/styled";
import { ReactNode, memo, useEffect, useMemo } from "react";
import useUserDepositList from "../Hooks/useUserDepositList";
import { auth } from "@/share/firebase";
import { useQueryClient } from "react-query";
import { usePathname } from "next/navigation";
import SkeletonAmount from "../Skeleton/SkeletonAmount";

interface Book {
  authors: string[];
  contents: string;
  datetime: string;
  id: string;
  isbn: string;
  price: number;
  publisher: string;
  sale_price: number;
  status: string;
  thumbnail: string;
  title: string;
  translators: string[];
  url: string;
}

interface BookBankProps {
  onClick: () => void;
  secondOnClick: () => void;
  text: string;
  secondText: string;
  transform: string;
  children?: ReactNode;
  disabled?: boolean;
}

const BankBook = ({
  onClick,
  secondOnClick,
  text,
  secondText,
  transform,
  children,
  disabled,
}: BookBankProps) => {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const userReviewList = useUserDepositList(auth.currentUser?.uid!);
  const totalBook = userReviewList?.length;
  const amount = useMemo(() => {
    return userReviewList
      ?.reduce((cur: number, acc: Book) => cur + acc.price, 0)
      .toLocaleString("ko-KR");
  }, [userReviewList]);

  useEffect(() => {
    queryClient.invalidateQueries("getReadBookInfo");
  }, []);

  return (
    <BankingInfo>
      <BankName>{children}</BankName>
      <div>
        <BankAmount transform={transform}>
          {userReviewList ? (
            <>
              <span>{`${amount}원`}</span>
              <span>{pathname == "/banking" && `(${totalBook}권)`}</span>
            </>
          ) : (
            <SkeletonAmount color="#bfb0d1" />
          )}
        </BankAmount>
      </div>
      <BankPage>
        <button disabled={disabled} onClick={onClick}>
          {text}
        </button>
        <button disabled={disabled} onClick={secondOnClick}>
          {secondText}
        </button>
      </BankPage>
    </BankingInfo>
  );
};

export default memo(BankBook);

const BankingInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 200px;
  border-radius: 12px;
  background-color: var(--sub-main-color);
  @media (max-width: 768px) {
    width: 100%;
  }
  @media (max-width: 600px) {
    width: 100%;
    height: 200px;
  }
`;

const BankName = styled.div`
  width: 100%;
  font-size: 0.9rem;
  box-sizing: border-box;
  padding: 0 20px;
  font-weight: 700;
`;

const BankAmount = styled.div<{ transform: string }>`
  font-weight: 800;
  font-size: 1.4rem;
  transform: translateY(40%);
  > span {
    word-break: break-all;
  }
`;

const BankPage = styled.div`
  > button {
    font-size: 0.9rem;
    background-color: transparent;
    border: none;
    padding: 0;
  }
  > button:first-of-type::after {
    content: "|";
    padding: 0 8px;
  }
`;
