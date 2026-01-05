"use client";

import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentLess,
  indentMore
} from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import {
  HighlightStyle,
  defaultHighlightStyle,
  indentOnInput,
  syntaxHighlighting
} from "@codemirror/language";
import { languages } from "@codemirror/language-data";
import { openSearchPanel } from "@codemirror/search";
import { search } from "@codemirror/search";
import { EditorState } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import {
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers
} from "@codemirror/view";
import { tags } from "@lezer/highlight";
import { vim } from "@replit/codemirror-vim";
import { RefObject, useEffect, useRef, useState } from "react";

interface Props {
  initialDoc: string;
  onChange?: (state: EditorState) => void;
  disabled?: boolean;
}

const transparentTheme = EditorView.theme({
  "&": {
    backgroundColor: "transparent !important",
    height: "100%"
  }
});

const highlighting = HighlightStyle.define([
  { tag: tags.heading1, fontSize: "1.6em", fontWeight: "bold" },
  { tag: tags.heading2, fontSize: "1.4em", fontWeight: "bold" },
  { tag: tags.heading3, fontSize: "1.2em", fontWeight: "bold" }
]);

const gutterTheme = EditorView.theme({
  ".cm-gutters": {
    backgroundColor: "transparent !important"
  },
  ".cm-activeLineGutter": {
    backgroundColor: "#6699ff0b !important"
  }
});

const biggerFont = EditorView.theme({
  ".cm-content": {
    fontSize: "18px",
    lineHeight: "1.7"
  },
  ".cm-lineNumbers": {
    fontSize: "18px",
    lineHeight: "1.7"
  }
});
export const editorTheme = EditorView.theme({
  "&": {
    borderRadius: "0.375rem",
    borderWidth: "1px",
    borderColor: "rgba(255,255,255,0.1)",
    padding: "0.75rem",
    transitionProperty:
      "color, background-color, border-color, text-decoration-color, fill, stroke",
    transitionDuration: "300ms"
  },
  ".cm-content ::selection": {
    color: "#fff"
  }
});

const darkPanelTheme = EditorView.theme({
  ".cm-panels": {
    backgroundColor: "#000000",
    color: "#c9d1d9"
  },
  ".cm-panel.cm-search": {
    backgroundColor: "#000000",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    padding: "6px 8px",
    gap: "6px"
  },
  ".cm-search input": {
    backgroundColor: "#161b22",
    color: "#e6edf3",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "6px",
    padding: "4px 6px",
    outline: "none"
  },
  ".cm-search input::placeholder": {
    color: "#8b949e"
  },
  ".cm-search input:focus": {
    borderColor: "#58a6ff",
    boxShadow: "0 0 0 1px #58a6ff"
  },
  ".cm-search button": {
    backgroundColor: "#161b22",
    color: "#c9d1d9",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "6px",
    padding: "4px 8px",
    cursor: "pointer"
  },
  ".cm-search button:hover": {
    backgroundColor: "#21262d"
  },
  ".cm-search .cm-search-info": {
    color: "#8b949e",
    fontSize: "12px"
  },
  ".cm-panel.cm-search button:last-of-type": {
    fontSize: "32px"
  }
});

export function useCodemirror<T extends Element>({
  initialDoc,
  onChange,
  disabled
}: Props): [RefObject<T | null>, EditorView?] {
  const containerRef = useRef<T>(null);
  const initialDocRef = useRef(initialDoc);
  const [editorView, setEditorView] = useState<EditorView>();

  useEffect(() => {
    initialDocRef.current = initialDoc;
  }, [initialDoc]);

  useEffect(() => {
    if (!containerRef.current) return;
    const state = EditorState.create({
      doc: initialDocRef.current,
      extensions: [
        search({ top: true }),
        vim(),
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          ...closeBracketsKeymap,
          {
            key: "Tab",
            preventDefault: true,
            run: indentMore
          },
          {
            key: "Shift-Tab",
            preventDefault: true,
            run: indentLess
          },
          {
            key: "Ctrl-;",
            preventDefault: true,
            run: openSearchPanel
          }
        ]),
        lineNumbers(),
        highlightActiveLineGutter(),
        history(),
        indentOnInput(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        syntaxHighlighting(highlighting),
        highlightActiveLine(),
        closeBrackets(),
        javascript({ jsx: true, typescript: true }),
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
          addKeymap: true
        }),
        oneDark,
        transparentTheme,
        gutterTheme,
        biggerFont,
        editorTheme,
        darkPanelTheme,
        EditorView.editable.of(!disabled),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.changes && onChange) onChange(update.state);
        })
      ]
    });
    const view = new EditorView({
      state,
      parent: containerRef.current
    });
    setEditorView(view);

    return () => {
      view.destroy();
    };
  }, [containerRef, onChange, disabled]);

  return [containerRef, editorView];
}
