"use client";
import { useMountedState } from "react-use";
import { EditProjectSheet } from "../features/admin/projects/edit-project-sheet";
import { NewProjectSheet } from "../features/admin/projects/new-project-sheet";
import { EditStackSheet } from "../features/admin/stack/edit-stack-sheet";
import { NewStackSheet } from "../features/admin/stack/new-stack-sheet";
import { NewExperienceSheet } from "../features/admin/experience/new-experience-sheet";
import { EditExperienceSheet } from "../features/admin/experience/edit-experience-sheet";

export default function SheetsProvider() {
  const isMounted = useMountedState();
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
