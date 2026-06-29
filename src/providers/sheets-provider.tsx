"use client";

import { useSyncExternalStore } from "react";

import { EditExperienceSheet } from "@/src/features/admin/experience/edit-experience-sheet";
import { NewExperienceSheet } from "@/src/features/admin/experience/new-experience-sheet";
import { EditProjectSheet } from "@/src/features/admin/projects/edit-project-sheet";
import { NewProjectSheet } from "@/src/features/admin/projects/new-project-sheet";
import { EditStackSheet } from "@/src/features/admin/stack/edit-stack-sheet";
import { NewStackSheet } from "@/src/features/admin/stack/new-stack-sheet";

export default function SheetsProvider() {
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  if (!isMounted) return null;
  return (
    <div>
      <NewProjectSheet />
      <EditProjectSheet />
      <NewStackSheet />
      <EditStackSheet />
      <NewExperienceSheet />
      <EditExperienceSheet />
    </div>
  );
}
