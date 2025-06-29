'use client';

import { useEffect, useState } from 'react';
import { MorseButton } from '@/components/MorseButton';
import { MorsePixelGrid } from '@/components/MorsePixelGrid';
import { Pattern } from '@/lib/patterns';
import { cn } from '@/lib/utils';

// Helper function to convert string pattern to boolean array
const stringToPattern = (stringPattern: string[]): Pattern => {
  return stringPattern.map(row => 
    row.split('').map(char => char === '#')
  );
};

const animationStates = {
  importing: {
    label: 'Importing',
    pattern: [
      '.....',
      '..#..',
      '.###.',
      '..#..',
      '.....'
    ],
    sequences: [
      { positions: [[2, 2]], duration: 100 },
      { positions: [[1, 2], [2, 1], [2, 3], [3, 2]], duration: 100 },
      { positions: [[2, 2], [0, 2], [1, 1], [1, 3], [2, 0], [2, 4], [3, 1], [3, 3], [4, 2]], duration: 100 },
      { positions: [[0, 1], [0, 3], [1, 0], [1, 2], [1, 4], [2, 1], [2, 3], [3, 0], [3, 2], [3, 4], [4, 1], [4, 3]], duration: 100 },
      { positions: [[0, 0], [0, 2], [0, 4], [1, 1], [1, 3], [2, 0], [2, 2], [2, 4], [3, 1], [3, 3], [4, 0], [4, 2], [4, 4]], duration: 100 },
      { positions: [[0, 1], [0, 3], [1, 0], [1, 2], [1, 4], [2, 1], [2, 3], [3, 0], [3, 2], [3, 4], [4, 1], [4, 3]], duration: 100 },
      { positions: [[0, 0], [0, 2], [0, 4], [1, 1], [1, 3], [2, 0], [2, 4], [3, 1], [3, 3], [4, 0], [4, 2], [4, 4]], duration: 100 },
      { positions: [[0, 1], [1, 0], [3, 0], [4, 1], [0, 3], [1, 4], [3, 4], [4, 3]], duration: 100 },
      { positions: [[0, 0], [0, 4], [4, 0], [4, 4]], duration: 100 },
      { positions: [], duration: 200 }
    ]
  },
  syncing: {
    label: 'Syncing',
    pattern: [
      '..#..',
      '..#..',
      '..#..',
      '..#..',
      '..#..'
    ],
    sequences: [
      { positions: [[2, 0]], duration: 100 },
      { positions: [[1, 0], [2, 0], [3, 0], [2, 1]], duration: 100 },
      { positions: [[2, 0], [1, 1], [2, 1], [3, 1], [2, 2]], duration: 100 },
      { positions: [[2, 0], [2, 1], [1, 2], [2, 2], [3, 2], [2, 3]], duration: 100 },
      { positions: [[2, 1], [2, 2], [1, 3], [2, 3], [3, 3], [2, 4]], duration: 100 },
      { positions: [[2, 2], [2, 3], [1, 4], [2, 4], [3, 4]], duration: 100 },
      { positions: [[2, 3], [2, 4]], duration: 100 },
      { positions: [[2, 4]], duration: 100 },
      { positions: [], duration: 100 },
      { positions: [[2, 4]], duration: 100 },
      { positions: [[1, 4], [2, 4], [3, 4], [2, 3]], duration: 100 },
      { positions: [[2, 4], [1, 3], [2, 3], [3, 3], [2, 2]], duration: 100 },
      { positions: [[2, 4], [2, 3], [1, 2], [2, 2], [3, 2], [2, 1]], duration: 100 },
      { positions: [[2, 3], [2, 2], [1, 1], [2, 1], [3, 1], [2, 0]], duration: 100 },
      { positions: [[2, 2], [2, 1], [1, 0], [2, 0], [3, 0]], duration: 100 },
      { positions: [[2, 1], [2, 0]], duration: 100 },
      { positions: [[2, 0]], duration: 100 },
      { positions: [], duration: 200 }
    ]
  },
  searching: {
    label: 'Searching',
    pattern: [
      '.....',
      '.#...',
      '..#..',
      '...#.',
      '.....'
    ],
    sequences: [
      { positions: [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]], duration: 100 },
      { positions: [[2, 0], [1, 1], [2, 1], [3, 1], [2, 2]], duration: 100 },
      { positions: [[3, 0], [2, 1], [3, 1], [4, 1], [3, 2]], duration: 100 },
      { positions: [[3, 1], [2, 2], [3, 2], [4, 2], [3, 3]], duration: 100 },
      { positions: [[3, 2], [2, 3], [3, 3], [4, 3], [3, 4]], duration: 100 },
      { positions: [[1, 2], [0, 3], [1, 3], [2, 3], [1, 4]], duration: 100 },
      { positions: [[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]], duration: 100 },
      { positions: [], duration: 200 }
    ]
  },
  processing: {
    label: 'Processing',
    pattern: [
      '#...#',
      '.#.#.',
      '..#..',
      '.#.#.',
      '#...#'
    ],
    sequences: [
      { positions: [[0, 1], [0, 2], [0, 3], [1, 2], [4, 1], [4, 2], [4, 3]], duration: 100 },
      { positions: [[0, 1], [0, 2], [0, 3], [2, 3], [4, 2], [4, 3], [4, 4]], duration: 100 },
      { positions: [[0, 1], [0, 2], [0, 3], [3, 4], [4, 2], [4, 3], [4, 4]], duration: 100 },
      { positions: [[0, 1], [0, 2], [0, 3], [2, 3], [4, 2], [4, 3], [4, 4]], duration: 100 },
      { positions: [[0, 0], [0, 1], [0, 2], [1, 2], [4, 2], [4, 3], [4, 4]], duration: 100 },
      { positions: [[0, 0], [0, 1], [0, 2], [2, 1], [4, 1], [4, 2], [4, 3]], duration: 100 },
      { positions: [[0, 0], [0, 1], [0, 2], [3, 0], [4, 0], [4, 1], [4, 2]], duration: 100 },
      { positions: [[0, 1], [0, 2], [0, 3], [2, 1], [4, 0], [4, 1], [4, 2]], duration: 100 }
    ]
  },
  saving: {
    label: 'Saving',
    pattern: [
      '#####',
      '#####',
      '#####',
      '#####',
      '#####'
    ],
    sequences: [
      { positions: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 0], [1, 1], [1, 2], [1, 3], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [3, 0], [3, 1], [3, 2], [3, 3], [4, 0], [4, 1], [4, 2], [4, 3], [4, 4]], duration: 100 },
      { positions: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2], [2, 3], [3, 0], [3, 1], [3, 2], [4, 0], [4, 1], [4, 2], [4, 3]], duration: 100 },
      { positions: [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [2, 0], [2, 1], [2, 2], [3, 0], [3, 1], [4, 0], [4, 1], [4, 2], [4, 4], [3, 4], [2, 4], [1, 4], [0, 4]], duration: 100 },
      { positions: [[0, 0], [0, 1], [1, 0], [2, 0], [2, 1], [3, 0], [4, 0], [4, 1], [4, 3], [3, 3], [2, 3], [1, 3], [0, 3], [4, 4], [3, 4], [2, 4], [1, 4], [0, 4]], duration: 100 },
      { positions: [[0, 0], [2, 0], [4, 0], [4, 2], [3, 2], [2, 2], [1, 2], [0, 2], [4, 3], [3, 3], [2, 3], [1, 3], [0, 3], [4, 4], [3, 4], [2, 4], [1, 4], [0, 4]], duration: 100 },
      { positions: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [4, 1], [3, 1], [2, 1], [1, 1], [0, 1], [4, 2], [3, 2], [2, 2], [1, 2], [0, 2], [4, 3], [3, 3], [2, 3], [1, 3], [0, 3], [4, 4], [3, 4], [2, 4], [1, 4], [0, 4]], duration: 200 }
    ]
  },
  complete: {
    label: 'Complete',
    pattern: [
      '.....',
      '...#.',
      '..##.',
      '.###.',
      '###..'
    ],
    sequences: [
      { positions: [], duration: 100 },
      { positions: [[1, 0], [3, 0]], duration: 100 },
      { positions: [[1, 0], [3, 0], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1]], duration: 100 },
      { positions: [[1, 0], [3, 0], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2]], duration: 100 },
      { positions: [[1, 0], [3, 0], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [1, 3], [2, 3], [3, 3]], duration: 100 },
      { positions: [[1, 0], [3, 0], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [1, 3], [2, 3], [3, 3], [2, 4]], duration: 100 },
      { positions: [[1, 2], [2, 1], [2, 2], [2, 3], [3, 2]], duration: 100 },
      { positions: [[2, 2]], duration: 100 },
      { positions: [], duration: 200 }
    ]
  }
};

const stateOrder = ['importing', 'syncing', 'searching', 'processing', 'saving', 'complete'] as const;

export function MorseButtonDemo() {
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const currentState = stateOrder[currentStateIndex];
  const stateData = animationStates[currentState];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStateIndex((prev) => (prev + 1) % stateOrder.length);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 200);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    setCurrentStateIndex((prev) => (prev + 1) % stateOrder.length);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <MorseButton
        variant="default"
        size="lg"
        onClick={handleClick}
        className="relative overflow-hidden group"
      >
        <div className="flex items-center gap-3">
          <div className="w-[25px] h-[25px] relative">
            <MorsePixelGrid
              patterns={[stringToPattern(stateData.pattern)]}
              pixelSize="sm"
              colorScheme={{
                active: "rgba(255, 255, 255, 0.8)",
                inactive: "rgba(255, 255, 255, 0.2)"
              }}
              tempo={200}
              iterations="infinite"
              gridSize={5}
              className="absolute inset-0"
            />
          </div>
          
          <span
            className={cn(
              "transition-all duration-300 transform",
              isAnimating && "scale-110 opacity-0"
            )}
          >
            {stateData.label}
          </span>
          
          <span
            className={cn(
              "absolute left-[46px] transition-all duration-300 transform",
              !isAnimating && "scale-110 opacity-0"
            )}
          >
            {animationStates[stateOrder[(currentStateIndex + 1) % stateOrder.length]].label}
          </span>
        </div>
      </MorseButton>
      
      <p className="text-sm text-muted-foreground">
        Click to change animation state
      </p>
    </div>
  );
}