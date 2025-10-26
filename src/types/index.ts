import { projectType } from "../models/project-model";

export type Next_Page_Url = string;

export type Variant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "light"
  | "dark"
  | "link"
  | "no-color";

export interface IProject {
  _id: string;
  name: string;
  year: number;
  techStack: string[];
  thumbnail: string;
  images: string[];
  slug?: string | null;
  liveUrl?: string | null;
  sourceCode?: string | null;
  description: string;
}

export type ProjectResponse = Omit<
  projectType,
  "createdAt" | "updatedAt" | "slug"
> & {
  _id: string;
  slug: string;
};
