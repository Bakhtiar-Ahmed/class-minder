
import React, { useState } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, ChevronLeft, ChevronRight, Edit, Trash, Users } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClassScheduler } from '@/components/ClassScheduler';
import Navbar from '@/components/Navbar';
import { mockClasses, mockStudents } from '@/utils/attendanceUtils';

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAddingClass, setIsAddingClass] = useState(false);
  
  // Find classes for the selected date
  const classesForDate = selectedDate 
    ? mockClasses.filter(cls => 
        isSameDay(new Date(cls.startTime), selectedDate)
      )
    : [];
    
  // Generate week view data
  const currentWeekStart = startOfWeek(selectedDate || new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));
  
  // Function to get classes for a specific day
  const getClassesForDay = (date: Date) => {
    return mockClasses.filter(cls => isSameDay(new Date(cls.startTime), date));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Class Schedule</h1>
            <p className="text-muted-foreground">
              Schedule and manage your classes
            </p>
          </div>
          
          <Dialog open={isAddingClass} onOpenChange={setIsAddingClass}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                Schedule Class
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Schedule a New Class</DialogTitle>
                <DialogDescription>
                  Add details for the new class session
                </DialogDescription>
              </DialogHeader>
              <ClassScheduler 
                onClose={() => setIsAddingClass(false)}
                initialDate={selectedDate}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:row-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border w-full"
                modifiers={{
                  withClasses: mockClasses.map(cls => new Date(cls.startTime))
                }}
                modifiersClassNames={{
                  withClasses: 'calendar-day-with-class'
                }}
              />
              
              <div className="mt-6">
                <h3 className="font-medium mb-4">
                  Classes on {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Selected Date'}
                </h3>
                
                {classesForDate.length > 0 ? (
                  <div className="space-y-3">
                    {classesForDate.map(cls => (
                      <div key={cls.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                        <h4 className="font-medium">{cls.title}</h4>
                        <div className="text-sm text-muted-foreground mt-1 space-y-1">
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                            <span>
                              {format(new Date(cls.startTime), 'h:mm a')} - {format(new Date(cls.endTime), 'h:mm a')}
                            </span>
                          </div>
                          {cls.room && (
                            <div className="flex items-center">
                              <MapPin className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                              <span>{cls.room}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <Users className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                            <span>{mockStudents.length} students</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                            <Trash className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground border rounded-lg">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No classes scheduled for this date</p>
                    <Button 
                      variant="link" 
                      className="mt-2"
                      onClick={() => setIsAddingClass(true)}
                    >
                      Schedule a class
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  Week View
                </div>
                <div className="flex items-center">
                  <Button variant="ghost" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm mx-2">
                    Week of {format(currentWeekStart, 'MMM d, yyyy')}
                  </span>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 text-center">
                {weekDays.map((day, index) => (
                  <div 
                    key={index} 
                    className={`text-sm ${isSameDay(day, new Date()) ? 'bg-primary/10 rounded-md' : ''}`}
                  >
                    <div className="font-medium py-1">{format(day, 'EEE')}</div>
                    <div className="text-xs text-muted-foreground">{format(day, 'MMM d')}</div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2 mt-2">
                {weekDays.map((day, index) => {
                  const dayClasses = getClassesForDay(day);
                  
                  return (
                    <div 
                      key={index} 
                      className={`min-h-[120px] text-sm border rounded-md p-1 ${
                        isSameDay(day, selectedDate || new Date()) ? 'bg-muted/50 border-primary' : ''
                      }`}
                      onClick={() => setSelectedDate(day)}
                    >
                      {dayClasses.length > 0 ? (
                        <div className="space-y-1">
                          {dayClasses.map(cls => (
                            <div 
                              key={cls.id} 
                              className="bg-primary/10 p-1 rounded text-xs overflow-hidden text-ellipsis"
                            >
                              <div className="font-medium">{cls.title}</div>
                              <div>{format(new Date(cls.startTime), 'h:mm a')}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div 
                          className="h-full flex items-center justify-center text-muted-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDate(day);
                            setIsAddingClass(true);
                          }}
                        >
                          <Button variant="ghost" size="sm" className="h-6 text-xs">
                            <Plus className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                <Tabs defaultValue="upcoming">
                  <TabsList>
                    <TabsTrigger value="upcoming">Upcoming Classes</TabsTrigger>
                    <TabsTrigger value="all">All Classes</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upcoming">
                <TabsContent value="upcoming" className="space-y-4 mt-0">
                  {mockClasses
                    .filter(cls => new Date(cls.startTime) >= new Date())
                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                    .slice(0, 5)
                    .map(cls => (
                      <div key={cls.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex flex-col items-center justify-center">
                          <span className="text-xs">{format(new Date(cls.startTime), 'MMM')}</span>
                          <span className="text-base font-bold">{format(new Date(cls.startTime), 'd')}</span>
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium">{cls.title}</h4>
                          <div className="text-sm text-muted-foreground flex flex-wrap gap-x-3">
                            <span>{format(new Date(cls.startTime), 'h:mm a')}</span>
                            {cls.room && <span>Room: {cls.room}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                </TabsContent>
                <TabsContent value="all" className="mt-0">
                  <div className="space-y-4">
                    {mockClasses
                      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                      .map(cls => (
                        <div key={cls.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex flex-col items-center justify-center">
                            <span className="text-xs">{format(new Date(cls.startTime), 'MMM')}</span>
                            <span className="text-base font-bold">{format(new Date(cls.startTime), 'd')}</span>
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-medium">{cls.title}</h4>
                            <div className="text-sm text-muted-foreground flex flex-wrap gap-x-3">
                              <span>{format(new Date(cls.startTime), 'h:mm a')}</span>
                              {cls.room && <span>Room: {cls.room}</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Schedule;
