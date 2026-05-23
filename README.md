
<div align="center">
    <a href="https://btech-buddy.vercel.app/">
        <h1>BtechBuddy</h1>
    </a>
    <p align="center">
        The open-source academic companion for GGSIPU students.
        <br />
        <a href="https://btech-buddy.vercel.app/">Website</a>
        ·
        <a href="https://github.com/govind-garg-web-dev/btech-buddy/issues">Feedback</a>
    </p>
</div>

---

# 🧭 Table of Contents

- [Introduction](#introduction)
- [Usage](#usage)
- [Local Development](#local-development)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

# Introduction

### Why BtechBuddy?

Hunting down syllabus PDFs, notes, and PYQs before every exam is a pain. BtechBuddy fixes that.

It's a single platform for B.Tech and BCA students at GGSIPU where you can find:

- **Syllabus** — for all branches and semesters
- **Handwritten Notes** — uploaded by students, for students
- **Previous Year Questions (PYQs)** — to know what actually shows up in exams
- **Books & Practical Files** — everything you need in one place
- **IPU Result Checker** — check your GGSIPU exam results directly
- **Datesheet Tracker** — add your exams and keep a countdown

All content is managed through a built-in admin panel and stored on Supabase.

---

# Usage

1. Visit [btech-buddy.vercel.app](https://btech-buddy.vercel.app/)
2. Select your course — **B.Tech** or **BCA**
3. Pick your semester and branch
4. Browse subjects — view the syllabus, notes, PYQs, books, and practical files
5. Use the **Result Checker** to fetch your GGSIPU exam result instantly

---

# Local Development

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- A [Supabase](https://supabase.com/) project

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/govind-garg-web-dev/btech-buddy.git
   cd btech-buddy
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

# Technologies Used

[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/docs)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-purple?style=for-the-badge)](https://ui.shadcn.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-2ea44f?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

# Features

- **Course Browser** — B.Tech (all branches) and BCA syllabi for GGSIPU
- **Study Materials** — Notes, PYQs, Books, and Lab files per subject
- **IPU Result Checker** — Fetches your result from the official GGSIPU exam portal
- **Datesheet Tracker** — Personal exam schedule with countdown
- **Theme Customizer** — Pick your color scheme and radius
- **Admin Panel** — Secure `/admin` panel to manage subjects and upload materials
- **Mobile Friendly** — Fully responsive across all screen sizes

---

# Contributing

Contributions are welcome! If you find a bug or have a feature idea, open an issue or submit a pull request.

Please write a clear PR description explaining what you changed and why. PRs that are vague or unrelated to the project may be closed.

---

# License

BtechBuddy is licensed under the [GPL License](./LICENSE).

---

# Support 🙏

If BtechBuddy helped you, consider starring the repository — it helps others find the project.

[![GitHub stars](https://img.shields.io/github/stars/govind-garg-web-dev/btech-buddy?style=social)](https://github.com/govind-garg-web-dev/btech-buddy/stargazers)
