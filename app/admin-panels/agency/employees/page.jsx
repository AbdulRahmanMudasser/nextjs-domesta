import dynamic from "next/dynamic";
import EmployeesList from "./employees";

export const metadata = {
  title: "Employees List || Domesta  - Listing Board",
  description: "Domesta  - Listing Board",
};

const index = () => {
  return (
    <>
      <EmployeesList />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
