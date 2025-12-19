import type { Profile } from "@/types/profile";

const adaptProfile = (data: any): Profile => {
  return {
    ...data,
    country:
      typeof data?.country === "string"
        ? data.country
        : data?.country?.name ?? "",
  };
};

//Get current user profile
export const getProfile = async (): Promise<Profile> => {
  const res = await fetch("/api/profile/get-me", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }

  const { data } = await res.json();
  return adaptProfile(data);
};

// Update current user profile
export const updateProfile = async (payload: {
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  countryId?: string;
}): Promise<Profile> => {
  const res = await fetch("/api/profile/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to update profile");
  }

  const { data } = await res.json();
  return adaptProfile(data);
};
