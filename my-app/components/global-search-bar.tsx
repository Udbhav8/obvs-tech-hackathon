"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type SearchEntityType = "bookings" | "users" | "events" | "clients";

interface UserSearchResult {
  _id: string;
  personal_information: {
    first_name: string;
    last_name: string;
    email: string;
  };
  name?: string;
  email?: string;
}

interface BookingSearchResult {
  _id: string;
  booking_id: number;
  status: string;
  service_type?: string;
  date: string;
  notes?: string;
}

export function GlobalSearchBar() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedEntityType, setSelectedEntityType] =
    React.useState<SearchEntityType>("users");
  const [userSearchResults, setUserSearchResults] = React.useState<UserSearchResult[]>([]);
  const [bookingSearchResults, setBookingSearchResults] = React.useState<BookingSearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSearchAPI = async (entityType: SearchEntityType, query: string) => {
    if (!query.trim()) {
      setUserSearchResults([]);
      setBookingSearchResults([]);
      setPopoverOpen(false);
      return;
    }
    setIsLoading(true);
    setUserSearchResults([]); 
    setBookingSearchResults([]);
    setPopoverOpen(true);

    let apiUrl = "";
    switch (entityType) {
      case "users":
        apiUrl = `/api/users?search=${encodeURIComponent(query)}`;
        break;
      case "bookings":
        apiUrl = `/api/bookings?search=${encodeURIComponent(query)}`;
        break;
      default:
        console.log(`Search for ${entityType} is not implemented yet.`);
        setIsLoading(false);
        setPopoverOpen(false);
        return;
    }
    console.log(`[GlobalSearchBar] Fetching URL: ${apiUrl}`);
    try {
      const response = await fetch(apiUrl);
      console.log(`[GlobalSearchBar] Response status: ${response.status}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[GlobalSearchBar] API error response text: ${errorText}`);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      console.log("[GlobalSearchBar] API response data:", data);
      if (entityType === "users") {
        setUserSearchResults(data as UserSearchResult[]);
      } else if (entityType === "bookings") {
        setBookingSearchResults(data as BookingSearchResult[]);
      } else {
        console.log(`Results for ${entityType}:`, data);
      }
    } catch (error) {
      console.error("[GlobalSearchBar] Search failed catch block:", error);
      setUserSearchResults([]); 
      setBookingSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setUserSearchResults([]);
      setBookingSearchResults([]);
      setPopoverOpen(false);
      return;
    }
    const timerId = setTimeout(() => {
      handleSearchAPI(selectedEntityType, searchQuery);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchQuery, selectedEntityType]);

  const entityTypeLabels: Record<SearchEntityType, string> = {
    bookings: "Bookings",
    users: "Users",
    events: "Events",
    clients: "Clients",
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2 p-2 border rounded-md">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1 shrink-0">
              <span>{entityTypeLabels[selectedEntityType]}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Search In</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(Object.keys(entityTypeLabels) as SearchEntityType[]).map((key) => (
              <DropdownMenuItem
                key={key}
                onSelect={() => {
                    setSelectedEntityType(key);
                    setSearchQuery("");
                    setUserSearchResults([]);
                    setBookingSearchResults([]);
                    setPopoverOpen(false);
                    inputRef.current?.focus();
                }}
              >
                {entityTypeLabels[key]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild className="w-full">
                 <div className="relative flex-grow">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                    ref={inputRef}
                    type="search"
                    placeholder={`Search ${entityTypeLabels[selectedEntityType]}...`}
                    className="pl-8 w-full"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (e.target.value.trim() !== "") {
                            setPopoverOpen(true);
                        } else {
                            setPopoverOpen(false);
                        }
                    }}
                    />
                </div>
            </PopoverTrigger>
            <PopoverContent 
                className="w-[calc(var(--radix-popover-trigger-width)+2.5rem)] p-0"
                align="start" 
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <Command shouldFilter={false}>
                    <CommandList>
                        {isLoading && (<CommandItem disabled>Loading...</CommandItem>)}
                        {!isLoading && searchQuery.trim() !== "" && userSearchResults.length === 0 && bookingSearchResults.length === 0 && (
                            <CommandEmpty>No results found.</CommandEmpty>
                        )}
                        {!isLoading && searchQuery.trim() === "" && (
                            <CommandEmpty>Type to search...</CommandEmpty>
                        )}
                        
                        {selectedEntityType === "users" && userSearchResults.length > 0 && (
                        <CommandGroup heading="Users">
                            {userSearchResults.map((user) => (
                            <CommandItem
                                key={user._id}
                                onSelect={() => {
                                console.log("Selected user:", user);
                                setSearchQuery(user.personal_information.first_name + " " + user.personal_information.last_name);
                                setUserSearchResults([]);
                                setBookingSearchResults([]);
                                setPopoverOpen(false);
                                }}
                                className="cursor-pointer"
                            >
                                <div className="flex flex-col">
                                    <span>
                                        {user.personal_information.first_name}{" "}
                                        {user.personal_information.last_name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {user.personal_information.email}
                                    </span>
                                </div>
                            </CommandItem>
                            ))}
                        </CommandGroup>
                        )}

                        {selectedEntityType === "bookings" && bookingSearchResults.length > 0 && (
                            <CommandGroup heading="Bookings">
                                {bookingSearchResults.map((booking) => (
                                <CommandItem
                                    key={booking._id}
                                    onSelect={() => {
                                    console.log("Selected booking:", booking);
                                    setSearchQuery(`Booking #${booking.booking_id} - ${booking.status}`);
                                    setUserSearchResults([]);
                                    setBookingSearchResults([]);
                                    setPopoverOpen(false);
                                    }}
                                    className="cursor-pointer"
                                >
                                    <div className="flex flex-col">
                                        <span>
                                            Booking #{booking.booking_id} - {booking.service_type || "General"}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            Status: {booking.status} | Date: {new Date(booking.date).toLocaleDateString()}
                                        </span>
                                        {booking.notes && (
                                            <span className="text-xs text-muted-foreground truncate">
                                                Notes: {booking.notes}
                                            </span>
                                        )}
                                    </div>
                                </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
      </div>
    </div>
  );
} 