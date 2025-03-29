
import React, { useState } from 'react';
import { PieChart, Download, Filter, Users, BookOpen, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AttendanceReport } from '@/components/AttendanceReport';
import Navbar from '@/components/Navbar';
import { 
  mockStudents, 
  mockClasses, 
  calculateAttendancePercentage, 
  mockAttendance,
  getAttendanceStatus 
} from '@/utils/attendanceUtils';

const Reports = () => {
  const [selectedSemester, setSelectedSemester] = useState<string>('All');
  
  // Get unique semesters
  const semesters = ['All', ...new Set(mockStudents.map(student => student.semester))];
  
  // Filter students by semester
  const filteredStudents = selectedSemester === 'All' 
    ? mockStudents 
    : mockStudents.filter(student => student.semester === selectedSemester);
  
  // Calculate NC and DC lists
  const ncList = filteredStudents.filter(student => {
    const percentage = calculateAttendancePercentage(student.id, mockAttendance);
    return percentage >= 50 && percentage < 75;
  });
  
  const dcList = filteredStudents.filter(student => {
    const percentage = calculateAttendancePercentage(student.id, mockAttendance);
    return percentage < 50;
  });
  
  // Sort students by attendance (lowest first)
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const aPercentage = calculateAttendancePercentage(a.id, mockAttendance);
    const bPercentage = calculateAttendancePercentage(b.id, mockAttendance);
    return aPercentage - bPercentage;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Attendance Reports</h1>
            <p className="text-muted-foreground">View and analyze attendance data</p>
          </div>
          
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Semester:</span>
              <select 
                className="border rounded p-2 text-sm"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
                {semesters.map(semester => (
                  <option key={semester} value={semester}>{semester}</option>
                ))}
              </select>
            </div>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export Report
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-500" />
                Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{filteredStudents.length}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {selectedSemester === 'All' ? 'Total enrolled' : `Enrolled in ${selectedSemester}`}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <X className="h-5 w-5 mr-2 text-red-500" />
                NC List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{ncList.length}</div>
              <div className="text-sm text-muted-foreground mt-1">
                Students with 50-75% attendance
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <X className="h-5 w-5 mr-2 text-red-500" />
                DC List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dcList.length}</div>
              <div className="text-sm text-muted-foreground mt-1">
                Students with below 50% attendance
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                <Tabs defaultValue="all">
                  <TabsList>
                    <TabsTrigger value="all">All Students</TabsTrigger>
                    <TabsTrigger value="nc">NC List</TabsTrigger>
                    <TabsTrigger value="dc">DC List</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsContent value="all" className="space-y-4 mt-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student Name</TableHead>
                          <TableHead>ID</TableHead>
                          <TableHead>Semester</TableHead>
                          <TableHead>Attendance</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedStudents.map(student => {
                          const attendancePercentage = calculateAttendancePercentage(student.id, mockAttendance);
                          const status = getAttendanceStatus(attendancePercentage);
                          
                          return (
                            <TableRow key={student.id}>
                              <TableCell className="font-medium">{student.name}</TableCell>
                              <TableCell>{student.studentId}</TableCell>
                              <TableCell>{student.semester}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress value={attendancePercentage} className="h-2 w-[60px]" />
                                  <span>{attendancePercentage}%</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    status === 'Regular' 
                                      ? 'default' 
                                      : status === 'NC' 
                                        ? 'outline' 
                                        : 'destructive'
                                  }
                                >
                                  {status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="nc" className="mt-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student Name</TableHead>
                          <TableHead>ID</TableHead>
                          <TableHead>Semester</TableHead>
                          <TableHead>Attendance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ncList.length > 0 ? (
                          ncList.map(student => {
                            const attendancePercentage = calculateAttendancePercentage(student.id, mockAttendance);
                            
                            return (
                              <TableRow key={student.id}>
                                <TableCell className="font-medium">{student.name}</TableCell>
                                <TableCell>{student.studentId}</TableCell>
                                <TableCell>{student.semester}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Progress value={attendancePercentage} className="h-2 w-[60px]" />
                                    <span>{attendancePercentage}%</span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                              No students in NC list
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="dc" className="mt-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student Name</TableHead>
                          <TableHead>ID</TableHead>
                          <TableHead>Semester</TableHead>
                          <TableHead>Attendance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dcList.length > 0 ? (
                          dcList.map(student => {
                            const attendancePercentage = calculateAttendancePercentage(student.id, mockAttendance);
                            
                            return (
                              <TableRow key={student.id}>
                                <TableCell className="font-medium">{student.name}</TableCell>
                                <TableCell>{student.studentId}</TableCell>
                                <TableCell>{student.semester}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Progress value={attendancePercentage} className="h-2 w-[60px]" />
                                    <span>{attendancePercentage}%</span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                              No students in DC list
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-primary" />
                Attendance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceReport students={filteredStudents} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Reports;
