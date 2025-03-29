
import React, { useState } from 'react';
import { Check, X, Clock, AlertCircle, Save } from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  mockStudents, 
  AttendanceStatus,
  mockAttendance,
  AttendanceRecord
} from '@/utils/attendanceUtils';

interface AttendanceTableProps {
  classId: string;
  classDate: Date;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({ 
  classId, 
  classDate 
}) => {
  const { toast } = useToast();
  
  // Find existing attendance records for this class
  const existingRecords = mockAttendance.filter(
    record => record.classId === classId
  );
  
  // Initialize attendance state
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(() => {
    const initialState: Record<string, AttendanceStatus> = {};
    mockStudents.forEach(student => {
      const record = existingRecords.find(r => r.studentId === student.id);
      initialState[student.id] = record ? record.status : 'present';
    });
    return initialState;
  });
  
  // Handle status change
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };
  
  // Save attendance
  const saveAttendance = () => {
    // In a real app, this would save to a database
    toast({
      title: "Attendance saved",
      description: "Attendance records have been updated successfully.",
    });
  };
  
  // Calculate stats
  const presentCount = Object.values(attendance).filter(status => status === 'present').length;
  const absentCount = Object.values(attendance).filter(status => status === 'absent').length;
  const lateCount = Object.values(attendance).filter(status => status === 'late').length;
  const excusedCount = Object.values(attendance).filter(status => status === 'excused').length;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{presentCount}</div>
            <div className="text-sm text-muted-foreground">Present</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{absentCount}</div>
            <div className="text-sm text-muted-foreground">Absent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{lateCount}</div>
            <div className="text-sm text-muted-foreground">Late</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{excusedCount}</div>
            <div className="text-sm text-muted-foreground">Excused</div>
          </div>
        </div>
        
        <Button onClick={saveAttendance}>
          <Save className="h-4 w-4 mr-1" />
          Save Attendance
        </Button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Student Name</TableHead>
              <TableHead>ID</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockStudents.map(student => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.studentId}</TableCell>
                <TableCell className="text-center">
                  <div 
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${attendance[student.id] === 'present' ? 'attendance-present' : ''}
                      ${attendance[student.id] === 'absent' ? 'attendance-absent' : ''}
                      ${attendance[student.id] === 'late' ? 'attendance-late' : ''}
                      ${attendance[student.id] === 'excused' ? 'attendance-excused' : ''}
                    `}
                  >
                    {attendance[student.id]}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="sm"
                      variant={attendance[student.id] === 'present' ? 'default' : 'outline'}
                      className="h-8 aspect-square p-0"
                      onClick={() => handleStatusChange(student.id, 'present')}
                      title="Mark as Present"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={attendance[student.id] === 'absent' ? 'default' : 'outline'}
                      className="h-8 aspect-square p-0"
                      onClick={() => handleStatusChange(student.id, 'absent')}
                      title="Mark as Absent"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={attendance[student.id] === 'late' ? 'default' : 'outline'}
                      className="h-8 aspect-square p-0"
                      onClick={() => handleStatusChange(student.id, 'late')}
                      title="Mark as Late"
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={attendance[student.id] === 'excused' ? 'default' : 'outline'}
                      className="h-8 aspect-square p-0"
                      onClick={() => handleStatusChange(student.id, 'excused')}
                      title="Mark as Excused"
                    >
                      <AlertCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
