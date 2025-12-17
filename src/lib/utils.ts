import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAge(birthDate: string) {
  return Math.floor(
    (new Date().getTime() - new Date(birthDate).getTime()) / 3.15576e10
  );
}
