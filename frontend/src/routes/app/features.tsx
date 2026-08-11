import { createFileRoute } from "@tanstack/react-router";
import FeaturesPage from "@/pages/FeaturesPage";

export const Route = createFileRoute("/app/features")({
  component: FeaturesPage,
});
