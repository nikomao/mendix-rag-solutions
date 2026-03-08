"use client";

type OriginalSiteFrameProps = {
  html: string;
};

export function OriginalSiteFrame({ html }: OriginalSiteFrameProps) {
  return (
    <main className="original-frame-shell">
      <iframe
        className="original-frame"
        srcDoc={html}
        title="Mendix RAG Original Site"
      />
      <a className="console-entry" href="/console">
        打开交互控制台
      </a>
    </main>
  );
}
