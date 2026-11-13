
import { ArrowRight, Sparkles, Target, Compass, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import DashboardPreview from "../components/DashboardPreview";
import Reveal from "../components/Reveal";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-20 sm:pt-28">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Hero content */}
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-300">
              <Sparkles size={15} />
              Discover your next career move
            </div>
          </Reveal>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl font-bold tracking-tight text-white sm:text-7xl lg:text-8xl"
          >
            Your career.
            <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Your possibilities.
            </span>
          </motion.h1>

          <Reveal delay={0.2}>
            <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              Discover careers that match your strengths, identify the skills
              you need, and build a personalized roadmap towards your future.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 px-7 py-4 font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-1 hover:shadow-violet-500/30"
              >
                Get started for free
                <ArrowRight size={18} />
              </a>

              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-7 py-4 font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.06]"
              >
                Explore features
              </a>
            </div>
          </Reveal>

          {/* Feature highlights */}
          <Reveal delay={0.4}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              {[
                { icon: Target, text: "Career Matching" },
                { icon: Compass, text: "Career Discovery" },
                { icon: TrendingUp, text: "Skill Analysis" },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.text}
                    className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-slate-400"
                  >
                    <Icon size={15} className="text-violet-400" />
                    {item.text}
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* Dashboard preview animation */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 1,
            delay: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto mt-20 max-w-6xl"
        >
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  );
}
