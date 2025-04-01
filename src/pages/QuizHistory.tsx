
import React from 'react'
import MainLayout from '@/components/layout/MainLayout'

export default function QuizHistory() {
  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Quiz History</h1>
        <p className="text-muted-foreground">
          View your previous quiz results and track your progress over time.
        </p>
      </div>
    </MainLayout>
  )
}
