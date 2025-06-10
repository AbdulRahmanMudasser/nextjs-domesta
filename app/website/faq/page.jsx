import dynamic from "next/dynamic";
import FAQs from "./faq";
export const metadata = {
  title: "FAQs || Domesta  - Listing Board",
  description: "Domesta  - Listing Board",
};

const index = () => {
  return (
    <>
      <FAQs />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
