import React from "react";
import ContentLoader from "react-content-loader";

const SkeletonAmount = ({ color }: { color: string }) => {
  return (
    <ContentLoader
      speed={2}
      width={100}
      height={28}
      viewBox="0 0 100 28"
      backgroundColor={color}
      foregroundColor="#f0f0f0"
      style={{ width: "100%" }}
    >
      <rect x="0" y="0" rx="4" ry="4" width="100" height="28" />
    </ContentLoader>
  );
};

export default SkeletonAmount;
