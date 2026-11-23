export enum STACK {
  "frontend" = "frontend",
  "backend" = "backend",
  "mobile" = "mobile",
  "testing" = "testing",
  "tools" = "tools",
  "studying" = "studying",
}

export enum STACK_SORT {
  "frontend",
  "backend",
  "mobile",
  "testing",
  "tools",
  "studying",
  "default" = 999,
}

export const PROJECT_CARD_SKILLS_COUNT = 3;

export const STACK_TYPE_OPTIONS = [
  { value: STACK.frontend, label: "Front-End" },
  { value: STACK.backend, label: "Back-End" },
  { value: STACK.mobile, label: "Mobile" },
  { value: STACK.testing, label: "Testing" },
  { value: STACK.tools, label: "Tools" },
  { value: STACK.studying, label: "Studying" },
];
