import React, { useState } from 'react';
import { 
  UserCheck, 
  Plus, 
  BookOpen, 
  Trash2, 
  Mail, 
  Phone, 
  Briefcase, 
  Layers, 
  X, 
  Check,
  GraduationCap
} from 'lucide-react';
import { useAttendanceContext } from '../../Context/AttendanceContext';
import { Teacher, TeacherAssignment } from '../../types/attendance';

export const TeacherAssignmentView: React.FC = () => {
  const { 
    teachers, 
    departments, 
    courses, 
    addTeacher, 
    deleteTeacher, 
    assignTeacherCourse, 
    removeTeacherAssignment 
  } = useAttendanceContext();

  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);
  const [isAssignCourseModalOpen, setIsAssignCourseModalOpen] = useState(false);
  const [selectedTeacherForAssign, setSelectedTeacherForAssign] = useState<Teacher | null>(null);

  // New Teacher Form
  const [teacherFormData, setTeacherFormData] = useState({
    name: '',
    employeeId: '',
    department: departments[0] || 'Computer Science & Engineering',
    designation: 'Assistant Professor',
    email: '',
    phone: ''
  });

  // Assign Course Form
  const [assignFormData, setAssignFormData] = useState({
    courseCode: courses[0]?.code || 'CSE-101',
    batch: '52nd Batch',
    section: 'A'
  });

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherFormData.name || !teacherFormData.employeeId) {
      alert('Please fill out Teacher Name and Employee ID');
      return;
    }

    addTeacher({
      ...teacherFormData,
      assignedCourses: []
    });

    setIsAddTeacherModalOpen(false);
    setTeacherFormData({
      name: '',
      employeeId: '',
      department: departments[0] || 'Computer Science & Engineering',
      designation: 'Assistant Professor',
      email: '',
      phone: ''
    });
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherForAssign) return;

    const matchedCourse = courses.find(c => c.code === assignFormData.courseCode);

    assignTeacherCourse(selectedTeacherForAssign.id, {
      courseCode: assignFormData.courseCode,
      courseName: matchedCourse?.name || assignFormData.courseCode,
      department: selectedTeacherForAssign.department,
      batch: assignFormData.batch,
      section: assignFormData.section
    });

    setIsAssignCourseModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <UserCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Faculty &amp; Course Assignment
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Assign instructors to specific courses, batches, and class sections.
          </p>
        </div>

        <button
          onClick={() => setIsAddTeacherModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center shadow-sm w-fit"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Faculty Member
        </button>
      </div>

      {/* Teachers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {teachers.map(teacher => (
          <div
            key={teacher.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition"
          >
            <div>
              {/* Teacher Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{teacher.name}</h3>
                  <div className="text-xs font-semibold text-emerald-700 mt-0.5">
                    {teacher.designation}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    ID: {teacher.employeeId} • {teacher.department}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm(`Delete teacher ${teacher.name}?`)) {
                      deleteTeacher(teacher.id);
                    }
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition"
                  title="Remove Teacher"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Contact info */}
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                {teacher.email && (
                  <div className="flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{teacher.email}</span>
                  </div>
                )}
                {teacher.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{teacher.phone}</span>
                  </div>
                )}
              </div>

              {/* Assigned Courses Section */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Assigned Classes &amp; Batches ({teacher.assignedCourses.length})
                  </span>
                  <button
                    onClick={() => {
                      setSelectedTeacherForAssign(teacher);
                      setIsAssignCourseModalOpen(true);
                    }}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center"
                  >
                    <Plus className="w-3 h-3 mr-0.5" />
                    Assign Course
                  </button>
                </div>

                {teacher.assignedCourses.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2 italic bg-slate-50 rounded-lg text-center">
                    No active course assignments. Click &quot;Assign Course&quot; to assign.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {teacher.assignedCourses.map(assignment => (
                      <div
                        key={assignment.id}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs text-slate-800 font-mono">
                              {assignment.courseCode}
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded bg-white text-slate-600 font-semibold border border-slate-200">
                              {assignment.batch} • Sec {assignment.section}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {assignment.courseName}
                          </div>
                        </div>

                        <button
                          onClick={() => removeTeacherAssignment(teacher.id, assignment.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                          title="Unassign"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Teacher Modal */}
      {isAddTeacherModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add New Faculty Member</h3>
              <button onClick={() => setIsAddTeacherModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeacher} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Teacher Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rafiqul Islam"
                  value={teacherFormData.name}
                  onChange={e => setTeacherFormData({ ...teacherFormData, name: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Employee ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="EMP-1005"
                    value={teacherFormData.employeeId}
                    onChange={e => setTeacherFormData({ ...teacherFormData, employeeId: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Designation</label>
                  <select
                    value={teacherFormData.designation}
                    onChange={e => setTeacherFormData({ ...teacherFormData, designation: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Professor & Head">Professor &amp; Head</option>
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Senior Lecturer">Senior Lecturer</option>
                    <option value="Lecturer">Lecturer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department</label>
                <select
                  value={teacherFormData.department}
                  onChange={e => setTeacherFormData({ ...teacherFormData, department: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
                >
                  {departments.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="teacher@univ.edu"
                    value={teacherFormData.email}
                    onChange={e => setTeacherFormData({ ...teacherFormData, email: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+880 1711-xxxxxx"
                    value={teacherFormData.phone}
                    onChange={e => setTeacherFormData({ ...teacherFormData, phone: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddTeacherModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  Save Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Course Modal */}
      {isAssignCourseModalOpen && selectedTeacherForAssign && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Assign Course to Faculty</h3>
                <p className="text-xs text-slate-500">{selectedTeacherForAssign.name}</p>
              </div>
              <button onClick={() => setIsAssignCourseModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Select Course</label>
                <select
                  value={assignFormData.courseCode}
                  onChange={e => setAssignFormData({ ...assignFormData, courseCode: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
                >
                  {courses.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Batch</label>
                  <select
                    value={assignFormData.batch}
                    onChange={e => setAssignFormData({ ...assignFormData, batch: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value="52nd Batch">52nd Batch</option>
                    <option value="53rd Batch">53rd Batch</option>
                    <option value="54th Batch">54th Batch</option>
                    <option value="48th Batch">48th Batch</option>
                    <option value="50th Batch">50th Batch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Section</label>
                  <select
                    value={assignFormData.section}
                    onChange={e => setAssignFormData({ ...assignFormData, section: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAssignCourseModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
