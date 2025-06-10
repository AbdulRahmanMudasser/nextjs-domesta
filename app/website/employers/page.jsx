import dynamic from "next/dynamic";
import EmployersList from "./employerslist";

export const metadata = {
  title: "Employers || Domesta  - Listing Board",
  description: "Domesta  - Listing Board",
};

const index = () => {
  return (
    <>
      <EmployersList />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
