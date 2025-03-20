import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { toggleTaskStatus } from "@/services/tasks";
import type { Task, TasksResponse, TaskStatus } from "@/types/task";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

const statuses: TaskStatus[] = ["new", "in_progress", "urgent", "completed"];

export function useTaskMutation() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: toggleTaskStatus,
        onMutate: async (taskId) => {
            // 1. Stop any in-flight queries to prevent race conditions
            await queryClient.cancelQueries({
                queryKey: queryKeys.tasks.root
            });

            // 2. Save the current state (backup)
            const previousData = new Map();
            let taskToUpdate: Task | undefined;

            // 3. Find the task we want to update and save current state for each column
            for (const status of statuses) {
                const queryKey = queryKeys.tasks.infinite({ status: [status] });
                const data = queryClient.getQueryData<{
                    pages: TasksResponse[];
                }>(queryKey);

                previousData.set(status, data);

                // Find the task we want to update
                if (!taskToUpdate) {
                    const task = data?.pages
                        .flatMap((p) => p.tasks)
                        .find((t) => t.id === taskId);

                    if (task) {
                        taskToUpdate = {
                            ...task,
                            assignee: Array.isArray(task.assignee)
                                ? task.assignee
                                : [task.assignee]
                        };
                    }
                }
            }

            if (!taskToUpdate) return { previousData };

            // 4. Immediately update UI with what we expect the result to be
            const updatedTask = {
                ...taskToUpdate,
                allowEdit: !taskToUpdate.allowEdit
            };

            for (const status of statuses) {
                queryClient.setQueryData(
                    queryKeys.tasks.infinite({ status: [status] }),
                    (old: any) => ({
                        ...old,
                        pages: old.pages.map((page: any) => ({
                            ...page,
                            tasks: page.tasks.map((t: Task) =>
                                t.id === taskId ? updatedTask : t
                            )
                        }))
                    })
                );
            }

            // 5. Return the backup data in case we need to rollback
            return { previousData };
        },
        onError: (error, __, context) => {
            // Revert on error
            if (context?.previousData) {
                statuses.forEach((status) => {
                    queryClient.setQueryData(
                        queryKeys.tasks.infinite({ status: [status] }),
                        context.previousData.get(status)
                    );
                });
            }

            toast({
                variant: "destructive",
                title: t("toast.titles.error"),
                description: t("errors.failedToUpdateTask")
            });
        },
        onSuccess: (updatedTask) => {
            toast({
                title: t("toast.titles.success"),
                description: t("toast.descriptions.taskCompleted")
            });
        }
    });
}
