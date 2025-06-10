import dynamic from "next/dynamic";
import Hirings from "./hirings";


export const metadata = {
  title: "Hirings List || Domesta  - Listing Board",
  description: "Domesta  - Listing Board",
};

const index = () => {
  return (
    <>
      <Hirings />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
