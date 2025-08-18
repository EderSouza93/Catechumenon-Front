'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarItem {
  id: number;
  title: string;
  href?: string;
  children?: SidebarItem[];
}

interface SidebarProps {
  items: SidebarItem[];
  currentId?: number;
}

export default function Sidebar({ items, currentId }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const renderItem = (item: SidebarItem, level = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isActive = currentId === item.id;

    return (
      <div key={item.id} className="w-full">
        <div 
          className={`flex items-center w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
            level > 0 ? 'ml-4' : ''
          } ${
            isActive 
              ? 'bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleExpanded(item.id)}
              className="w-full justify-start p-0 h-auto font-normal"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 mr-2" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-2" />
              )}
              {item.title}
            </Button>
          ) : item.href ? (
            <Link href={item.href} className="w-full">
              {item.title}
            </Link>
          ) : (
            <span className="w-full">{item.title}</span>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children?.map(child => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-card border-r border-border">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-2">
          {items.map(item => renderItem(item))}
        </div>
      </ScrollArea>
    </div>
  );
}