'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { SearchIcon, UserCircle2, CalendarDays } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce'; // Assuming you have a debounce hook

interface SearchResultItem {
  _id: string;
  type: 'user' | 'booking';
  display_name: string;
  sub_text?: string;
  // Add other relevant fields that might be present in user or booking objects
  // For users:
  name?: string;
  personal_information?: {
    email?: string;
  };
  // For bookings:
  booking_id?: number;
  service_type?: string;
  date?: string | Date;
  status?: string;
}

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const executeSearch = useCallback(async (query: string) => {
    if (query.trim() === '') {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Search request failed');
      }
      const data = await response.json();
      setResults(data);
      setShowDropdown(true);
    } catch (error) {
      console.error('Failed to fetch search results:', error);
      setResults([]);
      setShowDropdown(true); // Show dropdown even on error to indicate no results or error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    executeSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, executeSearch]);

  const getResultLink = (item: SearchResultItem) => {
    if (item.type === 'user') {
      return `/dashboard/users/${item._id}`;
    }
    if (item.type === 'booking') {
      return `/dashboard/bookings/${item._id}`;
    }
    return '#';
  };

  const renderIcon = (type: 'user' | 'booking') => {
    if (type === 'user') {
        return <UserCircle2 className="h-5 w-5 text-gray-500" />;
    }
    return <CalendarDays className="h-5 w-5 text-gray-500" />;
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Global Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full max-w-xl mx-auto">
            <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                type="text"
                placeholder="Search users by name/email or bookings by ID/service/status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            {showDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-y-auto">
                {isLoading && <div className="p-4 text-center text-gray-500">Loading...</div>}
                {!isLoading && results.length === 0 && debouncedSearchTerm !== '' && (
                  <div className="p-4 text-center text-gray-500">No results found.</div>
                )}
                {!isLoading && results.length > 0 && (
                  <ul>
                    {results.map((item) => (
                      <li key={item._id} className="border-b last:border-b-0">
                        <Link href={getResultLink(item)} passHref legacyBehavior>
                          <a 
                            onClick={() => setShowDropdown(false)} 
                            className="flex items-center p-3 hover:bg-gray-100 transition-colors duration-150 ease-in-out"
                          >
                            <div className="mr-3 flex-shrink-0">
                                {renderIcon(item.type)}
                            </div>
                            <div>
                                <div className="font-medium text-gray-800">{item.display_name}</div>
                                {item.sub_text && <div className="text-sm text-gray-600">{item.sub_text}</div>}
                            </div>
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          {/* Click outside to close dropdown logic */}
          {showDropdown && (
            <div 
                className="fixed inset-0 z-0" 
                onClick={() => setShowDropdown(false)}
            ></div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchPage;

// Debounce hook (e.g., in @/hooks/useDebounce.ts)
// export function useDebounce<T>(value: T, delay: number): T {
//   const [debouncedValue, setDebouncedValue] = useState<T>(value);
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);
//     return () => {
//       clearTimeout(handler);
//     };
//   }, [value, delay]);
//   return debouncedValue;
// } 