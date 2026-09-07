import { useSyncExternalStore } from "react";

export type Profile = {
  name: string;
  tagline: string;
  email: string;
  strengths: string[];
  photoDataUrl?: string;
};

export type ExperienceKind = "경력" | "학력" | "대외활동";
export type Experience = {
  id: string;
  kind: ExperienceKind;
  org: string;
  role: string;
  period: string;
  description: string;
};

export type Project = {
  id: string;
  name: string;
  summary: string;
  details: string;
  tech: string[];
  coverDataUrl?: string;
};

export type StudyKind = "후기" | "성과" | "미디어" | "기타";
export type StudyLog = {
  id: string;
  kind: StudyKind;
  title: string;
  source: string;
  summary: string;
  review: string;
  date: string;
};

export type PortfolioData = {
  profile: Profile;
  experiences: Experience[];
  projects: Project[];
  studies: StudyLog[];
};

const KEY = "portfolio:v2";

const e = (kind: ExperienceKind, org: string, role: string, period: string, description: string): Experience => ({
  id: `${kind}-${org}-${role}`.replace(/\s/g, ""),
  kind,
  org,
  role,
  period,
  description,
});

const empty: PortfolioData = {
  profile: {
    name: "정현태",
    tagline: "진로 방향을 제시하는 커리어 컨설턴트",
    email: "gkdl1545@kakao.com",
    strengths: [
      "맞춤형 취업 전략",
      "NCS 기반 직무 분석",
      "실전 면접 코칭",
      "직업상담사 2급",
      "사회복지사 1급",
      "MBTI · STRONG · BIRKMAN",
    ],
  },
  experiences: [
    e("경력", "(사)한국고용협회", "국민취업지원제도 상담사", "前", "국민취업지원제도 참여자 대상 심층 상담 및 취업 지원 서비스 제공"),
    e("경력", "커리어넷 대체인력뱅크", "파트장 & 취업 컨설턴트", "前", "구직자 취업 컨설팅 총괄 및 대체인력 매칭 업무 수행"),
    e(
      "경력",
      "공공기관 서류전형 심사위원",
      "심사위원",
      "상시",
      "한국동서발전, 한국승강기안전공단, 노사발전재단, 직업능력심사평가원 외 다수",
    ),
    e(
      "대외활동",
      "여성새로일하기센터",
      "직업상담사 양성과정 강사 및 면접관",
      "상시",
      "직업상담사 양성과정 강의 진행 및 모의면접 면접관 참여",
    ),
    e(
      "대외활동",
      "취업박람회 컨설팅",
      "전문 상담사",
      "상시",
      "KB굿잡 취업박람회, 동남권 일자리 박람회, 공공데이터 청년인턴, 전역예정장병 취업박람회",
    ),
    e("대외활동", "지역카페 진로탐색 프로그램", "프로그램 강사", "상시", "지역 주민 대상 진로탐색 및 NCS 기반 입사지원서 작성 교육 운영"),
    e("학력", "심리검사 전문가 과정", "MBTI · Strong · Birkman", "이수", "전문 심리검사 해석 및 상담 활용 과정 이수"),
  ],
  projects: [
    {
      id: "lecture-job-analysis",
      name: "강의 01. 직무분석 및 탐색",
      summary: "직업 vs 직무 vs 업(業)의 이해 — 막연한 취업 준비에서 벗어나는 명확한 방향 설정",
      tech: ["NCS", "KSA 분석", "워크넷", "고용24", "ChatGPT"],
      details:
        "[산업 및 업종 분석]\n· 산업분류: 산업의 정의와 분류 체계 이해\n· 업(業)의 본질: 가치를 만드는 기업과 조직의 목표 파악\n· 정보 수집: 산업연구원, 협회 자료 등 공신력 있는 소스 활용법\n\n[NCS 기반 직무 이해]\n· 직무 vs 과업: 직무를 구성하는 구체적 과업(Task) 단위 분해\n· 핵심 역량 도출: NCS 직무기술서를 통한 K(지식)·S(기술)·A(태도) 정의\n· Gap 분석: 필요 역량과 보유 역량 간 차이 분석 및 보완 전략\n\n[AI 활용 스마트 탐색]\n· 프롬프트 활용: ChatGPT를 활용한 직무 역량 키워드 추출\n· 직무 시뮬레이션: AI 문답을 통한 직무 간접 체험\n· 고용24 활용: 직업정보 및 관련 직업, 전직 가능성 탐색",
    },
    {
      id: "lecture-documents",
      name: "강의 02. 역량중심 서류작성",
      summary: "나의 경험을 '역량'으로 증명하라 — 구조화된 글쓰기로 가독성과 설득력 높이기",
      tech: ["CAR 기법", "NCS 입사지원서", "자기소개서", "프로젝트 기술서"],
      details:
        "[CAR 기법 마스터]\n· Context(상황): 당시 처했던 문제 상황과 배경 설명\n· Action(행동): 문제 해결을 위해 내가 취한 주도적이고 구체적인 행동 — 핵심!\n· Result(결과): 정량적(수치), 정성적(배운 점) 성과 도출\n\n[프로젝트 기술서 작성]\n· 기획 의도: 요구사항 및 문제점 인식\n· 본인 역할: 팀 내 역할 분담 및 기여도(%)\n· 수행 내용: 구체적인 사용 기술 및 프로세스\n· 주요 성과: Before & After 비교, 수상 실적",
    },
    {
      id: "lecture-consulting",
      name: "강의 03. 커리어 컨설팅",
      summary: "데이터 기반 진로 설계 — 전문 심리검사로 강점과 흥미를 객관적으로 분석",
      tech: ["MBTI", "STRONG", "BIRKMAN", "커리어 로드맵"],
      details:
        "[1. 정밀 진단 — 객관적 자기 이해]\n· MBTI: 선호 경향성 및 성격 유형 파악\n· STRONG: 직업 흥미 및 업무 스타일 분석\n· BIRKMAN: 대인관계 방식 및 스트레스 요인 진단\n\n[2. 강점 발굴 — 잠재력의 재발견]\n검사 결과 해석 상담을 통해 본인도 몰랐던 강점을 언어화하고, 지원 희망 직무와의 적합성을 매칭합니다.\n\n[3. 미래 설계 — Action Plan 수립]\n분석된 데이터를 토대로 단기(자격증·경험), 중기(인턴), 장기(최종 목표) 커리어 로드맵을 구체적으로 설계합니다.",
    },
  ],
  studies: [
    {
      id: "result-satisfaction",
      kind: "성과",
      title: "강의 만족도 평균 97% 이상",
      source: "2024~2025년 진행 프로그램 만족도 조사 (한국고용협회 외)",
      summary: "프로그램 유익성 99% · 강사의 전문성 98% · 구직활동 도움 96% · 전반적 만족도 97%",
      review:
        "다수의 취업 특강 및 프로그램 진행 결과, 평균 97% 이상의 높은 만족도를 기록했습니다.\n\n· 프로그램 유익성 99%\n· 강사의 전문성 98%\n· 구직활동 도움 96%\n· 전반적 만족도 97%",
      date: "2025",
    },
    {
      id: "media-kbgoodjob",
      kind: "미디어",
      title: "KB굿잡 우수기업 취업박람회 성료 — \"구직자 맞춤형 솔루션 제공\"",
      source: "글로컬경제 보도자료 · 2025.05.27",
      summary: "코엑스 KB굿잡 취업박람회 전문 상담사 참여, 구직자 대상 실질적 취업 전략 제시",
      review:
        "지난 5월 코엑스에서 개최된 'KB굿잡 취업박람회'에서 정현태 컨설턴트는 전문 상담사로 참여하여 구직자들에게 실질적인 취업 전략을 제시했습니다.\n\n· AI 자소서 클리닉: 최신 트렌드를 반영한 이력서 분석 및 첨삭\n· 직업카드(Career Card): 게임 요소를 결합한 즐거운 진로 탐색\n· 국민취업지원제도: 정부 지원 프로그램 연계 심층 상담",
      date: "2025-05-27",
    },
    {
      id: "review-a",
      kind: "후기",
      title: "\"취업 준비의 방향이 잡히는 느낌입니다\"",
      source: "취업특강 참여자 A",
      summary: "강사님의 열정적인 강의 감사합니다! 오늘 알게 된 채용정보 사이트가 정말 큰 도움이 되었습니다.",
      review: "\"강사님의 열정적인 강의 감사합니다! 오늘 알게 된 채용정보 사이트가 정말 큰 도움이 되었습니다. 취업 준비의 방향이 잡히는 느낌입니다.\"",
      date: "",
    },
    {
      id: "review-b",
      kind: "후기",
      title: "\"사례 위주의 설명과 실습이 있어서 이해하기 쉬웠습니다\"",
      source: "직무역량 교육 수강생 B",
      summary: "특히 CAR 기법으로 자기소개서를 직접 작성해보는 시간이 유익했습니다.",
      review: "\"사례 위주의 설명과 실습이 있어서 이해하기 쉬웠습니다. 특히 CAR 기법으로 자기소개서를 직접 작성해보는 시간이 유익했습니다.\"",
      date: "",
    },
    {
      id: "review-c",
      kind: "후기",
      title: "\"막막했던 진로 계획이 명확해졌습니다\"",
      source: "커리어 컨설팅 참여자 C",
      summary: "STRONG 검사 해석을 통해 제가 진짜 좋아하는 것이 무엇인지 확신을 얻었습니다.",
      review: "\"STRONG 검사 해석을 통해 제가 진짜 좋아하는 것이 무엇인지 확신을 얻었습니다. 막막했던 진로 계획이 명확해졌습니다.\"",
      date: "",
    },
  ],
};

function read(): PortfolioData {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw);
    return { ...empty, ...parsed, profile: { ...empty.profile, ...parsed.profile } };
  } catch {
    return empty;
  }
}

const listeners = new Set<() => void>();
let cache: PortfolioData | null = null;

function getSnapshot(): PortfolioData {
  if (cache === null) cache = read();
  return cache;
}

function getServerSnapshot(): PortfolioData {
  return empty;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = read();
      listeners.forEach((l) => l());
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function write(next: PortfolioData) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch (e) {
    console.error("localStorage write failed", e);
  }
  listeners.forEach((l) => l());
}

export function usePortfolio(): PortfolioData {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function updateProfile(p: Profile) {
  write({ ...getSnapshot(), profile: p });
}

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function addExperience(e: Experience) {
  const s = getSnapshot();
  write({ ...s, experiences: [...s.experiences, e] });
}
export function updateExperience(e: Experience) {
  const s = getSnapshot();
  write({ ...s, experiences: s.experiences.map((x) => (x.id === e.id ? e : x)) });
}
export function deleteExperience(id: string) {
  const s = getSnapshot();
  write({ ...s, experiences: s.experiences.filter((x) => x.id !== id) });
}

export function addProject(p: Project) {
  const s = getSnapshot();
  write({ ...s, projects: [...s.projects, p] });
}
export function updateProject(p: Project) {
  const s = getSnapshot();
  write({ ...s, projects: s.projects.map((x) => (x.id === p.id ? p : x)) });
}
export function deleteProject(id: string) {
  const s = getSnapshot();
  write({ ...s, projects: s.projects.filter((x) => x.id !== id) });
}

export function addStudy(x: StudyLog) {
  const s = getSnapshot();
  write({ ...s, studies: [...s.studies, x] });
}
export function updateStudy(x: StudyLog) {
  const s = getSnapshot();
  write({ ...s, studies: s.studies.map((y) => (y.id === x.id ? x : y)) });
}
export function deleteStudy(id: string) {
  const s = getSnapshot();
  write({ ...s, studies: s.studies.filter((y) => y.id !== id) });
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
