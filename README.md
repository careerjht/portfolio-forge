# Portfolio Forge

[프롬프트 샘플]

포트폴리오 웹앱을 만들어줘. 두 개의 뷰로 구성돼.

---

## 디자인 시스템 (전체 공통)

포인트 컬러: 코발트블루 (#2563EB)

배경: 연한 슬레이트 (#F8FAFC)

카드 배경: 흰색, 테두리 1px solid #E2E8F0, border-radius 12px

폰트: Inter 또는 system-ui, sans-serif

섹션 타이틀: 대문자 + 자간 넓게, 코발트블루, 하단에 1.5px 코발트블루 라인

배지: #EFF6FF 배경, #1D4ED8 텍스트, 둥근 pill 형태

태그: #F1F5F9 배경, #475569 텍스트

전체적으로 미니멀하고 세련된 느낌. 그림자보다 얇은 border로 구분.

불필요한 장식 없이 여백을 넉넉하게.

---

## 1. 관리자 뷰 (/admin)

접속 시 비밀번호 입력 화면 먼저 나와. 비밀번호: 0000

배경은 코발트블루, 중앙에 흰 카드로 입력창. 심플하게.

인증 후 레이아웃:

- 상단 헤더: "내 포트폴리오 관리" 타이틀 + 우측에 "포트폴리오 보기 →" 버튼 (코발트블루 outline)

- 왼쪽 사이드바: 4개 메뉴 아이콘+텍스트로 구성. 선택된 메뉴는 코발트블루 배경 흰 텍스트

- 오른쪽: 선택된 메뉴의 입력 폼




사이드바 메뉴 4개:

- 기본 프로필

- 경험 / 학력

- 프로젝트

- 학습 기록

각 폼은 카드 안에 들어가고, 저장하면 하단에 카드 리스트로 쌓여.

카드마다 수정 / 삭제 아이콘 버튼.

데이터는 localStorage에 저장해서 새로고침해도 유지.

입력 필드 상세:

[기본 프로필] — 단 하나만 존재, 수정만 가능

- 이름

- 한줄 소개

- 이메일

- 강점 키워드 (쉼표 입력 → pill 배지로 렌더링)

- 프로필 사진 업로드 (원형 미리보기)

[경험 / 학력]

- 구분 드롭다운: 경력 / 학력 / 대외활동

- 기관명

- 직책 또는 전공

- 기간 (예: 2022.03 ~ 2024.02)

- 상세 설명 (textarea)

[프로젝트]

- 프로젝트명

- 한줄 설명

- 상세 내용 (textarea)

- 사용 기술 키워드 (쉼표 → pill 태그)

- 대표 이미지 업로드




[학습 기록]

- 구분 드롭다운: 책 / 논문 / 강의 / 기타

- 제목

- 저자 또는 출처

- 한줄 요약

- 상세 서평 (textarea)

- 날짜

---

## 2. 채용담당자 뷰 (/portfolio)

누구나 접근 가능. 관리자 뷰의 localStorage 데이터를 그대로 불러와 렌더링.

상단 네비바:

- 좌측: "Portfolio" 로고 텍스트 (코발트블루)

- 우측: "관리자로 이동" 버튼 (outline, 작게)

히어로 섹션 (상단):

- 프로필 사진 (원형, 64px)

- 이름 (크게, 굵게)

- 한줄 소개 (회색 muted)

- 강점 키워드 pill 배지들 (코발트블루 계열)

- 이메일 아이콘 + 텍스트

섹션 1: 경험 / 학력

- 상단에 탭: 전체 / 경력 / 학력 / 대외활동

- 타임라인 형태: 왼쪽에 코발트블루 dot + 세로선

- 각 항목: 기관명(굵게) + 직책/전공(회색) + 기간(우측 정렬, 작게) + 설명

섹션 2: 프로젝트

- 2열 카드 그리드

- 각 카드: 대표 이미지(상단, rounded) + 프로젝트명 + 한줄 설명 + 기술 태그

- 카드 클릭 시 상세 모달 팝업 (상세 내용 전체 표시)

섹션 3: 학습 기록

- 탭으로 구분: 전체 / 책 / 논문 / 강의

- 리스트 형태: 좌측 아이콘(책=파란 북아이콘, 논문=문서아이콘) + 제목(굵게) + 한줄 요약

하단 푸터:

- 이름 + 이메일 작게

- "이 포트폴리오는 Lovable로 제작되었습니다" 문구

---

## 공통 조건

- 모바일 반응형 (사이드바는 모바일에서 하단 탭바로 전환)

- 모든 섹션 데이터가 없을 땐 "아직 추가된 내용이 없어요" 안내 문구 표시

- 채용담당자 뷰 인쇄 시 깔끔하게 (print media query 적용)

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/484a1ee1-903e-4ec3-a1c8-c203a2c4603a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
