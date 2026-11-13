
import api from "./api";

export interface ProfileData {
  userId: string;
  name: string;
  email: string;
  education: string;
  field: string;
  interests: string[];
  skills: string[];
  experience: string;
  workPreference: string;
  careerGoal: string;
  updatedAt?: string;
}

export const getProfile = async (): Promise<ProfileData | null> => {
  const response = await api.get("/profile");
  return response.data.profile ?? null;
};

export const saveProfile = async (
  profile: ProfileData
): Promise<ProfileData> => {
  const response = await api.put("/profile", profile);
  return response.data.profile;
};

export function getProfileCompletion(profile: ProfileData | null): number {
  if (!profile) return 0;

  const fields = [
    profile.name,
    profile.education,
    profile.field,
    profile.skills.length > 0,
    profile.interests.length > 0,
    profile.careerGoal,
    profile.workPreference,
    profile.experience,
  ];

  return Math.round(
    (fields.filter(Boolean).length / fields.length) * 100
  );
}
