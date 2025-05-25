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
import { Search, ChevronDown, CommandIcon } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
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
  name?: string; // Legacy
  email?: string; // Legacy
}

export function GlobalSearchBar() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedEntityType, setSelectedEntityType] =
    React.useState<SearchEntityType>("users");
  const [searchResults, setSearchResults] = React.useState<UserSearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isCommandOpen, setIsCommandOpen] = React.useState(false);
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  const handleSearchAPI = async (entityType: SearchEntityType, query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setPopoverOpen(false);
      return;
    }
    setIsLoading(true);
    setSearchResults([]);
    setPopoverOpen(true);

    let apiUrl = "";
    switch (entityType) {
      case "users":
        apiUrl = `/api/users?search=${encodeURIComponent(query)}`;
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
        setSearchResults(data as UserSearchResult[]);
      } else {
        console.log(`Results for ${entityType}:`, data);
      }
    } catch (error) {
      console.error("[GlobalSearchBar] Search failed catch block:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
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

  const inputRef = React.useRef<HTMLInputElement>(null);

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
                  setSearchResults([]);
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
            className="w-[--radix-popover-trigger-width] p-0" 
            align="start" 
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <Command shouldFilter={false} >
              <CommandList>
                {isLoading && <CommandItem disabled>Loading...</CommandItem>}
                <CommandEmpty>{!isLoading && searchQuery.trim() !== "" ? "No results found." : "Type to search..."}</CommandEmpty>
                {searchResults.length > 0 && (
                  <CommandGroup heading={selectedEntityType === "users" ? "Users" : "Results"}>
                    {selectedEntityType === "users" && searchResults.map((user) => (
                      <CommandItem
                        key={user._id}
                        onSelect={() => {
                          console.log("Selected user:", user);
                          setSearchQuery(user.personal_information.first_name + " " + user.personal_information.last_name);
                          setSearchResults([]);
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
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
} 