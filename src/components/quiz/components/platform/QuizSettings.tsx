
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { QuizSettingsProps } from '../../types/platform-types';

const QuizSettings: React.FC<QuizSettingsProps> = ({
  topics,
  selectedTopics,
  handleTopicChange,
  subjects,
  selectedSubjects,
  handleSubjectChange,
  questionCount,
  handleQuestionCountChange,
  initialDifficulty,
  handleDifficultyChange,
  showSettings,
  setShowSettings,
  handleStartQuiz
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Select Topics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {topics.map(topic => (
            <div key={topic} className="flex items-center space-x-2">
              <Checkbox 
                id={`topic-${topic}`} 
                checked={selectedTopics.includes(topic)}
                onCheckedChange={() => handleTopicChange(topic)}
              />
              <Label htmlFor={`topic-${topic}`}>{topic}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Select Subjects</h3>
        <div className="grid grid-cols-2 gap-2">
          {subjects.map(subject => (
            <div key={subject} className="flex items-center space-x-2">
              <Checkbox 
                id={`subject-${subject}`} 
                checked={selectedSubjects.includes(subject)}
                onCheckedChange={() => handleSubjectChange(subject)}
              />
              <Label htmlFor={`subject-${subject}`} className="capitalize">{subject}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="question-count">Number of Questions</Label>
          <Select 
            value={questionCount.toString()} 
            onValueChange={handleQuestionCountChange}
          >
            <SelectTrigger id="question-count">
              <SelectValue placeholder="Select number of questions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 Questions</SelectItem>
              <SelectItem value="5">5 Questions</SelectItem>
              <SelectItem value="10">10 Questions</SelectItem>
              <SelectItem value="15">15 Questions</SelectItem>
              <SelectItem value="20">20 Questions</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="difficulty">Initial Difficulty</Label>
          <Select 
            value={initialDifficulty.toString()} 
            onValueChange={handleDifficultyChange}
          >
            <SelectTrigger id="difficulty">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Easy</SelectItem>
              <SelectItem value="2">Medium</SelectItem>
              <SelectItem value="3">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default QuizSettings;
