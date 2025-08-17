import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'

// Mock data for demonstration
const currentDate = new Date()
const currentMonth = currentDate.getMonth()
const currentYear = currentDate.getFullYear()

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

// Mock tasks for calendar
const tasksInMonth = {
  '5': [{ title: 'Design Review', priority: 'high' }],
  '12': [
    { title: 'Bug Fix', priority: 'urgent' },
    { title: 'Team Meeting', priority: 'low' }
  ],
  '18': [{ title: 'Feature Release', priority: 'medium' }],
  '25': [{ title: 'Monthly Report', priority: 'high' }]
}

const getDaysArray = () => {
  const days = []
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }
  
  return days
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'bg-red-500'
    case 'high': return 'bg-orange-500'
    case 'medium': return 'bg-yellow-500'
    case 'low': return 'bg-green-500'
    default: return 'bg-gray-500'
  }
}

export default function CalendarPage() {
  const days = getDaysArray()
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600">View tasks and deadlines by date</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">
              {months[currentMonth]} {currentYear}
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                Today
              </Button>
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => (
              <div
                key={index}
                className={`min-h-[100px] p-2 border rounded-lg ${
                  day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                } ${day === currentDate.getDate() ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
              >
                {day && (
                  <>
                    <div className="font-semibold text-gray-900 mb-1">{day}</div>
                    {tasksInMonth[day.toString()] && (
                      <div className="space-y-1">
                        {tasksInMonth[day.toString()].map((task, taskIndex) => (
                          <div
                            key={taskIndex}
                            className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80"
                            style={{ backgroundColor: getPriorityColor(task.priority) + '20' }}
                          >
                            <div className={`w-2 h-2 rounded-full inline-block mr-1 ${getPriorityColor(task.priority)}`}></div>
                            {task.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Tasks */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Upcoming Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Bug Fix - Login Issue</div>
                  <div className="text-sm text-gray-600">Due: Jan 12, 2024</div>
                </div>
              </div>
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">2 days</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Design Review Meeting</div>
                  <div className="text-sm text-gray-600">Due: Jan 15, 2024</div>
                </div>
              </div>
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">5 days</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
