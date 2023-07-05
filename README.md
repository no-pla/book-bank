# Book Bank
![Logo](https://github.com/no-pla/book-bank/assets/88391843/010e17e4-9e3d-451f-837f-1eab885bdfb7)

📚🏦 도서관에서 참여했던 독서 통장을 기억하시나요?
Book Bank에서 당신의 독서를 저금하세요!
Book Bank는 개인적인 독서 기록을 관리하고, 월별, 연도별 독서 기록을 차트로 볼 수 있는 사이트입니다.

## Authors
- [@no-pla](https://www.github.com/no-pla)


## Screenshots
<h3>로그인 화면</h3>

![screencapture-book-bank-alpha-vercel-app-login-2023-07-05-17_00_58](https://github.com/no-pla/book-bank/assets/88391843/96751d76-e634-451b-8dbd-6c9a71d32315)

<h3>회원가입 화면</h3>

![screencapture-book-bank-alpha-vercel-app-register-2023-07-05-17_01_17](https://github.com/no-pla/book-bank/assets/88391843/2102b88e-f2e3-4818-8c4d-2983ea7cf15e)

<h3>메인 화면</h3>

![screencapture-book-bank-alpha-vercel-app-2023-07-05-17_00_19](https://github.com/no-pla/book-bank/assets/88391843/cebd3cae-76e3-428b-8e3d-720f2ce642b3)

<h3>내역 화면</h3>

![screencapture-book-bank-alpha-vercel-app-banking-2023-07-05-15_22_05](https://github.com/no-pla/book-bank/assets/88391843/959d5ae7-0bce-4661-b23b-f81ff4df4f32)

<h3>입금 화면</h3>

![screencapture-book-bank-alpha-vercel-app-banking-deposit-2023-07-05-15_19_37](https://github.com/no-pla/book-bank/assets/88391843/210a0467-b556-4210-bcd8-85c3559fc4f7)
![screencapture-book-bank-alpha-vercel-app-banking-deposit-2023-07-05-15_21_01](https://github.com/no-pla/book-bank/assets/88391843/b24a8777-7e8f-4c18-bc7b-f556e9639018)

<h3>설정 화면</h3>

![screencapture-book-bank-alpha-vercel-app-user-setting-2023-07-05-15_22_47](https://github.com/no-pla/book-bank/assets/88391843/fac474cd-ecac-41cc-87ac-82780866ec5d)

<h3>모바일 화면</h3>

![F0QjUhRaQAAMqGc](https://github.com/no-pla/book-bank/assets/88391843/aa24184f-a89b-4543-a042-d3edd233eb68)
![F0QjCxLagAAiGkT](https://github.com/no-pla/book-bank/assets/88391843/36c7bf03-d85c-4317-8e25-d664dd26e42c)

<h3>독서 내역 공유</h3>

![F0Qj1C8aQAMxc7y](https://github.com/no-pla/book-bank/assets/88391843/bb039b68-1669-45df-bd6c-69194d11686c)

## Tech Stack

**Client:** React, Next.js, Recoil
**Server:** Firebase

## Features
- 카카오 도서 검색 REST API
- 리뷰 CRUD
- 이메일/비밀번호 로그인, 구글 OAuth
- 카카오톡 공유
- 이번 달 리뷰 차트, 년도별 리뷰 차트
- 최근 인기 키워드


## API Reference
| 화면          | HTTP Verbs | Endpoints                    | Action                        |
| ------------- | ---------- | ---------------------------- | ----------------------------- |
| 회원가입 | POST | /api/user/signup | 회원가입 |
| 로그인 | POST | /api/user/login | 가입된 유저가 로그인          |
| 메인 페이지 | GET | /api/monthlyKeywords/${keyword} | 최근 월에 맞는 키워드 출력 |
| 입금 페이지 | POST | /api/${cafeId}/review | 선택한 도서 후기를 작성 |
| 디테일 페이지 | GET | /api/v3/search/book/${keyword} | 키워드에 맞는 책 출력 |
| 디테일 페이지 | PATCH | /api/v3/search/book/${keyword} | 선택한 도서 후기를 수정 |
| 디테일 페이지 | DELETE | /api/v3/search/book/${keyword} | 선택한 도서 후기를 삭제 |
| 설정 페이지 | PATCH | /api/${userId} | 프로필 사진, 닉네임 수정 |
| 설정 페이지 | DELETE | /api/${userId} | 회원 탈퇴 |

## Color Reference

| Color             | Hex                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Main Color | ![#8067a9](https://via.placeholder.com/10/8067a9?text=+) #8067a9 |
| Sub Main Color | ![#bfb0d1](https://via.placeholder.com/10/bfb0d1?text=+) #bfb0d1 |
| Background Color | ![#faf9fb](https://via.placeholder.com/10/faf9fb?text=+) #faf9fb |
| Text Color | ![#161223](https://via.placeholder.com/10/161223?text=+) #161223 |
| Point Color 1 | ![#ff0000](https://via.placeholder.com/10/ff0000?text=+) #ff0000 |
| Point Color 2 | ![#3FA876](https://via.placeholder.com/10/3FA876?text=+) #3FA876 |


## 배포
https://book-bank-alpha.vercel.app
