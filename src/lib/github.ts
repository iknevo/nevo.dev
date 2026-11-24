import "server-only";

import { env } from "@/src/config/env";

export type ContributionLevel =
  | "NONE"
  | "FIRST_QUARTILE"
  | "SECOND_QUARTILE"
  | "THIRD_QUARTILE"
  | "FOURTH_QUARTILE";

export type ContributionDay = {
  date: string;
  contributionCount: number;
  contributionLevel: ContributionLevel;
};

export type ContributionCalendar = {
  totalContributions: number;
  weeks: { contributionDays: ContributionDay[] }[];
};

const QUERY = `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

export async function getContributionCalendar(login: string): Promise<ContributionCalendar | null> {
  if (!env.githubToken) return null;
  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: QUERY, variables: { login } }),
      next: { revalidate: 86400 },
    });
    if (!res.ok) throw new Error(`GitHub responded with ${res.status}`);
    const json = await res.json();
    return json.data?.user?.contributionsCollection?.contributionCalendar ?? null;
  } catch (error) {
    console.error("Failed to load GitHub contributions", error);
    return null;
  }
}
