import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/**
 * Activity Calendar Component
 * Shows a heatmap of study activity over time
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Calendar data
 * @param {string} props.title - Component title
 * @param {string} props.description - Component description
 * @returns {React.ReactElement} Activity calendar component
 */
const ActivityCalendar = ({ 
  data = [], 
  title = "Activity Calendar", 
  description = "Your study activity over time" 
}) => {
  const [year, setYear] = React.useState(new Date().getFullYear().toString());
  
  // Get years from data
  const getYears = () => {
    const years = new Set();
    data.forEach(item => {
      const date = new Date(item.date);
      years.add(date.getFullYear().toString());
    });
    return Array.from(years).sort((a, b) => b - a); // Sort descending
  };
  
  const years = getYears();
  
  // Filter data by year
  const getFilteredData = () => {
    return data.filter(item => {
      const date = new Date(item.date);
      return date.getFullYear().toString() === year;
    });
  };
  
  const filteredData = getFilteredData();
  
  // Generate calendar cells
  const generateCalendarCells = () => {
    const cells = [];
    const currentYear = parseInt(year);
    
    // Create a map of date -> activity level
    const activityMap = new Map();
    filteredData.forEach(item => {
      activityMap.set(item.date, item.activity_level);
    });
    
    // Generate cells for each day of the year
    const startDate = new Date(currentYear, 0, 1); // Jan 1
    const endDate = new Date(currentYear, 11, 31); // Dec 31
    
    // Get the day of week for Jan 1 (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = startDate.getDay();
    
    // Add empty cells for days before Jan 1
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push(<div key={`empty-${i}`} className="w-3 h-3" />);
    }
    
    // Add cells for each day of the year
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const activityLevel = activityMap.get(dateStr) || 0;
      
      // Get color based on activity level (0-4)
      let bgColor;
      switch (activityLevel) {
        case 0:
          bgColor = 'bg-muted';
          break;
        case 1:
          bgColor = 'bg-green-100 dark:bg-green-900';
          break;
        case 2:
          bgColor = 'bg-green-300 dark:bg-green-700';
          break;
        case 3:
          bgColor = 'bg-green-500 dark:bg-green-500';
          break;
        case 4:
          bgColor = 'bg-green-700 dark:bg-green-300';
          break;
        default:
          bgColor = 'bg-muted';
      }
      
      const formattedDate = d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      cells.push(
        <TooltipProvider key={dateStr}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className={`w-3 h-3 rounded-sm ${bgColor} cursor-pointer`}
                data-date={dateStr}
              />
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs">
                <div className="font-medium">{formattedDate}</div>
                <div>{activityLevel === 0 ? 'No activity' : `${activityLevel} ${activityLevel === 1 ? 'activity' : 'activities'}`}</div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    return cells;
  };
  
  // If no data, show placeholder
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Select
              value={year}
              onValueChange={setYear}
              disabled
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={new Date().getFullYear().toString()}>
                  {new Date().getFullYear()}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="h-[150px] flex items-center justify-center">
            <p className="text-muted-foreground">No activity data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Select
            value={year}
            onValueChange={setYear}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map(y => (
                <SelectItem key={y} value={y}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="mr-1">Less</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-muted" />
              <div className="w-3 h-3 rounded-sm bg-green-100 dark:bg-green-900" />
              <div className="w-3 h-3 rounded-sm bg-green-300 dark:bg-green-700" />
              <div className="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-500" />
              <div className="w-3 h-3 rounded-sm bg-green-700 dark:bg-green-300" />
            </div>
            <span className="ml-1">More</span>
          </div>
        </div>
        
        <div className="overflow-x-auto pb-2">
          <div className="flex text-xs text-muted-foreground mb-2">
            <div className="w-8"></div>
            <div className="flex justify-between w-full">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex flex-col justify-between text-xs text-muted-foreground mr-2">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>
            
            <div className="grid grid-flow-col gap-1">
              <div className="grid grid-rows-7 gap-1">
                {generateCalendarCells()}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCalendar;
