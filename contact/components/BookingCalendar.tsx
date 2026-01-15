'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface CalendarDay {
  date: string;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  isSelected: boolean;
  hasAvailability: boolean;
}

const BookingCalendar = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [currentMonth] = useState('January 2026');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const calendarDays: CalendarDay[] = [
    { date: '2026-01-08', dayName: 'Wed', dayNumber: 8, isToday: true, isSelected: false, hasAvailability: true },
    { date: '2026-01-09', dayName: 'Thu', dayNumber: 9, isToday: false, isSelected: false, hasAvailability: true },
    { date: '2026-01-10', dayName: 'Fri', dayNumber: 10, isToday: false, isSelected: false, hasAvailability: true },
    { date: '2026-01-11', dayName: 'Sat', dayNumber: 11, isToday: false, isSelected: false, hasAvailability: false },
    { date: '2026-01-12', dayName: 'Sun', dayNumber: 12, isToday: false, isSelected: false, hasAvailability: false },
    { date: '2026-01-13', dayName: 'Mon', dayNumber: 13, isToday: false, isSelected: false, hasAvailability: true },
    { date: '2026-01-14', dayName: 'Tue', dayNumber: 14, isToday: false, isSelected: false, hasAvailability: true },
  ];

  const timeSlots: TimeSlot[] = [
    { time: '10:00 AM', available: true },
    { time: '11:00 AM', available: true },
    { time: '12:00 PM', available: false },
    { time: '02:00 PM', available: true },
    { time: '03:00 PM', available: true },
    { time: '04:00 PM', available: false },
    { time: '05:00 PM', available: true },
    { time: '06:00 PM', available: true },
  ];

  const handleDateSelect = (date: string) => {
    if (!isHydrated) return;
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleTimeSelect = (time: string) => {
    if (!isHydrated) return;
    setSelectedTime(time);
  };

  const handleBooking = () => {
    if (!isHydrated || !selectedDate || !selectedTime) return;
    alert(`Booking confirmed for ${selectedDate} at ${selectedTime}`);
  };

  if (!isHydrated) {
    return (
      <section className="py-12 lg:py-16">
        <div className="mx-auto px-6 max-w-6xl">
          <div className="bg-card rounded-xl p-8 lg:p-12 border border-border shadow-sm">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto px-6 max-w-6xl">
        <div className="bg-card rounded-xl p-8 lg:p-12 border border-border shadow-sm">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Book a Reading
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Select your preferred date and time for a consultation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">{currentMonth}</h3>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-lg hover:bg-muted transition-all duration-250 active:scale-95">
                    <Icon name="ChevronLeftIcon" size={20} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-muted transition-all duration-250 active:scale-95">
                    <Icon name="ChevronRightIcon" size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="text-center caption font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day) => (
                  <button
                    key={day.date}
                    onClick={() => handleDateSelect(day.date)}
                    disabled={!day.hasAvailability}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-all duration-250 ${
                      selectedDate === day.date
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : day.isToday
                        ? 'bg-accent text-accent-foreground'
                        : day.hasAvailability
                        ? 'bg-muted hover:bg-muted/80 text-foreground'
                        : 'bg-background text-muted-foreground opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <span className="caption font-medium">{day.dayName}</span>
                    <span className="text-lg font-bold">{day.dayNumber}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Icon name="InformationCircleIcon" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                  <div className="caption text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Booking Information</p>
                    <p>All times shown in GMT. Weekends are typically unavailable. Please book at least 24 hours in advance.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-6">
                {selectedDate ? 'Available Time Slots' : 'Select a Date First'}
              </h3>

              {selectedDate ? (
                <div className="space-y-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => handleTimeSelect(slot.time)}
                      disabled={!slot.available}
                      className={`w-full p-4 rounded-lg font-medium transition-all duration-250 flex items-center justify-between ${
                        selectedTime === slot.time
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : slot.available
                          ? 'bg-muted hover:bg-muted/80 text-foreground'
                          : 'bg-background text-muted-foreground opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <span>{slot.time}</span>
                      {slot.available ? (
                        <Icon name="CheckCircleIcon" size={20} className={selectedTime === slot.time ? 'text-primary-foreground' : 'text-success'} />
                      ) : (
                        <span className="caption text-error">Booked</span>
                      )}
                    </button>
                  ))}

                  {selectedDate && selectedTime && (
                    <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-lg">
                      <h4 className="font-bold text-foreground mb-4">Booking Summary</h4>
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center justify-between caption">
                          <span className="text-muted-foreground">Date:</span>
                          <span className="font-medium text-foreground">{selectedDate}</span>
                        </div>
                        <div className="flex items-center justify-between caption">
                          <span className="text-muted-foreground">Time:</span>
                          <span className="font-medium text-foreground">{selectedTime}</span>
                        </div>
                        <div className="flex items-center justify-between caption">
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="font-medium text-foreground">60 minutes</span>
                        </div>
                      </div>
                      <button
                        onClick={handleBooking}
                        className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-250 active:scale-95 flex items-center justify-center space-x-2"
                      >
                        <Icon name="CalendarIcon" size={20} />
                        <span>Confirm Booking</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Icon name="CalendarDaysIcon" size={64} className="text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">
                    Please select a date from the calendar to view available time slots
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingCalendar;