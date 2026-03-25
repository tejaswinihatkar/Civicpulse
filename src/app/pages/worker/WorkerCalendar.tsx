import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface Task {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'scheduled' | 'in-progress' | 'completed';
}

export function WorkerCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 13)); // March 13, 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 2, 13));

  const tasks: Task[] = [
    {
      id: '1',
      title: 'Fix Street Light',
      date: '2026-03-13',
      time: '09:00 AM',
      location: 'MG Road, Sector 14',
      priority: 'High',
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Repair Pothole',
      date: '2026-03-13',
      time: '02:00 PM',
      location: 'Highway 24',
      priority: 'Critical',
      status: 'scheduled'
    },
    {
      id: '3',
      title: 'Clean Drainage',
      date: '2026-03-14',
      time: '10:00 AM',
      location: 'Park Street',
      priority: 'Medium',
      status: 'scheduled'
    },
    {
      id: '4',
      title: 'Tree Trimming',
      date: '2026-03-15',
      time: '11:00 AM',
      location: 'Central Park',
      priority: 'Low',
      status: 'scheduled'
    },
    {
      id: '5',
      title: 'Water Pipe Repair',
      date: '2026-03-16',
      time: '09:30 AM',
      location: 'Main Street',
      priority: 'High',
      status: 'scheduled'
    }
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getTasksForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(task => task.date === dateStr);
  };

  const getSelectedDateTasks = () => {
    if (!selectedDate) return [];
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    return tasks.filter(task => task.date === dateStr);
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Calendar</h1>
          <p className="text-gray-600">View and manage your scheduled tasks</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={previousMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Day Names */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square" />
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const dayTasks = getTasksForDate(day);
                  const selected = isSelected(day);
                  const today = isToday(day);

                  return (
                    <button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={`aspect-square p-2 rounded-xl border-2 transition-all ${
                        selected
                          ? 'border-blue-600 bg-blue-50'
                          : today
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-transparent hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="h-full flex flex-col">
                        <span className={`text-sm font-medium ${
                          selected ? 'text-blue-600' : today ? 'text-purple-600' : 'text-gray-900'
                        }`}>
                          {day}
                        </span>
                        {dayTasks.length > 0 && (
                          <div className="flex-1 flex items-center justify-center">
                            <div className="flex gap-1">
                              {dayTasks.slice(0, 3).map((task, i) => (
                                <div
                                  key={i}
                                  className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(task.priority)}`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-600">Critical</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-gray-600">High</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-600">Medium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-600">Low</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Selected Date Tasks */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Select a date'}
                </h2>
              </div>

              <div className="space-y-4">
                {getSelectedDateTasks().length > 0 ? (
                  getSelectedDateTasks().map((task) => (
                    <div
                      key={task.id}
                      className="p-4 bg-gray-50 rounded-xl border-l-4"
                      style={{ borderLeftColor: getPriorityColor(task.priority).replace('bg-', '#').replace('500', '') }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium text-white ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{task.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{task.location}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No tasks scheduled</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white"
            >
              <h3 className="font-semibold mb-4">This Week</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Total Tasks</span>
                  <span className="text-2xl font-bold">{tasks.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Completed</span>
                  <span className="text-2xl font-bold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Pending</span>
                  <span className="text-2xl font-bold">{tasks.length}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
