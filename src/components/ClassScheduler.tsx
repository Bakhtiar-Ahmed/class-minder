
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface ClassSchedulerProps {
  onClose?: () => void;
  initialDate?: Date;
}

export const ClassScheduler: React.FC<ClassSchedulerProps> = ({ 
  onClose, 
  initialDate = new Date() 
}) => {
  const [date, setDate] = useState<Date | undefined>(initialDate);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');
  const [title, setTitle] = useState('');
  const [room, setRoom] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !startTime || !endTime || !title) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Create class object
    const newClass = {
      id: Math.random().toString(36).substring(2, 11),
      title,
      description,
      room,
      startTime: new Date(`${format(date, 'yyyy-MM-dd')}T${startTime}`).toISOString(),
      endTime: new Date(`${format(date, 'yyyy-MM-dd')}T${endTime}`).toISOString(),
    };
    
    // In a real app, this would save to backend
    console.log('New class scheduled:', newClass);
    
    toast({
      title: "Class Scheduled",
      description: `${title} has been scheduled for ${format(date, 'MMMM d, yyyy')}`,
    });
    
    if (onClose) onClose();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Class Title *</Label>
          <Input 
            id="title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Enter class title"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="room">Room Number</Label>
          <Input 
            id="room" 
            value={room} 
            onChange={(e) => setRoom(e.target.value)} 
            placeholder="Enter room number"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <Label className="block mb-2">Date *</Label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="border rounded-md"
            required
          />
        </Card>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time *</Label>
            <Input 
              id="startTime" 
              type="time" 
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)} 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time *</Label>
            <Input 
              id="endTime" 
              type="time" 
              value={endTime} 
              onChange={(e) => setEndTime(e.target.value)} 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="repeat">Repeat</Label>
            <Select defaultValue="none">
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Does not repeat</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Enter class description" 
          rows={3}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Schedule Class
        </Button>
      </div>
    </form>
  );
};
