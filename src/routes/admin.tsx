import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, Briefcase, FolderKanban, BookOpen, Pencil, Trash2, Plus } from "lucide-react";
import {
  usePortfolio,
  updateProfile,
  addExperience,
  updateExperience,
  deleteExperience,
  addProject,
  updateProject,
  deleteProject,
  addStudy,
  updateStudy,
  deleteStudy,
  fileToDataUrl,
  uid,
  type Experience,
  type ExperienceKind,
  type Project,
  type StudyLog,
  type StudyKind,
} from "@/lib/portfolio-store";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "포트폴리오 관리" }] }),
  component: AdminPage,
});

const AUTH_KEY = "admin-auth";

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAuthed(sessionStorage.getItem(AUTH_KEY) === "1");
  }, []);

  if (!mounted) return null;
  if (!authed) return <Gate onPass={() => setAuthed(true)} />;
  return <AdminShell />;
}

function Gate({ onPass }: { onPass: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center bg-cobalt px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (pw === "0000") {
            sessionStorage.setItem(AUTH_KEY, "1");
            onPass();
          } else {
            setErr(true);
          }
        }}
        className="pf-card w-full max-w-sm p-8"
      >
        <h1 className="text-xl font-bold mb-1">관리자 로그인</h1>
        <p className="text-sm text-slate-500 mb-6">비밀번호를 입력하세요</p>
        <input
          type="password"
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
            setErr(false);
          }}
          autoFocus
          className="w-full border border-border-soft rounded-lg px-3 py-2 mb-2 focus:outline-none focus:border-cobalt"
          placeholder="••••"
        />
        {err && <p className="text-sm text-red-600 mb-2">비밀번호가 올바르지 않습니다</p>}
        <button
          type="submit"
          className="w-full bg-cobalt text-white rounded-lg py-2 font-medium hover:bg-cobalt-deep transition"
        >
          입장
        </button>
      </form>
    </div>
  );
}

type Tab = "profile" | "exp" | "project" | "study";
const TABS: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "기본 프로필", icon: User },
  { id: "exp", label: "경험 / 학력", icon: Briefcase },
  { id: "project", label: "강의 프로그램", icon: FolderKanban },
  { id: "study", label: "성과·후기", icon: BookOpen },
];

function AdminShell() {
  const [tab, setTab] = useState<Tab>("profile");
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-border-soft px-6 py-4 flex items-center justify-between">
        <h1 className="font-bold text-lg">내 포트폴리오 관리</h1>
        <Link
          to="/portfolio"
          className="border border-cobalt text-cobalt rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-cobalt-soft transition"
        >
          포트폴리오 보기 →
        </Link>
      </header>
      <div className="flex flex-1 pb-20 md:pb-0">
        <aside className="hidden md:block w-60 border-r border-border-soft bg-white p-3">
          <nav className="space-y-1">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    active ? "bg-cobalt text-white" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={18} />
                  {t.label}
                </button>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-8 max-w-4xl">
          {tab === "profile" && <ProfileForm />}
          {tab === "exp" && <ExperienceSection />}
          {tab === "project" && <ProjectSection />}
          {tab === "study" && <StudySection />}
        </main>
      </div>
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-border-soft grid grid-cols-4 z-50">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-col items-center justify-center py-2 text-xs gap-1 ${
                active ? "text-cobalt" : "text-slate-500"
              }`}
            >
              <Icon size={20} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-slate-700 mb-1.5">{children}</label>;
}

const inputCls =
  "w-full border border-border-soft rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cobalt";

function ProfileForm() {
  const { profile } = usePortfolio();
  const [name, setName] = useState(profile.name);
  const [tagline, setTagline] = useState(profile.tagline);
  const [email, setEmail] = useState(profile.email);
  const [strengthsRaw, setStrengthsRaw] = useState(profile.strengths.join(", "));
  const [photo, setPhoto] = useState(profile.photoDataUrl);

  useEffect(() => {
    setName(profile.name);
    setTagline(profile.tagline);
    setEmail(profile.email);
    setStrengthsRaw(profile.strengths.join(", "));
    setPhoto(profile.photoDataUrl);
  }, [profile]);

  const strengths = strengthsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <>
      <h2 className="section-title">기본 프로필</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateProfile({ name, tagline, email, strengths, photoDataUrl: photo });
          alert("저장되었습니다");
        }}
        className="pf-card p-6 space-y-4"
      >
        <div className="flex items-center gap-4">
          {photo ? (
            <img src={photo} alt="" className="w-20 h-20 rounded-full object-cover border border-border-soft" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-slate-100 border border-border-soft" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              if (f.size > 1024 * 1024) {
                if (!confirm("1MB가 넘는 이미지입니다. 계속할까요?")) return;
              }
              setPhoto(await fileToDataUrl(f));
            }}
            className="text-sm"
          />
        </div>
        <div>
          <FieldLabel>이름</FieldLabel>
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <FieldLabel>한줄 소개</FieldLabel>
          <input className={inputCls} value={tagline} onChange={(e) => setTagline(e.target.value)} />
        </div>
        <div>
          <FieldLabel>이메일</FieldLabel>
          <input className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <FieldLabel>강점 키워드 (쉼표로 구분)</FieldLabel>
          <input
            className={inputCls}
            value={strengthsRaw}
            onChange={(e) => setStrengthsRaw(e.target.value)}
            placeholder="문제해결, 협업, 데이터분석"
          />
          {strengths.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {strengths.map((s) => (
                <span key={s} className="pf-pill">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
        <button type="submit" className="bg-cobalt text-white rounded-lg px-4 py-2 font-medium hover:bg-cobalt-deep">
          저장
        </button>
      </form>
    </>
  );
}

function ItemActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex gap-1">
      <button onClick={onEdit} className="p-1.5 text-slate-500 hover:text-cobalt hover:bg-slate-100 rounded">
        <Pencil size={15} />
      </button>
      <button
        onClick={() => {
          if (confirm("삭제하시겠습니까?")) onDelete();
        }}
        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

function ExperienceSection() {
  const { experiences } = usePortfolio();
  const [editing, setEditing] = useState<Experience | null>(null);
  const [kind, setKind] = useState<ExperienceKind>("경력");
  const [org, setOrg] = useState("");
  const [role, setRole] = useState("");
  const [period, setPeriod] = useState("");
  const [description, setDescription] = useState("");

  const reset = () => {
    setEditing(null);
    setKind("경력");
    setOrg("");
    setRole("");
    setPeriod("");
    setDescription("");
  };

  const load = (e: Experience) => {
    setEditing(e);
    setKind(e.kind);
    setOrg(e.org);
    setRole(e.role);
    setPeriod(e.period);
    setDescription(e.description);
  };

  return (
    <>
      <h2 className="section-title">경험 / 학력</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const data = { id: editing?.id ?? uid(), kind, org, role, period, description };
          if (editing) updateExperience(data);
          else addExperience(data);
          reset();
        }}
        className="pf-card p-6 space-y-4"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <FieldLabel>구분</FieldLabel>
            <select className={inputCls} value={kind} onChange={(e) => setKind(e.target.value as ExperienceKind)}>
              <option>경력</option>
              <option>교육이수</option>
              <option>대외활동</option>
            </select>
          </div>
          <div>
            <FieldLabel>기간</FieldLabel>
            <input className={inputCls} value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="2022.03 ~ 2024.02" />
          </div>
          <div>
            <FieldLabel>기관명</FieldLabel>
            <input className={inputCls} value={org} onChange={(e) => setOrg(e.target.value)} />
          </div>
          <div>
            <FieldLabel>직책 또는 전공</FieldLabel>
            <input className={inputCls} value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
        </div>
        <div>
          <FieldLabel>상세 설명</FieldLabel>
          <textarea
            className={inputCls + " min-h-24"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-cobalt text-white rounded-lg px-4 py-2 font-medium hover:bg-cobalt-deep flex items-center gap-1.5">
            <Plus size={16} />
            {editing ? "수정" : "추가"}
          </button>
          {editing && (
            <button type="button" onClick={reset} className="border border-border-soft rounded-lg px-4 py-2 text-sm">
              취소
            </button>
          )}
        </div>
      </form>
      <div className="mt-6 space-y-3">
        {experiences.length === 0 && <EmptyAdmin />}
        {experiences.map((e) => (
          <div key={e.id} className="pf-card p-4 flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="pf-tag">{e.kind}</span>
                <span className="text-xs text-slate-500">{e.period}</span>
              </div>
              <div className="font-semibold">{e.org}</div>
              <div className="text-sm text-slate-600">{e.role}</div>
              {e.description && <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{e.description}</p>}
            </div>
            <ItemActions onEdit={() => load(e)} onDelete={() => deleteExperience(e.id)} />
          </div>
        ))}
      </div>
    </>
  );
}

function ProjectSection() {
  const { projects } = usePortfolio();
  const [editing, setEditing] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [details, setDetails] = useState("");
  const [techRaw, setTechRaw] = useState("");
  const [cover, setCover] = useState<string | undefined>();

  const reset = () => {
    setEditing(null);
    setName("");
    setSummary("");
    setDetails("");
    setTechRaw("");
    setCover(undefined);
  };

  const load = (p: Project) => {
    setEditing(p);
    setName(p.name);
    setSummary(p.summary);
    setDetails(p.details);
    setTechRaw(p.tech.join(", "));
    setCover(p.coverDataUrl);
  };

  const tech = techRaw.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <>
      <h2 className="section-title">강의 프로그램</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const data = { id: editing?.id ?? uid(), name, summary, details, tech, coverDataUrl: cover };
          if (editing) updateProject(data);
          else addProject(data);
          reset();
        }}
        className="pf-card p-6 space-y-4"
      >
        <div>
          <FieldLabel>강의명</FieldLabel>
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <FieldLabel>한줄 설명</FieldLabel>
          <input className={inputCls} value={summary} onChange={(e) => setSummary(e.target.value)} />
        </div>
        <div>
          <FieldLabel>상세 내용</FieldLabel>
          <textarea className={inputCls + " min-h-32"} value={details} onChange={(e) => setDetails(e.target.value)} />
        </div>
        <div>
          <FieldLabel>사용 기술 (쉼표 구분)</FieldLabel>
          <input className={inputCls} value={techRaw} onChange={(e) => setTechRaw(e.target.value)} placeholder="React, TypeScript" />
          {tech.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tech.map((t) => (
                <span key={t} className="pf-tag">{t}</span>
              ))}
            </div>
          )}
        </div>
        <div>
          <FieldLabel>대표 이미지</FieldLabel>
          <div className="flex items-center gap-3">
            {cover && <img src={cover} className="w-24 h-16 rounded object-cover border border-border-soft" alt="" />}
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                if (f.size > 1024 * 1024 && !confirm("1MB가 넘습니다. 계속할까요?")) return;
                setCover(await fileToDataUrl(f));
              }}
              className="text-sm"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-cobalt text-white rounded-lg px-4 py-2 font-medium hover:bg-cobalt-deep flex items-center gap-1.5">
            <Plus size={16} />
            {editing ? "수정" : "추가"}
          </button>
          {editing && (
            <button type="button" onClick={reset} className="border border-border-soft rounded-lg px-4 py-2 text-sm">
              취소
            </button>
          )}
        </div>
      </form>
      <div className="mt-6 grid md:grid-cols-2 gap-3">
        {projects.length === 0 && <div className="md:col-span-2"><EmptyAdmin /></div>}
        {projects.map((p) => (
          <div key={p.id} className="pf-card p-4 flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              {p.coverDataUrl && <img src={p.coverDataUrl} className="w-full h-32 object-cover rounded mb-2" alt="" />}
              <div className="font-semibold">{p.name}</div>
              <p className="text-sm text-slate-600">{p.summary}</p>
              {p.tech.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.tech.map((t) => <span key={t} className="pf-tag">{t}</span>)}
                </div>
              )}
            </div>
            <ItemActions onEdit={() => load(p)} onDelete={() => deleteProject(p.id)} />
          </div>
        ))}
      </div>
    </>
  );
}

function StudySection() {
  const { studies } = usePortfolio();
  const [editing, setEditing] = useState<StudyLog | null>(null);
  const [kind, setKind] = useState<StudyKind>("후기");
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [summary, setSummary] = useState("");
  const [review, setReview] = useState("");
  const [date, setDate] = useState("");

  const reset = () => {
    setEditing(null);
    setKind("후기");
    setTitle("");
    setSource("");
    setSummary("");
    setReview("");
    setDate("");
  };

  const load = (s: StudyLog) => {
    setEditing(s);
    setKind(s.kind);
    setTitle(s.title);
    setSource(s.source);
    setSummary(s.summary);
    setReview(s.review);
    setDate(s.date);
  };

  return (
    <>
      <h2 className="section-title">성과 · 후기 · 미디어</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const data = { id: editing?.id ?? uid(), kind, title, source, summary, review, date };
          if (editing) updateStudy(data);
          else addStudy(data);
          reset();
        }}
        className="pf-card p-6 space-y-4"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <FieldLabel>구분</FieldLabel>
            <select className={inputCls} value={kind} onChange={(e) => setKind(e.target.value as StudyKind)}>
              <option>후기</option>
              <option>성과</option>
              <option>미디어</option>
              <option>기타</option>
            </select>
          </div>
          <div>
            <FieldLabel>날짜</FieldLabel>
            <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <FieldLabel>제목</FieldLabel>
            <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <FieldLabel>출처 또는 참여자</FieldLabel>
            <input className={inputCls} value={source} onChange={(e) => setSource(e.target.value)} />
          </div>
        </div>
        <div>
          <FieldLabel>한줄 요약</FieldLabel>
          <input className={inputCls} value={summary} onChange={(e) => setSummary(e.target.value)} />
        </div>
        <div>
          <FieldLabel>상세 내용</FieldLabel>
          <textarea className={inputCls + " min-h-28"} value={review} onChange={(e) => setReview(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-cobalt text-white rounded-lg px-4 py-2 font-medium hover:bg-cobalt-deep flex items-center gap-1.5">
            <Plus size={16} />
            {editing ? "수정" : "추가"}
          </button>
          {editing && (
            <button type="button" onClick={reset} className="border border-border-soft rounded-lg px-4 py-2 text-sm">
              취소
            </button>
          )}
        </div>
      </form>
      <div className="mt-6 space-y-3">
        {studies.length === 0 && <EmptyAdmin />}
        {studies.map((s) => (
          <div key={s.id} className="pf-card p-4 flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="pf-tag">{s.kind}</span>
                <span className="text-xs text-slate-500">{s.date}</span>
              </div>
              <div className="font-semibold">{s.title}</div>
              <div className="text-sm text-slate-500">{s.source}</div>
              {s.summary && <p className="text-sm text-slate-600 mt-1">{s.summary}</p>}
            </div>
            <ItemActions onEdit={() => load(s)} onDelete={() => deleteStudy(s.id)} />
          </div>
        ))}
      </div>
    </>
  );
}

function EmptyAdmin() {
  return (
    <div className="pf-card p-6 text-center text-sm text-slate-500">아직 추가된 내용이 없어요</div>
  );
}
