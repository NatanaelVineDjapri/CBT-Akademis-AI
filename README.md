# 🎓 CBT Akademis AI
**CBT Akademis** is a web-based Computer Based Test platform that enables educational institutions to conduct exams online, covering question bank management, exam scheduling, automated grading, and real-time proctoring.

> 🧩 Designed to be scalable, modular, and easily extendable for future development.

---

<p align="center">
  <marquee behavior="scroll" direction="left" scrollamount="5">
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" />
    <img src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" />
    <img src="https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white" />
    <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
    <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" />
    <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
    <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  </marquee>
</p>
<p align="center">
  <marquee behavior="scroll" direction="right" scrollamount="5">
    <img src="https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white" />
    <img src="https://img.shields.io/badge/MediaPipe-0097A7?style=for-the-badge&logo=google&logoColor=white" />
    <img src="https://img.shields.io/badge/Groq_LLM-F55036?style=for-the-badge&logo=meta&logoColor=white" />
    <img src="https://img.shields.io/badge/Pusher-300D4F?style=for-the-badge&logo=pusher&logoColor=white" />
    <img src="https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=webrtc&logoColor=white" />
    <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" />
    <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white" />
    <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
    <img src="https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white" />
    <img src="https://img.shields.io/badge/Let's_Encrypt-003A70?style=for-the-badge&logo=letsencrypt&logoColor=white" />
  </marquee>
</p>

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
git clone https://github.com/NatanaelVineDjapri/CBT-Akademis-AI.git
cd CBT-Akademis-AI
```

### 🧱 Step 2 — Setup Backend (Laravel)

```bash
cd Backend
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
cd Frontend
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

### 🤖 Step 4 — Setup Proctoring Service (Python)

```bash
cd Proctoring-services
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

```bash
python main.py
```

The AI proctoring WebSocket server runs on http://localhost:8001.
Make sure the frontend `.env.local` points to it:

```env
NEXT_PUBLIC_PROCTORING_WS_URL=ws://localhost:8001
```

---

## 📁 Project Structure

```
CBT-Akademis-AI/
├── Backend/                      # Laravel REST API
│   ├── app/                      # Models, Controllers, Events
│   ├── routes/                   # API routes
│   ├── database/                 # Migrations & seeders
│   └── config/                   # App configuration
│
├── Frontend/                     # Next.js App (React + TypeScript + Tailwind)
│   ├── app/                      # App Router pages (per role)
│   ├── components/               # Shared & dashboard components
│   ├── services/                 # API client services
│   ├── hooks/ · context/         # SWR hooks & global state
│   ├── lib/ · utils/             # Echo, ICE servers, formatters
│   └── public/                   # Static assets
│
└── Proctoring-services/          # Python AI proctoring (FastAPI + OpenCV DNN)
    ├── main.py                   # WebSocket server (analisis frame)
    ├── detector.py               # Logika deteksi wajah
    └── face_detector.caffemodel  # Model Caffe pretrained
```
