import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import type { Profile } from "@/types/profile";

const getFullName = (p: Profile) =>
  `${p.firstName} ${p.lastName}`.trim();

const getInitials = (p: Profile) =>
  getFullName(p)
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("");
    
export default function UserMenu({ profile }: { profile: Profile }) {
  const nav = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="w-8 h-8">
          <AvatarImage src={profile.avatar} />
          <AvatarFallback>{getInitials(profile)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => nav("/profile")}>
          Profile
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
