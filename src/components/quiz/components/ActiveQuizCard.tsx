import React from 'react';
import { ActiveQuizCardProps } from '@/types/components/quiz';

const ActiveQuizCard: React.FC<ActiveQuizCardProps> = ({
  question,
  onAnswer,
  currentQuestionIndex,
  totalQuestions
}) => {
  if (!question) {
    return <div>Loading question...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="text-lg font-semibold mb-2">
        Question {currentQuestionIndex + 1} / {totalQuestions}
      </div>
      <div className="text-center mb-4">{question.questionText}</div>
      <div className="flex flex-col gap-2 w-full max-w-md">
        {question.options &&
          Object.entries(question.options).map(([key, value]) => (
            <button
              key={key}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => onAnswer(key)}
            >
              {value}
            </button>
          ))}
      </div>
    </div>
  );
};

export default ActiveQuizCard;
