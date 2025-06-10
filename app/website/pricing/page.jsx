import dynamic from "next/dynamic";
import Pricing from "./pricing";
export const metadata = {
  title: "Pricing || Domesta  - Listing Board",
  description: "Domesta  - Listing Board",
};

const index = () => {
  return (
    <>
      <Pricing />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

