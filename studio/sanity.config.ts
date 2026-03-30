import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { voyage } from "./schemaTypes/voyage";

export default defineConfig({
  name: "mikedevnomad",
  title: "MikeDevNomad — Studio",
  projectId: "h10l696h",
  dataset: "production",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: [voyage],
  },
});
