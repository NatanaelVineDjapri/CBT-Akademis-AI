# 🎓 CBT Akademis
**CBT Akademis** is a web-based Computer Based Test platform that enables educational institutions to conduct exams online, covering question bank management, exam scheduling, automated grading, and real-time proctoring.

> 🧩 Designed to be scalable, modular, and easily extendable for future development.

---

![Laravel](https://img.shields.io/badge/laravel-E34F26?style=for-the-badge&logo=laravel&logoColor=white)
![Next.js](https://img.shields.io/badge/nextjs-000000?style=for-the-badge&logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

---

## 📖 Background

<p align="justify">CBT serves as a centralized exam engine integrated with the Academic System, Learning Management System (LMS), and PMB System, built to provide a secure, scalable, and automated digital examination experience.</p>

**🎯 Goals**

1. Provide a secure and scalable digital examination system
2. Simplify exam creation and management for lecturers and administrators
3. Reduce cheating potential through AI proctoring
4. Automate the grading and scoring process
5. Integrate exam results into the academic system and LMS

---

## ✨ Features

**1. 📚 Bank Soal**
<blockquote>Manage question banks with support for multiple choice, checklist, and essay types, media attachments, permission settings, and AI-powered question generation.</blockquote>

**2. 📅 Exam Scheduling**
<blockquote>Create exams with configurable type, duration, randomization, attempts, passing grade, sections, and proctoring activation.</blockquote>

**3. ⚙️ Exam Configuration**
<blockquote>Map question banks to exams and configure how questions are presented, shuffled, and evaluated.</blockquote>

**4. 🖥️ Exam Portal**
<blockquote>Participant interface with navigation panel, auto save, resume on disconnect, and warning time. Supports answer review and result viewing post-exam.</blockquote>

**5. 📊 Exam Results**
<blockquote>Automatic grading for objective questions, manual grading for essays, and final score calculation with result reports.</blockquote>

**6. 🤖 AI Proctoring**
<blockquote>Real-time detection of tab switching, multiple faces, copy-paste, and fullscreen violations. Each infraction is logged and assigned a risk score.</blockquote>

**7. 📈 Monitoring Dashboard**
<blockquote>Real-time overview of active exams, participant status, and proctoring activity for administrators.</blockquote>

---

## 🗺️ System Architecture

<p align="center">
  <img src="assets/Requirement CBT.jpg" alt="CBT Schema" width="700"/>
</p>

---

## 👨‍💻 Team Members

| No | Name                     | NIM       |
|----|--------------------------|-----------|
| 1  | Claudio Taffarel Santoso | 535240035 |
| 2  | Natanael Vine Djapri     | 535240042 |
| 3  | Ryan Prasetya Arjuna A.  | 535240043 |
| 4  | Devin Giovano            | 535240057 |
| 5  | Edbert Halim             | 535240059 |

---

## ⚙️ Installation & Setup Guide

### 🔧 Step 1 — Clone the Repository

```bash
git clone https://github.com/NatanaelVineDjapri/cbt-akademis.git
cd cbt-akademis
```

### 🧱 Step 2 — Setup Backend (Laravel)

```bash
cd BackEnd
composer install
cp .env.example .env
php artisan key:generate
```

Edit `.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=cbt_akademis
DB_USERNAME=postgres
DB_PASSWORD=
```

```bash
php artisan migrate --seed
php artisan serve
```

### 📱 Step 3 — Setup Frontend (Next.js)

```bash
cd FrontEnd
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

```bash
npm run dev
```

Open http://localhost:3000

---

## 🔐 Default Credentials (Seeder)

**Password for all accounts:** `password123`

| Role             | Email                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| Academic Admin   | [admin@akademis.ai](mailto:admin@akademis.ai)                                                   |
| University Admin | [admin@untar.ac.id](mailto:admin@untar.ac.id)                                                   |
| Lecturer         | [irvan.lewenusa@untar.ac.id](mailto:irvan.lewenusa@untar.ac.id)                                 |
| Student          | [agus.santoso.535210001@student.untar.ac.id](mailto:agus.santoso.535210001@student.untar.ac.id) |


---

## 📁 Project Structure

```
cbt-akademis/
├── BackEnd/       # Laravel REST API
└── FrontEnd/      # Next.js App
```
