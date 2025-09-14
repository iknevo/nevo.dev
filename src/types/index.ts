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
  title: string;
  year: number;
  techStack: string[];
  thumbnail: string;
  images: string[];
  slug: string;
  liveUrl?: string;
  sourceCode?: string;
  description?: string;
  role?: string;
}
