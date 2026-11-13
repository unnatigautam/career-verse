
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  History,
  CalendarDays,
  Target,
  Trash2,
  Eye,
  Sparkles,
  GraduationCap,
  Clock,
  ChevronRight,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

import {
  getAssessmentHistory,
  deleteAssessment,
  clearAssessmentHistory,
  type AssessmentData,
} from "../services/assessmentService";

type CareerMatch = {
  title: string;
  score: number;
};

type HistoryEntry = {
  id: string;
  date: string;
  assessment: AssessmentData;
  careerMatches: CareerMatch[];
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  // Fetch assessment history from MongoDB
  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAssessmentHistory();

      const records = response.history ?? [];

      const formattedHistory: HistoryEntry[] = records.map(
        (record: any) => ({
          id: record._id,
          date: record.createdAt,
          assessment: record.answers,
          careerMatches: record.result?.careerMatches ?? [],
        })
      );

      setHistory(formattedHistory);
    } catch (err: any) {
      console.error("Failed to fetch assessment history:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load assessment history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Delete one assessment from MongoDB
  const deleteEntry = async (id: string) => {
    try {
      setDeleting(true);

      await deleteAssessment(id);

      setHistory((previous) =>
        previous.filter((entry) => entry.id !== id)
      );

      setDeleteId(null);
    } catch (err: any) {
      console.error("Failed to delete assessment:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete assessment."
      );
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  // Clear all assessments from MongoDB
  const clearHistory = async () => {
    try {
      setDeleting(true);

      await clearAssessmentHistory();

      setHistory([]);
      setDeleteId(null);
    } catch (err: any) {
      console.error("Failed to clear history:", err);

      setError(
        err.response?.data?.message ||
          "Failed to clear assessment history."
      );
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  // View a saved assessment
  const viewAssessment = (entry: HistoryEntry) => {
    localStorage.setItem(
      "careerverse-assessment",
      JSON.stringify(entry.assessment)
    );

    navigate("/assessment/results");
  };

  const formatDate = (date: string) => {
    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "Unknown date";

    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date: string) => {
    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "";

    return parsed.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalMatches = history.reduce(
    (total, entry) => total + entry.careerMatches.length,
    0
  );

  return (
    <div className="min-h-screen bg-[#080b14] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-violet-300">
              <Sparkles size={15} />
              Your Journey
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Assessment History
            </h1>

            <p className="mt-3 text-slate-400">
              Track your career exploration journey over time.
            </p>
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/20 to-blue-500/20">
            <History size={30} className="text-violet-300" />
          </div>
        </div>

        {/* Summary */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.07] bg-[#101525] p-5">
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-400">
              <History size={16} />
              Total Assessments
            </div>

            <p className="text-3xl font-bold">
              {loading ? "—" : history.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#101525] p-5">
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-400">
              <CalendarDays size={16} />
              Latest Assessment
            </div>

            <p className="text-lg font-semibold">
              {loading
                ? "Loading..."
                : history.length > 0
                ? formatDate(history[0].date)
                : "Not available"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#101525] p-5">
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-400">
              <Target size={16} />
              Saved Career Matches
            </div>

            <p className="text-3xl font-bold">
              {loading ? "—" : totalMatches}
            </p>
          </div>
        </div>

        {/* History list */}
        <section className="rounded-2xl border border-white/[0.07] bg-[#101525]">
          <div className="flex flex-col gap-3 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="font-semibold">Previous Assessments</h2>
              <p className="mt-1 text-xs text-slate-500">
                Your saved career assessment snapshots
              </p>
            </div>

            {history.length > 0 && !loading && (
              <button
                onClick={() => setDeleteId("all")}
                className="inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/10"
              >
                <Trash2 size={14} />
                Clear History
              </button>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <LoaderCircle
                size={32}
                className="animate-spin text-violet-400"
              />
              <p className="mt-4 text-sm text-slate-400">
                Loading your assessment history...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <AlertCircle size={32} className="text-red-400" />

              <h3 className="mt-4 text-lg font-semibold">
                Couldn't load history
              </h3>

              <p className="mt-2 max-w-md text-sm text-slate-500">
                {error}
              </p>

              <button
                onClick={fetchHistory}
                className="mt-5 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && history.length === 0 && (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                <History size={28} className="text-slate-500" />
              </div>

              <h3 className="text-lg font-semibold">
                No assessment history yet
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Your completed assessments will appear here,
                allowing you to revisit your previous career
                exploration results.
              </p>

              <Link
                to="/assessment"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-semibold transition hover:opacity-90"
              >
                Start Assessment
                <ChevronRight size={16} />
              </Link>
            </div>
          )}

          {/* Assessment entries */}
          {!loading && !error && history.length > 0 && (
            <div className="divide-y divide-white/[0.05]">
              {history.map((entry, index) => (
                <div key={entry.id} className="p-5 sm:p-6">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-500/15 bg-violet-500/10">
                        <GraduationCap
                          size={22}
                          className="text-violet-300"
                        />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">
                            Career Assessment #{history.length - index}
                          </h3>

                          {index === 0 && (
                            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                              Latest
                            </span>
                          )}
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays size={13} />
                            {formatDate(entry.date)}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <Clock size={13} />
                            {formatTime(entry.date)}
                          </span>
                        </div>

                        <p className="mt-3 text-sm text-slate-400">
                          {entry.assessment.field || "Career exploration"} ·{" "}
                          {entry.assessment.education ||
                            "Education not specified"}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {entry.assessment.interests
                            .slice(0, 3)
                            .map((interest) => (
                              <span
                                key={interest}
                                className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-xs text-slate-400"
                              >
                                {interest}
                              </span>
                            ))}

                          {entry.assessment.interests.length > 3 && (
                            <span className="rounded-lg px-2 py-1 text-xs text-slate-500">
                              +{entry.assessment.interests.length - 3} more
                            </span>
                          )}
                        </div>

                        {entry.careerMatches.length > 0 && (
                          <div className="mt-4">
                            <p className="mb-2 text-xs text-slate-500">
                              Saved career matches
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {entry.careerMatches.map((career) => (
                                <span
                                  key={career.title}
                                  className="rounded-lg border border-violet-500/10 bg-violet-500/[0.05] px-2.5 py-1.5 text-xs text-violet-300"
                                >
                                  {career.title} · {career.score}%
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => viewAssessment(entry)}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08]"
                      >
                        <Eye size={15} />
                        View
                      </button>

                      <button
                        onClick={() => setDeleteId(entry.id)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-500 transition hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
                        title="Delete assessment"
                        aria-label="Delete assessment"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Information */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-violet-500/10 bg-violet-500/[0.04] p-4 text-xs leading-5 text-slate-400">
          <AlertCircle
            size={16}
            className="mt-0.5 shrink-0 text-violet-300"
          />
          Your assessment history is securely stored in MongoDB
          and linked to your account. You can access it whenever
          you sign in.
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101525] p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
              <Trash2 size={22} className="text-red-400" />
            </div>

            <h2 className="text-lg font-semibold">
              {deleteId === "all"
                ? "Clear assessment history?"
                : "Delete this assessment?"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {deleteId === "all"
                ? "This will permanently delete all your assessment history from your account."
                : "This assessment will be permanently deleted from your account."}
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  deleteId === "all"
                    ? clearHistory()
                    : deleteEntry(deleteId)
                }
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/90 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting && (
                  <LoaderCircle size={15} className="animate-spin" />
                )}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
