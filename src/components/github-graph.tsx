import ContributionGraph from "@/src/components/contribution-graph";
import { GENERAL_INFO } from "@/src/lib/data";
import { getContributionCalendar } from "@/src/lib/github";

export default async function GithubGraph() {
  const calendar = await getContributionCalendar(GENERAL_INFO.github);
  if (!calendar) return null;

  return <ContributionGraph calendar={calendar} username={GENERAL_INFO.github} />;
}
