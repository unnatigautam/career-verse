
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  Brain,
  BookOpen,
  User,
  History,
  ArrowLeftRight,
  Menu,
  X,
  ArrowUpRight,
  TrendingUp,
  Target,
  CheckCircle2,
  Clock,
  GraduationCap,
  Code2,
  ChevronRight,
} from "lucide-react";
import { getLatestAssessment } from "../services/assessmentService";
import { getRoadmapProgress } from "../services/roadmapService";
import { useAuth } from "../context/AuthContext";

type Assessment = {
  education?: string;
  field?: string;
  interests?: string[];
  skills?: string[];
  experience?: string;
  workPreference?: string;
  careerGoal?: string;
};

const navigation = [
  { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { label: "Career Explorer", path: "/careers", icon: Compass },
  { label: "Recommendations", path: "/recommendations", icon: Sparkles },
  { label: "Skill Analysis", path: "/skills", icon: Brain },
  { label: "Learning Roadmap", path: "/roadmap", icon: BookOpen },
  { label: "Career Comparison", path: "/compare", icon: ArrowLeftRight },
  { label: "Assessment History", path: "/history", icon: History },
  { label: "Profile", path: "/profile", icon: User },
];

const quickActions = [
  {
    title: "Explore Careers",
    description: "Discover career paths that match your interests.",
    path: "/careers",
    icon: Compass,
    color: "violet",
  },
  {
    title: "View Recommendations",
    description: "Explore your personalized career matches.",
    path: "/recommendations",
    icon: Sparkles,
    color: "blue",
  },
  {
    title: "Analyze Skills",
    description: "Identify strengths and skills to develop.",
    path: "/skills",
    icon: Brain,
    color: "emerald",
  },
  {
    title: "Learning Roadmap",
    description: "Track your learning journey and progress.",
    path: "/roadmap",
    icon: BookOpen,
    color: "amber",
  },
  {
    title: "Compare Careers",
    description: "Compare skills, salary, and career growth.",
    path: "/compare",
    icon: ArrowLeftRight,
    color: "pink",
  },
  {
    title: "Assessment History",
    description: "Revisit previous career assessments.",
    path: "/history",
    icon: History,
    color: "cyan",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [roadmapProgress, setRoadmapProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Read stored user safely
  const storedUser = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("careerverse-user") || "null"
      );
    } catch {
      return null;
    }
  })();

  // Prefer the actual authenticated user's name
  const name =
    user?.name?.trim() ||
    storedUser?.name?.trim() ||
    localStorage.getItem("careerverse-name") ||
    "Explorer";

  // Load dashboard data from MongoDB
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [assessmentResponse, roadmapResponse] =
          await Promise.all([
            getLatestAssessment(),
            getRoadmapProgress(),
          ]);

        const savedAssessment = assessmentResponse?.assessment;

        setAssessment(
          savedAssessment?.answers ??
            savedAssessment?.assessment ??
            null
        );

        const completedTasks =
          roadmapResponse?.completedTasks ?? [];

        // Roadmap contains 20 tasks across 5 stages
        setRoadmapProgress(
          Math.round((completedTasks.length / 20) * 100)
        );
      } catch (err) {
        console.error("Dashboard loading error:", err);
        setError("Unable to load all dashboard information.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = [
    {
      label: "Assessment Status",
      value: assessment ? "Completed" : "Pending",
      detail: assessment ? "Profile available" : "Start your assessment",
      icon: CheckCircle2,
      color: assessment ? "emerald" : "amber",
    },
    {
      label: "Skills Identified",
      value: assessment?.skills?.length ?? 0,
      detail: "From your assessment",
      icon: Code2,
      color: "blue",
    },
    {
      label: "Interests",
      value: assessment?.interests?.length ?? 0,
      detail: "Career interests",
      icon: Target,
      color: "violet",
    },
    {
      label: "Roadmap Progress",
      value: `${roadmapProgress}%`,
      detail: "Learning progress",
      icon: TrendingUp,
      color: "pink",
    },
  ];

  const colorClasses: Record<string, string> = {
    violet: "bg-violet-500/10 text-violet-300",
    blue: "bg-blue-500/10 text-blue-300",
    emerald: "bg-emerald-500/10 text-emerald-300",
    amber: "bg-amber-500/10 text-amber-300",
    pink: "bg-pink-500/10 text-pink-300",
    cyan: "bg-cyan-500/10 text-cyan-300",
  };

  return (
    <div className="min-h-screen bg-[#080b14] text-white">
      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.06] bg-[#080b14]/95 px-4 py-4 backdrop-blur-xl lg:hidden">
        <Link to="/" className="text-lg font-bold tracking-tight">
          Career<span className="text-violet-400">Verse</span>
        </Link>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg border border-white/10 p-2 text-slate-300"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/[0.06] bg-[#0b0f1b] transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-20 items-center justify-between border-b border-white/[0.06] px-6">
            <Link to="/" className="text-xl font-bold tracking-tight">
              Career<span className="text-violet-400">Verse</span>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-slate-500 hover:text-white lg:hidden"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>

          <div className="px-5 py-5">
            <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
              Workspace
            </div>

            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = item.path === "/dashboard";

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                      active
                        ? "border border-violet-500/15 bg-violet-500/10 font-medium text-violet-300"
                        : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto border-t border-white/[0.06] p-5">
            <Link
              to="/profile"
              className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-white/[0.04]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-violet-300">
                <User size={18} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{name}</p>
                <p className="text-xs text-slate-500">My Profile</p>
              </div>

              <ArrowUpRight size={15} className="ml-auto text-slate-500" />
            </Link>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
            aria-label="Close navigation overlay"
          />
        )}

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
            {/* Welcome */}
            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm text-violet-300">
                  <Sparkles size={15} />
                  Your Career Workspace
                </div>

                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Welcome back, {name.split(" ")[0]}!
                </h1>

                <p className="mt-3 text-sm text-slate-400">
                  Your career journey, progress, and opportunities in one place.
                </p>
              </div>

              <Link
                to={assessment ? "/recommendations" : "/assessment"}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-semibold transition hover:opacity-90"
              >
                {assessment ? "View Recommendations" : "Start Assessment"}
                <ArrowUpRight size={16} />
              </Link>
            </div>

            {loading && (
              <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-slate-400">
                Loading your dashboard...
              </div>
            )}

            {error && !loading && (
              <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-300">
                {error} Some information may be temporarily unavailable.
                <button
                  onClick={() => window.location.reload()}
                  className="ml-2 underline"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Assessment Banner */}
            {!loading && !assessment && (
              <div className="mb-8 rounded-2xl border border-violet-500/15 bg-gradient-to-r from-violet-500/[0.08] to-blue-500/[0.05] p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-violet-500/15 p-2.5">
                      <GraduationCap size={22} className="text-violet-300" />
                    </div>

                    <div>
                      <h2 className="font-semibold">
                        Start your career assessment
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        Discover career paths based on your interests, skills,
                        and goals.
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/assessment"
                    className="inline-flex items-center gap-2 self-start rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-3 text-sm font-medium text-violet-300 transition hover:bg-violet-500/15"
                  >
                    Begin Assessment
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/[0.07] bg-[#101525] p-5"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm text-slate-400">
                        {stat.label}
                      </span>

                      <div
                        className={`rounded-xl p-2 ${colorClasses[stat.color]}`}
                      >
                        <Icon size={18} />
                      </div>
                    </div>

                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {stat.detail}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Explore CareerVerse</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Access all your career tools
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <Link
                      key={action.path}
                      to={action.path}
                      className="group rounded-2xl border border-white/[0.07] bg-[#101525] p-5 transition hover:-translate-y-0.5 hover:border-white/15 hover:bg-[#13192b]"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div
                          className={`rounded-xl p-2.5 ${colorClasses[action.color]}`}
                        >
                          <Icon size={20} />
                        </div>

                        <ArrowUpRight
                          size={17}
                          className="text-slate-600 transition group-hover:text-white"
                        />
                      </div>

                      <h3 className="font-semibold">{action.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {action.description}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Profile Summary */}
            {assessment && (
              <div className="mb-8 grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-white/[0.07] bg-[#101525] p-5 sm:p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="font-semibold">Your Career Profile</h2>

                    <Link
                      to="/profile"
                      className="text-xs font-medium text-violet-300 hover:text-violet-200"
                    >
                      Edit Profile
                    </Link>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="mb-1 text-xs text-slate-500">Education</p>
                      <p className="text-sm text-slate-300">
                        {assessment.education || "Not specified"}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-xs text-slate-500">
                        Field of Study
                      </p>
                      <p className="text-sm text-slate-300">
                        {assessment.field || "Not specified"}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs text-slate-500">Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {(assessment.interests ?? []).slice(0, 4).map((interest) => (
                          <span
                            key={interest}
                            className="rounded-lg border border-violet-500/10 bg-violet-500/[0.05] px-2.5 py-1 text-xs text-violet-300"
                          >
                            {interest}
                          </span>
                        ))}
                        {!assessment.interests?.length && (
                          <span className="text-xs text-slate-500">
                            No interests recorded
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-xs text-slate-500">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {(assessment.skills ?? []).slice(0, 5).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-xs text-slate-400"
                          >
                            {skill}
                          </span>
                        ))}
                        {!assessment.skills?.length && (
                          <span className="text-xs text-slate-500">
                            No skills recorded
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.07] bg-[#101525] p-5 sm:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-blue-500/10 p-2.5">
                      <Clock size={19} className="text-blue-300" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Continue Your Journey</h2>
                      <p className="mt-1 text-xs text-slate-500">
                        Pick up where you left off
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link
                      to="/roadmap"
                      className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:bg-white/[0.04]"
                    >
                      <div>
                        <p className="text-sm font-medium">Learning Roadmap</p>
                        <p className="mt-1 text-xs text-slate-500">
                          Continue developing your skills
                        </p>
                      </div>
                      <ChevronRight size={17} className="text-slate-500" />
                    </Link>

                    <Link
                      to="/history"
                      className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:bg-white/[0.04]"
                    >
                      <div>
                        <p className="text-sm font-medium">Assessment History</p>
                        <p className="mt-1 text-xs text-slate-500">
                          Review your career exploration
                        </p>
                      </div>
                      <ChevronRight size={17} className="text-slate-500" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <footer className="border-t border-white/[0.06] py-6 text-center text-xs text-slate-600">
              CareerVerse · Personalized Career Intelligence Platform
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
