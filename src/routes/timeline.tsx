import { createFileRoute } from "@tanstack/react-router";
import { Timeline } from "@/components/timeline/Timeline";
import { RouteErrorComponent } from "@/components/ErrorComponent";

export const Route = createFileRoute("/timeline")({
    component: TimelineComponent,
    errorComponent: RouteErrorComponent
});

function TimelineComponent() {
    return <Timeline />;
}
