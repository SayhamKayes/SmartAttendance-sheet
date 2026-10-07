import { useAttendanceContext } from '../Context/AttendanceContext';
import { useMemo } from 'react';

export const useAttendance = () => {
  const context = useAttendanceContext();

  const statistics = useMemo(() => {
    const totalStudents = context.students.length;
    const totalSessions = context.sessions.length;

    let totalAttendanceMarks = 0;
    let totalPresentMarks = 0;

    context.sessions.forEach(session => {
      session.records.forEach(r => {
        totalAttendanceMarks++;
        if (r.status === 'present' || r.status === 'excused') {
          totalPresentMarks++;
        } else if (r.status === 'late') {
          totalPresentMarks += 0.5;
        }
      });
    });

    const averageRate = totalAttendanceMarks > 0 
      ? Math.round((totalPresentMarks / totalAttendanceMarks) * 100)
      : 0;

    // Student performance breakdown
    const studentStats = context.students.map(student => {
      let attended = 0;
      let totalEnrolledSessions = 0;

      context.sessions.forEach(session => {
        const matchesDept = !session.department || session.department === student.department;
        const matchesSec = !session.section || session.section === student.section;
        if (matchesDept && matchesSec) {
          const rec = session.records.find(r => r.studentId === student.id || r.studentRoll === student.roll);
          if (rec) {
            totalEnrolledSessions++;
            if (rec.status === 'present' || rec.status === 'excused') attended++;
            else if (rec.status === 'late') attended += 0.5;
          }
        }
      });

      const percentage = totalEnrolledSessions > 0
        ? Math.round((attended / totalEnrolledSessions) * 100)
        : 100;

      return {
        student,
        attended,
        totalEnrolledSessions,
        percentage
      };
    });

    const atRiskStudents = studentStats.filter(s => s.percentage < 75 && s.totalEnrolledSessions > 0);

    return {
      totalStudents,
      totalSessions,
      averageRate,
      studentStats,
      atRiskCount: atRiskStudents.length,
      atRiskStudents
    };
  }, [context.students, context.sessions]);

  return {
    ...context,
    statistics
  };
};
