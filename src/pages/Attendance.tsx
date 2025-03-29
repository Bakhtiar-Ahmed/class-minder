
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Check, Clock, ListX, MoreHorizontal, Search } from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { AttendanceTable } from '@/components/AttendanceTable';
import Navbar from '@/components/Navbar';
import { mockClasses, mockStudents } from '@/utils/attendanceUtils';

const Attendance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  
  // Filter classes based on search
  const filteredClasses = mockClasses.filter(cls => 
    cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.room?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    format(new Date(cls.startTime), 'MMMM d, yyyy').toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort classes by date (newest first)
  const sortedClasses = [...filteredClasses].sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );
  
  // Get selected class details
  const selectedClassDetails = selectedClass 
    ? mockClasses.find(cls => cls.id === selectedClass) 
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Attendance Tracking</h1>
            <p className="text-muted-foreground">Track and manage class attendance</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  Class Sessions
                </span>
              </CardTitle>
              
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search classes..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {sortedClasses.length > 0 ? (
                  sortedClasses.map(cls => (
                    <div 
                      key={cls.id} 
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedClass === cls.id 
                          ? 'bg-primary/10 border-primary' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedClass(cls.id)}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{cls.title}</h4>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Edit Class</DropdownMenuItem>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Download Attendance</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mt-1 space-y-1">
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                          <span>{format(new Date(cls.startTime), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                          <span>
                            {format(new Date(cls.startTime), 'h:mm a')} - {format(new Date(cls.endTime), 'h:mm a')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline">
                          {cls.room || 'No Room'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {mockStudents.length} students
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <ListX className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No classes found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Check className="h-5 w-5 mr-2 text-primary" />
                  {selectedClassDetails ? (
                    <span>
                      Attendance: {selectedClassDetails.title} - {format(new Date(selectedClassDetails.startTime), 'MMM d, yyyy')}
                    </span>
                  ) : (
                    <span>Select a class to take attendance</span>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {selectedClassDetails ? (
                <AttendanceTable 
                  classId={selectedClassDetails.id}
                  classDate={new Date(selectedClassDetails.startTime)}
                />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg">Please select a class from the list</p>
                  <p className="max-w-md mx-auto mt-2">
                    Select a class session from the list on the left to view or take attendance for that session.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Attendance;
