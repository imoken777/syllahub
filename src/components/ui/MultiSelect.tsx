'use client';

import { Check, ChevronDown } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const selectedOptions = options.filter((option) => value.includes(option.value));

  const OPTION_HEIGHT = 32;

  const handleSelect = (optionValue: string, checked: boolean) => {
    const newValue = checked ? [...value, optionValue] : value.filter((v) => v !== optionValue);
    onChange(newValue);
  };

  const renderOptionItem = (option: Option, idx: number) => {
    const isSelected = value.includes(option.value);
    const isActive = idx === activeIndex;
    const optionId = `multiselect-option-${option.value}`;

    return (
      <li
        id={optionId}
        key={optionId}
        role="option"
        aria-selected={isSelected}
        tabIndex={-1}
        className={cn(
          'relative flex cursor-pointer select-none items-center justify-start rounded-sm py-1.5 pl-8 pr-2 text-sm font-normal hover:bg-accent hover:text-accent-foreground focus-visible:outline-none',
          isActive &&
            'bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        )}
        onClick={() => handleSelect(option.value, !isSelected)}
      >
        <span className="absolute left-2 flex size-3.5 items-center justify-center">
          {isSelected && <Check className="size-4" />}
        </span>
        <span className="flex-1 truncate text-left">{option.label}</span>
      </li>
    );
  };

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (!open) return;
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight': {
        e.preventDefault();
        setActiveIndex((prev) => {
          if (prev === null) return 0;
          return (prev + 1) % options.length;
        });
        break;
      }
      case 'ArrowUp':
      case 'ArrowLeft': {
        e.preventDefault();
        setActiveIndex((prev) => {
          if (prev === null) return options.length - 1;
          return (prev - 1 + options.length) % options.length;
        });
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (activeIndex !== null) {
          const option = options[activeIndex];
          const checked = value.includes(option.value);
          handleSelect(option.value, !checked);
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        setOpen(false);
        break;
      }
    }
  };

  const onOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setActiveIndex(0);
    } else {
      setActiveIndex(null);
    }
  };

  useEffect(() => {
    if (activeIndex === null) return;
    const container = listboxRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const visibleStart = Math.floor(scrollTop / OPTION_HEIGHT);
    const visibleCount = Math.floor(containerHeight / OPTION_HEIGHT);
    const visibleEnd = visibleStart + visibleCount - 1;

    if (activeIndex < visibleStart) {
      container.scrollTop = activeIndex * OPTION_HEIGHT;
    } else if (activeIndex > visibleEnd) {
      container.scrollTop = (activeIndex - visibleCount + 1) * OPTION_HEIGHT;
    }
  }, [activeIndex]);

  const activeDescendantId =
    activeIndex !== null ? `multiselect-option-${options[activeIndex].value}` : undefined;

  return (
    <Popover open={open} onOpenChange={onOpenChange} modal>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
            className,
          )}
          onClick={() => setOpen(!open)}
          aria-label={placeholder ?? `${selectedOptions.length}個の項目を選択中`}
          aria-expanded={open}
          aria-haspopup="listbox"
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
        <div className="max-h-96 min-w-32 overflow-hidden p-1">
          <fieldset>
            <legend className="sr-only">{placeholder ?? '選択可能な項目'}</legend>
            <ul
              ref={listboxRef}
              className="max-h-60 overflow-auto focus:outline-none"
              role="listbox"
              aria-labelledby="selected-items-heading"
              aria-multiselectable="true"
              tabIndex={0}
              aria-activedescendant={activeDescendantId}
              onKeyDown={onKeyDown}
            >
              {options.map((option, i) => renderOptionItem(option, i))}
            </ul>
          </fieldset>
        </div>
      </PopoverContent>
    </Popover>
  );
};
