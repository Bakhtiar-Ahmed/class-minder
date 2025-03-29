
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Student, calculateAttendancePercentage, mockAttendance, getAttendanceStatus } from '@/utils/attendanceUtils';

interface AttendanceReportProps {
  students: Student[];
}

export const AttendanceReport: React.FC<AttendanceReportProps> = ({ students }) => {
  // Calculate counts for each status
  const regularCount = students.filter(student => {
    const percentage = calculateAttendancePercentage(student.id, mockAttendance);
    return getAttendanceStatus(percentage) === 'Regular';
  }).length;
  
  const ncCount = students.filter(student => {
    const percentage = calculateAttendancePercentage(student.id, mockAttendance);
    return getAttendanceStatus(percentage) === 'NC';
  }).length;
  
  const dcCount = students.filter(student => {
    const percentage = calculateAttendancePercentage(student.id, mockAttendance);
    return getAttendanceStatus(percentage) === 'DC';
  }).length;
  
  // Calculate average attendance
  const averageAttendance = students.reduce((sum, student) => {
    return sum + calculateAttendancePercentage(student.id, mockAttendance);
  }, 0) / (students.length || 1);
  
  // Prepare pie chart data
  const pieData = [
    { name: 'Regular', value: regularCount, color: '#22c55e' },
    { name: 'NC', value: ncCount, color: '#f59e0b' },
    { name: 'DC', value: dcCount, color: '#ef4444' }
  ].filter(item => item.value > 0);
  
  // Calculate attendance distribution
  const attendanceRanges = [
    { range: '90-100%', count: 0, color: '#22c55e' },
    { range: '75-89%', count: 0, color: '#84cc16' },
    { range: '60-74%', count: 0, color: '#f59e0b' },
    { range: '50-59%', count: 0, color: '#f97316' },
    { range: '0-49%', count: 0, color: '#ef4444' }
  ];
  
  students.forEach(student => {
    const percentage = calculateAttendancePercentage(student.id, mockAttendance);
    
    if (percentage >= 90) attendanceRanges[0].count++;
    else if (percentage >= 75) attendanceRanges[1].count++;
    else if (percentage >= 60) attendanceRanges[2].count++;
    else if (percentage >= 50) attendanceRanges[3].count++;
    else attendanceRanges[4].count++;
  });
  
  const distributionData = attendanceRanges.filter(item => item.count > 0);

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <div className="text-3xl font-bold">{Math.round(averageAttendance)}%</div>
        <div className="text-sm text-muted-foreground">Average Attendance</div>
      </div>
      
      {students.length > 0 ? (
        <>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-2 mt-4">
            <h4 className="font-medium text-sm mb-2">Attendance Distribution</h4>
            {distributionData.map((range, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: range.color }}
                ></div>
                <div className="flex-grow text-sm">{range.range}</div>
                <div className="text-sm font-medium">{range.count} students</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No data available</p>
        </div>
      )}
    </div>
  );
};
