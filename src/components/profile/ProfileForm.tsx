import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/api/profile";
import AvatarUpload from "./AvatarUpload";
import type { Profile } from "@/types/profile";

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [phone, setPhone] = useState(profile.phone ?? "");

  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });

  return (
    <>
      <AvatarUpload value={avatar} onChange={setAvatar} />

      <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} />

      <button
        onClick={() =>
          mutation.mutate({
            firstName,
            lastName,
            avatar,
            phone,
          })
        }
      >
        {mutation.isPending ? "Saving..." : "Save"}
      </button>
    </>
  );
}
