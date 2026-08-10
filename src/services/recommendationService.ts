import type { Recommendation, Profile } from '../types';
import { generateCareerRecommendations } from './aiService';

const KEY = 'career_recommendations';

function getAll(): Record<string, Recommendation[]> {
  return JSON.parse(localStorage.getItem(KEY) || '{}');
}

export function getRecommendations(userId: string): Recommendation[] {
  return (getAll()[userId] || []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createRecommendation(profile: Profile): Promise<Recommendation> {
  const careers = await generateCareerRecommendations(profile);
  const rec: Recommendation = {
    id: `rec_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    userId: profile.userId,
    createdAt: new Date().toISOString(),
    careers,
    profileSnapshot: {
      skills: profile.skills,
      interests: profile.interests,
      degree: profile.degree,
      careerGoals: profile.careerGoals,
    },
  };
  const all = getAll();
  if (!all[profile.userId]) all[profile.userId] = [];
  all[profile.userId].unshift(rec);
  localStorage.setItem(KEY, JSON.stringify(all));
  return rec;
}

export function deleteRecommendation(userId: string, recId: string): void {
  const all = getAll();
  if (!all[userId]) return;
  all[userId] = all[userId].filter((r) => r.id !== recId);
  localStorage.setItem(KEY, JSON.stringify(all));
}
