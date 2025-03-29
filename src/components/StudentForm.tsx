
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Student } from '@/utils/attendanceUtils';

interface StudentFormProps {
  student?: Student;
  onClose: () => void;
}

export const StudentForm: React.FC<StudentFormProps> = ({ student, onClose }) => {
  const { toast } = useToast();
  const isEditMode = !!student;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would save the data to a database
    toast({
      title: `Student ${isEditMode ? 'updated' : 'added'} successfully`,
      description: "Student data has been saved to the system.",
    });
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name"
            defaultValue={student?.name || ''}
            placeholder="John Smith"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="studentId">Student ID</Label>
          <Input 
            id="studentId"
            defaultValue={student?.studentId || ''}
            placeholder="S20230001"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email"
            type="email"
            defaultValue={student?.email || ''}
            placeholder="student@university.edu"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone"
            defaultValue={student?.phone || ''}
            placeholder="555-123-4567"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="semester">Semester</Label>
          <select 
            id="semester"
            className="w-full border rounded p-2"
            defaultValue={student?.semester || ''}
            required
          >
            <option value="">Select Semester</option>
            <option>Fall 2023</option>
            <option>Spring 2024</option>
            <option>Summer 2024</option>
            <option>Fall 2024</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="program">Program/Course</Label>
          <Input 
            id="program"
            defaultValue={student?.program || ''}
            placeholder="Computer Science"
          />
        </div>
      </div>
      
      <Separator />
      
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditMode ? 'Update Student' : 'Add Student'}
        </Button>
      </div>
    </form>
  );
};
