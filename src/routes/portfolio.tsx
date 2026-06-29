import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Mail, BookOpen, FileText, Video, Sparkles, X } from "lucide-react";
import { usePortfolio, type ExperienceKind, type StudyKind, type Project } from "@/lib/portfolio-store";

export const Route = createFileRoute("/portfolio")({
  head: () => ({ meta: [{ title: "Portfolio" }] }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const data = usePortfolio();
  const { profile, experiences, projects, studies } = data;

  return (
    <div className="min-h-screen">
      <nav className="no-print bg-white border-b border-border-soft px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="font-bold text-cobalt text-lg">Portfolio</div>
        <Link
          to="/admin"
          className="border border-border-soft text-slate-600 rounded-md px-2.5 py-1 text-xs hover:border-cobalt hover:text-cobalt"
        >
          관리자로 이동
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-5 py-10 space-y-14">
        <Hero
          name={profile.name}
          tagline={profile.tagline}
          email={profile.email}
          strengths={profile.strengths}
          photo={profile.photoDataUrl}
        />
        <ExperienceView items={experiences} />
        <ProjectsView items={projects} />
        <StudiesView items={studies} />
      </main>

      <footer className="border-t border-border-soft mt-12 py-6 text-center text-xs text-slate-500">
        <div>
          {profile.name} {profile.email && `· ${profile.email}`}
        </div>
        <div className="mt-1">이 포트폴리오는 Lovable로 제작되었습니다</div>
      </footer>
    </div>
  );
}

function Hero({
  name,
  tagline,
  email,
  strengths,
  photo,
}: {
  name: string;
  tagline: string;
  email: string;
  strengths: string[];
  photo?: string;
}) {
  const hasAny = name || tagline || email || strengths.length || photo;
  if (!hasAny) {
    return <div className="pf-card p-8 text-center text-sm text-slate-500">아직 프로필이 등록되지 않았어요</div>;
  }
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
      {photo ? (
        <img src={photo} alt={name} className="w-16 h-16 rounded-full object-cover border border-border-soft shrink-0" />
      ) : (
        <div className="w-16 h-16 rounded-full bg-slate-100 border border-border-soft shrink-0" />
      )}
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl sm:text-3xl font-bold">{name || "이름"}</h1>
        {tagline && <p className="text-slate-500 mt-1">{tagline}</p>}
        {strengths.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {strengths.map((s) => (
              <span key={s} className="pf-pill">
                {s}
              </span>
            ))}
          </div>
        )}
        {email && (
          <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
            <Mail size={14} className="text-cobalt" />
            <a href={`mailto:${email}`} className="hover:text-cobalt">
              {email}
            </a>
          </div>
        )}
      </div>
    </header>
  );
}

const EXP_TABS: ("전체" | ExperienceKind)[] = ["전체", "경력", "학력", "대외활동"];

function ExperienceView({ items }: { items: ReturnType<typeof usePortfolio>["experiences"] }) {
  const [tab, setTab] = useState<(typeof EXP_TABS)[number]>("전체");
  const filtered = useMemo(() => (tab === "전체" ? items : items.filter((i) => i.kind === tab)), [items, tab]);
  return (
    <section>
      <h2 className="section-title">Experience / Education</h2>
      <Tabs tabs={EXP_TABS as readonly string[]} value={tab} onChange={(v) => setTab(v as typeof tab)} />
      {filtered.length === 0 ? (
        <Empty />
      ) : (
        <div className="mt-6 relative pl-6 border-l-2 border-cobalt/30 space-y-6">
          {filtered.map((e) => (
            <div key={e.id} className="relative">
              <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-cobalt border-2 border-white shadow" />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <span className="pf-tag mr-2">{e.kind}</span>
                  <span className="font-semibold">{e.org}</span>
                  {e.role && <span className="text-slate-500 ml-2 text-sm">{e.role}</span>}
                </div>
                <span className="text-xs text-slate-500">{e.period}</span>
              </div>
              {e.description && <p className="text-sm text-slate-600 mt-1.5 whitespace-pre-wrap">{e.description}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function ProjectsView({ items }: { items: Project[] }) {
  const [open, setOpen] = useState<Project | null>(null);
  return (
    <section>
      <h2 className="section-title">Projects</h2>
      {items.length === 0 ? (
        <Empty />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((p) => (
            <button
              key={p.id}
              onClick={() => setOpen(p)}
              className="pf-card text-left overflow-hidden hover:border-cobalt transition group"
            >
              {p.coverDataUrl ? (
                <img src={p.coverDataUrl} alt={p.name} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-slate-100" />
              )}
              <div className="p-4">
                <div className="font-semibold group-hover:text-cobalt">{p.name}</div>
                {p.summary && <p className="text-sm text-slate-600 mt-1">{p.summary}</p>}
                {p.tech.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {p.tech.map((t) => (
                      <span key={t} className="pf-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
      {open && (
        <div
          className="no-print fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setOpen(null)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {open.coverDataUrl && <img src={open.coverDataUrl} className="w-full h-56 object-cover rounded-t-xl" alt="" />}
            <div className="p-6">
              <div className="flex justify-between items-start gap-4 mb-3">
                <h3 className="text-xl font-bold">{open.name}</h3>
                <button onClick={() => setOpen(null)} className="text-slate-400 hover:text-slate-700">
                  <X size={20} />
                </button>
              </div>
              {open.summary && <p className="text-slate-600 mb-3">{open.summary}</p>}
              {open.tech.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {open.tech.map((t) => (
                    <span key={t} className="pf-tag">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              {open.details && (
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{open.details}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

const STUDY_TABS: ("전체" | StudyKind)[] = ["전체", "책", "논문", "강의"];

function studyIcon(k: StudyKind) {
  if (k === "책") return BookOpen;
  if (k === "논문") return FileText;
  if (k === "강의") return Video;
  return Sparkles;
}

function StudiesView({ items }: { items: ReturnType<typeof usePortfolio>["studies"] }) {
  const [tab, setTab] = useState<(typeof STUDY_TABS)[number]>("전체");
  const filtered = useMemo(() => (tab === "전체" ? items : items.filter((i) => i.kind === tab)), [items, tab]);
  return (
    <section>
      <h2 className="section-title">Study Log</h2>
      <Tabs tabs={STUDY_TABS as readonly string[]} value={tab} onChange={(v) => setTab(v as typeof tab)} />
      {filtered.length === 0 ? (
        <Empty />
      ) : (
        <ul className="mt-6 space-y-3">
          {filtered.map((s) => {
            const Icon = studyIcon(s.kind);
            return (
              <li key={s.id} className="pf-card p-4 flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-cobalt-soft text-cobalt flex items-center justify-center shrink-0">
                  <Icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="font-semibold">{s.title}</div>
                    {s.date && <span className="text-xs text-slate-500">{s.date}</span>}
                  </div>
                  {s.source && <div className="text-xs text-slate-500 mt-0.5">{s.source}</div>}
                  {s.summary && <p className="text-sm text-slate-600 mt-1">{s.summary}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function Tabs({
  tabs,
  value,
  onChange,
}: {
  tabs: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 mb-2 no-print">
      {tabs.map((t) => {
        const active = value === t;
        return (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
              active
                ? "bg-cobalt text-white"
                : "bg-white border border-border-soft text-slate-600 hover:border-cobalt hover:text-cobalt"
            }`}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}

function Empty() {
  return <div className="pf-card p-8 text-center text-sm text-slate-500">아직 추가된 내용이 없어요</div>;
}
