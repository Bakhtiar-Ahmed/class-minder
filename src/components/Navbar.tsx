
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Calendar, ChevronRight, ClipboardList, Home, PieChart, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: "Dashboard", path: "/", icon: <Home className="h-5 w-5 mr-2" /> },
    { name: "Students", path: "/students", icon: <Users className="h-5 w-5 mr-2" /> },
    { name: "Schedule", path: "/schedule", icon: <Calendar className="h-5 w-5 mr-2" /> },
    { name: "Attendance", path: "/attendance", icon: <ClipboardList className="h-5 w-5 mr-2" /> },
    { name: "Reports", path: "/reports", icon: <PieChart className="h-5 w-5 mr-2" /> },
  ];

  return (
    <div className="bg-sidebar border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <BookOpen className="h-6 w-6 text-primary mr-2" />
          <span className="text-xl font-bold">Class-Minder</span>
        </div>
        
        <nav className="hidden md:flex">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button 
                variant={location.pathname === item.path ? "default" : "ghost"} 
                className="mx-1"
              >
                {item.icon}
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>
        
        <div className="md:hidden">
          <Button variant="outline" size="sm" className="ml-auto">
            Menu
          </Button>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-2 flex text-sm text-muted-foreground">
        <div className="flex items-center">
          <Home className="h-3 w-3 mr-1" />
          <span>Home</span>
          {location.pathname !== "/" && (
            <>
              <ChevronRight className="h-3 w-3 mx-1" />
              <span className="font-medium text-foreground">
                {navItems.find(item => item.path === location.pathname)?.name || "Page"}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
