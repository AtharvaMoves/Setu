import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Editor from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  X,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  RotateCcw,
  Download,
  WrapText,
  Columns2,
  Rows2,
  ZoomIn,
  ZoomOut,
  Terminal,
  Trash2,
} from "lucide-react";
import hljs from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";
import cssLang from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";

hljs.registerLanguage("xml", xml);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("css", cssLang);
hljs.registerLanguage("javascript", javascript);

/* ═══════════════════════════════════════
   Types & Constants
   ═══════════════════════════════════════ */

interface CodePlaygroundProps {
  code: string;
  language?: string;
  title?: string;
}

const LANG_LABEL: Record<string, string> = {
  html: "HTML",
  css: "CSS",
  javascript: "JS",
  typescript: "TS",
  json: "JSON",
  python: "PY",
};

const LANG_COLOR: Record<string, string> = {
  html: "#e34c26",
  css: "#264de4",
  javascript: "#f0db4f",
  typescript: "#3178c6",
  python: "#3776ab",
  json: "#6b7280",
};

/* Console capture script injected into preview iframe */
const CONSOLE_BRIDGE = `<script>
(function(){
    var _l=console.log,_e=console.error,_w=console.warn,_i=console.info;
    function s(t,a){
        try{window.parent.postMessage({type:'setu-console',level:t,
            message:Array.from(a).map(function(x){
                if(x===null) return 'null';
                if(x===undefined) return 'undefined';
                if(typeof x==='object') try{return JSON.stringify(x,null,2)}catch(e){return String(x)}
                return String(x);
            }).join(' ')},'*');
        }catch(e){}
    }
    console.log=function(){s('log',arguments);_l.apply(console,arguments);};
    console.error=function(){s('error',arguments);_e.apply(console,arguments);};
    console.warn=function(){s('warn',arguments);_w.apply(console,arguments);};
    console.info=function(){s('info',arguments);_i.apply(console,arguments);};
    window.onerror=function(msg,src,line,col,err){
        s('error',['Error: '+msg+(line?' (line '+line+')':'')]);
        return false;
    };
    window.onunhandledrejection=function(e){
        s('error',['Unhandled Promise: '+(e.reason||e)]);
    };
})();
<\/script>`;

/* ═══════════════════════════════════════
   Preview Engine — builds a full document
   for the iframe from any language input
   ═══════════════════════════════════════ */

function buildPreviewDocument(code: string, language: string): string {
  switch (language) {
    case "html":
      // If the code already has <html> or <body>, inject console bridge
      if (/<html|<body|<!doctype/i.test(code)) {
        if (/<head>/i.test(code)) {
          return code.replace(/<head>/i, `<head>${CONSOLE_BRIDGE}`);
        } else if (/<html[^>]*>/i.test(code)) {
          return code.replace(
            /<html([^>]*)>/i,
            `<html$1><head>${CONSOLE_BRIDGE}</head>`,
          );
        }
        return CONSOLE_BRIDGE + code;
      }
      // Fragment — wrap in a full document
      return `<!DOCTYPE html><html><head><meta charset="UTF-8">${CONSOLE_BRIDGE}</head><body>${code}</body></html>`;

    case "css":
      return `<!DOCTYPE html><html><head><meta charset="UTF-8">${CONSOLE_BRIDGE}
                <style>${code}</style></head><body>
                <div class="preview-container">
                    <h1>CSS Preview</h1>
                    <p>This is a paragraph to preview your styles.</p>
                    <button>Button</button>
                    <a href="#">Link</a>
                    <ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>
                    <div class="box">A div with class "box"</div>
                </div></body></html>`;

    case "javascript":
      return `<!DOCTYPE html><html><head><meta charset="UTF-8">${CONSOLE_BRIDGE}</head>
                <body><div id="app"></div>
                <script>${code}<\/script></body></html>`;

    case "python":
      // Python requires a server-side executor — show placeholder
      return `<!DOCTYPE html><html><head><meta charset="UTF-8">${CONSOLE_BRIDGE}</head>
                <body style="font-family:monospace;padding:2rem;color:#64748b">
                <p>Python execution requires a server runtime.</p>
                <p>Output will appear in the Console panel below.</p>
                </body></html>`;

    default:
      return `<!DOCTYPE html><html><head><meta charset="UTF-8">${CONSOLE_BRIDGE}</head>
                <body>${code}</body></html>`;
  }
}

/* ═══════════════════════════════════════
   Hooks
   ═══════════════════════════════════════ */

function useTheme() {
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    const check = () =>
      setIsDark(
        document.documentElement.getAttribute("data-theme") !== "light",
      );
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

/* ═══════════════════════════════════════
   UI Sub-Components
   ═══════════════════════════════════════ */

function ActionBtn({
  onClick,
  title,
  label,
  icon,
  color,
  active,
}: {
  onClick: () => void;
  title: string;
  label?: string;
  icon: React.ReactNode;
  color?: string;
  active?: boolean;
}) {
  const hasColor = !!color;
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.3rem",
        height: 30,
        padding: label ? "0 0.7rem" : "0 0.5rem",
        borderRadius: "999px",
        border: hasColor ? "none" : "1px solid rgba(148,163,184,0.12)",
        background: hasColor
          ? color
          : active
            ? "rgba(148,163,184,0.14)"
            : "rgba(148,163,184,0.06)",
        color: hasColor ? "#fff" : "inherit",
        opacity: hasColor ? 1 : active ? 0.92 : 0.72,
        cursor: "pointer",
        fontSize: "0.6875rem",
        fontWeight: 650,
        fontFamily: "'Inter', sans-serif",
        letterSpacing: "0.01em",
        transition: "all 0.15s ease",
        flexShrink: 0,
        boxShadow: hasColor ? "0 10px 30px -18px rgba(0,0,0,0.45)" : "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = "1";
        if (!hasColor) {
          e.currentTarget.style.background = "rgba(148,163,184,0.12)";
          e.currentTarget.style.borderColor = "rgba(148,163,184,0.2)";
        } else e.currentTarget.style.filter = "brightness(1.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = hasColor
          ? "1"
          : active
            ? "0.92"
            : "0.72";
        if (!hasColor) {
          e.currentTarget.style.background = active
            ? "rgba(148,163,184,0.14)"
            : "rgba(148,163,184,0.06)";
          e.currentTarget.style.borderColor = "rgba(148,163,184,0.12)";
        } else e.currentTarget.style.filter = "none";
      }}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
}

function Divider({ border }: { border: string }) {
  return (
    <div
      style={{
        width: 1,
        height: 18,
        background: border,
        margin: "0 0.25rem",
        flexShrink: 0,
      }}
    />
  );
}

/* ═══════════════════════════════════════
   Main Component
   ═══════════════════════════════════════ */

export function CodePlayground({
  code,
  language = "html",
  title = "index.html",
}: CodePlaygroundProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMaximized, setIsMaximized] = useState(true);
  const [editorValue, setEditorValue] = useState(code.trim());
  const [copied, setCopied] = useState(false);
  const [splitDir, setSplitDir] = useState<"horizontal" | "vertical">(
    "horizontal",
  );
  const [fontSize, setFontSize] = useState(13);
  const [wordWrap, setWordWrap] = useState(true);
  const [showConsole, setShowConsole] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [autoRun, setAutoRun] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isDark = useTheme();

  // Debounced value for live auto-run (400ms delay)
  const debouncedCode = useDebounce(editorValue, 400);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const highlightedCode = useMemo(() => {
    const hljsLang = language === "html" ? "xml" : language;
    try {
      return hljs.highlight(code.trim(), { language: hljsLang }).value;
    } catch {
      return code.trim();
    }
  }, [code, language]);

  /* ── Core preview rendering ── */
  const renderPreview = useCallback(
    (value: string) => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      // Use srcdoc approach — most reliable for full document rendering
      const fullDoc = buildPreviewDocument(value, language);
      iframe.srcdoc = fullDoc;
    },
    [language],
  );

  /* ── Auto-run on debounced code change ── */
  useEffect(() => {
    if (isOpen && autoRun) {
      renderPreview(debouncedCode);
    }
  }, [debouncedCode, isOpen, autoRun, renderPreview]);

  /* ── Render preview when modal first opens ── */
  useEffect(() => {
    if (isOpen) {
      // Give the iframe a moment to mount in the DOM
      const timer = setTimeout(() => renderPreview(editorValue), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]); // intentionally only depends on isOpen

  /* ── Console message listener ── */
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "setu-console") {
        const prefix =
          e.data.level === "error"
            ? "❌"
            : e.data.level === "warn"
              ? "⚠️"
              : e.data.level === "info"
                ? "ℹ️"
                : "›";
        setConsoleLogs((prev) => [
          ...prev.slice(-199),
          `${prefix} ${e.data.message}`,
        ]);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const handleRun = () => {
    setConsoleLogs([]);
    renderPreview(editorValue);
  };
  const handleEditorChange = (v: string | undefined) => setEditorValue(v || "");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editorValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    const original = code.trim();
    setEditorValue(original);
    setConsoleLogs([]);
    renderPreview(original);
  };

  const handleDownload = () => {
    const ext =
      language === "css" ? ".css" : language === "javascript" ? ".js" : ".html";
    const mime =
      language === "css"
        ? "text/css"
        : language === "javascript"
          ? "text/javascript"
          : "text/html";
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([editorValue], { type: mime }));
    a.download = title.endsWith(ext) ? title : title + ext;
    a.click();
  };

  const handleOpen = () => {
    setEditorValue(code.trim());
    setConsoleLogs([]);
    setIsOpen(true);
    setIsMaximized(true);
  };

  const monacoTheme = isDark ? "vs-dark" : "light";
  const bg = isDark ? "#0b0f19" : "#fdfdfc";
  const panel = isDark ? "rgba(15, 23, 42, 0.88)" : "rgba(248, 250, 252, 0.92)";
  const panelAlt = isDark
    ? "rgba(9, 14, 25, 0.92)"
    : "rgba(255, 255, 255, 0.94)";
  const border = isDark ? "rgba(148, 163, 184, 0.14)" : "#dbe3ee";
  const fg = isDark ? "#f8fafc" : "#1e293b";
  const lc = LANG_COLOR[language] || "#6b7280";

  return (
    <>
      {/* ═══ MINI CODE CARD ═══ */}
      <div className="setu-code-card">
        <div className="setu-code-header">
          <div className="setu-code-dots">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <span className="setu-code-title">{title}</span>
          <div className="setu-code-actions">
            <button
              type="button"
              onClick={handleCopy}
              className="setu-code-btn"
              title="Copy code"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
            </button>
          </div>
        </div>
        <pre className="setu-code-body">
          <code
            className={`hljs language-${language}`}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
        <div className="setu-code-footer">
          <button type="button" onClick={handleOpen} className="setu-try-btn">
            <Play size={14} />
            <span>Try Yourself</span>
          </button>
        </div>
      </div>

      {/* ═══ FULLSCREEN PLAYGROUND ═══ */}
      {isMounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 99999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isDark
                    ? "rgba(2,6,23,0.72)"
                    : "rgba(15,23,42,0.2)",
                  backdropFilter: "blur(14px)",
                  padding: isMaximized ? 0 : "1.25rem",
                }}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    width: isMaximized ? "100%" : "90%",
                    height: isMaximized ? "100%" : "85vh",
                    maxWidth: isMaximized ? "100%" : "1380px",
                    borderRadius: isMaximized ? 0 : "1.1rem",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    background: bg,
                    color: fg,
                    border: isMaximized ? "none" : `1px solid ${border}`,
                    boxShadow: isMaximized
                      ? "none"
                      : "0 30px 80px -40px rgba(0,0,0,0.55)",
                  }}
                >
                  {/* ─── TOP BAR ─── */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.55rem 0.85rem",
                      borderBottom: `1px solid ${border}`,
                      background: panel,
                      flexShrink: 0,
                      gap: "0.65rem",
                      flexWrap: "wrap",
                      backdropFilter: "blur(18px)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "0.375rem",
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: "#ef4444",
                          }}
                        />
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: "#f59e0b",
                          }}
                        />
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: "#10b981",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          opacity: 0.42,
                          whiteSpace: "nowrap",
                        }}
                      >
                        Setu Playground
                      </span>
                    </div>

                    {/* Toolbar */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        flexWrap: "nowrap",
                      }}
                    >
                      <ActionBtn
                        onClick={handleRun}
                        title="Run your code"
                        label="Run"
                        icon={<Play size={12} />}
                        color="#10b981"
                      />
                      <ActionBtn
                        onClick={handleReset}
                        title="Reset to original code"
                        label="Reset"
                        icon={<RotateCcw size={12} />}
                        color={isDark ? "#6366f1" : "#4f46e5"}
                      />

                      <Divider border={border} />

                      <ActionBtn
                        onClick={handleCopy}
                        title="Copy all code"
                        label={copied ? "Copied!" : "Copy"}
                        icon={copied ? <Check size={12} /> : <Copy size={12} />}
                        color={copied ? "#10b981" : undefined}
                      />
                      <ActionBtn
                        onClick={handleDownload}
                        title="Download as file"
                        label="Save"
                        icon={<Download size={12} />}
                      />

                      <Divider border={border} />

                      <ActionBtn
                        onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                        title="Smaller text"
                        icon={<ZoomOut size={12} />}
                      />
                      <span
                        style={{
                          fontSize: "0.625rem",
                          fontWeight: 700,
                          opacity: 0.35,
                          minWidth: 22,
                          textAlign: "center",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {fontSize}
                      </span>
                      <ActionBtn
                        onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                        title="Bigger text"
                        icon={<ZoomIn size={12} />}
                      />

                      <Divider border={border} />

                      <ActionBtn
                        onClick={() => setWordWrap(!wordWrap)}
                        title="Toggle word wrap"
                        label="Wrap"
                        icon={<WrapText size={12} />}
                        active={wordWrap}
                      />
                      <ActionBtn
                        onClick={() =>
                          setSplitDir(
                            splitDir === "horizontal"
                              ? "vertical"
                              : "horizontal",
                          )
                        }
                        title="Change split direction"
                        label={splitDir === "horizontal" ? "Side" : "Stack"}
                        icon={
                          splitDir === "horizontal" ? (
                            <Columns2 size={12} />
                          ) : (
                            <Rows2 size={12} />
                          )
                        }
                      />
                      <ActionBtn
                        onClick={() => setShowConsole(!showConsole)}
                        title="Show/hide console output"
                        label="Console"
                        icon={<Terminal size={12} />}
                        active={showConsole}
                        color={
                          showConsole
                            ? isDark
                              ? "#7c3aed"
                              : "#6d28d9"
                            : undefined
                        }
                      />
                    </div>

                    {/* Right */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.375rem",
                        flexShrink: 0,
                      }}
                    >
                      {/* Auto-run indicator */}
                      <button
                        onClick={() => setAutoRun(!autoRun)}
                        title={
                          autoRun
                            ? "Auto-run ON — preview updates as you type"
                            : "Auto-run OFF — click Run manually"
                        }
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          height: 24,
                          padding: "0 0.58rem",
                          borderRadius: "999px",
                          border: "1px solid rgba(148,163,184,0.12)",
                          cursor: "pointer",
                          background: autoRun
                            ? "rgba(16,185,129,0.12)"
                            : "rgba(148,163,184,0.06)",
                          color: autoRun ? "#10b981" : fg,
                          opacity: autoRun ? 1 : 0.66,
                          fontSize: "0.5625rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: autoRun ? "#10b981" : "#6b7280",
                          }}
                        />
                        Live
                      </button>

                      <span
                        style={{
                          fontSize: "0.5625rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          padding: "0.24rem 0.52rem",
                          borderRadius: "999px",
                          background: lc,
                          color:
                            language === "javascript" ? "#1e293b" : "#ffffff",
                        }}
                      >
                        {LANG_LABEL[language] || language.toUpperCase()}
                      </span>

                      <Divider border={border} />

                      <ActionBtn
                        onClick={() => setIsMaximized(!isMaximized)}
                        title={isMaximized ? "Windowed" : "Fullscreen"}
                        icon={
                          isMaximized ? (
                            <Minimize2 size={12} />
                          ) : (
                            <Maximize2 size={12} />
                          )
                        }
                      />
                      <ActionBtn
                        onClick={() => setIsOpen(false)}
                        title="Close playground"
                        icon={<X size={12} />}
                      />
                    </div>
                  </div>

                  {/* ─── EDITOR + PREVIEW ─── */}
                  <div
                    style={{
                      display: "flex",
                      flex: 1,
                      minHeight: 0,
                      flexDirection:
                        splitDir === "horizontal" ? "row" : "column",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        minWidth: 0,
                        minHeight: 0,
                        borderRight:
                          splitDir === "horizontal"
                            ? `1px solid ${border}`
                            : "none",
                        borderBottom:
                          splitDir === "vertical"
                            ? `1px solid ${border}`
                            : "none",
                      }}
                    >
                      <div
                        style={{
                          padding: "0.375rem 1rem",
                          fontSize: "0.5625rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          opacity: 0.3,
                          borderBottom: `1px solid ${border}`,
                          background: panel,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: lc,
                          }}
                        />
                        {title}
                      </div>
                      <div
                        style={{ flex: 1, minHeight: 0, background: panelAlt }}
                      >
                        <Editor
                          height="100%"
                          language={language}
                          value={editorValue}
                          onChange={handleEditorChange}
                          theme={monacoTheme}
                          options={{
                            minimap: { enabled: false },
                            fontSize,
                            lineHeight: Math.round(fontSize * 1.7),
                            padding: { top: 12 },
                            scrollBeyondLastLine: false,
                            wordWrap: wordWrap ? "on" : "off",
                            automaticLayout: true,
                            tabSize: 2,
                            renderLineHighlight: "line",
                            cursorBlinking: "smooth",
                            cursorSmoothCaretAnimation: "on",
                            smoothScrolling: true,
                            fontFamily:
                              "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                            fontLigatures: true,
                            bracketPairColorization: { enabled: true },
                            lineNumbers: "on",
                            renderWhitespace: "selection",
                            guides: { bracketPairs: true, indentation: true },
                          }}
                        />
                      </div>
                    </div>

                    {/* Preview */}
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        minWidth: 0,
                        minHeight: 0,
                      }}
                    >
                      <div
                        style={{
                          padding: "0.375rem 1rem",
                          fontSize: "0.5625rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          opacity: 0.3,
                          borderBottom: `1px solid ${border}`,
                          background: panel,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "#10b981",
                          }}
                        />
                        Live Preview
                      </div>
                      <div
                        style={{
                          flex: 1,
                          minHeight: 0,
                          background: "#ffffff",
                          position: "relative",
                        }}
                      >
                        <iframe
                          ref={iframeRef}
                          title="Live Preview"
                          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
                          style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            background: "#ffffff",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ─── CONSOLE ─── */}
                  <AnimatePresence>
                    {showConsole && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 160 }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                          overflow: "hidden",
                          borderTop: `1px solid ${border}`,
                          background: isDark ? "#0a0e17" : "#f8fafc",
                          flexShrink: 0,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0.375rem 1rem",
                            borderBottom: `1px solid ${border}`,
                            background: panel,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <span
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: "#7c3aed",
                              }}
                            />
                            <span
                              style={{
                                fontSize: "0.5625rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.12em",
                                opacity: 0.3,
                              }}
                            >
                              Console
                            </span>
                            {consoleLogs.length > 0 && (
                              <span
                                style={{
                                  fontSize: "0.5rem",
                                  fontWeight: 700,
                                  background: "#7c3aed",
                                  color: "#fff",
                                  padding: "0.1rem 0.35rem",
                                  borderRadius: "999px",
                                }}
                              >
                                {consoleLogs.length}
                              </span>
                            )}
                          </div>
                          <ActionBtn
                            onClick={() => setConsoleLogs([])}
                            title="Clear console"
                            icon={<Trash2 size={11} />}
                          />
                        </div>
                        <div
                          style={{
                            height: "calc(100% - 32px)",
                            overflowY: "auto",
                            padding: "0.5rem 1rem",
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.75rem",
                            lineHeight: 1.6,
                          }}
                        >
                          {consoleLogs.length === 0 ? (
                            <span
                              style={{ opacity: 0.25, fontSize: "0.6875rem" }}
                            >
                              No output yet — click{" "}
                              <strong style={{ color: "#10b981", opacity: 1 }}>
                                Run
                              </strong>{" "}
                              to execute.
                            </span>
                          ) : (
                            consoleLogs.map((log, i) => (
                              <div
                                key={i}
                                style={{
                                  opacity: log.startsWith("❌") ? 0.9 : 0.6,
                                  color: log.startsWith("❌")
                                    ? "#ef4444"
                                    : log.startsWith("⚠️")
                                      ? "#f59e0b"
                                      : "inherit",
                                  borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)"}`,
                                  padding: "0.2rem 0",
                                }}
                              >
                                {log}
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ─── STATUS BAR ─── */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.2rem 0.75rem",
                      borderTop: `1px solid ${border}`,
                      background: panel,
                      flexShrink: 0,
                      fontSize: "0.5625rem",
                      fontWeight: 500,
                      opacity: 0.35,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <span>Ln {editorValue.split("\n").length}</span>
                      <span>Spaces: 2</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                      }}
                    >
                      <span>
                        {(
                          new TextEncoder().encode(editorValue).length / 1024
                        ).toFixed(1)}{" "}
                        KB
                      </span>
                      <span
                        style={{
                          background: lc,
                          color: language === "javascript" ? "#1e293b" : "#fff",
                          padding: "0.05rem 0.35rem",
                          borderRadius: "0.15rem",
                          fontSize: "0.5rem",
                          fontWeight: 700,
                          opacity: 1,
                        }}
                      >
                        {LANG_LABEL[language] || language.toUpperCase()}
                      </span>
                      <span>UTF-8</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
