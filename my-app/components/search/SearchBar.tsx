'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input'; // Assuming shadcn/ui input component
import { useRouter } from 'next/navigation'; // For navigation

interface UserResult {
  _id: string;
  personal_information: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  name?: string; // if you have a concatenated name
  // Add other relevant user fields you want to display
}

interface BookingResult {
  _id: string;
  booking_id: number;
  booking_type?: string;
  service_type?: string; // From ServiceProgramBooking
  notes?: string;
  // Add other relevant booking fields you want to display
}

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ users: UserResult[]; bookings: BookingResult[] }>({ users: [], bookings: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  // Debounce function
  const debounce = <F extends (...args: any[]) => any>(func: F, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<F>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchResults = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults({ users: [], bookings: [] });
      setShowDropdown(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(searchTerm)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
        setShowDropdown(true);
      } else {
        console.error('Failed to fetch search results');
        setResults({ users: [], bookings: [] });
        setShowDropdown(false);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setResults({ users: [], bookings: [] });
      setShowDropdown(false);
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchResults = useCallback(debounce(fetchResults, 500), []);

  useEffect(() => {
    debouncedFetchResults(query);
  }, [query, debouncedFetchResults]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleResultClick = (type: 'user' | 'booking', id: string | number) => {
    setShowDropdown(false);
    setQuery(''); // Clear search bar
    if (type === 'user') {
      router.push(`/admin/users/${id}`); // Adjust path as needed
    } else if (type === 'booking') {
      router.push(`/admin/bookings/${id}`); // Adjust path as needed
    }
  };

  const handleBlur = () => {
    // Delay hiding dropdown to allow click event on results
    setTimeout(() => {
        setShowDropdown(false);
    }, 200);
  };

  return (
    <div className="relative w-full">
      <Input
        type="search"
        placeholder="Search users & bookings..."
        value={query}
        onChange={handleInputChange}
        onFocus={() => query && (results.users.length > 0 || results.bookings.length > 0) && setShowDropdown(true)}
        onBlur={handleBlur}
        className="w-full"
      />
      {showDropdown && (results.users.length > 0 || results.bookings.length > 0) && (
        <div className="absolute z-10 mt-1 w-full bg-background border border-border rounded-md shadow-lg max-h-96 overflow-y-auto">
          {isLoading && <div className="p-2 text-sm text-muted-foreground">Searching...</div>}
          {!isLoading && results.users.length === 0 && results.bookings.length === 0 && query.length > 0 && (
            <div className="p-2 text-sm text-center text-muted-foreground">No results found.</div>
          )}

          {results.users.length > 0 && (
            <div className="border-b border-border">
              <div className="p-2 text-xs font-semibold text-muted-foreground">Users</div>
              {results.users.map((user) => (
                <div
                  key={user._id}
                  className="p-2 hover:bg-accent cursor-pointer text-sm"
                  onMouseDown={() => handleResultClick('user', user._id)} // Use onMouseDown to fire before onBlur
                >
                  {user.name || `${user.personal_information.first_name || ''} ${user.personal_information.last_name || ''}`.trim() || user.personal_information.email}
                  <div className="text-xs text-muted-foreground">
                    {user.personal_information.email}
                  </div>
                </div>
              ))}
            </div>
          )}

          {results.bookings.length > 0 && (
            <div>
              <div className="p-2 text-xs font-semibold text-muted-foreground">Bookings</div>
              {results.bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="p-2 hover:bg-accent cursor-pointer text-sm"
                  onMouseDown={() => handleResultClick('booking', booking.booking_id.toString())} // Use onMouseDown
                >
                  <div>Booking ID: {booking.booking_id}</div>
                  <div className="text-xs text-muted-foreground">
                    {booking.service_type || booking.booking_type} - {booking.notes?.substring(0,50)}{booking.notes && booking.notes.length > 50 ? '...' : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 