"use client";
/**
 * RichTextEditor — lightweight contenteditable rich text editor.
 * Toolbar: Bold · Italic · Underline · Heading (H1) · Subheading (H2)
 *          · Bullet list · Numbered list
 * Stores content as HTML string via onChange.
 */
import { useRef, useEffect, useCallback } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

function ToolBtn({
  onClick,
  title,
  children,
  active,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault(); // keep focus in editor
        onClick();
      }}
      title={title}
      className={[
        "w-7 h-7 flex items-center justify-center rounded text-xs font-semibold transition-colors",
        active
          ? "bg-brand-indigo text-white"
          : "text-gray-600 hover:bg-gray-200 hover:text-heading-dark",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="w-px h-4 bg-gray-200 mx-1 flex-shrink-0 self-center" />;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing…",
  minHeight = "180px",
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isComposing = useRef(false);
  const isMounted = useRef(false);

  // Seed initial content once on mount
  useEffect(() => {
    if (!isMounted.current && editorRef.current) {
      editorRef.current.innerHTML = value || "";
      isMounted.current = true;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When value is cleared externally (e.g. form reset), also clear the editor
  useEffect(() => {
    if (isMounted.current && !value && editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  }, [value]);

  const exec = useCallback(
    (command: string, arg?: string) => {
      editorRef.current?.focus();
      document.execCommand(command, false, arg ?? "");
      if (editorRef.current) onChange(editorRef.current.innerHTML);
    },
    [onChange],
  );

  function handleInput() {
    if (!isComposing.current && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand-indigo transition-shadow">
      {/* ── Toolbar ────────────────────────────────────── */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-gray-100 bg-gray-50 flex-wrap">
        <ToolBtn onClick={() => exec("bold")} title="Bold">
          <span className="font-bold">B</span>
        </ToolBtn>
        <ToolBtn onClick={() => exec("italic")} title="Italic">
          <span className="italic">I</span>
        </ToolBtn>
        <ToolBtn onClick={() => exec("underline")} title="Underline">
          <span className="underline">U</span>
        </ToolBtn>

        <Divider />

        <ToolBtn onClick={() => exec("formatBlock", "h2")} title="Heading (H1)">
          <span className="font-bold text-[11px]">H1</span>
        </ToolBtn>
        <ToolBtn onClick={() => exec("formatBlock", "h3")} title="Subheading (H2)">
          <span className="font-semibold text-[11px]">H2</span>
        </ToolBtn>

        <Divider />

        <ToolBtn onClick={() => exec("insertUnorderedList")} title="Bullet list">
          {/* ≡ with bullets */}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="5" cy="7"  r="1.25" fill="currentColor" stroke="none" />
            <circle cx="5" cy="12" r="1.25" fill="currentColor" stroke="none" />
            <circle cx="5" cy="17" r="1.25" fill="currentColor" stroke="none" />
            <line x1="9" y1="7"  x2="20" y2="7"  strokeLinecap="round" />
            <line x1="9" y1="12" x2="20" y2="12" strokeLinecap="round" />
            <line x1="9" y1="17" x2="20" y2="17" strokeLinecap="round" />
          </svg>
        </ToolBtn>
        <ToolBtn onClick={() => exec("insertOrderedList")} title="Numbered list">
          {/* 1. 2. 3. icon */}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6h11M10 12h11M10 18h11" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h.01M4 12h.01M4 18h.01" strokeWidth={2.5} />
          </svg>
        </ToolBtn>

        <Divider />

        <ToolBtn onClick={() => exec("removeFormat")} title="Clear formatting">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M3 9h11l-4 9-4-4" />
          </svg>
        </ToolBtn>
      </div>

      {/* ── Editable area ───────────────────────────────── */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onCompositionStart={() => { isComposing.current = true; }}
        onCompositionEnd={() => { isComposing.current = false; handleInput(); }}
        data-rich-editor
        data-placeholder={placeholder}
        className={[
          "px-4 py-3 text-sm text-heading-dark outline-none leading-relaxed",
          // heading styles
          "[&_h2]:text-base [&_h2]:font-bold [&_h2]:text-heading-dark [&_h2]:mt-2 [&_h2]:mb-1",
          "[&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-heading-dark [&_h3]:mt-1.5 [&_h3]:mb-0.5",
          // list styles
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-0.5 [&_ul]:my-1",
          "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-0.5 [&_ol]:my-1",
          // paragraph spacing
          "[&_p]:my-0.5",
        ].join(" ")}
        style={{ minHeight }}
      />
    </div>
  );
}
