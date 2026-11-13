
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Search,
  BriefcaseBusiness,
  Sparkles,
  TrendingUp,
  Clock,
  GraduationCap,
  Code2,
  Brain,
  Palette,
  Shield,
  Cloud,
  Database,
  X,
  CheckCircle2,
  Target,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { getProfile } from "../services/profileService";
import { getLatestAssessment } from "../services/assessmentService";

type Career = {
  id: number;
  title: string;
  category: string;
  description: string;
  salary: string;
  demand: string;
  skills: string[];
  icon: typeof Code2;
  color: string;
  education: string;
  responsibilities: string[];
  roadmap: string[];
};

type UserCareerData = {
  interests: string[];
  skills: string[];
  careerGoal: string;
  field: string;
};

const careers: Career[] = [
  {
    id: 1,
    title: "Frontend Developer",
    category: "Development",
    description:
      "Build interactive, responsive, and user-friendly websites and web applications.",
    salary: "₹4–12 LPA",
    demand: "High",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    icon: Code2,
    color: "violet",
    education: "Computer Science or related field",
    responsibilities: [
      "Build responsive user interfaces",
      "Integrate APIs with frontend applications",
      "Optimize application performance",
      "Collaborate with designers and backend developers",
    ],
    roadmap: [
      "Master HTML, CSS and JavaScript",
      "Learn React and component architecture",
      "Build and deploy 2–3 projects",
      "Practice frontend interview questions",
    ],
  },
  {
    id: 2,
    title: "AI/ML Engineer",
    category: "Artificial Intelligence",
    description:
      "Develop intelligent systems using machine learning algorithms and AI technologies.",
    salary: "₹6–18 LPA",
    demand: "Very High",
    skills: ["Python", "Machine Learning", "Deep Learning", "TensorFlow"],
    icon: Brain,
    color: "blue",
    education: "Computer Science, AI or related field",
    responsibilities: [
      "Develop and train machine learning models",
      "Prepare and process datasets",
      "Evaluate model performance",
      "Deploy AI solutions into applications",
    ],
    roadmap: [
      "Strengthen Python and mathematics",
      "Learn NumPy, Pandas and visualization",
      "Study machine learning algorithms",
      "Build ML projects and deploy models",
    ],
  },
  {
    id: 3,
    title: "Data Scientist",
    category: "Data & Analytics",
    description:
      "Extract insights from data using statistical analysis, visualization, and machine learning.",
    salary: "₹5–15 LPA",
    demand: "High",
    skills: ["Python", "SQL", "Statistics", "Pandas"],
    icon: Database,
    color: "cyan",
    education: "Computer Science, Statistics or related field",
    responsibilities: [
      "Analyze large datasets",
      "Identify trends and patterns",
      "Build predictive models",
      "Communicate insights through visualizations",
    ],
    roadmap: [
      "Learn Python, SQL and statistics",
      "Practice data cleaning and visualization",
      "Learn machine learning fundamentals",
      "Create data analysis portfolio projects",
    ],
  },
  {
    id: 4,
    title: "UI/UX Designer",
    category: "Design",
    description:
      "Design intuitive digital experiences by combining user research, creativity, and usability.",
    salary: "₹4–12 LPA",
    demand: "High",
    skills: ["Figma", "Wireframing", "Prototyping", "User Research"],
    icon: Palette,
    color: "pink",
    education: "Design, Computer Science or related field",
    responsibilities: [
      "Conduct user research",
      "Create wireframes and prototypes",
      "Design user interfaces",
      "Test usability and improve experiences",
    ],
    roadmap: [
      "Learn design principles",
      "Master Figma",
      "Practice wireframing and prototyping",
      "Create a portfolio of case studies",
    ],
  },
  {
    id: 5,
    title: "Backend Developer",
    category: "Development",
    description:
      "Build server-side systems, APIs, databases, and application logic.",
    salary: "₹5–15 LPA",
    demand: "High",
    skills: ["Node.js", "Python", "SQL", "REST APIs"],
    icon: Code2,
    color: "emerald",
    education: "Computer Science or related field",
    responsibilities: [
      "Develop server-side application logic",
      "Design and maintain APIs",
      "Manage databases",
      "Improve security and performance",
    ],
    roadmap: [
      "Learn a backend programming language",
      "Understand HTTP and REST APIs",
      "Learn databases and authentication",
      "Build and deploy backend projects",
    ],
  },
  {
    id: 6,
    title: "Cybersecurity Analyst",
    category: "Security",
    description:
      "Protect systems and networks by identifying vulnerabilities and monitoring security threats.",
    salary: "₹5–14 LPA",
    demand: "Very High",
    skills: ["Networking", "Linux", "Security", "Python"],
    icon: Shield,
    color: "orange",
    education: "Computer Science or Cybersecurity",
    responsibilities: [
      "Monitor security systems",
      "Investigate potential threats",
      "Identify vulnerabilities",
      "Recommend security improvements",
    ],
    roadmap: [
      "Learn networking fundamentals",
      "Understand Linux and operating systems",
      "Study security concepts",
      "Practice labs and security projects",
    ],
  },
  {
    id: 7,
    title: "Cloud Engineer",
    category: "Cloud & Infrastructure",
    description:
      "Design, deploy, and maintain scalable cloud infrastructure and services.",
    salary: "₹5–16 LPA",
    demand: "Very High",
    skills: ["AWS", "Linux", "Docker", "Networking"],
    icon: Cloud,
    color: "sky",
    education: "Computer Science or related field",
    responsibilities: [
      "Deploy cloud infrastructure",
      "Maintain cloud services",
      "Monitor system availability",
      "Automate infrastructure workflows",
    ],
    roadmap: [
      "Learn networking and Linux",
      "Study cloud fundamentals",
      "Explore AWS, Azure or GCP",
      "Build and deploy cloud projects",
    ],
  },
  {
    id: 8,
    title: "Product Manager",
    category: "Product & Business",
    description:
      "Define product strategy, understand user needs, and coordinate product development.",
    salary: "₹8–20 LPA",
    demand: "High",
    skills: ["Communication", "Product Strategy", "Analytics", "Agile"],
    icon: BriefcaseBusiness,
    color: "amber",
    education: "Any relevant degree with product experience",
    responsibilities: [
      "Understand user needs",
      "Define product requirements",
      "Prioritize product features",
      "Coordinate cross-functional teams",
    ],
    roadmap: [
      "Understand product development",
      "Learn product frameworks",
      "Practice market and user research",
      "Build product case studies",
    ],
  },
];

const categories = [
  "All Careers",
  "Development",
  "Artificial Intelligence",
  "Data & Analytics",
  "Design",
  "Security",
  "Cloud & Infrastructure",
  "Product & Business",
];

const normalize = (value: string) => value.toLowerCase().trim();

function findMatchedSkills(
  career: Career,
  userSkills: string[]
): string[] {
  return career.skills.filter((careerSkill =>
    userSkills.some(
      userSkill =>
        normalize(userSkill).includes(normalize(careerSkill)) ||
        normalize(careerSkill).includes(normalize(userSkill))
    )
  ));
}

function getCareerRelevance(
  career: Career,
  userData: UserCareerData
): number | null {
  if (!userData.skills.length && !userData.interests.length) {
    return null;
  }

  const matchedSkills = findMatchedSkills(career, userData.skills);

  const skillScore =
    career.skills.length > 0
      ? (matchedSkills.length / career.skills.length) * 60
      : 0;

  const matchedInterests = userData.interests.filter(interest => {
    const normalizedInterest = normalize(interest);

    return (
      career.category.toLowerCase().includes(normalizedInterest) ||
      career.title.toLowerCase().includes(normalizedInterest) ||
      career.description.toLowerCase().includes(normalizedInterest)
    );
  });

  const interestScore = Math.min(
    40,
    matchedInterests.length * 20
  );

  return Math.min(
    100,
    Math.round(skillScore + interestScore)
  );
}

export default function CareerExplorerPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Careers");
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);

  const [userData, setUserData] = useState<UserCareerData>({
    interests: [],
    skills: [],
    careerGoal: "",
    field: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCareerData = async () => {
    try {
      setLoading(true);
      setError("");

      const [profileResult, assessmentResult] =
        await Promise.allSettled([
          getProfile(),
          getLatestAssessment(),
        ]);

      const loadedProfile =
        profileResult.status === "fulfilled"
          ? profileResult.value
          : null;

      const assessment =
        assessmentResult.status === "fulfilled"
          ? assessmentResult.value?.assessment?.answers ?? {}
          : {};


      const interests =
        assessment.interests?.length
          ? assessment.interests
          : loadedProfile?.interests ?? [];

      const skills =
        assessment.skills?.length
          ? assessment.skills
          : loadedProfile?.skills ?? [];

      setUserData({
        interests,
        skills,
        careerGoal:
          assessment.careerGoal || loadedProfile?.careerGoal || "",
        field: assessment.field || loadedProfile?.field || "",
      });

      if (
        profileResult.status === "rejected" &&
        assessmentResult.status === "rejected"
      ) {
        setError(
          "Unable to load your profile or assessment. Please try again."
        );
      }
    } catch (err) {
      console.error("Failed to load career data:", err);
      setError("Unable to load personalized career information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCareerData();
  }, []);

  const filteredCareers = useMemo(() => {
    return careers
      .filter((career) => {
        const normalizedSearch = normalize(search);

        const matchesSearch =
          career.title.toLowerCase().includes(normalizedSearch) ||
          career.description.toLowerCase().includes(normalizedSearch) ||
          career.skills.some(skill =>
            skill.toLowerCase().includes(normalizedSearch)
          );

        const matchesCategory =
          category === "All Careers" || career.category === category;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        const scoreA = getCareerRelevance(a, userData) ?? -1;
        const scoreB = getCareerRelevance(b, userData) ?? -1;

        return scoreB - scoreA;
      });
  }, [search, category, userData]);

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

  const hasPersonalization =
    userData.skills.length > 0 || userData.interests.length > 0;

  const selectedMatchedSkills = selectedCareer
    ? findMatchedSkills(selectedCareer, userData.skills)
    : [];

  const selectedMissingSkills = selectedCareer
    ? selectedCareer.skills.filter(
        skill => !selectedMatchedSkills.includes(skill)
      )
    : [];

  return (
    <div className="min-h-screen bg-[#080b14] text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#080b14]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition"
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
            Take Assessment
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* INTRO */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-violet-400 text-sm mb-4">
            <BriefcaseBusiness size={16} />
            Career Discovery
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Explore career paths
          </h1>

          <p className="text-slate-400 max-w-2xl">
            Discover career opportunities, understand required skills,
            and explore learning paths to get started.
          </p>
        </div>

        {/* PERSONALIZATION STATUS */}
        {loading ? (
          <div className="mb-8 rounded-xl border border-white/10 bg-white/[0.025] p-5 flex items-center gap-3 text-slate-400">
            <RefreshCw size={18} className="animate-spin text-violet-400" />
            Loading your profile and assessment...
          </div>
        ) : error ? (
          <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/5 p-5">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-red-400 mt-0.5" />
              <div>
                <p className="font-medium text-red-300">
                  Couldn't load personalization
                </p>
                <p className="text-sm text-slate-400 mt-1">{error}</p>
                <button
                  onClick={loadCareerData}
                  className="mt-3 inline-flex items-center gap-2 text-sm text-violet-400"
                >
                  <RefreshCw size={14} />
                  Retry
                </button>
              </div>
            </div>
          </div>
        ) : hasPersonalization ? (
          <div className="mb-8 rounded-xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-blue-500/5 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Sparkles size={20} className="text-violet-400 mt-0.5" />
                <div>
                  <p className="font-medium text-violet-200">
                    Career Explorer personalized for you
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    Your career list is prioritized using your saved interests and skills.
                    {userData.careerGoal && (
                      <> Your goal: <span className="text-slate-300">{userData.careerGoal}</span></>
                    )}
                  </p>
                </div>
              </div>
              <Link
                to="/profile"
                className="text-sm text-violet-400 hover:text-violet-300 shrink-0"
              >
                Update Profile →
              </Link>
            </div>
          </div>
        ) : (
          <div className="mb-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-start gap-3">
              <Target size={20} className="text-amber-400 mt-0.5" />
              <div>
                <p className="font-medium text-amber-200">
                  Make your career discovery personalized
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Complete your assessment or update your profile to prioritize careers
                  based on your interests and skills.
                </p>
                <Link
                  to="/assessment"
                  className="inline-flex items-center gap-2 mt-3 text-sm text-amber-300"
                >
                  Take Assessment <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* SEARCH */}
        <div className="relative max-w-2xl mb-6">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search careers, skills, or technologies..."
            className="w-full pl-12 pr-12 py-4 rounded-xl bg-white/[0.03] border border-white/10 outline-none focus:border-violet-500 transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* CATEGORY FILTER */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`px-4 py-2 rounded-lg text-sm border transition ${
                category === item
                  ? "bg-violet-500/15 border-violet-500/40 text-violet-300"
                  : "bg-white/[0.02] border-white/10 text-slate-400 hover:text-white hover:border-white/20"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* RESULTS COUNT */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-slate-400">
            Showing{" "}
            <span className="text-white font-medium">
              {filteredCareers.length}
            </span>{" "}
            career paths
          </p>
          <span className="text-xs text-slate-500">
            {hasPersonalization ? "Prioritized for your profile" : "Explore opportunities"}
          </span>
        </div>

        {/* CAREER GRID */}
        {filteredCareers.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredCareers.map((career) => {
              const Icon = career.icon;
              const relevance = getCareerRelevance(career, userData);
              const matchedSkills = findMatchedSkills(career, userData.skills);

              return (
                <div
                  key={career.id}
                  className="group rounded-2xl border border-white/10 bg-white/[0.025] p-6 hover:border-violet-500/30 hover:bg-white/[0.04] transition-all"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl border flex items-center justify-center ${
                        colorClasses[career.color]
                      }`}
                    >
                      <Icon size={22} />
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                        {career.demand} Demand
                      </span>
                      {relevance !== null && (
                        <span className="text-xs text-violet-300">
                          {relevance}% relevance
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-2">
                    {career.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed min-h-[60px]">
                    {career.description}
                  </p>

                  <div className="flex items-center gap-4 mt-5 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp size={14} />
                      {career.salary}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} />
                      Skill-based growth
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-5">
                    {career.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className={`text-xs px-2.5 py-1 rounded-md ${
                          matchedSkills.includes(skill)
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-white/5 text-slate-300"
                        }`}
                      >
                        {matchedSkills.includes(skill) && "✓ "}
                        {skill}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedCareer(career)}
                    className="w-full flex items-center justify-between mt-6 pt-4 border-t border-white/5 text-sm text-violet-400 hover:text-violet-300"
                  >
                    Explore career details
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 border border-white/10 rounded-2xl">
            <Search size={30} className="mx-auto text-slate-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No careers found</h3>
            <p className="text-sm text-slate-400">
              Try a different search term or category.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("All Careers");
              }}
              className="mt-4 text-sm text-violet-400"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* CAREER DETAIL MODAL */}
        {selectedCareer && (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedCareer(null)}
          >
            <div
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#101522] p-6 md:p-8"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-xs text-violet-400 mb-2 block">
                    {selectedCareer.category}
                  </span>
                  <h2 className="text-2xl font-bold">
                    {selectedCareer.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedCareer(null)}
                  className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-slate-400 leading-relaxed mb-6">
                {selectedCareer.description}
              </p>

              {/* PERSONALIZED SKILL MATCH */}
              {hasPersonalization && (
                <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5 mb-7">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={18} className="text-violet-400" />
                    <h3 className="font-semibold text-violet-200">
                      Your career fit
                    </h3>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-2">
                        Skills you already have
                      </p>
                      {selectedMatchedSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedMatchedSkills.map(skill => (
                            <span
                              key={skill}
                              className="text-xs px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"
                            >
                              <CheckCircle2 size={12} className="inline mr-1" />
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500">
                          No matching skills recorded yet.
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-2">
                        Skills to develop
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedMissingSkills.map(skill => (
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

                  {userData.careerGoal && (
                    <p className="text-sm text-slate-400">
                      Your career goal:{" "}
                      <span className="text-slate-200">{userData.careerGoal}</span>
                    </p>
                  )}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 mb-7">
                <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                  <TrendingUp size={18} className="text-emerald-400 mb-2" />
                  <p className="text-xs text-slate-500">Illustrative salary range</p>
                  <p className="font-semibold mt-1">{selectedCareer.salary}</p>
                </div>
                <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                  <GraduationCap size={18} className="text-blue-400 mb-2" />
                  <p className="text-xs text-slate-500">Typical education</p>
                  <p className="text-sm font-medium mt-1">
                    {selectedCareer.education}
                  </p>
                </div>
              </div>

              <h3 className="font-semibold mb-3">Core Skills</h3>
              <div className="flex flex-wrap gap-2 mb-7">
                {selectedCareer.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`px-3 py-1.5 rounded-lg text-sm ${
                      selectedMatchedSkills.includes(skill)
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                        : "bg-violet-500/10 border border-violet-500/20 text-violet-300"
                    }`}
                  >
                    {selectedMatchedSkills.includes(skill) && "✓ "}
                    {skill}
                  </span>
                ))}
              </div>

              <h3 className="font-semibold mb-3">What you'll do</h3>
              <ul className="space-y-2 mb-7">
                {selectedCareer.responsibilities.map((item) => (
                  <li key={item} className="text-sm text-slate-400 flex gap-2">
                    <span className="text-violet-400">•</span>
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="font-semibold mb-3">Suggested learning roadmap</h3>
              <div className="space-y-3 mb-8">
                {selectedCareer.roadmap.map((item, index) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-7 h-7 shrink-0 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center text-xs font-semibold">
                      {index + 1}
                    </div>
                    <p className="text-sm text-slate-300 pt-1">{item}</p>
                  </div>
                ))}
              </div>

              <Link
                to="/assessment"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 font-medium hover:opacity-90 transition"
              >
                Find my career match
                <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
        )}

        {/* FOOTNOTE */}
        <p className="text-xs text-slate-600 mt-10 text-center">
          Salary ranges are illustrative estimates, not guaranteed compensation.
          Career relevance is based on profile skill overlap, not validated AI predictions.
        </p>
      </main>
    </div>
  );
}
