# 🎓 SmartAttendance Portal

> **Full-Stack Student Attendance Management, Faculty Allocation & Real-Time Cloud Sheet Synchronization**

SmartAttendance Portal is a modern, responsive, and robust attendance management platform designed for academic institutions, universities, and colleges. It bridges fast client-side attendance taking with enterprise-grade backend persistence and automated cloud synchronization to **Google Sheets** and **Microsoft Excel (.xlsx)**.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack Breakdown](#-technology-stack-breakdown)
- [Architectural Diagrams](#-architectural-diagrams)
  - [1. High-Level System Architecture](#1-high-level-system-architecture)
  - [2. Database Entity-Relationship Diagram (ERD)](#2-database-entity-relationship-diagram-erd)
  - [3. Attendance & Cloud Sync Sequence Flow](#3-attendance--cloud-sync-sequence-flow)
- [Project Directory Structure](#-project-directory-structure)
- [Backend REST API Specification](#-backend-rest-api-specification)
- [Google Sheets Sync Integration](#-google-sheets-sync-integration)
- [Getting Started & Local Setup](#-getting-started--local-setup)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup (React + Vite)](#frontend-setup-react--vite)
  - [Backend Setup (Django REST Framework)](#backend-setup-django-rest-framework)
- [Database Configuration](#-database-configuration)
- [Environment Variables](#-environment-variables)
- [License](#-license)

---

## 🚀 Overview

Tracking student attendance manually or with disjointed spreadsheets causes delays, data loss, and reporting bottlenecks. **SmartAttendance Portal** delivers an integrated, two-way ecosystem:

1. **Faculty & Administrators** can manage student rosters, assign courses to faculty members, and conduct daily roll calls in seconds.
2. **Attendance Records** are computed dynamically into attendance percentages, multi-date attendance matrices, and summary analytics.
3. **Automated Cloud Sync** instantly writes attendance sessions to remote Google Sheets via Google Apps Script webhooks, while also supporting offline-ready local storage and single-click Excel export.

---

## ✨ Key Features

- **⚡ Fast Roll Call Interface**:
  - Filter by Department, Batch, Section, Course, and Date.
  - Quick-toggle actions: *Mark All Present*, *Mark All Absent*, *Clear*.
  - Four attendance statuses: **Present**, **Absent**, **Late** (with partial credit calculation), and **Excused**.
  - Student-specific remarks for leave notes or remarks.

- **📊 Master Attendance Matrix (Live Excel View)**:
  - Interactive grid displaying all enrolled students alongside historical session dates.
  - Dynamically calculated metrics: *Total Classes*, *Attended Classes*, and *Attendance Percentage*.
  - Color-coded badges for quick identification of irregular attendance.

- **📥 Bulk Roster Import & Export**:
  - Drag-and-drop Excel (`.xlsx`) import for rapid student onboarding.
  - Auto-validation of student roll numbers, batch, section, and contact info.
  - Download standardized roster templates and export full attendance sheets.

- **👨‍🏫 Faculty Assignment Matrix**:
  - Manage faculty profiles and employee credentials.
  - Map teachers to specific academic courses, departments, batches, and sections.

- **☁️ Real-Time Google Sheets Webhook Sync**:
  - Zero-cost, serverless live sync directly into Google Spreadsheets using Google Apps Script.
  - Built-in script lock handling for concurrency control.

- **🗄️ Multi-Database Backend Architecture**:
  - Built with Django REST Framework.
  - Plug-and-play support for **Neon Tech Serverless PostgreSQL**, **Supabase**, **Standard PostgreSQL**, or **SQLite3**.

---

## 🛠️ Technology Stack Breakdown

The system is architected as a decoupled frontend SPA and a Python REST API backend, with cloud spreadsheet integration.

### Frontend (Client-Side Application)
| Technology | Version | Purpose & Rationale |
| :--- | :--- | :--- |
| **React** | `19.0.1` | Component-based UI library providing declarative rendering, state encapsulation, and smooth view transitions. |
| **TypeScript** | `7.0.2` | End-to-end type safety across domain models (`Student`, `Teacher`, `AttendanceSession`, `GoogleSheetsConfig`). |
| **Vite** | `8.3.0` | Ultra-fast development server with instant Hot Module Replacement (HMR) and optimized ES module bundling. |
| **Tailwind CSS** | `4.3.3` | Modern utility-first CSS framework providing responsive layouts, dark/light tones, and clean design tokens. |
| **Lucide React** | `0.546.0` | Crisp, accessible icon system for navigational elements, badges, and controls. |
| **Motion** | `12.23.24` | Fluid animations, card reveals, and interactive state feedback. |
| **SheetJS (xlsx)** | `0.18.5` | Browser-side spreadsheet parsing and Excel generation without needing round-trips to the server. |
| **Context API & LocalStorage** | Native | Provides seamless offline-first capability; sessions and rosters persist locally even before remote sync. |

### Backend (RESTful Web Service)
| Technology | Version | Purpose & Rationale |
| :--- | :--- | :--- |
| **Python** | `>= 3.10` | Robust, expressive language for academic and web application backends. |
| **Django** | `>= 4.2, < 5.1` | High-level Python web framework providing ORM, migrations, authentication, and admin panel. |
| **Django REST Framework (DRF)** | `>= 3.14.0` | Serializers, ViewSets, and routers for exposing clean, versionable JSON REST endpoints. |
| **django-cors-headers** | `>= 4.3.0` | Configures Cross-Origin Resource Sharing (CORS) headers for secure frontend-backend communication. |
| **dj-database-url** | `>= 2.1.0` | 12-factor application database configuration via `DATABASE_URL` connection strings. |
| **psycopg2-binary** | `>= 2.9.9` | Production-grade PostgreSQL database adapter for Python. |
| **openpyxl** | `>= 3.1.2` | Python library to read and generate styled `.xlsx` files directly from the server. |
| **Requests** | `>= 2.31.0` | Synchronous HTTP client to dispatch webhook payloads to Google Apps Script. |
| **Gunicorn** | `>= 21.2.0` | Production WSGI HTTP server for containerized and cloud deployments. |

### External Services & Cloud Platforms
- **Neon Tech**: Serverless PostgreSQL with auto-suspend and connection pooling.
- **Supabase**: Cloud PostgreSQL alternative with built-in role policies.
- **Google Apps Script**: Serverless HTTP endpoint hosted within Google Drive to append rows directly into Google Sheets.

---

## 📐 Architectural Diagrams

### 1. High-Level System Architecture

```mermaid
flowchart TB
    subgraph ClientLayer["🖥️ Frontend Client (React 19 + TypeScript + Vite)"]
        UI["Tailwind CSS UI Views\n(Dashboard, Attendance, Sheet, Students, Teachers)"]
        State["React Context API\n(AttendanceContext)"]
        Storage["Browser LocalStorage\n(storageService)"]
        ClientXLSX["SheetJS Engine\n(excelSyncService)"]
        UI <--> State
        State <--> Storage
        State --> ClientXLSX
    end

    subgraph APILayer["⚙️ Backend Service (Django REST Framework)"]
        CORS["CORS Middleware\n(django-cors-headers)"]
        Routers["DRF ViewSets & Routers\n(/api/students, /api/teachers, /api/sessions)"]
        Serializers["DRF Serializers & Validation"]
        Models["Django ORM Models"]
        ExcelSvc["Server-Side Excel Generator\n(openpyxl)"]
        CORS --> Routers
        Routers --> Serializers
        Serializers --> Models
        Routers --> ExcelSvc
    end

    subgraph DataLayer["🗄️ Relational Database"]
        direction TB
        DB_Switch{"DATABASE_URL Switcher"}
        Neon[("Neon Tech PostgreSQL\n(Serverless Pooler)")]
        Supabase[("Supabase PostgreSQL")]
        LocalPG[("Local PostgreSQL")]
        SQLite[("SQLite3 (Demo)")]
        DB_Switch --> Neon
        DB_Switch --> Supabase
        DB_Switch --> LocalPG
        DB_Switch --> SQLite
    end

    subgraph CloudLayer["☁️ Cloud Sync & External Integrations"]
        GAS["Google Apps Script Webhook\n(doPost Handler)"]
        GSheet[("Google Sheets\n(Spreadsheet Rows)")]
        XLSXFile[("Exported .xlsx Workbook")]
        GAS --> GSheet
    end

    %% Client to Backend
    State -->|"HTTP REST API (JSON)"| CORS

    %% Client to Cloud
    State -->|"Direct HTTP POST Webhook"| GAS
    ClientXLSX -->|"Direct Download"| XLSXFile

    %% Backend to Data & Cloud
    Models <--> DB_Switch
    Routers -->|"Relay Sync Webhook"| GAS
    ExcelSvc -->|"Binary Stream (.xlsx)"| XLSXFile
```

---

### 2. Database Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    DEPARTMENT ||--o{ COURSE : "offers"
    DEPARTMENT ||--o{ STUDENT : "enrolls"
    DEPARTMENT ||--o{ TEACHER : "employs"
    TEACHER ||--o{ TEACHER_ASSIGNMENT : "assigned_to"
    TEACHER ||--o{ ATTENDANCE_SESSION : "conducts"
    ATTENDANCE_SESSION ||--|{ ATTENDANCE_RECORD : "contains"
    STUDENT ||--o{ ATTENDANCE_RECORD : "has_status_in"

    DEPARTMENT {
        int id PK
        string name "unique"
        string code "unique"
    }

    COURSE {
        int id PK
        string code "unique"
        string name
        string department
    }

    TEACHER {
        int id PK
        string name
        string employee_id "unique"
        string department
        string designation
        string email
        string phone
        datetime created_at
    }

    TEACHER_ASSIGNMENT {
        int id PK
        int teacher_id FK
        string course_code
        string course_name
        string department
        string batch
        string section
    }

    STUDENT {
        int id PK
        string roll "unique"
        string name
        string department
        string section
        string batch
        string course
        string email
        string phone
        datetime created_at
    }

    ATTENDANCE_SESSION {
        int id PK
        date date
        string department
        string course
        string course_name
        string batch
        string section
        int teacher_id FK
        string teacher_name
        boolean synced_to_sheet
        datetime created_at
    }

    ATTENDANCE_RECORD {
        int id PK
        int session_id FK
        int student_id FK
        string student_roll
        string student_name
        string status "present | absent | late | excused"
        string remarks
    }
```

---

### 3. Attendance & Cloud Sync Sequence Flow

```mermaid
sequenceDiagram
    autonumber
    actor Teacher as 👩‍🏫 Faculty / Admin
    participant UI as 💻 React Frontend
    participant Local as 💾 LocalStorage
    participant DRF as 🚀 Django REST API
    participant DB as 🐘 PostgreSQL (Neon/Supabase)
    participant GAS as 📑 Google Apps Script
    participant Sheet as 📊 Google Sheet

    Teacher->>UI: Selects Course, Batch, Section & Marks Attendance
    Teacher->>UI: Clicks "Save Session"
    UI->>Local: Persist snapshot immediately in LocalStorage
    
    par Save to Django Backend
        UI->>DRF: POST /api/sessions/ (Session + Student Records)
        DRF->>DB: update_or_create AttendanceSession
        DRF->>DB: Bulk insert/update AttendanceRecord rows
        DB-->>DRF: Commit Transaction
        DRF-->>UI: 201 Created / 200 OK
    and Sync to Google Sheets
        UI->>GAS: POST Webhook Payload (JSON)
        Note over GAS: Acquire LockService (concurrency lock)
        GAS->>Sheet: Insert timestamped row per student
        Sheet-->>GAS: Appended Successfully
        GAS-->>UI: 200 OK {status: "success", syncedRows: N}
    end

    UI->>Teacher: Displays Real-time Success Notification
```

---

## 📁 Project Directory Structure

```text
smartattendance-portal/
├── .env.example                      # Template for frontend environment variables
├── package.json                      # Frontend dependencies & scripts
├── tsconfig.json                     # TypeScript compiler configuration
├── vite.config.ts                    # Vite build & bundler configuration
├── index.html                        # Single-page application root HTML
│
├── src/                              # React Client Application
│   ├── App.tsx                       # Root application component
│   ├── main.tsx                      # Vite React entrypoint
│   ├── index.css                     # Tailwind CSS v4 styling rules
│   │
│   ├── Context/                      # React State Management
│   │   └── AttendanceContext.tsx     # Centralized state provider & sync orchestrator
│   │
│   ├── Layouts/                      # Application Shell & Navigation
│   │   ├── MainLayout.tsx            # Responsive page layout wrapper
│   │   ├── Navbar.tsx                # Top navigation header & quick actions
│   │   └── Sidebar.tsx               # Primary sidebar with active tab links
│   │
│   ├── components/                   # Feature-specific UI components
│   │   ├── attendance/               # Attendance Taking interface & controls
│   │   ├── backend/                  # Django & PostgreSQL configuration view
│   │   ├── dashboard/                # Analytics widgets, statistics & summary
│   │   ├── settings/                 # Webhook URLs, theme, and sync options
│   │   ├── sheetsync/                # Live interactive Excel sheet table
│   │   ├── students/                 # Student registry table & bulk import modal
│   │   └── teachers/                 # Faculty list & course assignment editor
│   │
│   ├── pages/                        # View-level page components
│   ├── routers/                      # Tab-based router (AppRouter.tsx)
│   ├── services/                     # External & storage adapters
│   │   ├── excelSyncService.ts       # SheetJS (.xlsx) export & import logic
│   │   ├── googleSheetsService.ts    # Google Apps Script HTTP dispatcher & script template
│   │   ├── mockInitialData.ts        # Seed data for immediate evaluation
│   │   └── storageService.ts         # LocalStorage serialization engine
│   └── types/                        # Core TypeScript type definitions
│       └── attendance.ts             # Interface definitions
│
└── Backend/                          # Django REST Framework Backend
    ├── manage.py                     # Django CLI utility
    ├── requirements.txt              # Python package dependencies
    ├── .env                          # Backend environment & database credentials
    ├── README.md                     # Backend-specific instructions
    │
    ├── class_attendance/             # Django Project Configuration
    │   ├── settings.py               # Settings with multi-database switcher & CORS
    │   ├── urls.py                   # Root URL dispatcher
    │   └── wsgi.py                   # WSGI deployment configuration
    │
    └── api/                          # Primary Attendance Application
        ├── admin.py                  # Django Admin site model registrations
        ├── apps.py                   # App configuration
        ├── models.py                 # Student, Teacher, Session, Record ORM models
        ├── serializers.py            # DRF ModelSerializers with nested creation
        ├── urls.py                   # Endpoints (/students/, /teachers/, /sessions/)
        └── views.py                  # ViewSets, Webhook Relay & openpyxl Excel exporter
```

---

## 🔌 Backend REST API Specification

| Endpoint | Method | Description | Parameters / Payload |
| :--- | :--- | :--- | :--- |
| `/api/students/` | `GET` | List all students | Query params: `department`, `batch`, `section` |
| `/api/students/` | `POST` | Register a new student | JSON Student object |
| `/api/teachers/` | `GET` | List all teachers with assignments | Optional filters |
| `/api/teachers/` | `POST` | Add teacher profile | JSON Teacher object |
| `/api/sessions/` | `GET` | Retrieve attendance sessions | Order by `-date` |
| `/api/sessions/` | `POST` | Create or update attendance session | JSON session payload with nested `records[]` |
| `/api/sync-google-sheet/` | `POST` | Server-side relay to Google Sheets | Attendance session payload |
| `/api/export-excel/` | `GET` | Download full `.xlsx` workbook | Generates styled attendance matrix |

### Sample Attendance Session Creation Payload:
```json
{
  "date": "2026-10-07",
  "department": "Computer Science & Engineering",
  "course": "CSE-3101",
  "course_name": "Database Management Systems",
  "batch": "52nd Batch",
  "section": "A",
  "teacher_name": "Dr. Sarah Khan",
  "records": [
    {
      "student_roll": "CSE-2023-001",
      "student_name": "Tanzil Ahmed",
      "status": "present",
      "remarks": ""
    },
    {
      "student_roll": "CSE-2023-002",
      "student_name": "Nafisa Rahman",
      "status": "absent",
      "remarks": "Sick leave"
    }
  ]
}
```

---

## 🌐 Google Sheets Sync Integration

You can stream live attendance records directly into a Google Spreadsheet without needing Google Cloud console service accounts or complex OAuth flows.

### Step-by-Step Setup:
1. Open [Google Sheets](https://sheets.new) and create a new blank spreadsheet.
2. Navigate to **Extensions** → **Apps Script**.
3. Replace any existing boilerplate code with the script below:

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = "Attendance_Records";
    var sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow([
        "Timestamp", "Date", "Department", "Course", 
        "Batch", "Section", "Teacher", "Student Roll", 
        "Student Name", "Status", "Remarks"
      ]);
      sheet.getRange(1, 1, 1, 11).setFontWeight("bold").setBackground("#e2e8f0");
    }
    
    if (data.records && data.records.length > 0) {
      data.records.forEach(function(rec) {
        sheet.appendRow([
          new Date(),
          data.date,
          data.department,
          data.course,
          data.batch,
          data.section,
          data.teacherName || "Assigned Teacher",
          rec.studentRoll,
          rec.studentName,
          rec.status.toUpperCase(),
          rec.remarks || ""
        ]);
      });
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      syncedRows: data.records ? data.records.length : 0
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

4. Click **Deploy** → **New deployment**.
5. Select **Web app** as the type.
6. Set **Execute as**: `Me` and **Who has access**: `Anyone`.
7. Click **Deploy** and copy the generated **Web App URL**.
8. Paste the Web App URL into the **Settings** page inside the SmartAttendance Portal or into `Backend/.env`.

---

## 💻 Getting Started & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (`v18.x` or higher)
- [Python](https://www.python.org/) (`v3.10` or higher)
- [Git](https://git-scm.com/)

---

### Frontend Setup (React + Vite)

1. **Install Node Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` or `.env.local` file at the root:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The portal will run at `http://localhost:3000`.

4. **Build for Production**:
   ```bash
   npm run build
   ```

---

### Backend Setup (Django REST Framework)

1. **Navigate to the Backend Directory**:
   ```bash
   cd Backend
   ```

2. **Create and Activate the Virtual Environment**:
   ```bash
   # Windows PowerShell
   python -m venv ClassAttendance_env
   ClassAttendance_env\Scripts\activate

   # macOS / Linux
   python3 -m venv ClassAttendance_env
   source ClassAttendance_env/bin/activate
   ```

3. **Install Python Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Database & Secrets**:
   Edit `Backend/.env` to configure your database string (see [Database Configuration](#-database-configuration)).

5. **Run Database Migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create an Administrative Superuser (Optional)**:
   ```bash
   python manage.py createsuperuser
   ```

7. **Start the Django Development Server**:
   ```bash
   python manage.py runserver 8000
   ```
   The REST API will be accessible at `http://127.0.0.1:8000/api/` and the Django Admin panel at `http://127.0.0.1:8000/admin/`.

---

## 🗄️ Database Configuration

The backend utilizes `dj-database-url` to provide zero-friction switching between multiple database providers. Select your target database in `Backend/.env`:

### 1. Neon Tech PostgreSQL (Serverless - Recommended)
```env
DATABASE_URL=postgresql://neondb_owner:YOUR_NEON_PASSWORD@ep-cool-sample.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

### 2. Supabase PostgreSQL
```env
DATABASE_URL=postgresql://postgres:YOUR_SUPABASE_PASSWORD@db.xxxxxx.supabase.co:5432/postgres
```

### 3. Local PostgreSQL
```env
DATABASE_URL=postgres://postgres:password@localhost:5432/class_attendance_db
```

### 4. SQLite3 (Zero-Configuration Development)
```env
DATABASE_URL=sqlite:///db.sqlite3
```

---

## 🔐 Environment Variables

### Frontend Variables (`.env.local` / `.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL for Django REST API calls | `http://localhost:8000/api` |
| `GEMINI_API_KEY` | Optional Gemini API key if GenAI assistance is activated | `""` |

### Backend Variables (`Backend/.env`)
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `DJANGO_SECRET_KEY` | Unique Django secret cryptographic key | `django-insecure-smartattendance-...` |
| `DEBUG` | Django debug flag | `True` |
| `ALLOWED_HOSTS` | Comma-separated list of permitted hostnames | `*` |
| `DATABASE_URL` | Full database connection string | `postgresql://...` or `sqlite:///db.sqlite3` |
| `GOOGLE_SHEET_WEBHOOK_URL` | Apps Script webhook deployment URL | `https://script.google.com/macros/s/.../exec` |
| `CORS_ALLOWED_ORIGINS` | Permitted cross-origin frontend domains | `http://localhost:3000,http://127.0.0.1:3000` |

---

## 📄 Developed By

This project is developed by [Sayham Kayes](https://github.com/SayhamKayes). 
