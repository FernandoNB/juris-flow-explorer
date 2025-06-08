
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CalendarFilterProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

const CalendarFilter: React.FC<CalendarFilterProps> = ({
  selectedDate,
  onDateSelect
}) => {
  return (
    <div className="flex items-center space-x-2 mb-6">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Filtrar por data"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
      
      {selectedDate && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDateSelect(undefined)}
          className="h-8 px-2"
        >
          <X className="h-4 w-4" />
          Limpar filtro
        </Button>
      )}
    </div>
  );
};

export default CalendarFilter;
