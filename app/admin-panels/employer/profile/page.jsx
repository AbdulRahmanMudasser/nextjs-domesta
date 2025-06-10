import dynamic from "next/dynamic";
import ProfilePage from "./ProfilePage";

export const metadata = {
  title: "Employer Profile || Domesta  - Listing Board",
  description: "Domesta  - Listing Board",
};

const index = () => {
  return (
    <>
      <ProfilePage />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
