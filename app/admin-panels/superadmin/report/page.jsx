import dynamic from "next/dynamic";

export const metadata = {
  title: "Report || Domesta  - Listing Board",
  description: "Domesta  - Listing Board",
};

const index = () => {
  return (
    <>
      <h2>Report Page</h2>
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
