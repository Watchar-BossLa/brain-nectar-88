
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createNewFlashcard } from '@/services/spacedRepetition';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { supabase } from '@/integrations/supabase/client';
import { flashcardSchema } from '@/lib/validators/flashcard';
import * as z from "zod";

interface FlashcardFormProps {
  topicId?: string;
  onFlashcardCreated?: () => void;
}

const FlashcardForm: React.FC<FlashcardFormProps> = ({ topicId, onFlashcardCreated }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof flashcardSchema>>({
    resolver: zodResolver(flashcardSchema),
    defaultValues: {
      question: "",
      answer: "",
      difficulty: "medium",
    },
  })

  async function onSubmit(values: z.infer<typeof flashcardSchema>) {
    setLoading(true);
    try {
      if (!user) {
        toast({
          title: "Unauthorized",
          description: "Please login to create a flashcard.",
        });
        return;
      }

      await createNewFlashcard(user.id, values.question, values.answer, topicId);

      toast({
        title: "Success",
        description: "Flashcard created successfully.",
      });

      if (onFlashcardCreated) {
        onFlashcardCreated();
      } else {
        navigate('/flashcards');
      }
    } catch (error: any) {
      console.error("Error creating flashcard:", error);
      toast({
        title: "Error",
        description: "Failed to create flashcard. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Flashcard</CardTitle>
        <CardDescription>Add a new flashcard to your collection.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter the question" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter the answer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Flashcard"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FlashcardForm;
