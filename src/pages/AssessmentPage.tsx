
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  GraduationCap,
  Heart,
  Code2,
  Target,
  Sparkles,
  Clock,
  Save,
} from "lucide-react";
import {
  saveAssessment,
  type AssessmentData,
  type AssessmentResult,
  type CareerSnapshot,
} from "../services/assessmentService";

const HISTORY_KEY = "careerverse-assessment-history";
const ASSESSMENT_KEY = "careerverse-assessment";

type HistoryEntry = {
  id: string;
  date: string;
  assessment: AssessmentData;
  careerMatches: CareerSnapshot[];
};

const initialData: AssessmentData = {
  education: "",
  field: "",
  interests: [],
  skills: [],
  experience: "",
  workPreference: "",
  careerGoal: "",
};

const interestOptions = [
  "Web Development",
  "Artificial Intelligence",
  "Data Science",
  "Cybersecurity",
  "Cloud Computing",
  "UI/UX Design",
  "Software Development",
  "Product Management",
];

const skillOptions = [
  "C++",
  "Python",
  "JavaScript",
  "HTML",
  "CSS",
  "React",
  "SQL",
  "Machine Learning",
  "Figma",
  "Git",
];

const careerProfiles = [
  {
    title: "Frontend Developer",
    interests: ["Web Development", "Software Development", "UI/UX Design"],
    skills: ["JavaScript", "HTML", "CSS", "React"],
  },
  {
    title: "AI/ML Engineer",
    interests: ["Artificial Intelligence", "Data Science"],
    skills: ["Python", "Machine Learning"],
  },
  {
    title: "Data Scientist",
    interests: ["Data Science", "Artificial Intelligence"],
    skills: ["Python", "SQL", "Machine Learning"],
  },
  {
    title: "Backend Developer",
    interests: ["Software Development", "Web Development"],
    skills: ["Python", "JavaScript", "SQL", "Git"],
  },
  {
    title: "UI/UX Designer",
    interests: ["UI/UX Design", "Web Development"],
    skills: ["Figma", "HTML", "CSS"],
  },
  {
    title: "Cybersecurity Analyst",
    interests: ["Cybersecurity"],
    skills: ["Python", "C++"],
  },
];

function calculateCareerMatches(
  data: AssessmentData
): CareerSnapshot[] {
  const interests = data.interests.map((item) => item.toLowerCase());
  const skills = data.skills.map((item) => item.toLowerCase());

  return careerProfiles
    .map((career) => {
      const interestMatches = career.interests.filter((interest) =>
        interests.includes(interest.toLowerCase())
      ).length;

      const skillMatches = career.skills.filter((skill) =>
        skills.includes(skill.toLowerCase())
      ).length;

      const interestScore =
        career.interests.length > 0
          ? (interestMatches / career.interests.length) * 60
          : 0;

      const skillScore =
        career.skills.length > 0
          ? (skillMatches / career.skills.length) * 40
          : 0;

      return {
        title: career.title,
        score: Math.min(
          100,
          Math.round(interestScore + skillScore)
        ),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function saveAssessmentToHistory(
  data: AssessmentData,
  careerMatches: CareerSnapshot[]
) {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    const previousHistory: HistoryEntry[] = stored
      ? JSON.parse(stored)
      : [];

    const newEntry: HistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      date: new Date().toISOString(),
      assessment: data,
      careerMatches,
    };

    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify([newEntry, ...previousHistory])
    );
  } catch (error) {
    console.error("Unable to save assessment history:", error);
  }
}

export default function AssessmentPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [data, setData] = useState<AssessmentData>(initialData);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    {
      title: "Education",
      subtitle: "Tell us about your academic background.",
      icon: GraduationCap,
    },
    {
      title: "Interests",
      subtitle: "What areas excite you the most?",
      icon: Heart,
    },
    {
      title: "Skills",
      subtitle: "Select the skills you currently have.",
      icon: Code2,
    },
    {
      title: "Preferences",
      subtitle: "Tell us about your career preferences.",
      icon: Target,
    },
  ];

  const updateField = <K extends keyof AssessmentData>(
    field: K,
    value: AssessmentData[K]
  ) => {
    setData((previous) => ({
      ...previous,
      [field]: value,
    }));
    setError("");
  };

  const toggleSelection = (
    field: "interests" | "skills",
    value: string
  ) => {
    const current = data[field];

    updateField(
      field,
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const handleNext = async () => {
    if (isSubmitting) return;

    if (step === 0 && (!data.education || !data.field.trim())) {
      setError("Please complete your education details.");
      return;
    }

    if (step === 1 && data.interests.length === 0) {
      setError("Please select at least one interest.");
      return;
    }

    if (step === 2 && data.skills.length === 0) {
      setError("Please select at least one skill.");
      return;
    }

    if (step < steps.length - 1) {
      setStep((previous) => previous + 1);
      setError("");
      return;
    }

    if (
      !data.experience ||
      !data.workPreference ||
      !data.careerGoal.trim()
    ) {
      setError("Please complete your career preferences.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const careerMatches = calculateCareerMatches(data);

      const result: AssessmentResult = {
        assessment: data,
        careerMatches,
      };

      // Save the assessment to MongoDB.
      await saveAssessment(data, result);

      // Preserve the latest assessment for other pages.
      localStorage.setItem(ASSESSMENT_KEY, JSON.stringify(data));

      // Maintain local history for existing UI compatibility.
      saveAssessmentToHistory(data, careerMatches);

      navigate("/assessment/results");
    } catch (err) {
      console.error("Assessment submission failed:", err);
      setError(
        "Unable to save your assessment. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/60";

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-300";

  const selectionClass = (selected: boolean) =>
    `flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-sm transition ${
      selected
        ? "border-violet-500/40 bg-violet-500/10 text-violet-200"
        : "border-white/[0.07] bg-white/[0.02] text-slate-400 hover:border-white/15 hover:bg-white/[0.04]"
    }`;

  const StepIcon = steps[step].icon;

  return (
    <div className="min-h-screen bg-[#080b14] text-white">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link
          to="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        {/* Heading */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
            <Sparkles size={26} className="text-violet-300" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Career Assessment
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            Discover career paths aligned with your interests and skills.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8 rounded-2xl border border-white/[0.07] bg-[#101525] p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">
              Step {step + 1} of {steps.length}
            </span>

            <span className="text-xs text-violet-300">
              {Math.round(((step + 1) / steps.length) * 100)}% complete
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-500"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>

          <div className="mt-5 grid grid-cols-4 gap-2">
            {steps.map((item, index) => (
              <div
                key={item.title}
                className={`flex flex-col items-center gap-2 text-center text-xs ${
                  index === step
                    ? "text-violet-300"
                    : index < step
                    ? "text-emerald-300"
                    : "text-slate-600"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    index === step
                      ? "bg-violet-500/15"
                      : index < step
                      ? "bg-emerald-500/10"
                      : "bg-white/[0.03]"
                  }`}
                >
                  {index < step ? (
                    <Check size={16} />
                  ) : (
                    <item.icon size={16} />
                  )}
                </div>
                <span>{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#101525] p-5 sm:p-8">
          <div className="mb-7 flex items-center gap-3">
            <div className="rounded-xl bg-violet-500/10 p-2.5">
              <StepIcon size={20} className="text-violet-300" />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                {steps[step].title}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {steps[step].subtitle}
              </p>
            </div>
          </div>

          {/* Step 1: Education */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Education Level</label>
                <select
                  value={data.education}
                  onChange={(e) => updateField("education", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select education level</option>
                  <option value="High School">High School</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Degree / Field of Study</label>
                <input
                  value={data.field}
                  onChange={(e) => updateField("field", e.target.value)}
                  placeholder="e.g. Computer Science, Engineering, Economics"
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* Step 2: Interests */}
          {step === 1 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {interestOptions.map((interest) => {
                const selected = data.interests.includes(interest);

                return (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => toggleSelection("interests", interest)}
                    className={selectionClass(selected)}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                        selected
                          ? "border-violet-400 bg-violet-500 text-white"
                          : "border-white/20"
                      }`}
                    >
                      {selected && <Check size={13} />}
                    </span>
                    {interest}
                  </button>
                );
              })}
            </div>
          )}

          {/* Step 3: Skills */}
          {step === 2 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {skillOptions.map((skill) => {
                const selected = data.skills.includes(skill);

                return (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => toggleSelection("skills", skill)}
                    className={selectionClass(selected)}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                        selected
                          ? "border-violet-400 bg-violet-500 text-white"
                          : "border-white/20"
                      }`}
                    >
                      {selected && <Check size={13} />}
                    </span>
                    {skill}
                  </button>
                );
              })}
            </div>
          )}

          {/* Step 4: Preferences */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Experience Level</label>
                <select
                  value={data.experience}
                  onChange={(e) => updateField("experience", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select experience level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Preferred Work Environment</label>
                <select
                  value={data.workPreference}
                  onChange={(e) =>
                    updateField("workPreference", e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Select work preference</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Career Goal</label>
                <textarea
                  value={data.careerGoal}
                  onChange={(e) => updateField("careerGoal", e.target.value)}
                  placeholder="What do you want to achieve in your career?"
                  rows={4}
                  className={`${inputClass} resize-y`}
                />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="mt-5 rounded-xl border border-red-500/15 bg-red-500/[0.05] px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-white/[0.06] pt-6">
            <button
              type="button"
              onClick={() => {
                setStep((previous) => Math.max(0, previous - 1));
                setError("");
              }}
              disabled={step === 0 || isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                "Saving Assessment..."
              ) : step === steps.length - 1 ? (
                <>
                  <Save size={16} />
                  Complete Assessment
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-600">
          <Clock size={13} />
          Takes approximately 3–5 minutes
        </div>
      </div>
    </div>
  );
}
