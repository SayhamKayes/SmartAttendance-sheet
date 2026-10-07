# Class Attendance Portal - Backend Service

This backend is built with **Django REST Framework** and supports **PostgreSQL** (Neon Tech, Supabase, or standard PostgreSQL) as well as **SQLite** for demo and rapid development.

## Virtual Environment Name
`ClassAttendance_env`

## Quick Setup Instructions

1. **Activate the Virtual Environment**:
   ```bash
   # On macOS / Linux:
   source ClassAttendance_env/bin/activate

   # On Windows PowerShell / Command Prompt:
   ClassAttendance_env\Scripts\activate
   ```

2. **Install Required Packages**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Database & Secrets in `.env`**:
   Open `Backend/.env` and pick your target database URL:
   - **Neon Tech PostgreSQL**: `DATABASE_URL=postgresql://neondb_owner:***@ep-***.neon.tech/neondb?sslmode=require`
   - **Supabase PostgreSQL**: `DATABASE_URL=postgresql://postgres:***@db.***.supabase.co:5432/postgres`
   - **SQLite Demo**: `DATABASE_URL=sqlite:///db.sqlite3`

4. **Run Migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create Superuser (Optional)**:
   ```bash
   python manage.py createsuperuser
   ```

6. **Start the API Server**:
   ```bash
   python manage.py runserver 8000
   ```

## REST API Endpoints
- `GET /api/students/` - Retrieve all students (filter by `department`, `batch`, `section`)
- `POST /api/students/` - Register single or bulk students
- `GET /api/teachers/` - Retrieve faculty list and assigned courses
- `POST /api/sessions/` - Save date-wise attendance records
- `POST /api/sync-google-sheet/` - Sync attendance session to remote Google Sheet
- `GET /api/export-excel/` - Download complete attendance matrix as `.xlsx`
