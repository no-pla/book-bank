export default function Home({ currentUser }: any) {
  return <h1>{currentUser?.displayName || "닉네임"} 님</h1>;
}
