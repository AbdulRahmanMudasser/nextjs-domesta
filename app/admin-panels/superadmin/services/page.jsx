import dynamic from "next/dynamic";
import ServicesList from "./services";

export const metadata = {
    title: "SuperAdmin Dashboard || Domesta  - Listing Board",
    description: "Domesta  - Listing Board",
};

const index = () => {
    return (
        <>
            <ServicesList />
        </>
    );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
