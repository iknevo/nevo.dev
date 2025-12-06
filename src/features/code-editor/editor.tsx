import { useCodemirror } from "@/src/hooks/use-codemirror";
import { cn } from "@/src/lib/utils";
import { EditorState } from "@codemirror/state";
import { useCallback } from "react";

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
  disabled,
}: Props) {
  const handleChange = useCallback(
    (state: EditorState) => onChange(state.doc.toString()),
    [onChange],
  );

  const [containerRef] = useCodemirror<HTMLDivElement>({
    initialDoc,
    onChange: handleChange,
    disabled,
  });

  return (
    <div
      className={cn(
        "h-full border-1 border-white/10 rounded-sm overflow-hidden",
        className,
      )}
      ref={containerRef}
    />
  );
}
