import dynamic from "next/dynamic";
import AgentsList from "./agentslist";

export const metadata = {
  title: "Agency || Domesta  - Listing Board",
  description: "Domesta  - Listing Board",
};

const index = () => {
  return (
    <>
      <AgentsList />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
