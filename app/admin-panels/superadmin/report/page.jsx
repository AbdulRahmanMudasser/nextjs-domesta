import dynamic from "next/dynamic";
import ReportsReport from "./report";

export const metadata = {
  title: "SuperAdmin Dashboard || Domesta  - Listing Board",
  description: "Domesta  - Listing Board",
};

const index = () => {
  return (
    <>
      <ReportsReport />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
