
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FlashcardFormInputsProps {
  front: string;
  setFront: (value: string) => void;
  back: string;
  setBack: (value: string) => void;
  topicId?: string;
  setTopicId?: (value: string) => void;
  topics?: Array<{ id: string; title: string }>;
}

const FlashcardFormInputs: React.FC<FlashcardFormInputsProps> = ({
  front,
  setFront,
  back,
  setBack,
  topicId,
  setTopicId,
  topics = []
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="front-content">Front (Question)</Label>
        <Textarea
          id="front-content"
          placeholder="Enter the question or prompt (use $$formula$$ for math formulas)"
          value={front}
          onChange={(e) => setFront(e.target.value)}
          rows={3}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="back-content">Back (Answer)</Label>
        <Textarea
          id="back-content"
          placeholder="Enter the answer or explanation (use $$formula$$ for math formulas)"
          value={back}
          onChange={(e) => setBack(e.target.value)}
          rows={3}
          required
        />
      </div>
      
      {topics && topics.length > 0 && setTopicId && (
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
