import dynamic from "next/dynamic";
import Services from "./services";

export const metadata = {
    title: "Services || Domesta  - Listing Board",
    description: "Domesta  - Listing Board",
};

const index = () => {
    return (
        <>
            <Services/>
        </>
    );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

