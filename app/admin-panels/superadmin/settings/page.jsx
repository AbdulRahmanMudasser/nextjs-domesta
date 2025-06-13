import dynamic from "next/dynamic";
import SettingsList from "./settings";

export const metadata = {
  title: "Settings || Domesta  - Listing Board",
  description: "Domesta  - Listing Board",
};

const index = () => {
  return (
    <>
      <SettingsList />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
