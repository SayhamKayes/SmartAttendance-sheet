import React, { useState, useRef } from 'react';
import { 
  Users, 
  UserPlus, 
  UploadCloud, 
  Download, 
  Search, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  FileSpreadsheet, 
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import { useAttendanceContext } from '../../Context/AttendanceContext';
import { useExcelSync } from '../../hooks/useExcelSync';
import { Student } from '../../types/attendance';

export const StudentList: React.FC = () => {
  const { 
    students, 
    departments, 
    courses, 
    sessions, 
    addStudent, 
    updateStudent, 
    deleteStudent 
  } = useAttendanceContext();

  const {
    isProcessing,
    importPreview,
    importError,
    handleFileUpload,
    confirmImport,
    cancelImport,
    downloadTemplate
  } = useExcelSync();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    roll: '',
    department: departments[0] || 'Computer Science & Engineering',
    section: 'A',
    batch: '52nd Batch',
    course: '',
    email: '',
    phone: ''
  });

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      roll: '',
      department: departments[0] || 'Computer Science & Engineering',
      section: 'A',
      batch: '52nd Batch',
      course: '',
      email: '',
      phone: ''
    });
    setEditingStudent(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (student: Student) => {
    setFormData({
      name: student.name,
      roll: student.roll,
      department: student.department,
      section: student.section,
      batch: student.batch,
      course: student.course || '',
      email: student.email || '',
      phone: student.phone || ''
    });
    setEditingStudent(student);
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.roll.trim()) {
      alert('Please fill out student Name and Roll number.');
      return;
    }

    if (editingStudent) {
      updateStudent(editingStudent.id, formData);
    } else {
      addStudent(formData);
    }
    setIsAddModalOpen(false);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
      e.target.value = '';
    }
  };

  // Filtered student list
  const filteredStudents = students.filter(st => {
    const matchDept = selectedDept === 'All' || st.department === selectedDept;
    const matchBatch = selectedBatch === 'All' || st.batch === selectedBatch;
    const matchSec = selectedSection === 'All' || st.section === selectedSection;
    const matchSearch = searchTerm === '' ||
      st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.roll.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (st.email && st.email.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchDept && matchBatch && matchSec && matchSearch;
  });

  // Calculate individual attendance stats
  const getStudentStats = (student: Student) => {
    let attended = 0;
    let total = 0;

    sessions.forEach(sess => {
      if ((!sess.department || sess.department === student.department) &&
          (!sess.section || sess.section === student.section)) {
        const rec = sess.records.find(r => r.studentId === student.id || r.studentRoll === student.roll);
        if (rec) {
          total++;
          if (rec.status === 'present' || rec.status === 'excused') attended++;
          else if (rec.status === 'late') attended += 0.5;
        }
      }
    });

    const pct = total > 0 ? Math.round((attended / total) * 100) : 100;
    return { attended, total, pct };
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Student Information &amp; Registry
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manual student registration or bulk Excel / CSV spreadsheet import.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Download Sample Excel Template */}
          <button
            onClick={downloadTemplate}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center"
            title="Download an Excel template to populate students"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Excel Template
          </button>

          {/* Import from Excel */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 text-xs font-bold transition flex items-center shadow-xs"
          >
            <UploadCloud className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            Import Excel / CSV
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileInputChange}
            accept=".xlsx, .xls, .csv"
            className="hidden"
          />

          {/* Add Student Manually */}
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
            Add Student
          </button>
        </div>
      </div>

      {/* Bulk Import Preview Modal */}
      {importPreview && (
        <div className="bg-emerald-50/70 border-2 border-emerald-400 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileSpreadsheet className="w-6 h-6 text-emerald-700" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Excel Import Preview ({importPreview.length} students detected)
                </h3>
                <p className="text-xs text-slate-600">Review the parsed columns before appending to the database.</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={confirmImport}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center"
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                Confirm &amp; Import
              </button>
              <button
                onClick={cancelImport}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto border border-emerald-200 rounded-xl bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase sticky top-0">
                <tr>
                  <th className="py-2 px-3">Roll</th>
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Department</th>
                  <th className="py-2 px-3">Batch</th>
                  <th className="py-2 px-3">Section</th>
                  <th className="py-2 px-3">Course</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {importPreview.map((st, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-1.5 px-3 font-mono font-bold text-slate-800">{st.roll}</td>
                    <td className="py-1.5 px-3 font-semibold text-slate-900">{st.name}</td>
                    <td className="py-1.5 px-3 text-slate-600">{st.department}</td>
                    <td className="py-1.5 px-3 text-slate-600">{st.batch}</td>
                    <td className="py-1.5 px-3 font-bold text-slate-700">{st.section}</td>
                    <td className="py-1.5 px-3 text-slate-500">{st.course || 'All'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {importError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-3 text-rose-800 text-xs font-medium">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="flex-1">{importError}</div>
          <button onClick={cancelImport} className="text-rose-700 font-bold hover:underline">Dismiss</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Dept filter */}
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-emerald-500"
          >
            <option value="All">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Batch filter */}
          <select
            value={selectedBatch}
            onChange={e => setSelectedBatch(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-emerald-500"
          >
            <option value="All">All Batches</option>
            <option value="52nd Batch">52nd Batch</option>
            <option value="53rd Batch">53rd Batch</option>
            <option value="54th Batch">54th Batch</option>
            <option value="48th Batch">48th Batch</option>
            <option value="50th Batch">50th Batch</option>
          </select>

          {/* Section filter */}
          <select
            value={selectedSection}
            onChange={e => setSelectedSection(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-emerald-500"
          >
            <option value="All">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, roll or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-full sm:w-60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 w-32">Roll Number</th>
                <th className="py-3 px-4">Student Details</th>
                <th className="py-3 px-4">Department &amp; Batch</th>
                <th className="py-3 px-4 w-24 text-center">Section</th>
                <th className="py-3 px-4 w-28">Course (Optional)</th>
                <th className="py-3 px-4 w-28 text-center">Attendance %</th>
                <th className="py-3 px-4 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-medium">No students found matching your filters</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, idx) => {
                  const stat = getStudentStats(student);

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4 text-center font-mono text-xs text-slate-400">
                        {idx + 1}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800">
                          {student.roll}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{student.name}</div>
                        <div className="text-xs text-slate-400 flex items-center space-x-2">
                          {student.email && <span>{student.email}</span>}
                          {student.phone && <span>• {student.phone}</span>}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-xs font-semibold text-slate-700">{student.department}</div>
                        <div className="text-[11px] text-slate-400">{student.batch}</div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700">
                          Sec {student.section}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-xs font-medium text-slate-600">
                        {student.course ? (
                          <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                            {student.course}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">All Courses</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded ${
                            stat.pct >= 75
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {stat.pct}%
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => handleOpenEditModal(student)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                            title="Edit Student"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete student ${student.name} (${student.roll})?`)) {
                                deleteStudent(student.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Student"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingStudent ? 'Edit Student Information' : 'Add New Student'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shakil Mahmud"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Student Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CSE-52-015"
                    value={formData.roll}
                    onChange={e => setFormData({ ...formData, roll: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    {departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Batch
                  </label>
                  <select
                    value={formData.batch}
                    onChange={e => setFormData({ ...formData, batch: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="52nd Batch">52nd Batch</option>
                    <option value="53rd Batch">53rd Batch</option>
                    <option value="54th Batch">54th Batch</option>
                    <option value="48th Batch">48th Batch</option>
                    <option value="50th Batch">50th Batch</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Section
                  </label>
                  <select
                    value={formData.section}
                    onChange={e => setFormData({ ...formData, section: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Course (Optional)
                  </label>
                  <select
                    value={formData.course}
                    onChange={e => setFormData({ ...formData, course: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="">Enrolled in All Department Courses</option>
                    {courses.map(c => (
                      <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="student@univ.edu"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+880 1711-xxxxxx"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  {editingStudent ? 'Save Changes' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
