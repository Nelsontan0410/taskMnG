import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Copy, Edit, Trash2 } from 'lucide-react'

// Mock data for demonstration
const templates = [
  {
    id: '1',
    name: 'Bug Fix Template',
    description: 'Standard template for bug fixes with investigation and testing steps',
    checklist: [
      'Reproduce the bug',
      'Identify root cause',
      'Implement fix',
      'Write unit tests',
      'Test in staging',
      'Deploy to production'
    ],
    createdBy: 'John Doe',
    createdAt: '2024-01-05',
    usageCount: 15
  },
  {
    id: '2',
    name: 'Feature Development',
    description: 'Complete workflow for developing new features from design to deployment',
    checklist: [
      'Review requirements',
      'Create design mockups',
      'Set up development environment',
      'Implement core functionality',
      'Add error handling',
      'Write documentation',
      'Code review',
      'QA testing',
      'Production deployment'
    ],
    createdBy: 'Sarah Smith',
    createdAt: '2024-01-03',
    usageCount: 8
  },
  {
    id: '3',
    name: 'Code Review Checklist',
    description: 'Systematic checklist for thorough code reviews',
    checklist: [
      'Check code style consistency',
      'Verify functionality works as expected',
      'Review security considerations',
      'Ensure proper error handling',
      'Validate test coverage',
      'Check performance implications'
    ],
    createdBy: 'Mike Johnson',
    createdAt: '2024-01-01',
    usageCount: 23
  }
]

export default function TemplatesPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Templates</h1>
          <p className="text-gray-600">Create and manage reusable task templates</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="mt-2">
                    {template.description}
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  {template.usageCount} uses
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Checklist Preview */}
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Checklist Items:</h4>
                  <div className="space-y-1">
                    {template.checklist.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        <span>{item}</span>
                      </div>
                    ))}
                    {template.checklist.length > 3 && (
                      <div className="text-sm text-gray-500 ml-3.5">
                        +{template.checklist.length - 3} more items...
                      </div>
                    )}
                  </div>
                </div>

                {/* Template Meta */}
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Created by {template.createdBy}</div>
                  <div>Created on {template.createdAt}</div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" className="flex-1">
                    <Copy className="h-3 w-3 mr-1" />
                    Use Template
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common template operations and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Plus className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Create New Template</div>
                <div className="text-sm text-gray-500">Start from scratch</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Copy className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Duplicate Existing</div>
                <div className="text-sm text-gray-500">Copy and modify</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Edit className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Import Template</div>
                <div className="text-sm text-gray-500">From JSON file</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
