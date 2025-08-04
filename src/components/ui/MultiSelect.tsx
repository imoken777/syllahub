'use client';

import { Check, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { cn } from '@/utils/cn';

type Option = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
};

export const MultiSelect = ({
  options,
  value,
  onChange,
  placeholder = '選択してください...',
  className,
}: MultiSelectProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const handleRemove = (optionValue: string) => {
    onChange(value.filter((v) => v !== optionValue));
  };

  const selectedOptions = options.filter((option) => value.includes(option.value));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls="multiselect-list"
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
            className,
          )}
          onClick={() => setOpen(!open)}
        >
          <div className="flex min-w-0 flex-1 items-center">
            {selectedOptions.length === 0 ? (
              <span className="truncate text-sm">{placeholder}</span>
            ) : selectedOptions.length === 1 ? (
              <span className="truncate text-sm">{selectedOptions[0].label}</span>
            ) : (
              <span className="truncate text-sm">{selectedOptions.length}件選択中</span>
            )}
          </div>
          <ChevronDown className="size-4 shrink-0 opacity-50" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        {selectedOptions.length > 0 && (
          <div className="border-b p-2">
            <div className="mb-2 text-xs text-muted-foreground">選択中の項目:</div>
            <div className="space-y-1">
              {selectedOptions.map((option) => (
                <div
                  key={`selected-${option.value}`}
                  className="flex items-center justify-between rounded bg-secondary px-2 py-1 text-xs"
                >
                  <span className="truncate">{option.label}</span>
                  <button
                    type="button"
                    aria-label={`選択解除 ${option.label}`}
                    className="ml-2 rounded-full p-0.5 hover:bg-secondary-foreground/20"
                    onClick={() => handleRemove(option.value)}
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <ul
          id="multiselect-list"
          role="listbox"
          aria-multiselectable="true"
          tabIndex={-1}
          className="max-h-60 overflow-auto"
        >
          {options.map((option) => {
            const isSelected = value.includes(option.value);
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                onClick={() => handleSelect(option.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(option.value);
                  }
                }}
                className={cn(
                  'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                  isSelected
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground',
                )}
              >
                <Check
                  className={cn('mr-2 size-4', isSelected ? 'opacity-100' : 'opacity-0')}
                  aria-hidden="true"
                />
                {option.label}
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
};
