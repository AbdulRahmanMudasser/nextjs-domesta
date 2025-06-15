import dynamic from "next/dynamic";
import HowItWorks from "./how-it-works";

export const metadata = {
    title: "Search || Domesta  - Listing Board",
    description: "Domesta  - Listing Board",
};

const index = () => {
    return (
        <>
            <HowItWorks />
        </>
    );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

