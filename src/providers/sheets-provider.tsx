"use client";
import { useMountedState } from "react-use";
import { EditProjectSheet } from "../features/admin/projects/edit-project-sheet";
import { NewProjectSheet } from "../features/admin/projects/new-project-sheet";

export default function SheetsProvider() {
  const isMounted = useMountedState();
  if (!isMounted) return null;

  return (
    <div>
      <NewProjectSheet />
      <EditProjectSheet />
    </div>
  );
}
