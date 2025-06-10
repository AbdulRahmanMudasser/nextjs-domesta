import dynamic from "next/dynamic";
import EmployerList from "./employer";

export const metadata = {
  title: "Employer List || Domesta  - Listing Board",
  description: "Domesta  - Listing Board",
};

const index = () => {
  return (
    <>
      <EmployerList />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
