
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  ChevronRight, 
  ClipboardList, 
  Users, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import { 
  mockStudents, 
  mockClasses, 
  calculateAttendancePercentage, 
  mockAttendance,
  getStudentsByAttendanceStatus 
} from '@/utils/attendanceUtils';

const Index = () => {
  // Get today's date
  const today = new Date();
  
  // Get upcoming classes (classes scheduled for today or in the future)
  const upcomingClasses = mockClasses
    .filter(cls => new Date(cls.startTime) >= today)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 3);
  
  // Calculate average attendance
  const averageAttendance = mockStudents.reduce((sum, student) => {
    return sum + calculateAttendancePercentage(student.id, mockAttendance);
  }, 0) / mockStudents.length;
  
  // Get NC and DC students
  const ncStudents = getStudentsByAttendanceStatus('NC');
  const dcStudents = getStudentsByAttendanceStatus('DC');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-500" />
                Total Students
              </CardTitle>
              <CardDescription>Enrolled this semester</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockStudents.length}</div>
              <Link to="/students" className="text-sm text-primary flex items-center mt-2">
                View all students <ChevronRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-indigo-500" />
                Scheduled Classes
              </CardTitle>
              <CardDescription>This semester</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockClasses.length}</div>
              <Link to="/schedule" className="text-sm text-primary flex items-center mt-2">
                View schedule <ChevronRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <ClipboardList className="h-5 w-5 mr-2 text-green-500" />
                Average Attendance
              </CardTitle>
              <CardDescription>Across all classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold">{Math.round(averageAttendance)}%</div>
                <Progress value={averageAttendance} className="h-2" />
              </div>
              <Link to="/reports" className="text-sm text-primary flex items-center mt-2">
                View reports <ChevronRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Upcoming Classes */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                Upcoming Classes
              </CardTitle>
              <CardDescription>Classes scheduled for the near future</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingClasses.length > 0 ? (
                <div className="space-y-4">
                  {upcomingClasses.map((cls) => (
                    <div key={cls.id} className="flex items-center gap-4 p-3 rounded-lg border">
                      <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-lg flex flex-col items-center justify-center">
                        <span className="text-xs">{cls.startTime.toLocaleDateString(undefined, { month: 'short' })}</span>
                        <span className="text-lg font-bold">{cls.startTime.getDate()}</span>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">{cls.title}</h4>
                        <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4">
                          <span>{cls.startTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} - {cls.endTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                          {cls.room && <span>Room: {cls.room}</span>}
                        </div>
                      </div>
                      <div>
                        <Link to={`/attendance/${cls.id}`}>
                          <Button variant="outline" size="sm">
                            Take Attendance
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No upcoming classes scheduled</p>
                  <Link to="/schedule">
                    <Button variant="link" className="mt-2">
                      Schedule a new class
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Attendance Concerns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-destructive" />
                Attendance Concerns
              </CardTitle>
              <CardDescription>Students at risk</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dcStudents.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-destructive flex items-center">
                      <span className="h-2 w-2 rounded-full bg-destructive mr-2"></span>
                      DC List ({dcStudents.length})
                    </h4>
                    <div className="text-sm space-y-1">
                      {dcStudents.map(student => (
                        <div key={student.id} className="flex justify-between py-1 border-b">
                          <span>{student.name}</span>
                          <span className="font-medium">
                            {calculateAttendancePercentage(student.id, mockAttendance)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {ncStudents.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-amber-500 flex items-center">
                      <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                      NC List ({ncStudents.length})
                    </h4>
                    <div className="text-sm space-y-1">
                      {ncStudents.map(student => (
                        <div key={student.id} className="flex justify-between py-1 border-b">
                          <span>{student.name}</span>
                          <span className="font-medium">
                            {calculateAttendancePercentage(student.id, mockAttendance)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {ncStudents.length === 0 && dcStudents.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No attendance concerns</p>
                  </div>
                )}
              </div>
              
              <Separator className="my-4" />
              
              <Link to="/reports">
                <Button variant="outline" size="sm" className="w-full">
                  View Full Reports
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
