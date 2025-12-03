import { useCodemirror } from "@/src/hooks/use-codemirror";
import { cn } from "@/src/lib/utils";
import { EditorState } from "@codemirror/state";
import { useCallback, useEffect } from "react";

interface Props {
  initialDoc: string;
  className?: string;
  onChange: (doc: string) => void;
}

export default function Editor({ initialDoc, className, onChange }: Props) {
  const handleChange = useCallback(
    (state: EditorState) => onChange(state.doc.toString()),
    [onChange],
  );

  const [containerRef, editorView] = useCodemirror<HTMLDivElement>({
    initialDoc,
    onChange: handleChange,
  });

  useEffect(() => {
    if (editorView) {
    }
  }, [editorView]);

  return (
    <div
      className={cn("h-full border-1 border-white/10", className)}
      ref={containerRef}
    />
  );
}
