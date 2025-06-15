import dynamic from "next/dynamic";
import Search from "./search";

export const metadata = {
    title: "Search || Domesta  - Listing Board",
    description: "Domesta  - Listing Board",
};

const index = () => {
    return (
        <>
            <Search />
        </>
    );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

