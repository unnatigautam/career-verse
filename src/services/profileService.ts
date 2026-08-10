import type { Profile } from '../types';

const KEY = 'career_profiles';

function getAll(): Record<string, Profile> {
  return JSON.parse(localStorage.getItem(KEY) || '{}');
}

export function getProfile(userId: string): Profile | null {
  return getAll()[userId] || null;
}

export function saveProfile(profile: Profile): Profile {
  const all = getAll();
  const updated = { ...profile, updatedAt: new Date().toISOString() };
  all[profile.userId] = updated;
  localStorage.setItem(KEY, JSON.stringify(all));
  return updated;
}

export function getProfileCompletion(profile: Profile | null): number {
  if (!profile) return 0;
  const fields = [
    profile.name,
    profile.degree,
    profile.year,
    profile.academicBackground,
    profile.skills.length > 0,
    profile.interests.length > 0,
    profile.careerGoals,
    profile.preferredAreas.length > 0,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}
