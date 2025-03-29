
export type Student = {
  id: string;
  name: string;
  studentId: string;
  semester: string;
  email: string;
  phone?: string;
  program?: string;
};

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export type AttendanceRecord = {
  id: string;
  studentId: string;
  classId: string;
  date: Date;
  status: AttendanceStatus;
};

export type ClassSession = {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  semester: string;
  room?: string;
  notes?: string;
};

// Calculate attendance percentage for a student
export const calculateAttendancePercentage = (
  studentId: string,
  records: AttendanceRecord[]
): number => {
  const studentRecords = records.filter(record => record.studentId === studentId);
  
  if (studentRecords.length === 0) return 0;
  
  const totalClasses = studentRecords.length;
  const attendedClasses = studentRecords.filter(
    record => record.status === 'present' || record.status === 'late'
  ).length;
  
  return Math.round((attendedClasses / totalClasses) * 100);
};

// Get student attendance status (NC or DC based on threshold)
export const getAttendanceStatus = (percentage: number): 'NC' | 'DC' | 'Regular' => {
  if (percentage < 50) return 'DC';
  if (percentage < 75) return 'NC';
  return 'Regular';
};

// Mock data for initial development
export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'John Smith',
    studentId: 'S2023001',
    semester: 'Fall 2023',
    email: 'john.smith@university.edu',
    phone: '555-123-4567',
    program: 'Computer Science'
  },
  {
    id: '2',
    name: 'Emily Johnson',
    studentId: 'S2023002',
    semester: 'Fall 2023',
    email: 'emily.johnson@university.edu',
    phone: '555-234-5678',
    program: 'Computer Science'
  },
  {
    id: '3',
    name: 'Michael Brown',
    studentId: 'S2023003',
    semester: 'Fall 2023',
    email: 'michael.brown@university.edu',
    phone: '555-345-6789',
    program: 'Computer Science'
  },
  {
    id: '4',
    name: 'Jessica Davis',
    studentId: 'S2023004',
    semester: 'Fall 2023',
    email: 'jessica.davis@university.edu',
    phone: '555-456-7890',
    program: 'Computer Science'
  },
  {
    id: '5',
    name: 'David Wilson',
    studentId: 'S2023005',
    semester: 'Fall 2023',
    email: 'david.wilson@university.edu',
    phone: '555-567-8901',
    program: 'Computer Science'
  }
];

export const mockClasses: ClassSession[] = [
  {
    id: '1',
    title: 'Introduction to Programming',
    startTime: new Date('2023-09-04T09:00:00'),
    endTime: new Date('2023-09-04T10:30:00'),
    semester: 'Fall 2023',
    room: 'CS-101'
  },
  {
    id: '2',
    title: 'Data Structures',
    startTime: new Date('2023-09-06T13:00:00'),
    endTime: new Date('2023-09-06T14:30:00'),
    semester: 'Fall 2023',
    room: 'CS-102'
  },
  {
    id: '3',
    title: 'Database Systems',
    startTime: new Date('2023-09-08T11:00:00'),
    endTime: new Date('2023-09-08T12:30:00'),
    semester: 'Fall 2023',
    room: 'CS-103'
  }
];

export const mockAttendance: AttendanceRecord[] = [
  // Class 1 attendance
  { id: '1', studentId: '1', classId: '1', date: new Date('2023-09-04'), status: 'present' },
  { id: '2', studentId: '2', classId: '1', date: new Date('2023-09-04'), status: 'present' },
  { id: '3', studentId: '3', classId: '1', date: new Date('2023-09-04'), status: 'late' },
  { id: '4', studentId: '4', classId: '1', date: new Date('2023-09-04'), status: 'absent' },
  { id: '5', studentId: '5', classId: '1', date: new Date('2023-09-04'), status: 'present' },
  
  // Class 2 attendance
  { id: '6', studentId: '1', classId: '2', date: new Date('2023-09-06'), status: 'present' },
  { id: '7', studentId: '2', classId: '2', date: new Date('2023-09-06'), status: 'absent' },
  { id: '8', studentId: '3', classId: '2', date: new Date('2023-09-06'), status: 'present' },
  { id: '9', studentId: '4', classId: '2', date: new Date('2023-09-06'), status: 'excused' },
  { id: '10', studentId: '5', classId: '2', date: new Date('2023-09-06'), status: 'present' },
  
  // Class 3 attendance
  { id: '11', studentId: '1', classId: '3', date: new Date('2023-09-08'), status: 'absent' },
  { id: '12', studentId: '2', classId: '3', date: new Date('2023-09-08'), status: 'present' },
  { id: '13', studentId: '3', classId: '3', date: new Date('2023-09-08'), status: 'present' },
  { id: '14', studentId: '4', classId: '3', date: new Date('2023-09-08'), status: 'present' },
  { id: '15', studentId: '5', classId: '3', date: new Date('2023-09-08'), status: 'late' }
];

// Get all attendance records for a specific class
export const getClassAttendance = (classId: string): AttendanceRecord[] => {
  return mockAttendance.filter(record => record.classId === classId);
};

// Get all attendance records for a student
export const getStudentAttendance = (studentId: string): AttendanceRecord[] => {
  return mockAttendance.filter(record => record.studentId === studentId);
};

// Get students with attendance status (NC/DC)
export const getStudentsByAttendanceStatus = (status: 'NC' | 'DC'): Student[] => {
  return mockStudents.filter(student => {
    const percentage = calculateAttendancePercentage(student.id, mockAttendance);
    const attendanceStatus = getAttendanceStatus(percentage);
    return attendanceStatus === status;
  });
};
