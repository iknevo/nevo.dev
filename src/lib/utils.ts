export { cn } from "cn";

export function getAge(birthDate: string) {
  return Math.floor((new Date().getTime() - new Date(birthDate).getTime()) / 3.15576e10);
}
