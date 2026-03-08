import { OriginalSite } from "@/components/original-site";
import { readOriginalSiteDoc } from "@/lib/original-site-doc";

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const doc = await readOriginalSiteDoc();
  const params = await searchParams;
  return <OriginalSite doc={doc} initialSection={params.section} />;
}
