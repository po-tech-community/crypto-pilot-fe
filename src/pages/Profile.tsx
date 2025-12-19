import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/api/profile";
import ProfileCard from "@/components/profile/ProfileCard";
import type { Profile } from "@/types/profile";

export default function ProfilePage() {
  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  if (profileLoading) {
    return <div>Loading...</div>;
  }

  if (profileError || !profile) {
    return <div>Error loading profile</div>;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">{profile.email}</p>

      <ProfileCard profile={profile} />
    </div>
  );
}
