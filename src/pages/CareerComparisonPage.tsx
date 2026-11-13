
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowLeftRight,
  Briefcase,
  Check,
  GraduationCap,
  TrendingUp,
  DollarSign,
  Sparkles,
  Target,
  Lightbulb,
  UserRound,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { getProfile, type ProfileData } from "../services/profileService";
import { getLatestAssessment } from "../services/assessmentService";
import {
  careerData,
  calculateMatch,
  mergeUserData,
  type Assessment,
} from "../services/careerMatchService";

type Career = {
  id: string;
  title: string;
  category: string;
  salary: string;
  growth: string;
  demand: string;
  education: string;
  skills: string[];
  softSkills: string[];
  description: string;
};

const careers: Career[] = [
  {
    id: "frontend",
    title: "Frontend Developer",
    category: "Software Development",
    salary: "₹4–12 LPA",
    growth: "High",
    demand: "Very High",
    education: "B.Tech / BCA / Relevant Skills",
    skills: ["HTML", "CSS", "JavaScript", "React", "Git"],
    softSkills: ["Communication", "Creativity", "Problem Solving"],
    description:
      "Build interactive, responsive user interfaces for websites and applications.",
  },
  {
    id: "aiml",
    title: "AI/ML Engineer",
    category: "Artificial Intelligence",
    salary: "₹6–20 LPA",
    growth: "Very High",
    demand: "Very High",
    education: "B.Tech / B.Sc / Relevant Skills",
    skills: ["Python", "Machine Learning", "Statistics", "SQL", "Deep Learning"],
    softSkills: ["Analytical Thinking", "Research", "Problem Solving"],
    description:
      "Develop intelligent systems using machine learning and artificial intelligence.",
  },
  {
    id: "data",
    title: "Data Scientist",
    category: "Data & Analytics",
    salary: "₹5–18 LPA",
    growth: "Very High",
    demand: "High",
    education: "B.Tech / B.Sc / Relevant Skills",
    skills: ["Python", "Statistics", "SQL", "Machine Learning", "Data Visualization"],
    softSkills: ["Analytical Thinking", "Communication", "Critical Thinking"],
    description:
      "Extract insights from data and build predictive models to support decisions.",
  },
  {
    id: "backend",
    title: "Backend Developer",
    category: "Software Development",
    salary: "₹5–15 LPA",
    growth: "High",
    demand: "High",
    education: "B.Tech / BCA / Relevant Skills",
    skills: ["Node.js", "Python", "SQL", "APIs", "Git"],
    softSkills: ["Problem Solving", "Teamwork", "Logical Thinking"],
    description:
      "Build server-side systems, APIs, databases, and application infrastructure.",
  },
  {
    id: "uiux",
    title: "UI/UX Designer",
    category: "Design",
    salary: "₹4–12 LPA",
    growth: "High",
    demand: "High",
    education: "Any Degree / Design Portfolio",
    skills: ["Figma", "Wireframing", "Prototyping", "User Research"],
    softSkills: ["Creativity", "Empathy", "Communication"],
    description:
      "Design intuitive digital experiences based on user needs and research.",
  },
  {
    id: "cyber",
    title: "Cybersecurity Analyst",
    category: "Cybersecurity",
    salary: "₹5–16 LPA",
    growth: "Very High",
    demand: "High",
    education: "B.Tech / Relevant Certifications",
    skills: ["Networking", "Linux", "Python", "Security Tools", "Cryptography"],
    softSkills: ["Attention to Detail", "Analytical Thinking", "Problem Solving"],
    description:
      "Protect systems, networks, and information against security threats.",
  },
  {
    id: "cloud",
    title: "Cloud Engineer",
    category: "Cloud Computing",
    salary: "₹5–16 LPA",
    growth: "High",
    demand: "High",
    education: "B.Tech / Relevant Certifications",
    skills: ["Linux", "Networking", "AWS", "Docker", "Python"],
    softSkills: ["Problem Solving", "Teamwork", "Adaptability"],
    description:
      "Design, deploy, and maintain scalable cloud infrastructure and services.",
  },
  {
    id: "pm",
    title: "Product Manager",
    category: "Product & Business",
    salary: "₹8–25 LPA",
    growth: "High",
    demand: "High",
    education: "Any Degree / Relevant Experience",
    skills: ["Product Strategy", "Analytics", "Roadmapping", "User Research"],
    softSkills: ["Leadership", "Communication", "Decision Making"],
    description:
      "Define product strategy and coordinate teams to deliver valuable products.",
  },
];

const normalizeSkill = (skill: string) =>
  skill.trim().toLowerCase().replace(/[^a-z0-9+#.]/g, "");

function SkillTag({
  skill,
  matched,
}: {
  skill: string;
  matched?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs ${
        matched
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
          : "border-white/10 bg-white/[0.03] text-slate-300"
      }`}
    >
      {matched && <Check size={12} />}
      {skill}
    </span>
  );
}

function CareerSelect({
  label,
  value,
  onChange,
  excluded,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  excluded: string;
}) {
  return (
    <div className="flex-1">
      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3.5 text-sm font-medium text-white outline-none focus:border-violet-500/60"
      >
        {careers
          .filter((career) => career.id !== excluded)
          .map((career) => (
            <option key={career.id} value={career.id}>
              {career.title}
            </option>
          ))}
      </select>
    </div>
  );
}

export default function CareerComparisonPage() {
  const [firstId, setFirstId] = useState("frontend");
  const [secondId, setSecondId] = useState("aiml");

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadPersonalization = async () => {
      setLoadingProfile(true);
      setProfileError("");

      try {
        const [profileResult, assessmentResult] =
          await Promise.allSettled([getProfile(), getLatestAssessment()]);

        if (!isMounted) return;

        if (profileResult.status === "fulfilled") {
          setProfile(profileResult.value);
        } else {
          setProfileError("Unable to load your saved profile.");
        }

        if (assessmentResult.status === "fulfilled") {
          const response = assessmentResult.value?.assessment;

          const savedAssessment =
            response?.answers ??
            response?.result?.assessment ??
            response?.result ??
            response ??
            null;

          setAssessment(savedAssessment);
        }
      } catch {
        if (isMounted) {
          setProfileError("Unable to load personalization data.");
        }
      } finally {
        if (isMounted) setLoadingProfile(false);
      }
    };

    loadPersonalization();

    return () => {
      isMounted = false;
    };
  }, []);

  const firstCareer = careers.find((career) => career.id === firstId) ?? careers[0];
  const secondCareer = careers.find((career) => career.id === secondId) ?? careers[1];

  // Shared career matching service is now the source of personalization.
  const mergedAssessment = useMemo(
    () => mergeUserData(profile, assessment ?? {}),
    [profile, assessment]
  );

  const getSharedCareer = (career: Career) =>
    careerData.find(
      (item) => item.title.toLowerCase() === career.title.toLowerCase()
    );

  const firstSharedCareer = getSharedCareer(firstCareer);
  const secondSharedCareer = getSharedCareer(secondCareer);

  const firstRecommendation = firstSharedCareer
    ? calculateMatch(firstSharedCareer, mergedAssessment)
    : null;

  const secondRecommendation = secondSharedCareer
    ? calculateMatch(secondSharedCareer, mergedAssessment)
    : null;

  const commonSkills = useMemo(
    () =>
      firstCareer.skills.filter((skill) =>
        secondCareer.skills.some(
          (other) => normalizeSkill(other) === normalizeSkill(skill)
        )
      ),
    [firstCareer, secondCareer]
  );

  const uniqueFirstSkills = firstCareer.skills.filter(
    (skill) =>
      !commonSkills.some(
        (common) => normalizeSkill(common) === normalizeSkill(skill)
      )
  );

  const uniqueSecondSkills = secondCareer.skills.filter(
    (skill) =>
      !commonSkills.some(
        (common) => normalizeSkill(common) === normalizeSkill(skill)
      )
  );

  const userSkills = mergedAssessment.skills ?? [];
  const careerGoal = mergedAssessment.careerGoal ?? "";

  const firstMatchedSkills = firstRecommendation?.matchedSkills ?? [];
  const secondMatchedSkills = secondRecommendation?.matchedSkills ?? [];

  const firstMatchPercentage = firstRecommendation?.score ?? 0;
  const secondMatchPercentage = secondRecommendation?.score ?? 0;

  const swapCareers = () => {
    setFirstId(secondId);
    setSecondId(firstId);
  };

  const metricClass =
    "rounded-xl border border-white/[0.06] bg-white/[0.025] p-4";

  return (
    <div className="min-h-screen bg-[#080b14] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm text-violet-300">
            <Sparkles size={15} />
            Career Intelligence
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Compare Careers
          </h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            Explore career paths side by side and discover which skills,
            opportunities, and growth directions align with your goals.
          </p>
        </div>

        {/* Career Selection */}
        <div className="mb-8 rounded-2xl border border-white/[0.07] bg-[#101525] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <CareerSelect
              label="Career One"
              value={firstId}
              onChange={setFirstId}
              excluded={secondId}
            />

            <button
              onClick={swapCareers}
              className="flex h-11 w-11 shrink-0 items-center justify-center self-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-violet-500/30 hover:text-violet-300"
              title="Swap careers"
              aria-label="Swap careers"
            >
              <ArrowLeftRight size={18} />
            </button>

            <CareerSelect
              label="Career Two"
              value={secondId}
              onChange={setSecondId}
              excluded={firstId}
            />
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="grid gap-5 lg:grid-cols-2">
          {[firstCareer, secondCareer].map((career, index) => (
            <div
              key={career.id}
              className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101525]"
            >
              <div
                className={`border-b border-white/[0.06] p-6 ${
                  index === 0
                    ? "bg-gradient-to-br from-violet-500/[0.10] to-transparent"
                    : "bg-gradient-to-br from-blue-500/[0.10] to-transparent"
                }`}
              >
                <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-400">
                  <Briefcase size={14} />
                  {career.category}
                </div>
                <h2 className="text-2xl font-bold">{career.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {career.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-5">
                <div className={metricClass}>
                  <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                    <DollarSign size={14} />
                    Salary Range
                  </div>
                  <p className="text-lg font-bold text-emerald-300">
                    {career.salary}
                  </p>
                </div>

                <div className={metricClass}>
                  <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                    <TrendingUp size={14} />
                    Growth Outlook
                  </div>
                  <p className="text-lg font-bold text-violet-300">
                    {career.growth}
                  </p>
                </div>

                <div className={metricClass}>
                  <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                    <Target size={14} />
                    Job Demand
                  </div>
                  <p className="text-sm font-semibold text-blue-300">
                    {career.demand}
                  </p>
                </div>

                <div className={metricClass}>
                  <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                    <GraduationCap size={14} />
                    Education
                  </div>
                  <p className="text-xs leading-5 text-slate-300">
                    {career.education}
                  </p>
                </div>
              </div>

              <div className="border-t border-white/[0.06] p-5">
                <h3 className="mb-3 text-sm font-semibold">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {career.skills.map((skill) => (
                    <SkillTag
                      key={skill}
                      skill={skill}
                      matched={commonSkills.some(
                        (common) =>
                          normalizeSkill(common) === normalizeSkill(skill)
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="border-t border-white/[0.06] p-5">
                <h3 className="mb-3 text-sm font-semibold">Soft Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {career.softSkills.map((skill) => (
                    <SkillTag key={skill} skill={skill} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Personal Career Alignment */}
        <section className="mt-8 rounded-2xl border border-violet-500/15 bg-gradient-to-br from-violet-500/[0.08] to-blue-500/[0.04] p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-violet-500/15 p-2.5">
              <UserRound size={20} className="text-violet-300" />
            </div>
            <div>
              <h2 className="font-semibold">Your Career Alignment</h2>
              <p className="text-xs text-slate-500">
                Powered by your profile and the shared career matching service
              </p>
            </div>
          </div>

          {loadingProfile ? (
            <div className="flex items-center gap-2 py-4 text-sm text-slate-400">
              <Loader2 size={16} className="animate-spin" />
              Loading your profile...
            </div>
          ) : profileError ? (
            <div className="flex items-center gap-2 text-sm text-amber-300">
              <AlertCircle size={16} />
              {profileError} Comparison is still available.
            </div>
          ) : userSkills.length === 0 &&
            !careerGoal &&
            !(mergedAssessment.interests?.length) ? (
            <div className="space-y-3 text-sm text-slate-400">
              <p>
                Add skills and a career goal to your profile or complete an
                assessment to see personalized career alignment.
              </p>
              <Link
                to="/profile"
                className="inline-flex items-center rounded-lg border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-violet-300 transition hover:bg-violet-500/15"
              >
                Update Profile
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {careerGoal && (
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
                  <p className="mb-1 text-xs text-slate-500">
                    Your saved career goal
                  </p>
                  <p className="text-sm font-medium text-white">{careerGoal}</p>
                </div>
              )}

              {userSkills.length > 0 && (
                <div>
                  <p className="mb-3 text-sm font-medium text-slate-300">
                    Your saved skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {userSkills.map((skill) => (
                      <SkillTag key={skill} skill={skill} matched />
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {[firstCareer, secondCareer].map((career, index) => {
                  const recommendation =
                    index === 0 ? firstRecommendation : secondRecommendation;

                  const percentage =
                    index === 0
                      ? firstMatchPercentage
                      : secondMatchPercentage;

                  const matchedSkills =
                    index === 0
                      ? firstMatchedSkills
                      : secondMatchedSkills;

                  return (
                    <div
                      key={career.id}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold">{career.title}</h3>
                        <span
                          className={`text-sm font-bold ${
                            index === 0 ? "text-violet-300" : "text-blue-300"
                          }`}
                        >
                          {recommendation?.score === null ||
                          recommendation?.score === undefined
                            ? "—"
                            : `${percentage}% match`}
                        </span>
                      </div>

                      <div className="mb-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className={`h-full rounded-full transition-all ${
                            index === 0
                              ? "bg-gradient-to-r from-violet-500 to-purple-400"
                              : "bg-gradient-to-r from-blue-500 to-cyan-400"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <p className="mb-3 text-xs text-slate-500">
                        {matchedSkills.length} matching skills · calculated using
                        shared career matching logic
                      </p>

                      {matchedSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {matchedSkills.map((skill) => (
                            <SkillTag key={skill} skill={skill} matched />
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500">
                          No matching technical skills recorded yet.
                        </p>
                      )}

                      {recommendation?.goalMatch && (
                        <p className="mt-3 flex items-center gap-1.5 text-xs text-violet-300">
                          <Target size={13} />
                          Matches your career goal
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-xs leading-5 text-slate-500">
                Match percentages are indicative profile-alignment scores based
                on skills, interests, and career goals. They are not predictions
                of job eligibility or hiring probability.
              </p>
            </div>
          )}
        </section>

        {/* Skill Overlap */}
        <section className="mt-8 rounded-2xl border border-white/[0.07] bg-[#101525] p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-2.5">
              <Check size={20} className="text-emerald-300" />
            </div>
            <div>
              <h2 className="font-semibold">Skill Overlap</h2>
              <p className="text-xs text-slate-500">
                Skills shared between the two careers
              </p>
            </div>
          </div>

          {commonSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {commonSkills.map((skill) => (
                <SkillTag key={skill} skill={skill} matched />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              These careers have no common technical skills in our current dataset.
            </p>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-violet-500/10 bg-violet-500/[0.04] p-4">
              <h3 className="mb-3 text-sm font-medium text-violet-300">
                Unique to {firstCareer.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {uniqueFirstSkills.map((skill) => (
                  <SkillTag key={skill} skill={skill} />
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-blue-500/10 bg-blue-500/[0.04] p-4">
              <h3 className="mb-3 text-sm font-medium text-blue-300">
                Unique to {secondCareer.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {uniqueSecondSkills.map((skill) => (
                  <SkillTag key={skill} skill={skill} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Insights */}
        <section className="mt-6 rounded-2xl border border-violet-500/15 bg-gradient-to-br from-violet-500/[0.08] to-blue-500/[0.04] p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-violet-500/15 p-2.5">
              <Lightbulb size={20} className="text-violet-300" />
            </div>
            <h2 className="font-semibold">Comparison Insights</h2>
          </div>

          <div className="space-y-3 text-sm leading-6 text-slate-300">
            <p>
              <span className="font-medium text-white">Shared foundation:</span>{" "}
              {commonSkills.length > 0
                ? `Both careers benefit from ${commonSkills.join(", ")}. These skills can help you explore either path.`
                : "The current career profiles have different technical skill requirements."}
            </p>

            <p>
              <span className="font-medium text-white">Skill differentiation:</span>{" "}
              {firstCareer.title} focuses on{" "}
              {uniqueFirstSkills.slice(0, 3).join(", ") || "its specialized skills"},
              while {secondCareer.title} focuses on{" "}
              {uniqueSecondSkills.slice(0, 3).join(", ") || "its specialized skills"}.
            </p>

            <p>
              <span className="font-medium text-white">Your preparation:</span>{" "}
              {firstMatchedSkills.length + secondMatchedSkills.length > 0
                ? `Your profile already contains skills relevant to ${firstCareer.title} and ${secondCareer.title}.`
                : "Start adding your skills to your profile to see how they align with these careers."}
            </p>

            <p>
              <span className="font-medium text-white">Next step:</span>{" "}
              Identify your existing skills and prioritize learning the
              requirements of your preferred career.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/recommendations"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-semibold transition hover:opacity-90"
            >
              View Recommendations
            </Link>

            <Link
              to="/learning-roadmap"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08]"
            >
              Explore Roadmap
            </Link>
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-slate-600">
          Salary and demand information is illustrative demo data, not verified
          market statistics.
        </p>
      </div>
    </div>
  );
}
