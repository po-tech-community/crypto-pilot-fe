import type { Profile } from "@/types/profile";
import ProfileField from "./ProfileField";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ProfileCard({ profile }: { profile: Profile }) {
  const initials = profile.name
  .split(" ")
  .map((n) => n[0])
  .join("");
  return (
    <>
      <Avatar className="h-20 w-20">
        <AvatarImage src={profile.avatar || undefined} />
        <AvatarFallback>
          {initials}
        </AvatarFallback>
      </Avatar>

      <ProfileField
        label="Name"
        value={profile.name}
      />
      <ProfileField label="Phone" value={profile.phone ?? "N/A"} />
      <ProfileField
        label="Country"
        value={profile.country || "N/A"}
      />
      <ProfileField
        label="Joined"
        value={new Date(profile.joinDate).toLocaleDateString()}
      />
    </>
  );
}
