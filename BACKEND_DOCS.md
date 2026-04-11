# Backend API Documentation

This document outlines the core backend API routes and expected payloads for the MentorFlow application, specifically focusing on Authentication and User Profiles.

## Authentication Routes

Base URL: `/api/auth` (depending on your environment mapping `BASE_API_URL`)

### 1. Register User
`POST /auth/register`

Creates a new user via Better-Auth and immediately associates them with a `StudentProfile` or `TutorProfile` based on the provided role.

**Request Body (JSON):**
- `name` (string, required)
- `email` (string, required)
- `password` (string, required)
- `role` (enum: `"STUDENT"` | `"TUTOR"`, required)
- `phone` (string, optional)
- `imgUrl` (string, optional) *Note: ImgUrl is mapped to `image` in Better-Auth user*.

**If Role == STUDENT:**
- `grade` (string, optional)
- `institution` (string, optional)
- `gender` (string, optional)
- `interests` (string, optional)

**If Role == TUTOR:**
- `bio` (string, optional)
- `price` (number, optional)
- `experience` (string, optional)
- `categoryId` (string, optional)
- `gender` (string, optional)
- `institution` (string, optional)

**Response:**
Returns `accessToken` (custom JWT), `refreshToken`, `sessionToken` (better-auth), and the full user object including relation properties (`studentProfile` / `tutorProfile`).

---

### 2. Login User
`POST /auth/sign-in/email`

Signs in the user using Better-Auth.

**Request Body (JSON):**
- `email` (string, required)
- `password` (string, required)

**Response:**
Returns `accessToken`, `refreshToken`, `sessionToken`, and core user data.

---

### 3. Logout
`POST /auth/logout`

Logs out the user. Needs `Authorization: Bearer <token>` and/or `x-session-token`.

---

## User Profile Routes

Base URL: `/api/my-profile`

### 1. Get My Profile
`GET /my-profile`

Fetches the currently authenticated user's data along with their associated role profile (`studentProfile` or `tutorProfile`). 

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
Returns User model fields. Includes nested `studentProfile` (if role is `STUDENT`) or `tutorProfile` (if role is `TUTOR`).

---

### 2. Update My Profile
`PATCH /my-profile`

Updates the authenticated user's general data and role-specific profile data.

**Request Body (JSON):**
*General Fields (apply to User table):*
- `name` (string)
- `phone` (string)
- `image` (string) *Warning: Send `image`, NOT `imgUrl`!*

*Role == STUDENT Fields (apply to StudentProfile):*
- `grade` (string)
- `interests` (string)
- `gender` (string)
- `institution` (string)

*Role == TUTOR Fields (apply to TutorProfile):*
- `bio` (string)
- `price` (number)
- `experience` (string)
- `categoryId` (string)
- `gender` (string)
- `institution` (string)

**Response:**
Returns the updated user object with their respective nested role-profile.