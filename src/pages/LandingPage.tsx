
import {
  ArrowRight,
  Brain,
  Compass,
  Target,
  TrendingUp,
  Sparkles,
  Rocket,
  GitBranch,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Reveal from "../components/Reveal";
import Hero from "./Hero";

const features = [
  {
    icon: Compass,
    title: "Career Discovery",
    description:
      "Explore career paths aligned with your interests, strengths, education, and aspirations.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Target,
    title: "Career Matching",
    description:
      "Discover career opportunities ranked by compatibility with your skills and preferences.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: TrendingUp,
    title: "Skill Gap Analysis",
    description:
      "Identify the skills you need to develop and understand where you currently stand.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Brain,
    title: "Personalized Roadmaps",
    description:
      "Get structured learning roadmaps with actionable milestones to achieve your career goals.",
    color: "from-orange-500 to-pink-500",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080b14] text-slate-100">
      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Features */}
      <section id="features" className="relative px-6 py-28">
        <div className="absolute left-1/2 top-20 -z-0 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl">
          <Reveal>
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-300">
                <Sparkles size={15} />
                Everything you need to grow
              </div>

              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
                Your career journey,
                <span className="block bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                  all in one place.
                </span>
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-400">
                From discovering your potential to building the skills that
                matter, CareerVerse helps you move forward with clarity.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <Reveal key={feature.title} delay={index * 0.1}>
                  <div className="group h-full rounded-2xl border border-white/[0.08] bg-white/[0.03] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-violet-400/30 hover:bg-white/[0.05]">
                    <div
                      className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}
                    >
                      <Icon size={23} className="text-white" />
                    </div>

                    <h3 className="mb-3 text-lg font-semibold text-white">
                      {feature.title}
                    </h3>

                    <p className="text-sm leading-7 text-slate-400">
                      {feature.description}
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-sm font-medium text-violet-300 transition-all group-hover:gap-3">
                      Explore feature
                      <ArrowRight size={15} />
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="grid items-center gap-14 lg:grid-cols-2">
              <div>
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
                  Your journey, simplified
                </p>

                <h2 className="text-3xl font-bold leading-tight sm:text-5xl">
                  Turn career confusion into
                  <span className="text-violet-400"> direction.</span>
                </h2>

                <p className="mt-6 max-w-xl leading-8 text-slate-400">
                  CareerVerse brings your career exploration, skill development,
                  and progress tracking together into one personalized experience.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    number: "01",
                    title: "Discover yourself",
                    text: "Understand your interests, strengths, and career preferences.",
                  },
                  {
                    number: "02",
                    title: "Explore your possibilities",
                    text: "Find career paths that align with your profile.",
                  },
                  {
                    number: "03",
                    title: "Build your roadmap",
                    text: "Identify skill gaps and plan your learning journey.",
                  },
                  {
                    number: "04",
                    title: "Track your growth",
                    text: "Monitor progress and keep moving towards your goals.",
                  },
                ].map((step) => (
                  <div
                    key={step.number}
                    className="flex gap-5 rounded-xl border border-white/[0.07] bg-white/[0.025] p-5"
                  >
                    <span className="text-sm font-semibold text-violet-400">
                      {step.number}
                    </span>

                    <div>
                      <h3 className="font-semibold text-white">{step.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        {step.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="px-6 py-24">
        <Reveal>
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-950/70 via-[#11152a] to-blue-950/50 px-8 py-16 text-center sm:px-16">
            <div className="absolute left-1/2 top-0 h-60 w-60 -translate-x-1/2 rounded-full bg-violet-500/20 blur-[100px]" />

            <div className="relative">
              <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 p-3">
                <Rocket size={25} className="text-violet-300" />
              </div>

              <h2 className="mx-auto max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">
                Your future isn't something you find.
                <span className="block text-violet-300">
                  It's something you build.
                </span>
              </h2>

              <p className="mx-auto mt-6 max-w-xl leading-8 text-slate-400">
                Take the first step towards a career that actually feels like
                yours.
              </p>

              <a
                href="/signup"
                className="mt-9 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-[#080b14] transition hover:bg-violet-100"
              >
                Start your journey
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.07] px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500">
              <Sparkles size={16} className="text-white" />
            </div>

            <span className="font-semibold text-white">CareerVerse</span>
          </div>

          <p className="text-center text-sm text-slate-500">
            © {new Date().getFullYear()} CareerVerse. Your future, your way.
          </p>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <GitBranch size={17} />
            GitHub
          </a>
        </div>
      </footer>
    </main>
  );
}
