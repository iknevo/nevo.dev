"use client";

import AdminSection, { AdminSectionLoading } from "@/src/features/admin/shared/admin-section";

import { useGetProfile } from "./api/use-get-profile";
import ProfileForm from "./profile-form";

export default function ProfileSection() {
  const { data, isLoading } = useGetProfile();

  return (
    <AdminSection title="Profile">
      {isLoading || !data ? <AdminSectionLoading /> : <ProfileForm profile={data} />}
    </AdminSection>
  );
}
