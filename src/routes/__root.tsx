import * as React from "react";
import {
    Link,
    Outlet,
    createRootRouteWithContext
} from "@tanstack/react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { CgBoard } from "react-icons/cg";
import { CiCalendar, CiViewTimeline } from "react-icons/ci";
import { useTranslation } from "react-i18next";
import { Toaster } from "@/components/ui/toaster";

const TanStackRouterDevtools =
    process.env.NODE_ENV === "production"
        ? () => null // Render nothing in production
        : React.lazy(() =>
              // Lazy load in development
              import("@tanstack/router-devtools").then((res) => ({
                  default: res.TanStackRouterDevtools
                  // For Embedded Mode
                  // default: res.TanStackRouterDevtoolsPanel
              }))
          );

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient;
}>()({
    component: RootComponent
});

function RootComponent() {
    const { t } = useTranslation();

    const views = React.useMemo(
        () => [
            { id: "/", label: t("navigation.board"), icon: CgBoard },
            {
                id: "/timeline",
                label: t("navigation.timeline"),
                icon: CiViewTimeline
            },
            {
                id: "/calendar",
                label: t("navigation.calendar"),
                icon: CiCalendar
            }
        ],
        [t]
    );

    return (
        <div className="min-h-screen">
            <main>
                <div className="flex gap-8 px-8 py-4 border-gray-200 border-b">
                    {views.map((view) => {
                        const Icon = view.icon;
                        return (
                            <Link
                                key={view.id}
                                to={view.id}
                                className={cn(
                                    "flex items-center gap-2 text-gray-500 relative transition-colors font-medium"
                                )}
                                activeProps={{
                                    className: "!text-[#3b82f6]"
                                }}
                                activeOptions={{ exact: view.id === "/" }}
                            >
                                <Icon size={18} />
                                {view.label}
                            </Link>
                        );
                    })}
                </div>
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
            <Toaster />
            <ReactQueryDevtools buttonPosition="top-right" />
            <TanStackRouterDevtools position="bottom-right" />
        </div>
    );
}
