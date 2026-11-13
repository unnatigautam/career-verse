
import { motion } from "framer-motion";
import {
  Sparkles,
  Target,
  TrendingUp,
  Brain,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

const careerMatches = [
  { name: "Frontend Developer", score: 94, color: "from-violet-500 to-blue-500" },
  { name: "UI/UX Designer", score: 86, color: "from-blue-500 to-cyan-500" },
  { name: "Product Designer", score: 78, color: "from-purple-500 to-pink-500" },
];

const skills = [
  { name: "JavaScript", progress: 85 },
  { name: "React", progress: 72 },
  { name: "Data Structures", progress: 48 },
];

export default function DashboardPreview() {
  return (
    <div className="relative">
      {/* Ambient glow */}
      <div className="absolute -inset-5 -z-10 rounded-[2rem] bg-gradient-to-r from-violet-600/20 to-blue-600/20 blur-3xl" />

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d111d] shadow-2xl shadow-black/40">
        {/* Dashboard header */}
        <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500">
              <Sparkles size={17} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">CareerVerse</p>
              <p className="text-xs text-slate-500">Career Dashboard</p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Profile analyzed
          </div>
        </div>

        {/* Dashboard body */}
        <div className="grid gap-5 p-5 sm:p-8 lg:grid-cols-[1.4fr_1fr]">
          {/* Career matches */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">
                  Your career matches
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Based on your profile
                </p>
              </div>
              <Target size={18} className="text-violet-400" />
            </div>

            <div className="space-y-5">
              {careerMatches.map((career, index) => (
                <motion.div
                  key={career.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.15 }}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-slate-300">{career.name}</span>
                    <span className="text-sm font-semibold text-white">
                      {career.score}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${career.score}%` }}
                      transition={{
                        duration: 1,
                        delay: 1.2 + index * 0.2,
                        ease: "easeOut",
                      }}
                      className={`h-full rounded-full bg-gradient-to-r ${career.color}`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2 border-t border-white/[0.07] pt-4 text-xs text-violet-300">
              View all recommendations
              <ArrowUpRight size={14} />
            </div>
          </motion.div>

          {/* Skills and progress */}
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">
                    Skill development
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Your learning progress
                  </p>
                </div>
                <TrendingUp size={18} className="text-blue-400" />
              </div>

              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={skill.name}>
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-slate-400">{skill.name}</span>
                      <span className="text-slate-300">{skill.progress}%</span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.progress}%` }}
                        transition={{
                          duration: 0.8,
                          delay: 1.2 + index * 0.2,
                        }}
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Roadmap card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.2 }}
              className="rounded-xl border border-violet-400/15 bg-gradient-to-br from-violet-500/[0.08] to-blue-500/[0.05] p-5"
            >
              <div className="mb-4 flex items-center gap-2">
                <Brain size={17} className="text-violet-400" />
                <p className="text-sm font-medium text-slate-200">
                  Your learning roadmap
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/10">
                  <CheckCircle2 size={17} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-300">
                    Phase 1 · Foundations
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Example milestone completed
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Preview disclaimer */}
        <div className="border-t border-white/[0.07] px-5 py-3 text-center">
          <p className="text-xs text-slate-500">
            Illustrative dashboard preview · Example data
          </p>
        </div>
      </div>
    </div>
  );
}
