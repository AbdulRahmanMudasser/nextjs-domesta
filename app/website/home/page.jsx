import dynamic from "next/dynamic";
import LandingPage from "./LandingPage";

export const metadata = {
  title: "Candidates Dashboard || Domesta  - Listing Board",
  description: "Domesta  - Listing Board",
};

const index = () => {
  return (
    <>
      <LandingPage />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
