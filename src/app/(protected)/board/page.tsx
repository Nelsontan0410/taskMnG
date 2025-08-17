'use client'

import { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, User, Calendar } from 'lucide-react'
import { getTasks, updateTaskStatus } from '@/lib/tasks'
import { useAuthStore } from '@/stores/authStore'
import type { Task } from '@/lib/supabase'

type TaskWithUser = Task & {
  assigned_user?: { name: string; email: string }
}

type Column = {
  id: Task['status']
  title: string
  tasks: TaskWithUser[]
}

const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'urgent': return 'bg-red-500'
    case 'high': return 'bg-orange-500'
    case 'medium': return 'bg-yellow-500'
    case 'low': return 'bg-green-500'
    default: return 'bg-gray-500'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

export default function BoardPage() {
  const { user } = useAuthStore()
  const [columns, setColumns] = useState<Column[]>([
    { id: 'todo', title: 'To Do', tasks: [] },
    { id: 'in_progress', title: 'In Progress', tasks: [] },
    { id: 'completed', title: 'Completed', tasks: [] },
  ])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const { data: tasks } = await getTasks()
      if (tasks) {
        // Group tasks by status
        const todoTasks = tasks.filter(task => task.status === 'todo')
        const inProgressTasks = tasks.filter(task => task.status === 'in_progress')
        const completedTasks = tasks.filter(task => task.status === 'completed')

        setColumns([
          { id: 'todo', title: 'To Do', tasks: todoTasks },
          { id: 'in_progress', title: 'In Progress', tasks: inProgressTasks },
          { id: 'completed', title: 'Completed', tasks: completedTasks },
        ])
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    // If no destination, return
    if (!destination) return

    // If dropped in the same position, return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const sourceColumn = columns.find(col => col.id === source.droppableId)
    const destColumn = columns.find(col => col.id === destination.droppableId)

    if (!sourceColumn || !destColumn || !user) return

    const task = sourceColumn.tasks.find(task => task.id === draggableId)
    if (!task) return

    // Update local state immediately for better UX
    const newColumns = [...columns]
    const sourceColIndex = newColumns.findIndex(col => col.id === source.droppableId)
    const destColIndex = newColumns.findIndex(col => col.id === destination.droppableId)

    // Remove task from source column
    const sourceTasks = [...newColumns[sourceColIndex].tasks]
    sourceTasks.splice(source.index, 1)
    newColumns[sourceColIndex].tasks = sourceTasks

    // Add task to destination column with updated status
    const destTasks = [...newColumns[destColIndex].tasks]
    const updatedTask = { ...task, status: destination.droppableId as Task['status'] }
    destTasks.splice(destination.index, 0, updatedTask)
    newColumns[destColIndex].tasks = destTasks

    setColumns(newColumns)

    // Update in database
    try {
      await updateTaskStatus(draggableId, destination.droppableId as Task['status'], user.id)
    } catch (error) {
      console.error('Error updating task status:', error)
      // Revert on error
      fetchTasks()
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
          <p className="text-gray-600">Manage your tasks with drag and drop</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="bg-gray-100 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
                <Badge variant="secondary">{column.tasks.length}</Badge>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3 min-h-[200px] ${
                      snapshot.isDraggingOver ? 'bg-blue-50' : ''
                    }`}
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`cursor-pointer hover:shadow-md transition-shadow ${
                              snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
                            }`}
                          >
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm">{task.title}</CardTitle>
                              {task.description && (
                                <p className="text-xs text-gray-600 line-clamp-2">
                                  {task.description}
                                </p>
                              )}
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                                    <User className="h-3 w-3" />
                                    <span>{task.assigned_user?.name || 'Unassigned'}</span>
                                  </div>
                                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                                </div>
                                
                                {task.due_date && (
                                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                                    <Calendar className="h-3 w-3" />
                                    <span>Due {formatDate(task.due_date)}</span>
                                  </div>
                                )}
                                
                                <div className="flex justify-between items-center">
                                  <Badge 
                                    variant="outline" 
                                    className="text-xs"
                                  >
                                    {task.priority}
                                  </Badge>
                                  
                                  {task.estimated_hours > 0 && (
                                    <span className="text-xs text-gray-500">
                                      {task.time_spent}h / {task.estimated_hours}h
                                    </span>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    <Button 
                      variant="ghost" 
                      className="w-full text-gray-500 border-dashed border-2 border-gray-300 mt-3"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add a task
                    </Button>
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
