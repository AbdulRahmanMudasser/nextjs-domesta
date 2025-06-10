import dynamic from "next/dynamic";
import employeeProfile from "@/data/employee-profile";
import WsPageOuter from "@/templates/layouts/ws-page-outer";

export const metadata = {
    title: "Employee Profile || Domesta ",
    description: "Domesta ",
};

const CandidateSingleDynamicV3 = dynamic(() => import("./CandidateSingleDynamicV3"), { ssr: false });

export default function ProfilePage({ params }) {
    const id = params.id;
    const candidate = employeeProfile.find((item) => String(item.id) === id);

    if (!candidate) {
        return (
            <WsPageOuter>
                <section className="candidate-detail-section style-three">
                    <div className="auto-container">
                        <h4>Candidate Not Found</h4>
                        <p>No candidate found with ID: {id}</p>
                    </div>
                </section>
            </WsPageOuter>
        );
    }

    return <CandidateSingleDynamicV3 params={params} />;
}