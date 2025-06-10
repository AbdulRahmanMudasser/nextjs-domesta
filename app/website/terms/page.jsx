import dynamic from "next/dynamic";
import Terms from "./terms";
export const metadata = {
  title: "Terms || Domesta  - Listing Board",
  description: "Domesta  - Listing Board",
};

const index = () => {
  return (
    <>
      <Terms />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
