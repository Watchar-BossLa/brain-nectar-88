
import { useState, useEffect } from 'react';
import { Flashcard } from './types';
import { calculateFlashcardRetention } from './flashcardUtils';

export interface UseFlashcardsPageReturn {
  flashcards: Flashcard[];
  loading: boolean;
  error: Error | null;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  refetch: () => void;
  sortedFlashcards: Flashcard[];
  sortBy: (key: keyof Flashcard) => void;
  sortOrder: 'asc' | 'desc';
  filterByDueStatus: (isDue: boolean) => void;
  filtering: {
    isDue: boolean | null;
  };
}

export function useFlashcardsPage(initialFlashcards: Flashcard[] = []): UseFlashcardsPageReturn {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(initialFlashcards);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<keyof Flashcard>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filtering, setFiltering] = useState({
    isDue: null as boolean | null,
  });

  // Sort the flashcards
  const sortedFlashcards = [...flashcards].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (aValue === undefined || bValue === undefined) {
      return 0;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortOrder === 'asc' 
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  // Filter the flashcards
  const filteredFlashcards = filtering.isDue !== null
    ? sortedFlashcards.filter(card => {
        const isDue = calculateFlashcardRetention(card) < 0.7;
        return filtering.isDue === isDue;
      })
    : sortedFlashcards;

  const totalPages = Math.ceil(filteredFlashcards.length / pageSize);

  // Sort the flashcards by a specific key
  const sortBy = (key: keyof Flashcard) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  // Filter flashcards by due status
  const filterByDueStatus = (isDue: boolean) => {
    setFiltering(prev => ({
      ...prev,
      isDue: prev.isDue === isDue ? null : isDue,
    }));
    setCurrentPage(1);
  };

  const refetch = () => {
    setLoading(true);
    // In a real app, this would fetch from an API
    // For now, we just simulate it
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return {
    flashcards: filteredFlashcards.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    loading,
    error,
    currentPage,
    totalPages,
    pageSize,
    setCurrentPage,
    setPageSize,
    refetch,
    sortedFlashcards: filteredFlashcards,
    sortBy,
    sortOrder,
    filterByDueStatus,
    filtering,
  };
}
