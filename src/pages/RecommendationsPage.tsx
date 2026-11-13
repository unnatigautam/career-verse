
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Target,
  TrendingUp,
  Brain,
  Code2,
  Palette,
  Database,
  Shield,
  Cloud,
  BriefcaseBusiness,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { getLatestAssessment } from "../services/assessmentService";
import {
  getProfile,
  type ProfileData,
} from "../services/profileService";

type Assessment = {
  education?: string;
  field?: string;
  interests?: string[];
  skills?: string[];
  experience?: string;
  workPreference?: string;
  careerGoal?: string;
};

type Career = {
  id: number;
  title: string;
  category: string;
  description: string;
  skills: string[];
  interests: string[];
  icon: typeof Code2;
  color: string;
};

type Recommendation = {
  career: Career;
  score: number;
  matchedSkills: string[];
  matchedInterests: string[];
  missingSkills: string[];
};

const careerData: Career[] = [
  {
    id: 1,
    title: "Frontend Developer",
    category: "Development",
    description:
      "Build interactive websites and applications with engaging user experiences.",
    skills: ["HTML", "CSS", "JavaScript", "React", "UI Design"],
    interests: ["Web Development", "Design", "Technology", "Programming"],
    icon: Code2,
    color: "violet",
  },
  {
    id: 2,
    title: "AI/ML Engineer",
    category: "Artificial Intelligence",
    description:
      "Develop intelligent systems using machine learning and AI technologies.",
    skills: ["Python", "Machine Learning", "Statistics", "Deep Learning"],
    interests: [
      "Artificial Intelligence",
      "Machine Learning",
      "Research",
      "Programming",
    ],
    icon: Brain,
    color: "blue",
  },
  {
    id: 3,
    title: "Data Scientist",
    category: "Data & Analytics",
    description:
      "Analyze datasets, discover patterns, and build data-driven solutions.",
    skills: ["Python", "SQL", "Statistics", "Data Visualization"],
    interests: ["Data Science", "Analytics", "Mathematics", "Research"],
    icon: Database,
    color: "cyan",
  },
  {
    id: 4,
    title: "UI/UX Designer",
    category: "Design",
    description:
      "Create intuitive digital experiences through user research and interface design.",
    skills: ["Figma", "Wireframing", "Prototyping", "User Research"],
    interests: ["Design", "Creativity", "User Experience", "Product"],
    icon: Palette,
    color: "pink",
  },
  {
    id: 5,
    title: "Backend Developer",
    category: "Development",
    description:
      "Build APIs, databases, and server-side systems powering applications.",
    skills: ["Node.js", "Python", "SQL", "REST APIs", "Databases"],
    interests: ["Backend Development", "Programming", "Technology"],
    icon: Code2,
    color: "emerald",
  },
  {
    id: 6,
    title: "Cybersecurity Analyst",
    category: "Security",
    description:
      "Protect digital systems by identifying vulnerabilities and security threats.",
    skills: ["Networking", "Linux", "Security", "Python"],
    interests: [
      "Cybersecurity",
      "Security",
      "Technology",
      "Problem Solving",
    ],
    icon: Shield,
    color: "orange",
  },
  {
    id: 7,
    title: "Cloud Engineer",
    category: "Infrastructure",
    description:
      "Build and maintain scalable cloud infrastructure and deployment systems.",
    skills: ["AWS", "Linux", "Docker", "Networking"],
    interests: ["Cloud Computing", "Infrastructure", "Technology"],
    icon: Cloud,
    color: "sky",
  },
  {
    id: 8,
    title: "Product Manager",
    category: "Product & Business",
    description:
      "Connect user needs, business goals, and technology to build useful products.",
    skills: ["Communication", "Product Strategy", "Analytics", "Planning"],
    interests: [
      "Product Management",
      "Business",
      "Leadership",
      "Product",
    ],
    icon: BriefcaseBusiness,
    color: "amber",
  },
];

const normalize = (value: string) => value.toLowerCase().trim();

function calculateMatch(career: Career, assessment: Assessment) {
  const userInterests = assessment.interests ?? [];
  const userSkills = assessment.skills ?? [];

  const matchedInterests = career.interests.filter((interest) =>
    userInterests.some(
      (userInterest) =>
        normalize(userInterest).includes(normalize(interest)) ||
        normalize(interest).includes(normalize(userInterest))
    )
  );

  const matchedSkills = career.skills.filter((skill) =>
    userSkills.some(
      (userSkill) =>
        normalize(userSkill).includes(normalize(skill)) ||
        normalize(skill).includes(normalize(userSkill))
    )
  );

  const interestScore =
    career.interests.length > 0
      ? (matchedInterests.length / career.interests.length) * 60
      : 0;

  const skillScore =
    career.skills.length > 0
      ? (matchedSkills.length / career.skills.length) * 40
      : 0;

  const rawScore = interestScore + skillScore;

  const hasAssessmentData =
    userInterests.length > 0 || userSkills.length > 0;

  const score = hasAssessmentData
    ? Math.min(98, Math.max(35, Math.round(rawScore)))
    : 75;

  const missingSkills = career.skills.filter(
    (skill) => !matchedSkills.includes(skill)
  );

  return {
    score,
    matchedSkills,
    matchedInterests,
    missingSkills,
  };
}

function mergeUserData(
  profile: ProfileData | null,
  assessment: Assessment
): Assessment {
  return {
    education: assessment.education || profile?.education || "",
    field: assessment.field || profile?.field || "",
    interests:
      assessment.interests?.length
        ? assessment.interests
        : profile?.interests ?? [],
    skills:
      assessment.skills?.length
        ? assessment.skills
        : profile?.skills ?? [],
    experience: assessment.experience || profile?.experience || "",
    workPreference:
      assessment.workPreference || profile?.workPreference || "",
    careerGoal: assessment.careerGoal || profile?.careerGoal || "",
  };
}

export default function RecommendationsPage() {
  const [assessment, setAssessment] = useState<Assessment>({});
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRecommendationsData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch Profile and Assessment independently.
      const [profileResult, assessmentResult] =
        await Promise.allSettled([
          getProfile(),
          getLatestAssessment(),
        ]);

      let loadedProfile: ProfileData | null = null;
      let loadedAssessment: Assessment = {};

      if (profileResult.status === "fulfilled") {
        loadedProfile = profileResult.value;
        setProfile(loadedProfile);
      } else {
        console.error("Failed to load profile:", profileResult.reason);
        setProfile(null);
      }

      if (assessmentResult.status === "fulfilled") {
        loadedAssessment =
          assessmentResult.value?.assessment?.answers ?? {};
      } else {
        console.error(
          "Failed to load assessment:",
          assessmentResult.reason
        );
      }

      // Assessment data takes priority; Profile fills missing information.
      const mergedData = mergeUserData(
        loadedProfile,
        loadedAssessment
      );

      setAssessment(mergedData);

      // Only show a complete error when both sources fail.
      if (
        profileResult.status === "rejected" &&
        assessmentResult.status === "rejected"
      ) {
        setError(
          "Unable to load your profile or assessment. Please check your connection and try again."
        );
      }
    } catch (err) {
      console.error("Failed to load recommendation data:", err);
      setError(
        "Unable to load your career information. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendationsData();
  }, []);

  const recommendations: Recommendation[] = useMemo(() => {
    return careerData
      .map((career) => ({
        career,
        ...calculateMatch(career, assessment),
      }))
      .sort((a, b) => b.score - a.score);
  }, [assessment]);

  const hasAssessment =
    Boolean(assessment.interests?.length) ||
    Boolean(assessment.skills?.length);

  const colorClasses: Record<string, string> = {
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    pink: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    sky: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  return (
    <div className="min-h-screen bg-[#080b14] text-white">
      {/* HEADER */}
      <header className="border-b border-white/5 bg-[#080b14]/90">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-slate-400 hover:text-white"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <span className="font-bold">
              Career<span className="text-violet-400">Verse</span>
            </span>
          </div>

          <Link
            to="/careers"
            className="text-sm text-violet-400 hover:text-violet-300"
          >
            Explore Careers
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* INTRO */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-violet-400 text-sm mb-4">
            <Sparkles size={16} />
            Personalized Insights
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Your career recommendations
          </h1>

          <p className="text-slate-400 max-w-2xl">
            Discover career paths that align with your interests and
            skills, along with the capabilities you can develop next.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="mb-8 rounded-xl border border-white/10 bg-white/[0.025] p-6 flex items-center gap-3 text-slate-400">
            <RefreshCw size={18} className="animate-spin text-violet-400" />
            Loading your profile and assessment...
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/5 p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="font-medium text-red-300">
                  Couldn't load your career information
                </p>
                <p className="text-sm text-slate-400 mt-1">{error}</p>
                <button
                  onClick={loadRecommendationsData}
                  className="mt-3 inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300"
                >
                  <RefreshCw size={14} />
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ASSESSMENT NOTICE */}
        {!loading && !error && !hasAssessment && (
          <div className="mb-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle
                className="text-amber-400 shrink-0 mt-0.5"
                size={20}
              />
              <div>
                <p className="font-medium text-amber-200">
                  Complete your career assessment
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  These are general suggestions. Complete your assessment
                  to make your recommendations more personalized.
                </p>
              </div>
            </div>

            <Link
              to="/assessment"
              className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-sm"
            >
              Take Assessment <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* SUMMARY */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
              <Target size={16} className="text-violet-400" />
              Career Paths
            </div>
            <p className="text-2xl font-bold">{recommendations.length}</p>
            <p className="text-xs text-slate-500 mt-1">
              Evaluated career options
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
              <TrendingUp size={16} className="text-emerald-400" />
              Top Match
            </div>
            <p className="text-xl font-bold">
              {recommendations[0]?.career.title ?? "—"}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {recommendations[0]?.score ?? 0}% illustrative match
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
              <Brain size={16} className="text-blue-400" />
              Your Interests
            </div>
            <p className="text-2xl font-bold">
              {assessment.interests?.length ?? 0}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Interests selected
            </p>
          </div>
        </div>

        {/* RECOMMENDATIONS */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold">
            Recommended career paths
          </h2>
          <span className="text-xs text-slate-500">
            Highest match first
          </span>
        </div>

        <div className="space-y-5">
          {recommendations.map((item, index) => {
            const Icon = item.career.icon;

            return (
              <div
                key={item.career.id}
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 md:p-7 hover:border-violet-500/20 transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* CAREER INFO */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${
                          colorClasses[item.career.color]
                        }`}
                      >
                        <Icon size={22} />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {index === 0 && (
                            <span className="text-xs px-2 py-1 rounded-full bg-violet-500/10 text-violet-300">
                              Top Recommendation
                            </span>
                          )}
                          <span className="text-xs text-slate-500">
                            {item.career.category}
                          </span>
                        </div>

                        <h3 className="text-xl font-semibold">
                          {item.career.title}
                        </h3>
                        <p className="text-sm text-slate-400 mt-2 max-w-2xl">
                          {item.career.description}
                        </p>
                      </div>
                    </div>

                    {/* MATCHED SKILLS */}
                    <div className="mt-6">
                      <p className="text-xs text-slate-500 mb-3">
                        Skills you already have that match
                      </p>

                      {item.matchedSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {item.matchedSkills.map((skill) => (
                            <span
                              key={skill}
                              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"
                            >
                              <CheckCircle2 size={13} />
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500">
                          Add skills in your assessment or profile to see matching skills.
                        </p>
                      )}
                    </div>

                    {/* SKILL GAPS */}
                    <div className="mt-5">
                      <p className="text-xs text-slate-500 mb-3">
                        Skills to develop
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.missingSkills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="text-xs px-2.5 py-1.5 rounded-lg bg-white/5 text-slate-400"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* MATCH SCORE */}
                  <div className="lg:w-44 shrink-0 lg:border-l lg:border-white/5 lg:pl-6">
                    <div className="flex lg:flex-col items-center lg:items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">
                          Illustrative match
                        </p>
                        <p className="text-3xl font-bold text-violet-300">
                          {item.score}%
                        </p>
                      </div>

                      <div className="w-full max-w-32 h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>

                    <Link
                      to="/careers"
                      className="flex items-center justify-center gap-2 w-full mt-5 py-2.5 rounded-lg border border-white/10 text-sm text-slate-300 hover:text-white hover:border-violet-500/30 transition"
                    >
                      Explore Career <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-blue-500/5 p-7 md:p-9">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Ready to build your career roadmap?
              </h2>
              <p className="text-sm text-slate-400">
                Explore career paths and identify the skills you need next.
              </p>
            </div>

            <Link
              to="/careers"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 font-medium hover:opacity-90 transition"
            >
              Explore All Careers <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        <p className="text-xs text-slate-600 mt-8 text-center">
          Match scores are illustrative and based on simple overlap between
          assessment interests and skills. They are not validated AI predictions.
        </p>
      </main>
    </div>
  );
}
