import { EditorState } from "@codemirror/state";
import { useCallback } from "react";

import { useCodemirror } from "@/src/hooks/use-codemirror";
import { cn } from "@/src/lib/utils";

interface Props {
  initialDoc: string;
  className?: string;
  onChange: (doc: string) => void;
  disabled?: boolean;
}

export default function Editor({
  initialDoc,
  className,
  onChange,
  disabled
}: Props) {
  const handleChange = useCallback(
    (state: EditorState) => onChange(state.doc.toString()),
    [onChange]
  );

  const [containerRef] = useCodemirror<HTMLDivElement>({
    initialDoc,
    onChange: handleChange,
    disabled
  });

  return (
    <div
      className={cn(
        "h-full overflow-hidden editor-container rounded-sm border-1 border-white/10 selection:!bg-primary select-text",
        className
      )}
      data-lenis-prevent
      ref={containerRef}
    />
  );
}
