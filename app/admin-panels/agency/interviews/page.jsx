import dynamic from "next/dynamic";
import Interview from "./interviews";

export const metadata = {
  title: "Interviews List || Domesta  - Listing Board",
  description: "Domesta  - Listing Board",
};

const index = () => {
  return (
    <>
      <Interview />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
