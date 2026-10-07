from django.contrib import admin
from .models import Student, Teacher, TeacherAssignment, AttendanceSession, AttendanceRecord, Course, Department

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('roll', 'name', 'department', 'batch', 'section', 'course')
    search_fields = ('roll', 'name', 'department')
    list_filter = ('department', 'batch', 'section')

@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('name', 'employee_id', 'department', 'designation', 'email')
    search_fields = ('name', 'employee_id')
    list_filter = ('department', 'designation')

@admin.register(TeacherAssignment)
class TeacherAssignmentAdmin(admin.ModelAdmin):
    list_display = ('teacher', 'course_code', 'department', 'batch', 'section')

@admin.register(AttendanceSession)
class AttendanceSessionAdmin(admin.ModelAdmin):
    list_display = ('date', 'course', 'batch', 'section', 'teacher_name', 'synced_to_sheet')
    list_filter = ('department', 'date', 'batch')

@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ('session', 'student_roll', 'student_name', 'status')
    list_filter = ('status',)
