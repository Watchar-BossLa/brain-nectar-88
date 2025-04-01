
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FlashcardFormInputsProps {
  frontContent: string;
  setFrontContent: (value: string) => void;
  backContent: string;
  setBackContent: (value: string) => void;
  topicId: string;
  setTopicId: (value: string) => void;
  topics: Array<{ id: string; title: string }>;
}

const FlashcardFormInputs: React.FC<FlashcardFormInputsProps> = ({
  frontContent,
  setFrontContent,
  backContent,
  setBackContent,
  topicId,
  setTopicId,
  topics
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="front-content">Front (Question)</Label>
        <Textarea
          id="front-content"
          placeholder="Enter the question or prompt (use $$formula$$ for math formulas)"
          value={frontContent}
          onChange={(e) => setFrontContent(e.target.value)}
          rows={3}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="back-content">Back (Answer)</Label>
        <Textarea
          id="back-content"
          placeholder="Enter the answer or explanation (use $$formula$$ for math formulas)"
          value={backContent}
          onChange={(e) => setBackContent(e.target.value)}
          rows={3}
          required
        />
      </div>
      
      {topics.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="topic">Topic (Optional)</Label>
          <Select value={topicId} onValueChange={setTopicId}>
            <SelectTrigger id="topic">
              <SelectValue placeholder="Select a topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No topic</SelectItem>
              {topics.map(topic => (
                <SelectItem key={topic.id} value={topic.id}>
                  {topic.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default FlashcardFormInputs;
