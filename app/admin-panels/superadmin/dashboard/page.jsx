import dynamic from "next/dynamic";
import DashboadHome from "./DashboardPage";

export const metadata = {
  title: "SuperAdmin Dashboard || Domesta  - Listing Board",
  description: "Domesta  - Listing Board",
};

const index = () => {
  return (
    <>
      <DashboadHome />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
