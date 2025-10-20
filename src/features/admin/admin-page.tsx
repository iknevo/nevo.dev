"use client";
import useMe from "../auth/api/use-me";
import LogoutButton from "../auth/components/logout-button";
import ProjectsPage from "./projects/projects-page";

export default function AdminPage() {
  const meQuery = useMe();
  if (!meQuery.data) {
    return <p>empty</p>;
  }
  const { user } = meQuery.data;

  return (
    <section className="min-h-screen container space-y-5">
      <div className="flex justify-between">
        <p className="text-2xl">{user.name.toUpperCase()}</p>
        <LogoutButton />
      </div>
      <ProjectsPage />
    </section>
  );
}
