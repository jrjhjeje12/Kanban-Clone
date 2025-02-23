import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/timeline")({
    component: RouteComponent
});

function RouteComponent() {
    return <div>Timeline View (Coming Soon)</div>;
}
