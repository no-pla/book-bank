# Book Bank
![Logo](https://github.com/no-pla/book-bank/assets/88391843/010e17e4-9e3d-451f-837f-1eab885bdfb7)


## Authors
- [@no-pla](https://www.github.com/no-pla)


## Screenshots
로그인 화면
![스크린샷 2023-05-27 오후 5 28 25](https://github.com/no-pla/book-bank/assets/88391843/027fd1a3-f401-433f-9d32-7b6741437eaf)

회원가입 화면
![스크린샷 2023-05-27 오후 5 28 48](https://github.com/no-pla/book-bank/assets/88391843/7774c364-5045-4f33-8740-6643506e478b)

메인 화면
![스크린샷 2023-05-27 오후 5 01 56](https://github.com/no-pla/book-bank/assets/88391843/2fd2a8f0-5ef8-4c47-be59-1408695f6adb)

내역 화면
![스크린샷 2023-05-27 오후 5 02 21](https://github.com/no-pla/book-bank/assets/88391843/fceac5d7-39f1-4467-97d0-744913f2894a)

입금 화면
![스크린샷 2023-05-27 오후 5 03 06](https://github.com/no-pla/book-bank/assets/88391843/0084c21e-a9b3-4854-b840-22a02526bf32)
![스크린샷 2023-05-27 오후 5 03 17](https://github.com/no-pla/book-bank/assets/88391843/b29b587f-df92-4c06-990a-144ca8e54fef)

설정 화면
![스크린샷 2023-05-27 오후 5 02 07](https://github.com/no-pla/book-bank/assets/88391843/49554ff4-ff8c-4f3e-8bc0-9272371643bb)

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
