from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    StudentViewSet, 
    TeacherViewSet, 
    AttendanceSessionViewSet,
    GoogleSheetSyncAPIView,
    ExcelExportAPIView
)

router = DefaultRouter()
router.register(r'students', StudentViewSet, basename='student')
router.register(r'teachers', TeacherViewSet, basename='teacher')
router.register(r'sessions', AttendanceSessionViewSet, basename='attendance-session')

urlpatterns = [
    path('', include(router.urls)),
    path('sync-google-sheet/', GoogleSheetSyncAPIView.as_view(), name='sync-google-sheet'),
    path('export-excel/', ExcelExportAPIView.as_view(), name='export-excel'),
]
