
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  GraduationCap,
  Briefcase,
  Target,
  Save,
  CheckCircle2,
  Sparkles,
  BookOpen,
  LoaderCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getProfile,
  saveProfile,
  type ProfileData,
} from "../services/profileService";
import { getLatestAssessment } from "../services/assessmentService";

type AssessmentAnswers = {
  education?: string;
  field?: string;
  interests?: string[];
  skills?: string[];
  experience?: string;
  workPreference?: string;
  careerGoal?: string;
};

const emptyProfile: ProfileData = {
  userId: "",
  name: "",
  email: "",
  education: "",
  field: "",
  interests: [],
  skills: [],
  experience: "",
  workPreference: "",
  careerGoal: "",
};

const mergeProfile = (
  profile: ProfileData | null,
  assessment: AssessmentAnswers | null,
  user: { name?: string; email?: string } | null
): ProfileData => {
  const base = profile ?? emptyProfile;

  return {
    ...emptyProfile,
    ...base,
    name: base.name?.trim() || user?.name || "",
    email: base.email?.trim() || user?.email || "",
    education: base.education || assessment?.education || "",
    field: base.field || assessment?.field || "",
    interests:
      base.interests?.length > 0
        ? base.interests
        : assessment?.interests ?? [],
    skills:
      base.skills?.length > 0
        ? base.skills
        : assessment?.skills ?? [],
    experience: base.experience || assessment?.experience || "",
    workPreference:
      base.workPreference || assessment?.workPreference || "",
    careerGoal: base.careerGoal || assessment?.careerGoal || "",
  };
};

export default function ProfilePage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState<ProfileData>(emptyProfile);
  const [interestsText, setInterestsText] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const [profileResult, assessmentResult] =
          await Promise.allSettled([
            getProfile(),
            getLatestAssessment(),
          ]);

        const savedProfile =
          profileResult.status === "fulfilled"
            ? profileResult.value
            : null;

        const assessmentResponse =
          assessmentResult.status === "fulfilled"
            ? assessmentResult.value
            : null;

        const answers: AssessmentAnswers | null =
          assessmentResponse?.assessment?.answers ??
          assessmentResponse?.assessment ??
          null;

        const merged = mergeProfile(savedProfile, answers, user);

        if (active) {
          setProfile(merged);
          setInterestsText((merged.interests ?? []).join(", "));
          setSkillsText((merged.skills ?? []).join(", "));

          if (profileResult.status === "rejected") {
            console.error("Profile loading failed:", profileResult.reason);
          }
        }
      } catch (err) {
        console.error("Profile loading error:", err);
        if (active) {
          setError("Unable to load your profile.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [user]);

  const updateField = (
    field: keyof ProfileData,
    value: string | string[]
  ) => {
    setProfile((previous) => ({ ...previous, [field]: value }));
    setSaved(false);
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const profileToSave: ProfileData = {
        ...profile,
        interests: interestsText
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        skills: skillsText
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      const updated = await saveProfile(profileToSave);

      const normalized: ProfileData = {
        ...emptyProfile,
        ...profileToSave,
        ...updated,
        interests: updated.interests ?? profileToSave.interests,
        skills: updated.skills ?? profileToSave.skills,
      };

      setProfile(normalized);
      setInterestsText(normalized.interests.join(", "));
      setSkillsText(normalized.skills.join(", "));

      localStorage.setItem("careerverse-name", normalized.name);
      localStorage.setItem("careerverse-email", normalized.email);

      localStorage.setItem(
        "careerverse-assessment",
        JSON.stringify({
          education: normalized.education,
          field: normalized.field,
          interests: normalized.interests,
          skills: normalized.skills,
          experience: normalized.experience,
          workPreference: normalized.workPreference,
          careerGoal: normalized.careerGoal,
        })
      );

      setSaved(true);
    } catch (err) {
      console.error("Profile save error:", err);
      setError("Failed to save profile. Please try again.");
      setSaved(false);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10";

  const labelClass = "mb-2 block text-sm font-medium text-slate-300";
  const sectionClass =
    "rounded-2xl border border-white/[0.07] bg-[#101525] p-5 sm:p-6";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080b14] text-slate-400">
        <LoaderCircle className="mr-3 animate-spin" size={20} />
        Loading your profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080b14] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-violet-300">
                <Sparkles size={15} />
                Your CareerVerse Profile
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Profile Settings
              </h1>
              <p className="mt-2 text-slate-400">
                Manage your information and career preferences.
              </p>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/20 to-blue-500/20">
              <User size={30} className="text-violet-300" />
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <section className={sectionClass}>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-violet-500/10 p-2.5">
                <User size={20} className="text-violet-300" />
              </div>
              <div>
                <h2 className="font-semibold">Personal Information</h2>
                <p className="text-xs text-slate-500">Basic information about you</p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  value={profile.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Enter your full name"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="you@example.com"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/10 p-2.5">
                <GraduationCap size={20} className="text-blue-300" />
              </div>
              <div>
                <h2 className="font-semibold">Education</h2>
                <p className="text-xs text-slate-500">Your academic background</p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Education Level</label>
                <select
                  value={profile.education}
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
                <label className={labelClass}>Degree / Field</label>
                <input
                  value={profile.field}
                  onChange={(e) => updateField("field", e.target.value)}
                  placeholder="e.g. Computer Science"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500/10 p-2.5">
                <BookOpen size={20} className="text-emerald-300" />
              </div>
              <div>
                <h2 className="font-semibold">Skills & Interests</h2>
                <p className="text-xs text-slate-500">Help CareerVerse understand your strengths</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className={labelClass}>Interests</label>
                <textarea
                  value={interestsText}
                  onChange={(e) => {
                    setInterestsText(e.target.value);
                    setSaved(false);
                  }}
                  placeholder="e.g. Artificial Intelligence, Web Development, Design"
                  rows={3}
                  className={`${inputClass} resize-y`}
                />
                <p className="mt-2 text-xs text-slate-500">Separate multiple interests with commas.</p>
              </div>
              <div>
                <label className={labelClass}>Skills</label>
                <textarea
                  value={skillsText}
                  onChange={(e) => {
                    setSkillsText(e.target.value);
                    setSaved(false);
                  }}
                  placeholder="e.g. Python, C++, React, SQL"
                  rows={3}
                  className={`${inputClass} resize-y`}
                />
                <p className="mt-2 text-xs text-slate-500">Separate multiple skills with commas.</p>
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-amber-500/10 p-2.5">
                <Briefcase size={20} className="text-amber-300" />
              </div>
              <div>
                <h2 className="font-semibold">Career Preferences</h2>
                <p className="text-xs text-slate-500">Tell us what your career looks like</p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Experience Level</label>
                <select
                  value={profile.experience}
                  onChange={(e) => updateField("experience", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select experience</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Work Preference</label>
                <select
                  value={profile.workPreference}
                  onChange={(e) => updateField("workPreference", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select preference</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Career Goal</label>
                <div className="relative">
                  <Target size={16} className="absolute left-4 top-4 text-slate-500" />
                  <textarea
                    value={profile.careerGoal}
                    onChange={(e) => updateField("careerGoal", e.target.value)}
                    placeholder="e.g. Become an AI/ML Engineer and build intelligent applications"
                    rows={3}
                    className={`${inputClass} resize-y pl-10`}
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-[#101525] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm">
              {saved ? (
                <>
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  <span className="text-emerald-300">Profile saved successfully in MongoDB!</span>
                </>
              ) : (
                <span className="text-slate-500">Changes will be saved to your account.</span>
              )}
            </div>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
