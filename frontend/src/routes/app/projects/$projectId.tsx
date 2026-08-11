import { createFileRoute } from "@tanstack/react-router";
import ProjectDetailPage from "@/pages/ProjectDetailPage";

export const Route = createFileRoute("/app/projects/$projectId")({
  component: ProjectDetailPage,
});
