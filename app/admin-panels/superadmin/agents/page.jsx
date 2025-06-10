import dynamic from "next/dynamic";
import Agents from "./agents";
export const metadata = {
  title: "Agency List || Domesta  - Listing Board",
  description: "Domesta  - Listing Board",
};

const index = () => {
  return (
    <>
      <Agents />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
