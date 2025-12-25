import type { Profile } from "@/types/profile";
import ProfileField from "./ProfileField";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const getFullName = (p: Profile) =>
  `${p.firstName} ${p.lastName}`.trim();

const getInitials = (p: Profile) =>
  getFullName(p)
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("");

export default function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <>
      <Avatar className="h-20 w-20">
        <AvatarImage src={profile.avatar || undefined} />
        <AvatarFallback>
          {getInitials(profile)}
        </AvatarFallback>
      </Avatar>

      <ProfileField label="Name" value={getFullName(profile)} />
      <ProfileField label="Phone" value={profile.phone ?? "N/A"} />
      <ProfileField label="Country" value={profile.countryId ?? "N/A"} />
      <ProfileField
        label="Joined"
        value={new Date(profile.joinDate).toLocaleDateString()}
      />
    </>
  );
}
