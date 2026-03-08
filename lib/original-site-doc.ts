import { readFile } from "node:fs/promises";
import path from "node:path";

export type OriginalSectionId =
  | "overview"
  | "ecosystem"
  | "comparison"
  | "etl"
  | "implementation";

export type OriginalTabId = "files" | "images" | "multimedia" | "3d";

export type OriginalSiteDoc = {
  nav: Array<{ id: OriginalSectionId; labelHtml: string }>;
  sections: Record<Exclude<OriginalSectionId, "etl">, string>;
  etlShell: string;
  etlTabs: Array<{ id: OriginalTabId; labelHtml: string }>;
  etlContents: Record<OriginalTabId, string>;
};

function between(source: string, start: string, end: string) {
  const startIndex = source.indexOf(start);
  if (startIndex === -1) {
    throw new Error(`Missing start marker: ${start}`);
  }

  const endIndex = source.indexOf(end, startIndex + start.length);
  if (endIndex === -1) {
    throw new Error(`Missing end marker: ${end}`);
  }

  return source.slice(startIndex + start.length, endIndex);
}

function extractSection(source: string, sectionId: OriginalSectionId) {
  const start = source.indexOf(`<section id="${sectionId}"`);
  if (start === -1) {
    throw new Error(`Missing section: ${sectionId}`);
  }

  const end = source.indexOf("</section>", start);
  if (end === -1) {
    throw new Error(`Missing closing section for: ${sectionId}`);
  }

  return source
    .slice(start, end + "</section>".length)
    .replace(/class="hidden\s+/g, 'class="')
    .replace(/\shidden"/g, '"');
}

function extractTabContent(source: string, tabId: OriginalTabId) {
  const start = source.indexOf(`<div id="content-${tabId}"`);
  if (start === -1) {
    throw new Error(`Missing ETL content: ${tabId}`);
  }

  const nextComment = source.indexOf("<!-- Tab Content:", start + 1);
  const sectionEnd = source.indexOf("</section>", start);
  const end = nextComment !== -1 && nextComment < sectionEnd ? nextComment : sectionEnd;

  return source
    .slice(start, end)
    .trim()
    .replace(/class="etl-content hidden"/g, 'class="etl-content"');
}

function cleanSectionShell(sectionHtml: string) {
  const tabNavStart = sectionHtml.indexOf('<!-- Tabs Navigation -->');
  const filesStart = sectionHtml.indexOf('<!-- Tab Content: Files -->');

  if (tabNavStart === -1 || filesStart === -1) {
    throw new Error("Missing ETL shell markers.");
  }

  return `${sectionHtml.slice(0, tabNavStart)}__ETL_TABS____ETL_CONTENT__</section>`;
}

export async function readOriginalSiteDoc(): Promise<OriginalSiteDoc> {
  const raw = (await readFile(path.join(process.cwd(), "docs", "index.md"), "utf8")).replace(
    /\r\n?/g,
    "\n"
  );
  const navHtml = between(raw, "<ul class=\"space-y-1\">", "</ul>");
  const navIds: OriginalSectionId[] = [
    "overview",
    "ecosystem",
    "comparison",
    "etl",
    "implementation"
  ];

  const nav = navIds.map((id) => {
    const buttonMatch = navHtml.match(
      new RegExp(
        `<button[^>]*id="nav-${id}"[^>]*>([\\s\\S]*?)<\\/button>`,
        "i"
      )
    );

    if (!buttonMatch) {
      throw new Error(`Missing nav button: ${id}`);
    }

    return {
      id,
      labelHtml: buttonMatch[1].trim()
    };
  });

  const overview = extractSection(raw, "overview");
  const ecosystem = extractSection(raw, "ecosystem");
  const comparison = extractSection(raw, "comparison");
  const etl = extractSection(raw, "etl");
  const implementation = extractSection(raw, "implementation");

  const etlTabs = (["files", "images", "multimedia", "3d"] as OriginalTabId[]).map((id) => {
    const match = etl.match(
      new RegExp(`<button[^>]*id="tab-${id}"[^>]*>([\\s\\S]*?)<\\/button>`, "i")
    );

    if (!match) {
      throw new Error(`Missing ETL tab: ${id}`);
    }

    return {
      id,
      labelHtml: match[1].trim()
    };
  });

  return {
    nav,
    sections: {
      overview,
      ecosystem,
      comparison,
      implementation
    },
    etlShell: cleanSectionShell(etl),
    etlTabs,
    etlContents: {
      files: extractTabContent(etl, "files"),
      images: extractTabContent(etl, "images"),
      multimedia: extractTabContent(etl, "multimedia"),
      "3d": extractTabContent(etl, "3d")
    }
  };
}
