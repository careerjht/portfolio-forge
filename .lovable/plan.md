# 포트폴리오 웹앱 구현 계획

요구사항이 매우 명확하므로 별도 디자인 옵션 없이 명세대로 구현합니다. 데이터는 모두 localStorage(이미지는 base64)로 저장하며 백엔드는 사용하지 않습니다.

## 라우트 구조 (TanStack Start)

```
src/routes/
  __root.tsx          (기존 유지, 메타만 업데이트)
  index.tsx           → /portfolio 로 리다이렉트
  admin.tsx           → /admin (비밀번호 게이트 + 관리자 레이아웃)
  portfolio.tsx       → /portfolio (공개 채용담당자 뷰)
```

`/admin`은 로컬 세션(sessionStorage) 기반 단순 비밀번호 게이트(0000). 명세대로 클라이언트 전용이며 실제 보안 목적이 아닙니다.

## 디자인 시스템 (src/styles.css)

`@theme`에 아래 토큰을 추가하여 Tailwind 유틸로 사용:
- `--color-cobalt: #2563EB`, `--color-cobalt-deep: #1D4ED8`, `--color-cobalt-soft: #EFF6FF`
- `--color-slate-bg: #F8FAFC`, `--color-border-soft: #E2E8F0`
- `--color-tag-bg: #F1F5F9`, `--color-tag-text: #475569`
- body 배경 → slate-bg, 카드 → 흰색 + 1px #E2E8F0 + radius 12px
- 폰트: `font-family: Inter, system-ui, sans-serif` (Google Fonts Inter는 `__root.tsx`의 head links로 로드)
- 섹션 타이틀 유틸 `.section-title` (uppercase, tracking-wider, 코발트, 하단 1.5px 라인)
- pill 배지/태그용 컴포넌트 클래스

## 데이터 레이어 (src/lib/portfolio-store.ts)

타입 정의 + localStorage CRUD 훅:
```ts
type Profile = { name; tagline; email; strengths: string[]; photoDataUrl?: string }
type Experience = { id; kind: '경력'|'학력'|'대외활동'; org; role; period; description }
type Project = { id; name; summary; details; tech: string[]; coverDataUrl?: string }
type StudyLog = { id; kind: '책'|'논문'|'강의'|'기타'; title; source; summary; review; date }
```
- `usePortfolioStore()` 훅: SSR 안전(`useEffect`로 초기 로드), `useSyncExternalStore`로 storage 이벤트 구독
- key: `portfolio:v1`

## 관리자 뷰 (/admin)

**비밀번호 게이트**
- 미인증 시: 코발트블루 풀스크린 배경, 중앙 흰 카드, 비밀번호 입력 + "입장" 버튼
- 0000 일치 시 `sessionStorage['admin-auth']='1'`

**인증 후 레이아웃**
- 상단 헤더: 좌측 "내 포트폴리오 관리", 우측 "포트폴리오 보기 →" (코발트 outline Link to /portfolio)
- 좌측 사이드바 (데스크톱): 4개 메뉴 (User, Briefcase, FolderKanban, BookOpen 아이콘 / lucide-react). 활성 메뉴 코발트 배경 + 흰 텍스트
- 모바일: 하단 고정 탭바로 전환 (4개 아이콘+텍스트)
- 우측: 활성 섹션 폼 + 카드 리스트

**4개 섹션 폼**
1. **기본 프로필** — 단일 객체. 항상 수정 모드. 사진 파일 input → FileReader로 base64 → 원형 미리보기. 강점 쉼표 입력 → pill 배지 실시간 렌더
2. **경험/학력** — 구분 드롭다운 + 입력 → 추가. 아래 카드 리스트 (수정/삭제 Pencil/Trash 아이콘)
3. **프로젝트** — 동일 패턴, 기술 쉼표 → 태그, 대표 이미지 업로드
4. **학습 기록** — 동일 패턴, 날짜 input[type=date]

각 카드: 흰 배경 + soft border, 우상단 수정/삭제 아이콘. 수정 클릭 시 폼에 값 로드(편집 모드).

## 채용담당자 뷰 (/portfolio)

**상단 네비바**: 좌측 "Portfolio" 코발트 로고 텍스트, 우측 "관리자로 이동" outline 버튼

**히어로**: 원형 64px 사진 + 이름(2xl bold) + tagline(muted) + 강점 pill 배지들 + Mail 아이콘 + 이메일

**섹션 1: 경험/학력**
- 탭: 전체 / 경력 / 학력 / 대외활동 (상태로 필터)
- 타임라인: 왼쪽 코발트 dot + 세로 라인 (`border-l-2 border-cobalt` + absolute dot)
- 각 항목: 기관명 bold + 직책 muted + 기간 우측 정렬 작게 + 설명

**섹션 2: 프로젝트**
- 데스크톱 2열 / 모바일 1열 그리드
- 카드: 대표 이미지 rounded-top + 이름 + 요약 + 태그
- 클릭 시 shadcn Dialog 모달로 상세 내용 표시

**섹션 3: 학습 기록**
- 탭: 전체 / 책 / 논문 / 강의
- 리스트: 좌측 아이콘 (BookOpen=책, FileText=논문, Video=강의, Sparkles=기타) + 제목 bold + 요약. 클릭 시 상세 펼침(Collapsible) 또는 모달

**푸터**: 이름 + 이메일 작게, "이 포트폴리오는 Lovable로 제작되었습니다"

**빈 상태**: 각 섹션 데이터 0건이면 "아직 추가된 내용이 없어요" 안내 카드

**Print 스타일**: `@media print`로 네비/관리자 버튼/모달 숨김, 카드 border 유지, 배경 흰색 강제, page-break-inside avoid

## 기술 메모

- 모든 색상은 토큰화 (`bg-cobalt`, `text-cobalt-deep`, `bg-cobalt-soft` 등) — 하드코딩 금지
- 이미지 업로드는 1MB 초과 시 경고(localStorage 용량 보호), base64 dataURL로 저장
- shadcn 컴포넌트 활용: Button, Input, Textarea, Select, Dialog, Tabs, Card, Badge
- lucide-react 아이콘 사용
- 모든 form은 zod + react-hook-form 없이 간단한 controlled state로 충분 (스펙 단순)
- SSR 안전: localStorage 접근은 항상 `useEffect`/이벤트 핸들러 내에서만

## 작업 순서

1. 디자인 토큰을 `src/styles.css`에 추가 + Inter 폰트 link
2. `src/lib/portfolio-store.ts` 데이터 레이어
3. `src/components/portfolio/` 하위 공통 컴포넌트 (SectionTitle, Pill, Tag, EmptyState, TimelineItem, ProjectCard, StudyItem)
4. `src/components/admin/` 하위 4개 폼 컴포넌트 + 사이드바/탭바
5. `src/routes/admin.tsx` (게이트 + 레이아웃)
6. `src/routes/portfolio.tsx` (공개 뷰 + print CSS)
7. `src/routes/index.tsx` → `/portfolio` 리다이렉트
8. 반응형 + print 미디어쿼리 마무리 확인
