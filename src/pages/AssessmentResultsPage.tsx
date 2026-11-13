
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Target,
  Brain,
  GraduationCap,
  Briefcase,
  Compass,
} from "lucide-react";
import {
  getLatestAssessment,
  type AssessmentData,
} from "../services/assessmentService";

export default function AssessmentResultsPage() {
  const [data, setData] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await getLatestAssessment();

        // Backend response: { success: true, assessment: {...} }
        const savedAssessment = response.assessment;

        if (savedAssessment?.answers) {
          setData(savedAssessment.answers as AssessmentData);
        } else if (savedAssessment) {
          setData(savedAssessment as AssessmentData);
        } else {
          setData(null);
        }
      } catch (err) {
        console.error("Unable to fetch assessment:", err);
        setError("Unable to load your assessment. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080b14] text-white">
        <div className="text-center">
          <Sparkles className="mx-auto mb-4 animate-pulse text-violet-300" size={30} />
          <p className="text-slate-400">Loading your career profile...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080b14] px-6 text-white">
        <div className="text-center">
          <p className="text-red-300">{error}</p>
          <Link
            to="/assessment"
            className="mt-4 inline-block text-violet-300 hover:text-white"
          >
            Complete assessment →
          </Link>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080b14] px-6 text-white">
        <div className="text-center">
          <p className="text-slate-400">No assessment found.</p>
          <Link
            to="/assessment"
            className="mt-4 inline-block text-violet-300 hover:text-white"
          >
            Start assessment →
          </Link>
        </div>
      </main>
    );
  }

  const sections = [
    {
      title: "Education",
      icon: GraduationCap,
      values: [data.education, data.field],
    },
    {
      title: "Interests",
      icon: Compass,
      values: data.interests,
    },
    {
      title: "Skills",
      icon: Brain,
      values: data.skills,
    },
    {
      title: "Career preferences",
      icon: Briefcase,
      values: [data.experience, data.workPreference, data.careerGoal],
    },
  ];

  return (
    <main className="min-h-screen bg-[#080b14] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500">
            <Sparkles size={18} />
          </div>
          <span className="font-semibold">CareerVerse</span>
        </Link>

        <div className="mt-14 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-violet-300">
            <Sparkles size={30} />
          </div>

          <p className="text-sm font-medium text-violet-300">
            Assessment completed
          </p>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Your career profile
          </h1>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-400">
            Here's a summary of your responses. We'll use this information
            to personalize your career exploration experience.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <div
                key={section.title}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                    <Icon size={19} />
                  </div>

                  <h2 className="font-semibold">{section.title}</h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  {section.values.filter(Boolean).map((value, index) => (
                    <span
                      key={`${section.title}-${index}`}
                      className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-slate-300"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/[0.08] to-blue-500/[0.05] p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
            <Target size={22} />
          </div>

          <h2 className="text-2xl font-bold">Ready to explore your future?</h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Your assessment is securely saved to your account.
            Career recommendations and personalized learning roadmaps
            will be available as we build the next modules.
          </p>

          <Link
            to="/dashboard"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3.5 font-semibold text-white transition hover:opacity-90"
          >
            Go to dashboard
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/assessment"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            Edit assessment
          </Link>
        </div>
      </div>
    </main>
  );
}
