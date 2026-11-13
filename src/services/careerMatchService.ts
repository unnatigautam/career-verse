
import {
  Code2,
  Brain,
  Palette,
  Database,
  Shield,
  Cloud,
  BriefcaseBusiness,
} from "lucide-react";

import type { ProfileData } from "./profileService";

export type Assessment = {
  education?: string;
  field?: string;
  interests?: string[];
  skills?: string[];
  experience?: string;
  workPreference?: string;
  careerGoal?: string;
};

export type Career = {
  id: number;
  title: string;
  category: string;
  description: string;
  skills: string[];
  interests: string[];
  icon: typeof Code2;
  color: string;
};

export type Recommendation = {
  career: Career;
  score: number | null;
  matchedSkills: string[];
  matchedInterests: string[];
  missingSkills: string[];
  goalMatch: boolean;
};

export const careerData: Career[] = [
  {
    id: 1,
    title: "Frontend Developer",
    category: "Development",
    description: "Build interactive websites and applications with engaging user experiences.",
    skills: ["HTML", "CSS", "JavaScript", "React", "UI Design"],
    interests: ["Web Development", "Design", "Technology", "Programming"],
    icon: Code2,
    color: "violet",
  },
  {
    id: 2,
    title: "AI/ML Engineer",
    category: "Artificial Intelligence",
    description: "Develop intelligent systems using machine learning and AI technologies.",
    skills: ["Python", "Machine Learning", "Statistics", "Deep Learning"],
    interests: ["Artificial Intelligence", "Machine Learning", "Research", "Programming"],
    icon: Brain,
    color: "blue",
  },
  {
    id: 3,
    title: "Data Scientist",
    category: "Data & Analytics",
    description: "Analyze datasets, discover patterns, and build data-driven solutions.",
    skills: ["Python", "SQL", "Statistics", "Data Visualization"],
    interests: ["Data Science", "Analytics", "Mathematics", "Research"],
    icon: Database,
    color: "cyan",
  },
  {
    id: 4,
    title: "UI/UX Designer",
    category: "Design",
    description: "Create intuitive digital experiences through user research and interface design.",
    skills: ["Figma", "Wireframing", "Prototyping", "User Research"],
    interests: ["Design", "Creativity", "User Experience", "Product"],
    icon: Palette,
    color: "pink",
  },
  {
    id: 5,
    title: "Backend Developer",
    category: "Development",
    description: "Build APIs, databases, and server-side systems powering applications.",
    skills: ["Node.js", "Python", "SQL", "REST APIs", "Databases"],
    interests: ["Backend Development", "Programming", "Technology"],
    icon: Code2,
    color: "emerald",
  },
  {
    id: 6,
    title: "Cybersecurity Analyst",
    category: "Security",
    description: "Protect digital systems by identifying vulnerabilities and security threats.",
    skills: ["Networking", "Linux", "Security", "Python"],
    interests: ["Cybersecurity", "Security", "Technology", "Problem Solving"],
    icon: Shield,
    color: "orange",
  },
  {
    id: 7,
    title: "Cloud Engineer",
    category: "Infrastructure",
    description: "Build and maintain scalable cloud infrastructure and deployment systems.",
    skills: ["AWS", "Linux", "Docker", "Networking"],
    interests: ["Cloud Computing", "Infrastructure", "Technology"],
    icon: Cloud,
    color: "sky",
  },
  {
    id: 8,
    title: "Product Manager",
    category: "Product & Business",
    description: "Connect user needs, business goals, and technology to build useful products.",
    skills: ["Communication", "Product Strategy", "Analytics", "Planning"],
    interests: ["Product Management", "Business", "Leadership", "Product"],
    icon: BriefcaseBusiness,
    color: "amber",
  },
];

export const normalize = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9+#.]/g, "");

const skillAliases: Record<string, string[]> = {
  javascript: ["js", "javascript"],
  typescript: ["ts", "typescript"],
  "node.js": ["node", "nodejs", "node.js"],
  "machine learning": ["ml", "machine learning"],
  "deep learning": ["dl", "deep learning"],
  "ui design": ["ui", "ui design", "user interface design"],
  "data visualization": ["data viz", "data visualization"],
  "rest apis": ["api", "apis", "rest api", "rest apis"],
  databases: ["database", "databases", "db", "dbms"],
  "user research": ["user research", "ux research"],
};

export function isSkillMatch(userSkill: string, careerSkill: string) {
  const user = normalize(userSkill);
  const career = normalize(careerSkill);

  if (!user || !career) return false;
  if (user === career) return true;

  const userAliases = skillAliases[userSkill.toLowerCase().trim()] ?? [];
  const careerAliases = skillAliases[careerSkill.toLowerCase().trim()] ?? [];

  return (
    userAliases.some((alias) => normalize(alias) === career) ||
    careerAliases.some((alias) => normalize(alias) === user
  ));
}

export function isInterestMatch(
  userInterest: string,
  careerInterest: string
) {
  const user = normalize(userInterest);
  const career = normalize(careerInterest);

  if (!user || !career) return false;
  if (user === career) return true;

  return user.includes(career) || career.includes(user);
}

export function matchesCareerGoal(goal: string, career: Career) {
  const normalizedGoal = normalize(goal);
  const normalizedTitle = normalize(career.title);
  const normalizedCategory = normalize(career.category);

  if (!normalizedGoal) return false;

  const goalAliases: Record<number, string[]> = {
    1: ["frontend developer", "front end developer", "web developer"],
    2: ["ai engineer", "ml engineer", "machine learning engineer", "ai/ml engineer"],
    3: ["data scientist", "data analyst", "data science"],
    4: ["ui ux designer", "ui/ux designer", "ux designer", "ui designer"],
    5: ["backend developer", "back end developer", "server developer"],
    6: ["cybersecurity analyst", "security analyst"],
    7: ["cloud engineer", "cloud computing"],
    8: ["product manager", "product management"],
  };

  return (
    normalizedGoal === normalizedTitle ||
    normalizedGoal === normalizedCategory ||
    (goalAliases[career.id] ?? []).some((alias =>
      normalizedGoal.includes(normalize(alias))
    ))
  );
}

export function calculateMatch(
  career: Career,
  assessment: Assessment
): Recommendation {
  const userInterests = assessment.interests ?? [];
  const userSkills = assessment.skills ?? [];

  const matchedInterests = career.interests.filter((careerInterest =>
    userInterests.some(userInterest =>
      isInterestMatch(userInterest, careerInterest)
    )
  ));

  const matchedSkills = career.skills.filter(careerSkill =>
    userSkills.some(userSkill =>
      isSkillMatch(userSkill, careerSkill)
    )
  );

  const missingSkills = career.skills.filter(
    skill => !matchedSkills.includes(skill)
  );

  const goalMatch = matchesCareerGoal(
    assessment.careerGoal ?? "",
    career
  );

  const hasPersonalData =
    userInterests.length > 0 ||
    userSkills.length > 0 ||
    Boolean(assessment.careerGoal?.trim());

  if (!hasPersonalData) {
    return {
      career,
      score: null,
      matchedSkills,
      matchedInterests,
      missingSkills,
      goalMatch,
    };
  }

  const interestScore =
    userInterests.length > 0
      ? (matchedInterests.length / Math.max(career.interests.length, 1)) * 50
      : 0;

  const skillScore =
    userSkills.length > 0
      ? (matchedSkills.length / Math.max(career.skills.length, 1)) * 35
      : 0;

  const goalScore = goalMatch ? 15 : 0;

  const availableWeight =
    (userInterests.length > 0 ? 50 : 0) +
    (userSkills.length > 0 ? 35 : 0) +
    (assessment.careerGoal?.trim() ? 15 : 0);

  const score = Math.round(
    ((interestScore + skillScore + goalScore) / availableWeight) * 100
  );

  return {
    career,
    score: Math.min(100, Math.max(0, score)),
    matchedSkills,
    matchedInterests,
    missingSkills,
    goalMatch,
  };
}

export function mergeUserData(
  profile: ProfileData | null,
  assessment: Assessment
): Assessment {
  return {
    education: assessment.education || profile?.education || "",
    field: assessment.field || profile?.field || "",
    interests: Array.from(
      new Set([
        ...(assessment.interests ?? []),
        ...(profile?.interests ?? []),
      ])
    ),
    skills: Array.from(
      new Map(
        [...(assessment.skills ?? []), ...(profile?.skills ?? [])]
          .map(skill => [normalize(skill), skill])
      ).values()
    ),
    experience: assessment.experience || profile?.experience || "",
    workPreference:
      assessment.workPreference || profile?.workPreference || "",
    careerGoal: assessment.careerGoal || profile?.careerGoal || "",
  };
}

export function getCareerRecommendations(
  assessment: Assessment
): Recommendation[] {
  return careerData
    .map(career => calculateMatch(career, assessment))
    .sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
}
