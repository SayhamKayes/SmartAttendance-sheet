from rest_framework import serializers
from .models import Student, Teacher, TeacherAssignment, AttendanceSession, AttendanceRecord, Course, Department

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class TeacherAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherAssignment
        fields = '__all__'

class TeacherSerializer(serializers.ModelSerializer):
    assignments = TeacherAssignmentSerializer(many=True, read_only=True)

    class Meta:
        model = Teacher
        fields = '__all__'

class AttendanceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceRecord
        fields = '__all__'

class AttendanceSessionSerializer(serializers.ModelSerializer):
    records = AttendanceRecordSerializer(many=True)

    class Meta:
        model = AttendanceSession
        fields = '__all__'

    def create(self, validated_data):
        records_data = validated_data.pop('records')
        session, created = AttendanceSession.objects.update_or_create(
            date=validated_data.get('date'),
            course=validated_data.get('course'),
            batch=validated_data.get('batch'),
            section=validated_data.get('section'),
            defaults=validated_data
        )

        # Clear previous records for this session if updated
        session.records.all().delete()

        for record_data in records_data:
            AttendanceRecord.objects.create(session=session, **record_data)

        return session
