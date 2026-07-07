"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type SearchableDropdownProps = {
options: string[];
value: string;
onChange: (value: string) => void;
placeholder?: string;
disabled?: boolean;
};

export default function SearchableDropdown({
options,
value,
onChange,
placeholder = "Search...",
disabled = false,
}: SearchableDropdownProps) {
const [isOpen, setIsOpen] = useState(false);
const containerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
    }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

const filteredOptions = value
    ? options.filter((opt) => opt.toLowerCase().includes(value.toLowerCase()))
    : options;

const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
};

return (
    <div ref={containerRef} className="relative">
    <div className="relative">
        <input
        type="text"
        value={value}
        onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        className="w-full p-2 pr-9 border border-gray-300 rounded-md outline-none disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500"
        />
        <ChevronDown
        className={`w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform ${
            isOpen ? "rotate-180" : ""
        }`}
        />
    </div>

    {isOpen && !disabled && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
        {filteredOptions.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-400">No matches found</div>
        ) : (
            filteredOptions.map((option) => (
            <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 active:bg-blue-100 transition-colors touch-manipulation border-b border-gray-50 last:border-0"
            >
                {option}
            </button>
            ))
        )}
        </div>
    )}
    </div>
);
}