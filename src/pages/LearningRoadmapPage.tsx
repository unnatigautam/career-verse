
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  BookOpen,
  Target,
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
  Trophy,
  Rocket,
  RefreshCw,
  AlertCircle,
  Brain,
} from "lucide-react";

import {
  getRoadmapProgress,
  saveRoadmapProgress,
} from "../services/roadmapService";
import { getProfile, type ProfileData } from "../services/profileService";
import { getLatestAssessment } from "../services/assessmentService";

type RoadmapStage = {
  id: number;
  title: string;
  description: string;
  duration: string;
  tasks: string[];
};

type CareerTrack = {
  title: string;
  stages: Omit<RoadmapStage, "id">[];
};

const careerTracks: Record<string, CareerTrack> = {
  software: {
    title: "Software Developer",
    stages: [
      {
        title: "Programming Foundations",
        description: "Strengthen your programming and problem-solving fundamentals.",
        duration: "4 weeks",
        tasks: [
          "Revise programming fundamentals",
          "Practice arrays and strings",
          "Learn functions and recursion",
          "Solve 20 beginner programming problems",
        ],
      },
      {
        title: "Core Development Skills",
        description: "Build the fundamentals required for software development.",
        duration: "6 weeks",
        tasks: [
          "Learn HTML and CSS",
          "Practice JavaScript fundamentals",
          "Understand Git and GitHub",
          "Build a responsive web page",
        ],
      },
      {
        title: "Application Development",
        description: "Learn to build interactive and functional applications.",
        duration: "6 weeks",
        tasks: [
          "Learn React fundamentals",
          "Understand components and state",
          "Practice API integration",
          "Build an interactive application",
        ],
      },
      {
        title: "Projects & Portfolio",
        description: "Demonstrate your development skills through projects.",
        duration: "4 weeks",
        tasks: [
          "Build a complete personal project",
          "Connect your project to a backend API",
          "Deploy your project online",
          "Create or update your portfolio",
        ],
      },
      {
        title: "Career Preparation",
        description: "Prepare for software development internships.",
        duration: "4 weeks",
        tasks: [
          "Practice technical interview questions",
          "Revise DSA fundamentals",
          "Update your resume",
          "Apply for software development internships",
        ],
      },
    ],
  },

  ai: {
    title: "AI / Machine Learning",
    stages: [
      {
        title: "Programming & Mathematics",
        description: "Build the foundations required for machine learning.",
        duration: "4 weeks",
        tasks: [
          "Revise Python programming",
          "Practice NumPy and Pandas",
          "Learn linear algebra fundamentals",
          "Understand probability and statistics",
        ],
      },
      {
        title: "Data Analysis",
        description: "Learn to process and understand datasets.",
        duration: "5 weeks",
        tasks: [
          "Practice data cleaning",
          "Learn exploratory data analysis",
          "Create visualizations using Matplotlib",
          "Analyze a real-world dataset",
        ],
      },
      {
        title: "Machine Learning",
        description: "Understand and implement core ML algorithms.",
        duration: "6 weeks",
        tasks: [
          "Learn supervised learning",
          "Understand classification and regression",
          "Practice model evaluation",
          "Train a machine learning model",
        ],
      },
      {
        title: "AI Projects",
        description: "Apply machine learning concepts to practical problems.",
        duration: "5 weeks",
        tasks: [
          "Build a prediction-based ML project",
          "Evaluate and improve model performance",
          "Create a simple model interface",
          "Document your project on GitHub",
        ],
      },
      {
        title: "Career Preparation",
        description: "Prepare for AI and machine learning opportunities.",
        duration: "4 weeks",
        tasks: [
          "Revise machine learning concepts",
          "Practice Python coding questions",
          "Update your AI project portfolio",
          "Apply for AI or ML internships",
        ],
      },
    ],
  },

  data: {
    title: "Data Analyst",
    stages: [
      {
        title: "Data Foundations",
        description: "Build the foundations of data analysis.",
        duration: "4 weeks",
        tasks: [
          "Revise Python fundamentals",
          "Learn NumPy basics",
          "Practice Pandas data manipulation",
          "Understand descriptive statistics",
        ],
      },
      {
        title: "Data Analysis",
        description: "Learn to explore and analyze datasets.",
        duration: "5 weeks",
        tasks: [
          "Practice data cleaning",
          "Learn exploratory data analysis",
          "Practice SQL queries",
          "Analyze a real-world dataset",
        ],
      },
      {
        title: "Visualization & BI",
        description: "Turn analytical findings into meaningful insights.",
        duration: "5 weeks",
        tasks: [
          "Create charts using Matplotlib",
          "Learn dashboard design fundamentals",
          "Practice data storytelling",
          "Build an interactive dashboard",
        ],
      },
      {
        title: "Analytics Projects",
        description: "Demonstrate analytical skills through projects.",
        duration: "4 weeks",
        tasks: [
          "Complete an end-to-end data analysis",
          "Write SQL queries for a dataset",
          "Build a dashboard project",
          "Publish your analysis on GitHub",
        ],
      },
      {
        title: "Career Preparation",
        description: "Prepare for data analytics opportunities.",
        duration: "4 weeks",
        tasks: [
          "Practice SQL interview questions",
          "Revise Python and statistics",
          "Create a data analytics portfolio",
          "Apply for data analyst internships",
        ],
      },
    ],
  },

  cybersecurity: {
    title: "Cybersecurity",
    stages: [
      {
        title: "Technical Foundations",
        description: "Understand the fundamentals of computer systems.",
        duration: "4 weeks",
        tasks: [
          "Revise networking fundamentals",
          "Learn Linux command-line basics",
          "Understand operating systems",
          "Practice basic scripting",
        ],
      },
      {
        title: "Security Fundamentals",
        description: "Learn core concepts in information security.",
        duration: "5 weeks",
        tasks: [
          "Understand common security threats",
          "Learn authentication and authorization",
          "Study cryptography fundamentals",
          "Explore web security basics",
        ],
      },
      {
        title: "Security Tools",
        description: "Develop practical security investigation skills.",
        duration: "5 weeks",
        tasks: [
          "Practice Linux security commands",
          "Explore Wireshark fundamentals",
          "Learn vulnerability assessment basics",
          "Practice in legal security labs",
        ],
      },
      {
        title: "Security Projects",
        description: "Apply security concepts in controlled environments.",
        duration: "4 weeks",
        tasks: [
          "Complete a security lab exercise",
          "Document a vulnerability analysis",
          "Build a security-focused project",
          "Create a cybersecurity portfolio",
        ],
      },
      {
        title: "Career Preparation",
        description: "Prepare for cybersecurity internships.",
        duration: "4 weeks",
        tasks: [
          "Revise networking concepts",
          "Practice security fundamentals",
          "Document practical lab experience",
          "Apply for cybersecurity internships",
        ],
      },
    ],
  },

  design: {
    title: "UI/UX Designer",
    stages: [
      {
        title: "Design Foundations",
        description: "Understand visual design and usability principles.",
        duration: "4 weeks",
        tasks: [
          "Learn typography fundamentals",
          "Understand color theory",
          "Study visual hierarchy",
          "Explore usability principles",
        ],
      },
      {
        title: "Design Tools",
        description: "Develop practical skills using design tools.",
        duration: "4 weeks",
        tasks: [
          "Learn Figma fundamentals",
          "Practice wireframing",
          "Create reusable design components",
          "Design a responsive interface",
        ],
      },
      {
        title: "UX Research & Prototyping",
        description: "Learn to design around user needs.",
        duration: "5 weeks",
        tasks: [
          "Understand user research",
          "Create user personas",
          "Design user flows",
          "Build an interactive prototype",
        ],
      },
      {
        title: "Portfolio Projects",
        description: "Showcase your design process and solutions.",
        duration: "5 weeks",
        tasks: [
          "Complete a UI/UX case study",
          "Redesign an existing interface",
          "Document design decisions",
          "Publish your design portfolio",
        ],
      },
      {
        title: "Career Preparation",
        description: "Prepare for design internships.",
        duration: "4 weeks",
        tasks: [
          "Practice explaining design decisions",
          "Review UX interview questions",
          "Polish your design portfolio",
          "Apply for UI/UX internships",
        ],
      },
    ],
  },
};

const defaultTrack = careerTracks.software;

function getCareerTrack(careerGoal: string): CareerTrack {
  const goal = careerGoal.toLowerCase();

  if (
    goal.includes("machine learning") ||
    goal.includes("artificial intelligence") ||
    goal.includes("ai engineer") ||
    goal.includes("data scientist") ||
    goal.includes("ml engineer") ||
    goal.includes("ai")
  ) {
    return careerTracks.ai;
  }

  if (
    goal.includes("data analyst") ||
    goal.includes("business analyst") ||
    goal.includes("analytics")
  ) {
    return careerTracks.data;
  }

  if (
    goal.includes("cyber") ||
    goal.includes("security")
  ) {
    return careerTracks.cybersecurity;
  }

  if (
    goal.includes("ui/ux") ||
    goal.includes("designer") ||
    goal.includes("design")
  ) {
    return careerTracks.design;
  }

  return defaultTrack;
}

export default function LearningRoadmapPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [assessmentCareerGoal, setAssessmentCareerGoal] = useState("");
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [expandedStages, setExpandedStages] = useState<number[]>([1]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");

  const careerGoal =
    profile?.careerGoal?.trim() || assessmentCareerGoal;

  const careerTrack = useMemo(
    () => getCareerTrack(careerGoal),
    [careerGoal]
  );

  const stages: RoadmapStage[] = useMemo(
    () =>
      careerTrack.stages.map((stage, index) => ({
        ...stage,
        id: index + 1,
      })),
    [careerTrack]
  );

  const allTasks = useMemo(
    () => stages.flatMap((stage) => stage.tasks),
    [stages]
  );

  const totalTasks = allTasks.length;

  const loadProgress = async () => {
    try {
      setLoading(true);
      setError("");
      setSaveError("");

      const [progressResponse, profileResponse, assessmentResponse] =
        await Promise.all([
          getRoadmapProgress(),
          getProfile(),
          getLatestAssessment(),
        ]);

      const assessment =
        assessmentResponse?.assessment?.answers ??
        assessmentResponse?.assessment?.result?.assessment ??
        assessmentResponse?.assessment?.answers ??
        assessmentResponse?.answers ??
        {};

      setProfile(profileResponse);
      setAssessmentCareerGoal(
        typeof assessment.careerGoal === "string"
          ? assessment.careerGoal
          : ""
      );

      setCompletedTasks(progressResponse.completedTasks ?? []);
    } catch (err) {
      console.error("Failed to load roadmap:", err);
      setError("Unable to load your roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProgress();
  }, []);

  // Remove completed tasks that do not belong to the selected track.
  useEffect(() => {
    setCompletedTasks((previous) =>
      previous.filter((task) => allTasks.includes(task))
    );
  }, [allTasks]);

  const progress = totalTasks
    ? Math.round((completedTasks.length / totalTasks) * 100)
    : 0;

  const toggleTask = async (task: string) => {
    if (saving || loading) return;

    const previousTasks = completedTasks;

    const updatedTasks = previousTasks.includes(task)
      ? previousTasks.filter((item) => item !== task)
      : [...previousTasks, task];

    setCompletedTasks(updatedTasks);
    setSaving(true);
    setSaveError("");

    try {
      await saveRoadmapProgress(updatedTasks);
    } catch (err) {
      console.error("Failed to save roadmap progress:", err);
      setCompletedTasks(previousTasks);
      setSaveError(
        "Progress could not be saved. Your previous progress has been restored."
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleStage = (stageId: number) => {
    setExpandedStages((previous) =>
      previous.includes(stageId)
        ? previous.filter((id) => id !== stageId)
        : [...previous, stageId]
    );
  };

  const getStageProgress = (stage: RoadmapStage) => {
    const completed = stage.tasks.filter((task =>
      completedTasks.includes(task)
    )).length;

    return Math.round((completed / stage.tasks.length) * 100);
  };

  return (
    <div className="min-h-screen bg-[#080b14] text-white">
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
            to="/skills"
            className="text-sm text-violet-400 hover:text-violet-300"
          >
            Skill Analysis
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-violet-400 text-sm mb-4">
            <BookOpen size={16} />
            Learning Journey
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Your learning roadmap
          </h1>

          <p className="text-slate-400 max-w-2xl">
            Follow a career-focused learning path, complete milestones,
            and track your progress toward career readiness.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-10 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-slate-400">
              Personalizing your roadmap...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <AlertCircle size={24} className="text-red-400 mx-auto mb-3" />
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => void loadProgress()}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 transition"
            >
              <RefreshCw size={15} />
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* PERSONALIZATION */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 mb-8 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0">
                <Brain size={21} />
              </div>
              <div>
                <p className="text-xs text-violet-400 mb-1">
                  YOUR CAREER TRACK
                </p>
                <h2 className="font-semibold text-lg">
                  {careerGoal || careerTrack.title}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {careerGoal
                    ? `Your roadmap is aligned with your career goal: ${careerGoal}.`
                    : "Complete your assessment or update your profile career goal to personalize this roadmap further."}
                </p>
              </div>
            </div>

            {/* PROGRESS */}
            <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-blue-500/5 p-6 md:p-8 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-violet-300 text-sm mb-3">
                    <Target size={16} />
                    Overall Progress
                  </div>
                  <h2 className="text-4xl font-bold mb-2">{progress}%</h2>
                  <p className="text-sm text-slate-400">
                    {completedTasks.length} of {totalTasks} tasks completed
                  </p>
                </div>

                <div className="w-full md:max-w-md">
                  <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-3">
                    <span>Start</span>
                    <span>Career Ready</span>
                  </div>
                </div>
              </div>

              {progress === 100 && (
                <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-3 text-emerald-400">
                  <Trophy size={22} />
                  <p className="font-medium">
                    Congratulations! You've completed this roadmap.
                  </p>
                </div>
              )}
            </div>

            {saving && (
              <div className="flex items-center gap-2 text-xs text-violet-400 mb-4">
                <RefreshCw size={13} className="animate-spin" />
                Saving progress to your account...
              </div>
            )}

            {saveError && (
              <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400 flex items-start justify-between gap-3">
                <span>{saveError}</span>
                <button
                  onClick={() => void loadProgress()}
                  className="shrink-0 underline hover:text-white"
                >
                  Reload
                </button>
              </div>
            )}

            {/* STAGES */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold">Learning milestones</h2>
              <span className="text-xs text-slate-500">
                {stages.length} stages
              </span>
            </div>

            <div className="space-y-4">
              {stages.map((stage, index) => {
                const expanded = expandedStages.includes(stage.id);
                const stageProgress = getStageProgress(stage);
                const completed = stageProgress === 100;
                const StageIcon = completed ? CheckCircle2 : Circle;

                return (
                  <div
                    key={stage.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.025] overflow-hidden"
                  >
                    <button
                      onClick={() => toggleStage(stage.id)}
                      className="w-full flex items-center gap-4 p-5 md:p-6 text-left hover:bg-white/[0.02] transition"
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        completed
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-violet-500/10 text-violet-400"
                      }`}>
                        <StageIcon size={21} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs text-violet-400">
                            Stage {index + 1}
                          </span>
                          {completed && (
                            <span className="text-xs text-emerald-400">
                              Completed
                            </span>
                          )}
                        </div>

                        <h3 className="font-semibold text-base">{stage.title}</h3>
                        <p className="text-sm text-slate-400 mt-1">
                          {stage.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Clock size={13} />
                            {stage.duration}
                          </span>
                          <span>
                            {stage.tasks.filter(task =>
                              completedTasks.includes(task)
                            ).length}/{stage.tasks.length} tasks
                          </span>
                        </div>
                      </div>

                      <div className="hidden sm:block w-24 shrink-0">
                        <p className="text-sm text-right mb-2 text-slate-300">
                          {stageProgress}%
                        </p>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-violet-500 transition-all"
                            style={{ width: `${stageProgress}%` }}
                          />
                        </div>
                      </div>

                      {expanded ? (
                        <ChevronUp size={18} className="text-slate-500" />
                      ) : (
                        <ChevronDown size={18} className="text-slate-500" />
                      )}
                    </button>

                    {expanded && (
                      <div className="border-t border-white/5 px-5 md:px-6 py-5">
                        <div className="space-y-3">
                          {stage.tasks.map((task) => {
                            const isCompleted = completedTasks.includes(task);

                            return (
                              <button
                                key={task}
                                onClick={() => void toggleTask(task)}
                                disabled={saving}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition ${
                                  isCompleted
                                    ? "bg-emerald-500/5"
                                    : "bg-white/[0.02] hover:bg-white/[0.04]"
                                } ${saving ? "opacity-70 cursor-wait" : ""}`}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 size={19} className="text-emerald-400 shrink-0" />
                                ) : (
                                  <Circle size={19} className="text-slate-500 shrink-0" />
                                )}

                                <span className={`text-sm ${
                                  isCompleted
                                    ? "text-slate-500 line-through"
                                    : "text-slate-300"
                                }`}>
                                  {task}
                                </span>

                                <span className="ml-auto text-xs text-slate-500">
                                  {isCompleted ? "Done" : "Mark complete"}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-10 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-blue-500/5 p-7 md:p-9">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div>
                  <div className="flex items-center gap-2 text-violet-300 text-sm mb-3">
                    <Rocket size={16} />
                    Keep progressing
                  </div>
                  <h2 className="text-xl font-semibold mb-2">
                    Build your next skill
                  </h2>
                  <p className="text-sm text-slate-400">
                    Review your skill gaps and continue learning.
                  </p>
                </div>

                <Link
                  to="/skills"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 font-medium hover:opacity-90 transition"
                >
                  Review Skills <ArrowRight size={17} />
                </Link>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-8 text-center">
              Roadmap tracks are currently predefined learning paths selected
              using your career goal. Progress is saved to your account.
            </p>
          </>
        )}
      </main>
    </div>
  );
}
