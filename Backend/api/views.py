from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse
from django.conf import settings
import requests
import json
import os

from .models import Student, Teacher, TeacherAssignment, AttendanceSession, AttendanceRecord, Course, Department
from .serializers import (
    StudentSerializer, 
    TeacherSerializer, 
    AttendanceSessionSerializer,
    CourseSerializer,
    DepartmentSerializer
)

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all().order_by('roll')
    serializer_class = StudentSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        dept = self.request.query_params.get('department')
        batch = self.request.query_params.get('batch')
        sec = self.request.query_params.get('section')
        if dept:
            qs = qs.filter(department=dept)
        if batch:
            qs = qs.filter(batch=batch)
        if sec:
            qs = qs.filter(section=sec)
        return qs

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all().order_by('name')
    serializer_class = TeacherSerializer

class AttendanceSessionViewSet(viewsets.ModelViewSet):
    queryset = AttendanceSession.objects.all().order_by('-date')
    serializer_class = AttendanceSessionSerializer

class GoogleSheetSyncAPIView(APIView):
    """
    Relays attendance updates immediately to Google Sheet Webhook.
    """
    def post(self, request):
        webhook_url = os.getenv('GOOGLE_SHEET_WEBHOOK_URL')
        if not webhook_url or 'YOUR_SCRIPT_ID' in webhook_url:
            return Response({
                'status': 'simulated',
                'message': 'Recorded locally in PostgreSQL. To sync to remote Google Sheets, define GOOGLE_SHEET_WEBHOOK_URL in .env.'
            }, status=status.HTTP_200_OK)

        try:
            payload = request.data
            resp = requests.post(webhook_url, json=payload, timeout=10)
            return Response({
                'status': 'success',
                'google_sheet_response': resp.text
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ExcelExportAPIView(APIView):
    """
    Generates and downloads full Excel spreadsheet (.xlsx) using openpyxl.
    """
    def get(self, request):
        import openpyxl
        from openpyxl.styles import Font, PatternFill, Alignment

        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Attendance Matrix"

        # Headers
        headers = ["Roll", "Name", "Department", "Batch", "Section", "Total Classes", "Total Present", "Attendance %"]
        ws.append(headers)

        header_font = Font(bold=True, color="FFFFFF")
        header_fill = PatternFill(start_color="10B981", end_color="10B981", fill_type="solid")

        for col_num, header in enumerate(headers, 1):
            cell = ws.cell(row=1, column=col_num)
            cell.font = header_font
            cell.fill = header_fill
            cell.alignment = Alignment(horizontal="center")

        students = Student.objects.all().order_by('roll')
        for s in students:
            # Count records
            total = AttendanceRecord.objects.filter(student_roll=s.roll).count()
            present = AttendanceRecord.objects.filter(student_roll=s.roll, status__in=['present', 'excused']).count()
            pct = round((present / total) * 100) if total > 0 else 0

            ws.append([
                s.roll,
                s.name,
                s.department,
                s.batch,
                s.section,
                total,
                present,
                f"{pct}%"
            ])

        response = HttpResponse(
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )
        response['Content-Disposition'] = 'attachment; filename="Class_Attendance_Export.xlsx"'
        wb.save(response)
        return response
