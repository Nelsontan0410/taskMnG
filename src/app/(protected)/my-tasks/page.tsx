'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, Filter, SortDesc, Plus } from 'lucide-react'
import { getTasksForUser, updateTaskStatus } from '@/lib/tasks'
import { useAuthStore } from '@/stores/authStore'
import type { Task } from '@/lib/supabase'

type TaskWithUser = Task & {
  assigned_user?: { name: string; email: string }
}

type FilterStatus = 'all' | Task['status']
type FilterPriority = 'all' | Task['priority']

const getStatusColor = (status: Task['status']) => {
  switch (status) {
    case 'todo': return 'bg-gray-100 text-gray-800'
    case 'in_progress': return 'bg-blue-100 text-blue-800'
    case 'completed': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'urgent': return 'bg-red-100 text-red-800'
    case 'high': return 'bg-orange-100 text-orange-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'low': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const isOverdue = (dueDate: string) => {
  return new Date(dueDate) < new Date() && new Date().toDateString() !== new Date(dueDate).toDateString()
}

export default function MyTasksPage() {
  const { user } = useAuthStore()
  const [tasks, setTasks] = useState<TaskWithUser[]>([])
  const [filteredTasks, setFilteredTasks] = useState<TaskWithUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>('all')
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'created'>('dueDate')

  useEffect(() => {
    if (user) {
      fetchTasks()
    }
  }, [user])

  useEffect(() => {
    filterAndSortTasks()
  }, [tasks, statusFilter, priorityFilter, sortBy])

  const fetchTasks = async () => {
    if (!user) return
    
    try {
      const { data } = await getTasksForUser(user.id)
      if (data) {
        setTasks(data)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortTasks = () => {
    let filtered = [...tasks]

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter)
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.due_date && !b.due_date) return 0
          if (!a.due_date) return 1
          if (!b.due_date) return -1
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
        
        case 'priority':
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        
        default:
          return 0
      }
    })

    setFilteredTasks(filtered)
  }

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    if (!user) return

    try {
      await updateTaskStatus(taskId, newStatus, user.id)
      
      // Update local state
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ))
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600">Track and manage your assigned tasks</p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Status:</span>
          <div className="flex space-x-1">
            {['all', 'todo', 'in_progress', 'completed'].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter(status as FilterStatus)}
              >
                {status === 'all' ? 'All' : status.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Priority:</span>
          <div className="flex space-x-1">
            {['all', 'urgent', 'high', 'medium', 'low'].map((priority) => (
              <Button
                key={priority}
                variant={priorityFilter === priority ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPriorityFilter(priority as FilterPriority)}
              >
                {priority === 'all' ? 'All' : priority}
              </Button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="created">Created Date</option>
          </select>
        </div>
      </div>

      {/* Tasks Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </p>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? filteredTasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{task.title}</CardTitle>
                <div className="flex space-x-2">
                  <Badge className={getStatusColor(task.status)}>
                    {task.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  {task.due_date && isOverdue(task.due_date) && task.status !== 'completed' && (
                    <Badge className="bg-red-100 text-red-800">
                      Overdue
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {task.description && (
                <p className="text-gray-600 mb-4">{task.description}</p>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  {task.due_date && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {formatDate(task.due_date)}</span>
                    </div>
                  )}
                  {task.estimated_hours > 0 && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{task.time_spent}h / {task.estimated_hours}h</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>Assigned to me</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {task.status === 'todo' && (
                    <Button 
                      size="sm"
                      onClick={() => handleStatusChange(task.id, 'in_progress')}
                    >
                      Start Task
                    </Button>
                  )}
                  {task.status === 'in_progress' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusChange(task.id, 'todo')}
                      >
                        Pause
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleStatusChange(task.id, 'completed')}
                      >
                        Complete
                      </Button>
                    </>
                  )}
                  {task.status === 'completed' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleStatusChange(task.id, 'in_progress')}
                    >
                      Reopen
                    </Button>
                  )}
                  <Button size="sm" variant="ghost">Edit</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No tasks found matching the current filters.</p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create your first task
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
