from django.db import models

class Department(models.Model):
    name = models.CharField(max_length=150, unique=True)
    code = models.CharField(max_length=20, unique=True, blank=True, null=True)

    def __str__(self):
        return self.name

class Course(models.Model):
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    department = models.CharField(max_length=150)

    def __str__(self):
        return f"{self.code} - {self.name}"

class Teacher(models.Model):
    name = models.CharField(max_length=150)
    employee_id = models.CharField(max_length=50, unique=True)
    department = models.CharField(max_length=150)
    designation = models.CharField(max_length=100, default='Lecturer')
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=30, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.employee_id})"

class TeacherAssignment(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='assignments')
    course_code = models.CharField(max_length=50)
    course_name = models.CharField(max_length=200)
    department = models.CharField(max_length=150)
    batch = models.CharField(max_length=50)
    section = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.teacher.name} - {self.course_code} ({self.batch} Sec {self.section})"

class Student(models.Model):
    name = models.CharField(max_length=150)
    roll = models.CharField(max_length=50, unique=True)
    department = models.CharField(max_length=150)
    section = models.CharField(max_length=20, default='A')
    batch = models.CharField(max_length=50, default='52nd Batch')
    course = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=30, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.roll} - {self.name}"

class AttendanceSession(models.Model):
    date = models.DateField()
    department = models.CharField(max_length=150)
    course = models.CharField(max_length=50)
    course_name = models.CharField(max_length=200, blank=True, null=True)
    batch = models.CharField(max_length=50)
    section = models.CharField(max_length=20)
    teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True, blank=True, related_name='sessions')
    teacher_name = models.CharField(max_length=150, blank=True, null=True)
    synced_to_sheet = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('date', 'course', 'batch', 'section')

    def __str__(self):
        return f"{self.date} - {self.course} ({self.batch} Sec {self.section})"

class AttendanceRecord(models.Model):
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
        ('excused', 'Excused'),
    ]

    session = models.ForeignKey(AttendanceSession, on_delete=models.CASCADE, related_name='records')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendance_records', null=True, blank=True)
    student_roll = models.CharField(max_length=50)
    student_name = models.CharField(max_length=150)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='present')
    remarks = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.student_roll} - {self.status}"
