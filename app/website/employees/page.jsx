import dynamic from "next/dynamic";
import EmployeesList from "./employeeslist";

export const metadata = {
  title: "Employees || Domesta  - Listing Board",
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
