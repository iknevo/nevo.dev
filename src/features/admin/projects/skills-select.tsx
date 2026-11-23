"use client";

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  type SortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import {
  Check,
  ChevronDown,
  EyeOff,
  GripVertical,
  Loader2,
  Plus,
  Search,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import { type Ref, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { PROJECT_CARD_SKILLS_COUNT, STACK_TYPE_OPTIONS } from "@/src/config/constants";
import { useGetStack } from "@/src/features/admin/stack/api/use-get-stack";
import { cn } from "@/src/lib/utils";

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
  onBlur?: () => void;
  disabled?: boolean;
  id?: string;
  ref?: Ref<HTMLButtonElement>;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

type Skill = {
  id: string;
  name: string;
  icon: string;
  hide: boolean;
};

const toKey = (name: string) => name.trim().toLowerCase();

export function uniqueSkillNames(names: string[]) {
  const seen = new Set<string>();
  return names.filter((name) => {
    const key = toKey(name);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function suppressNextContextMenu() {
  const block = (event: Event) => {
    event.preventDefault();
    cleanup();
  };
  const cleanup = () => {
    window.removeEventListener("contextmenu", block, true);
    window.removeEventListener("mousedown", cleanup, true);
  };
  window.addEventListener("contextmenu", block, true);
  window.addEventListener("mousedown", cleanup, true);
}

const keepInPlace: SortingStrategy = () => null;

const chipClassName = "gap-1.5 rounded-sm py-1 pr-1 pl-0.5";
const gripClassName =
  "text-muted-foreground inline-flex size-4 items-center justify-center rounded-xs";

type ChipContentProps = {
  name: string;
  skill?: Skill;
};

function ChipContent({ name, skill }: ChipContentProps) {
  return (
    <>
      {skill && (
        <Image src={skill.icon} alt="" width={16} height={16} className="size-4 object-contain" />
      )}
      <span>{name}</span>
      {!skill && <span className="sr-only">(not in your skills)</span>}
    </>
  );
}

type SortableChipProps = ChipContentProps & {
  onCard: boolean;
  dropSide: "before" | "after" | null;
  disabled?: boolean;
  onRemove: () => void;
};

function SortableChip({ name, skill, onCard, dropSide, disabled, onRemove }: SortableChipProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({ id: name, disabled });

  return (
    <Badge
      ref={setNodeRef}
      variant={skill ? "secondary" : "outline"}
      title={skill ? undefined : "Not in your skills"}
      className={cn(
        chipClassName,
        !skill && "text-muted-foreground border-dashed",
        onCard && "border-primary/50",
        isDragging && "opacity-40",
        dropSide === "before" && "shadow-[-4px_0_0_-1px_var(--color-primary)]",
        dropSide === "after" && "shadow-[4px_0_0_-1px_var(--color-primary)]"
      )}
    >
      <button
        type="button"
        aria-label={`Reorder ${name}`}
        disabled={disabled}
        className={cn(
          gripClassName,
          "hover:text-foreground cursor-grab touch-none active:cursor-grabbing disabled:pointer-events-none"
        )}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-3" />
      </button>
      <ChipContent name={name} skill={skill} />
      <button
        type="button"
        aria-label={`Remove ${name}`}
        disabled={disabled}
        onClick={onRemove}
        className="hover:text-foreground inline-flex size-4 items-center justify-center rounded-xs disabled:pointer-events-none"
      >
        <XIcon className="size-3" />
      </button>
    </Badge>
  );
}

function DraggingChip({ name, skill }: ChipContentProps) {
  return (
    <Badge
      variant={skill ? "secondary" : "outline"}
      className={cn(
        chipClassName,
        "dark cursor-grabbing pr-2 shadow-lg",
        !skill && "text-muted-foreground border-dashed"
      )}
    >
      <span className={gripClassName}>
        <GripVertical className="size-3" />
      </span>
      <ChipContent name={name} skill={skill} />
    </Badge>
  );
}

function groupLabel(type: string) {
  return STACK_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? type;
}

export default function SkillsSelect({
  value,
  onChange,
  onBlur,
  disabled,
  id,
  ref,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: Props) {
  const { data, isLoading, isError, refetch } = useGetStack(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const groups = useMemo(
    () =>
      (data ?? []).map((group) => ({
        type: group.type,
        items: group.items.map(
          (item): Skill => ({
            id: String(item._id),
            name: item.name,
            icon: item.icon,
            hide: Boolean(item.hide),
          })
        ),
      })),
    [data]
  );

  const skillsByKey = useMemo(
    () => new Map(groups.flatMap((group) => group.items.map((item) => [toKey(item.name), item]))),
    [groups]
  );

  const selectedKeys = new Set(value.map(toKey));
  const query = toKey(search);
  const filteredGroups = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => toKey(item.name).includes(query)),
    }))
    .filter((group) => group.items.length > 0);
  const customName = search.trim();
  const customKey = toKey(customName);
  const isCustomSelected = !!customName && selectedKeys.has(customKey);
  const canAddCustom = !!customName && !skillsByKey.has(customKey) && !isCustomSelected;

  const addCustom = () => {
    if (!canAddCustom) return;
    onChange([...value, customName]);
    setSearch("");
  };

  const toggle = (name: string) => {
    if (selectedKeys.has(toKey(name))) {
      onChange(value.filter((selected) => toKey(selected) !== toKey(name)));
    } else {
      onChange([...value, name]);
    }
  };

  const remove = (name: string) => {
    onChange(value.filter((selected) => toKey(selected) !== toKey(name)));
    onBlur?.();
  };

  useEffect(() => {
    if (!activeId) return;

    const cancelDrag = () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { code: "Escape", bubbles: true }));
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button !== 2) return;
      event.preventDefault();
      suppressNextContextMenu();
      cancelDrag();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      cancelDrag();
    };

    window.addEventListener("mousedown", handleMouseDown, true);
    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown, true);
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [activeId]);

  const activeIndex = activeId ? value.indexOf(activeId) : -1;
  const overIndex = overId ? value.indexOf(overId) : -1;

  const resetDrag = () => {
    setActiveId(null);
    setOverId(null);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    resetDrag();
    if (!over || active.id === over.id) return;
    const oldIndex = value.indexOf(String(active.id));
    const newIndex = value.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    onChange(arrayMove(value, oldIndex, newIndex));
    onBlur?.();
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setSearch("");
      onBlur?.();
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal>
      <PopoverAnchor asChild>
        <div
          className={cn(
            "border-input dark:bg-input/30 flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border bg-transparent px-2 py-1.5",
            ariaInvalid && "border-destructive",
            disabled && "opacity-50"
          )}
        >
          {value.length === 0 && (
            <span className="text-muted-foreground px-1 text-sm">Select skills…</span>
          )}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={({ active }) => setActiveId(String(active.id))}
            onDragOver={({ over }) => setOverId(over ? String(over.id) : null)}
            onDragEnd={handleDragEnd}
            onDragCancel={resetDrag}
          >
            <SortableContext items={value} strategy={keepInPlace}>
              {value.map((name, index) => (
                <SortableChip
                  key={name}
                  name={name}
                  skill={skillsByKey.get(toKey(name))}
                  onCard={index < PROJECT_CARD_SKILLS_COUNT}
                  dropSide={
                    activeIndex === -1 || index !== overIndex || index === activeIndex
                      ? null
                      : overIndex > activeIndex
                        ? "after"
                        : "before"
                  }
                  disabled={disabled}
                  onRemove={() => remove(name)}
                />
              ))}
            </SortableContext>
            {typeof document !== "undefined" &&
              createPortal(
                <DragOverlay dropAnimation={null}>
                  {activeId && (
                    <DraggingChip name={activeId} skill={skillsByKey.get(toKey(activeId))} />
                  )}
                </DragOverlay>,
                document.body
              )}
          </DndContext>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              id={id}
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled}
              aria-label={value.length > 0 ? "Add skills" : undefined}
              aria-invalid={ariaInvalid}
              aria-describedby={ariaDescribedBy}
              className="text-muted-foreground hover:text-foreground ml-auto h-7 px-2"
            >
              {value.length === 0 && "Add skills"}
              <ChevronDown />
            </Button>
          </PopoverTrigger>
        </div>
      </PopoverAnchor>
      {value.length > 1 && (
        <p className="text-muted-foreground text-xs">
          {value.length > PROJECT_CARD_SKILLS_COUNT
            ? `Drag to reorder. The first ${PROJECT_CARD_SKILLS_COUNT} are shown on the project card.`
            : "Drag to reorder."}
        </p>
      )}

      <PopoverContent align="start" className="dark w-(--radix-popover-trigger-width) min-w-64 p-0">
        <div className="flex items-center gap-2 border-b border-white/10 px-3">
          <Search className="text-muted-foreground size-4 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search or add a skill…"
            aria-label="Search skills"
            className="placeholder:text-muted-foreground h-10 w-full bg-transparent text-sm outline-none"
          />
        </div>

        <div className="max-h-72 overflow-y-auto overscroll-contain p-1">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="text-muted-foreground size-5 animate-spin" aria-label="Loading" />
            </div>
          ) : isError && !data ? (
            <div className="flex flex-col items-center gap-3 px-3 py-6 text-center text-sm">
              <p className="text-muted-foreground">Couldn&apos;t load skills.</p>
              <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          ) : (
            <>
              {filteredGroups.length === 0 && !canAddCustom && (
                <p className="text-muted-foreground px-3 py-6 text-center text-sm">
                  {isCustomSelected
                    ? `"${customName}" is already added`
                    : groups.length === 0
                      ? "No skills yet. Type a name to add one, or create skills in the Stack section."
                      : "No matches"}
                </p>
              )}
              {filteredGroups.map((group) => (
                <div key={group.type} role="group" aria-label={groupLabel(group.type)}>
                  <p className="text-muted-foreground px-2 pt-2 pb-1 text-[11px] font-semibold tracking-[0.14em] uppercase">
                    {groupLabel(group.type)}
                  </p>
                  {group.items.map((item) => {
                    const selected = selectedKeys.has(toKey(item.name));
                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggle(item.name)}
                        className="hover:bg-accent focus-visible:bg-accent flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-none"
                      >
                        <span
                          className={cn(
                            "flex size-4 shrink-0 items-center justify-center rounded-xs border border-white/30",
                            selected && "bg-primary border-primary text-primary-foreground"
                          )}
                        >
                          {selected && <Check className="size-3" />}
                        </span>
                        <Image
                          src={item.icon}
                          alt=""
                          width={20}
                          height={20}
                          className="size-5 object-contain"
                        />
                        <span className="min-w-0 flex-1 truncate">{item.name}</span>
                        {item.hide && (
                          <>
                            <EyeOff className="text-muted-foreground size-3.5" aria-hidden />
                            <span className="sr-only">(hidden)</span>
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
              {canAddCustom && (
                <div
                  className={cn(filteredGroups.length > 0 && "mt-1 border-t border-white/10 pt-1")}
                >
                  <button
                    type="button"
                    onClick={addCustom}
                    className="hover:bg-accent focus-visible:bg-accent flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-none"
                  >
                    <Plus className="text-muted-foreground size-4 shrink-0" />
                    <span className="min-w-0 flex-1 truncate">Add &quot;{customName}&quot;</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
