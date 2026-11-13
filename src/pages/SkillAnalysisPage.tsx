
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Brain,
  Target,
  TrendingUp,
  CheckCircle2,
  Circle,
  BookOpen,
  Code2,
  Database,
  Palette,
  BarChart3,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { getProfile } from "../services/profileService";
import { getLatestAssessment } from "../services/assessmentService";

type Assessment = {
  education?: string;
  field?: string;
  interests?: string[];
  skills?: string[];
  experience?: string;
  workPreference?: string;
  careerGoal?: string;
};

type Skill = {
  name: string;
  category: string;
  careers: string[];
  description: string;
  icon: typeof Code2;
};

type SkillWithStatus = Skill & {
  isLearned: boolean;
  isRelevant: boolean;
};

const skillCatalog: Skill[] = [
  {
    name: "HTML",
    category: "Web Development",
    careers: ["Frontend Developer"],
    description: "Structure web pages using semantic HTML.",
    icon: Code2,
  },
  {
    name: "CSS",
    category: "Web Development",
    careers: ["Frontend Developer", "UI/UX Designer"],
    description: "Style responsive and visually appealing interfaces.",
    icon: Palette,
  },
  {
    name: "JavaScript",
    category: "Programming",
    careers: ["Frontend Developer", "Backend Developer"],
    description: "Build interactive applications and dynamic functionality.",
    icon: Code2,
  },
  {
    name: "React",
    category: "Web Development",
    careers: ["Frontend Developer"],
    description: "Develop component-based frontend applications.",
    icon: Code2,
  },
  {
    name: "Python",
    category: "Programming",
    careers: ["AI/ML Engineer", "Data Scientist", "Backend Developer"],
    description: "Write programs and work with data and machine learning.",
    icon: Code2,
  },
  {
    name: "Machine Learning",
    category: "Artificial Intelligence",
    careers: ["AI/ML Engineer", "Data Scientist"],
    description: "Build predictive models using data and algorithms.",
    icon: Brain,
  },
  {
    name: "SQL",
    category: "Data",
    careers: ["Data Scientist", "Backend Developer"],
    description: "Query, manage, and analyze relational databases.",
    icon: Database,
  },
  {
    name: "Statistics",
    category: "Data",
    careers: ["Data Scientist", "AI/ML Engineer"],
    description: "Understand distributions, probability, and data patterns.",
    icon: BarChart3,
  },
  {
    name: "Figma",
    category: "Design",
    careers: ["UI/UX Designer"],
    description: "Create interface designs, wireframes, and prototypes.",
    icon: Palette,
  },
  {
    name: "Data Visualization",
    category: "Data",
    careers: ["Data Scientist"],
    description: "Present information through meaningful charts and visuals.",
    icon: BarChart3,
  },
];

const normalize = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9+#]/g, "");

const matchesSkill = (userSkill: string, catalogSkill: string) => {
  const user = normalize(userSkill);
  const catalog = normalize(catalogSkill);

  return (
    user === catalog ||
    user.includes(catalog) ||
    catalog.includes(user)
  );
};

const getRelevantCareers = (assessment: Assessment) => {
  const goal = assessment.careerGoal?.toLowerCase().trim() ?? "";
  const field = assessment.field?.toLowerCase().trim() ?? "";

  return [goal, field].filter(Boolean);
};

export default function SkillAnalysisPage() {
  const [activeFilter, setActiveFilter] = useState("All Skills");
  const [assessment, setAssessment] = useState<Assessment>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSkillData = async () => {
    setLoading(true);
    setError("");

    try {
      const [profileResult, assessmentResult] = await Promise.allSettled([
        getProfile(),
        getLatestAssessment(),
      ]);

      const profile =
        profileResult.status === "fulfilled"
          ? profileResult.value
          : null;

      const latestAssessment =
        assessmentResult.status === "fulfilled"
          ? assessmentResult.value?.assessment?.result?.assessment ??
            assessmentResult.value?.assessment?.answers ??
            assessmentResult.value?.assessment?.result ??
            assessmentResult.value?.result?.assessment ??
            assessmentResult.value?.result ??
            {}
          : {};

      const profileSkills = profile?.skills ?? [];
      const assessmentSkills = latestAssessment?.skills ?? [];

      const mergedAssessment: Assessment = {
        education: latestAssessment?.education || profile?.education || "",
        field: latestAssessment?.field || profile?.field || "",
        interests:
          latestAssessment?.interests?.length
            ? latestAssessment.interests
            : profile?.interests ?? [],
        skills: assessmentSkills.length
          ? assessmentSkills
          : profileSkills,
        experience:
          latestAssessment?.experience || profile?.experience || "",
        workPreference:
          latestAssessment?.workPreference ||
          profile?.workPreference ||
          "",
        careerGoal:
          latestAssessment?.careerGoal || profile?.careerGoal || "",
      };

      setAssessment(mergedAssessment);

      if (
        profileResult.status === "rejected" &&
        assessmentResult.status === "rejected"
      ) {
        setError(
          "Unable to load your profile and assessment. Please try again."
        );
      }
    } catch {
      setError("Unable to load your skill analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSkillData();
  }, []);

  const userSkills = assessment.skills ?? [];
  const relevantCareers = getRelevantCareers(assessment);

  const skills: SkillWithStatus[] = useMemo(
    () =>
      skillCatalog.map((skill) => {
        const isLearned = userSkills.some((userSkill) =>
          matchesSkill(userSkill, skill.name)
        );

        const careerText = [
          skill.name,
          skill.category,
          ...skill.careers,
        ]
          .join(" ")
          .toLowerCase();

        const isRelevant = relevantCareers.some((career) => {
          const careerWords = career.split(/[\s/-]+/).filter(Boolean);

          return (
            careerText.includes(career) ||
            careerWords.some(
              (word) => word.length > 2 && careerText.includes(word)
            )
          );
        });

        return {
          ...skill,
          isLearned,
          isRelevant,
        };
      }),
    [userSkills, relevantCareers]
  );

  const filteredSkills = skills.filter((skill) => {
    if (activeFilter === "Learned") return skill.isLearned;
    if (activeFilter === "To Learn") return !skill.isLearned;
    if (activeFilter === "Relevant") return skill.isRelevant;
    return true;
  });

  const learnedCount = skills.filter((skill) => skill.isLearned).length;
  const remainingCount = skills.length - learnedCount;
  const readiness = Math.round((learnedCount / skills.length) * 100);

  const filters = ["All Skills", "Learned", "To Learn", "Relevant"];

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
            to="/assessment"
            className="text-sm text-violet-400 hover:text-violet-300"
          >
            Update Skills
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* INTRO */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-violet-400 text-sm mb-4">
            <Brain size={16} />
            Skill Intelligence
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Your skill analysis
          </h1>

          <p className="text-slate-400 max-w-2xl">
            Track your current capabilities, identify skills to develop,
            and understand how your skills connect to career opportunities.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="mb-8 rounded-xl border border-white/10 bg-white/[0.025] p-5 flex items-center gap-3 text-slate-400">
            <RefreshCw size={18} className="animate-spin text-violet-400" />
            Loading your profile and assessment...
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/5 p-5 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-300">{error}</p>
              <button
                onClick={() => void loadSkillData()}
                className="inline-flex items-center gap-2 mt-3 text-sm text-red-300 hover:text-white"
              >
                <RefreshCw size={14} />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* ASSESSMENT NOTICE */}
        {!loading && userSkills.length === 0 && (
          <div className="mb-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 flex items-start gap-3">
            <AlertCircle
              size={20}
              className="text-amber-400 shrink-0 mt-0.5"
            />
            <div>
              <p className="font-medium text-amber-200">
                Add your skills to get started
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Complete or update your career assessment to identify
                skills you already possess.
              </p>
              <Link
                to="/assessment"
                className="inline-flex items-center gap-2 mt-3 text-sm text-amber-300"
              >
                Update Assessment <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        )}

        {/* CAREER GOAL */}
        {!loading && assessment.careerGoal && (
          <div className="mb-8 rounded-xl border border-violet-500/20 bg-violet-500/5 p-5 flex items-start gap-3">
            <Target size={20} className="text-violet-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-violet-300 mb-1">
                Your career direction
              </p>
              <p className="font-medium text-white">
                {assessment.careerGoal}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Skills marked as relevant are aligned with your career direction.
              </p>
            </div>
          </div>
        )}

        {/* SUMMARY CARDS */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
              <CheckCircle2 size={16} className="text-emerald-400" />
              Skills Identified
            </div>
            <p className="text-3xl font-bold">{learnedCount}</p>
            <p className="text-xs text-slate-500 mt-1">
              Skills matching your assessment
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
              <Target size={16} className="text-violet-400" />
              Skills to Explore
            </div>
            <p className="text-3xl font-bold">{remainingCount}</p>
            <p className="text-xs text-slate-500 mt-1">
              Skills not listed in your assessment
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
              <TrendingUp size={16} className="text-blue-400" />
              Skill Coverage
            </div>
            <p className="text-3xl font-bold">{readiness}%</p>
            <p className="text-xs text-slate-500 mt-1">
              Coverage of this skill catalog
            </p>
          </div>
        </div>

        {/* SKILL COVERAGE */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold">Skill coverage overview</h2>
              <p className="text-sm text-slate-500 mt-1">
                Based on the skills listed in your assessment
              </p>
            </div>
            <span className="text-xl font-bold text-violet-300">
              {readiness}%
            </span>
          </div>

          <div className="h-3 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-500"
              style={{ width: `${readiness}%` }}
            />
          </div>

          <p className="text-xs text-slate-500 mt-3">
            This is catalog coverage, not a validated proficiency score.
          </p>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <h2 className="text-xl font-semibold">Skills inventory</h2>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm border transition ${
                  activeFilter === filter
                    ? "bg-violet-500/15 border-violet-500/40 text-violet-300"
                    : "bg-white/[0.02] border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* SKILL GRID */}
        {!loading && (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredSkills.map((skill) => {
              const Icon = skill.icon;

              return (
                <div
                  key={skill.name}
                  className={`rounded-2xl border bg-white/[0.025] p-5 transition ${
                    skill.isRelevant
                      ? "border-violet-500/30 hover:border-violet-500/50"
                      : "border-white/10 hover:border-violet-500/20"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                      <Icon size={20} />
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {skill.isLearned ? (
                        <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                          <CheckCircle2 size={14} />
                          Listed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Circle size={14} />
                          To explore
                        </span>
                      )}

                      {skill.isRelevant && (
                        <span className="text-xs text-violet-300 bg-violet-500/10 px-2 py-1 rounded-md">
                          Career relevant
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-semibold mb-1">{skill.name}</h3>
                  <p className="text-xs text-violet-400 mb-3">
                    {skill.category}
                  </p>

                  <p className="text-sm text-slate-400 leading-relaxed min-h-[48px]">
                    {skill.description}
                  </p>

                  <div className="mt-5 pt-4 border-t border-white/5">
                    <p className="text-xs text-slate-500 mb-2">
                      Relevant career paths
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {skill.careers.map((career) => (
                        <span
                          key={career}
                          className="text-xs px-2 py-1 rounded-md bg-white/5 text-slate-300"
                        >
                          {career}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredSkills.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-white/[0.025] p-8 text-center">
            <p className="text-slate-400">
              No skills match this filter.
            </p>
            <button
              onClick={() => setActiveFilter("All Skills")}
              className="mt-3 text-sm text-violet-400 hover:text-violet-300"
            >
              View all skills
            </button>
          </div>
        )}

        {/* LEARNING CTA */}
        <div className="mt-10 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-blue-500/5 p-7 md:p-9">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-violet-300 text-sm mb-3">
                <BookOpen size={16} />
                Keep growing
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Turn skill gaps into a learning plan
              </h2>
              <p className="text-sm text-slate-400">
                Explore your career roadmap and start building relevant skills.
              </p>
            </div>

            <Link
              to="/roadmap"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 font-medium hover:opacity-90 transition"
            >
              View Learning Roadmap <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>

        <p className="text-xs text-slate-600 mt-8 text-center">
          Skill identification is based on your assessment responses.
          Actual proficiency requires practice and evaluation.
        </p>
      </main>
    </div>
  );
}
