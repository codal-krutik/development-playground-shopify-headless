import SectionRenderer from "./components/SectionRenderer";
import { shopifyAdminClient } from "./lib/shopify/client";
import { getTemplateIndexFileQuery } from "./lib/shopify/queries/theme";

export default async function Home() {
  const data = await shopifyAdminClient.request(getTemplateIndexFileQuery);
  const content = data.theme.files.nodes[0].body.content;
  const jsonString = content.replace(/\/\*[\s\S]*?\*\//, "").trim();
  const parsed = JSON.parse(jsonString);

  return <SectionRenderer sections={parsed.sections} order={parsed.order} />;
}
