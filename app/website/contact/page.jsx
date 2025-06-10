import dynamic from "next/dynamic";
import Contact from "./contact";
export const metadata = {
  title: "Contact || Domesta  - Listing Board",
  description: "Domesta  - Listing Board",
};

const index = () => {
  return (
    <>
      <Contact />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
