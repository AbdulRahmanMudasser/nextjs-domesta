import dynamic from "next/dynamic";
import agentData from "@/data/agent-profile";
import WsPageOuter from "@/templates/layouts/ws-page-outer";

export const metadata = {
    title: "Agency Profile || Domesta",
    description: "Domesta",
};

const AgentSingleProfile = dynamic(() => import("./agentsingle"), { ssr: false });

export default function ProfilePage({ params }) {
    const id = params.id;
    const agent = agentData.find((item) => String(item.id) === id);

    if (!agent) {
        return (
            <WsPageOuter>
                <section className="agent-detail-section style-three">
                    <div className="auto-container">
                        <h4>Agency Not Found</h4>
                        <p>No agency found with ID: {id}</p>
                    </div>
                </section>
            </WsPageOuter>
        );
    }

    return <AgentSingleProfile params={params} />;
}