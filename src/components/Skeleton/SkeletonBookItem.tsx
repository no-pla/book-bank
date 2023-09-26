import styled from "@emotion/styled";
import { BookListItem } from "../Banking/Form/SearchForm";
import ContentLoader from "react-content-loader";

const SkeletonBookItem = ({ idx }: { idx: string }) => {
  return (
    <BookListItem>
      <div>
        <ContentLoader
          speed={2}
          width={168}
          height={84}
          viewBox="0 0 168 84"
          backgroundColor="#f3f3f3"
          foregroundColor="#d1d1d1"
          style={{ width: "100%" }}
          uniqueKey={idx}
        >
          <rect x="0" y="0" rx="4" ry="4" width="100%" height="22%" />
          <rect x="0" y="28" rx="4" ry="4" width="66%" height="20%" />
          <rect x="0" y="64" rx="4" ry="4" width="80%" height="20%" />
        </ContentLoader>
      </div>
    </BookListItem>
  );
};

export default SkeletonBookItem;
