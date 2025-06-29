import {
  createCirclePattern,
  createRingPattern,
  createCrossPattern,
  createDiagonalPattern,
  createSpiralPattern,
  createWavePattern,
  createHeartPattern,
  createEmptyPattern,
  Pattern,
} from "./generators";

export interface PatternPreset {
  name: string;
  description: string;
  frames: Pattern[];
  tempo: number;
}

const createExpandingCircles = (): Pattern[] => {
  const frames: Pattern[] = [];
  for (let i = 0; i <= 3; i++) {
    frames.push(createCirclePattern(7, i));
  }
  for (let i = 2; i >= 1; i--) {
    frames.push(createCirclePattern(7, i));
  }
  return frames;
};

const createRotatingCross = (): Pattern[] => {
  const frames: Pattern[] = [];
  const base = createCrossPattern(7);
  frames.push(base);

  for (let angle = 0; angle < 360; angle += 45) {
    const pattern = createEmptyPattern(7);
    const center = 3;
    const rad = (angle * Math.PI) / 180;

    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (base[r][c]) {
          const x = c - center;
          const y = r - center;
          const newX = x * Math.cos(rad) - y * Math.sin(rad) + center;
          const newY = x * Math.sin(rad) + y * Math.cos(rad) + center;
          const newR = Math.round(newY);
          const newC = Math.round(newX);

          if (newR >= 0 && newR < 7 && newC >= 0 && newC < 7) {
            pattern[newR][newC] = true;
          }
        }
      }
    }
    frames.push(pattern);
  }

  return frames;
};

const createRadarSweep = (): Pattern[] => {
  const frames: Pattern[] = [];
  const steps = 16;

  for (let step = 0; step < steps; step++) {
    const pattern = createEmptyPattern(7);
    const angle = (step / steps) * Math.PI * 2;
    const center = 3;

    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const x = c - center;
        const y = r - center;
        const pixelAngle = Math.atan2(y, x);
        const distance = Math.sqrt(x * x + y * y);

        const angleDiff = Math.abs(pixelAngle - angle);
        const normalizedDiff = Math.min(angleDiff, Math.PI * 2 - angleDiff);

        if (normalizedDiff < Math.PI / 8 && distance <= 3) {
          pattern[r][c] = true;
        }
      }
    }

    frames.push(pattern);
  }

  return frames;
};

const createBuildingBlocks = (): Pattern[] => {
  const frames: Pattern[] = [];

  for (let row = 6; row >= 0; row--) {
    const pattern = createEmptyPattern(7);
    for (let r = row; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        pattern[r][c] = true;
      }
    }
    frames.push(pattern);
  }

  for (let row = 1; row < 7; row++) {
    const pattern = createEmptyPattern(7);
    for (let r = row; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        pattern[r][c] = true;
      }
    }
    frames.push(pattern);
  }

  return frames;
};

const createPulseWave = (): Pattern[] => {
  const frames: Pattern[] = [];

  for (let radius = 0; radius <= 3; radius++) {
    frames.push(createRingPattern(7, radius + 0.5, Math.max(0, radius - 0.5)));
  }

  return frames;
};

const createMorseSignal = (code: string): Pattern[] => {
  const frames: Pattern[] = [];
  const dotDuration = 2;
  const dashDuration = 6;
  const pauseDuration = 2;

  for (const char of code) {
    if (char === ".") {
      for (let i = 0; i < dotDuration; i++) {
        const pattern = createEmptyPattern(7);
        for (let r = 3; r <= 3; r++) {
          for (let c = 3; c <= 3; c++) {
            pattern[r][c] = true;
          }
        }
        frames.push(pattern);
      }
    } else if (char === "-") {
      for (let i = 0; i < dashDuration; i++) {
        const pattern = createEmptyPattern(7);
        for (let r = 3; r <= 3; r++) {
          for (let c = 1; c <= 5; c++) {
            pattern[r][c] = true;
          }
        }
        frames.push(pattern);
      }
    }

    for (let i = 0; i < pauseDuration; i++) {
      frames.push(createEmptyPattern(7));
    }
  }

  return frames;
};

const createCompactSpinner = (): Pattern[] => {
  const frames: Pattern[] = [];
  const positions = [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 3],
    [2, 3],
    [3, 3],
    [3, 2],
    [3, 1],
    [3, 0],
    [2, 0],
    [1, 0],
  ];

  for (let i = 0; i < positions.length; i++) {
    const pattern = createEmptyPattern(4);
    const [r, c] = positions[i];
    pattern[r][c] = true;
    if (i > 0) {
      const [pr, pc] = positions[i - 1];
      pattern[pr][pc] = true;
    }
    frames.push(pattern);
  }

  return frames;
};

const createCompactPulse = (): Pattern[] => {
  return [
    createEmptyPattern(4),
    [
      [false, false, false, false],
      [false, true, true, false],
      [false, true, true, false],
      [false, false, false, false],
    ],
    [
      [false, true, true, false],
      [true, false, false, true],
      [true, false, false, true],
      [false, true, true, false],
    ],
    createEmptyPattern(4),
  ];
};

const createCheckmark = (): Pattern[] => {
  return [
    createEmptyPattern(4),
    [
      [false, false, false, false],
      [false, false, false, true],
      [false, false, true, false],
      [false, false, false, false],
    ],
    [
      [false, false, false, false],
      [false, false, false, true],
      [false, true, true, false],
      [true, false, false, false],
    ],
  ];
};

const createErrorX = (): Pattern[] => {
  return [
    createEmptyPattern(4),
    [
      [true, false, false, true],
      [false, false, false, false],
      [false, false, false, false],
      [true, false, false, true],
    ],
    [
      [true, false, false, true],
      [false, true, true, false],
      [false, true, true, false],
      [true, false, false, true],
    ],
  ];
};

export const patternPresets: PatternPreset[] = [
  {
    name: "Loading",
    description: "Expanding circles animation",
    frames: createExpandingCircles(),
    tempo: 100,
  },
  {
    name: "Processing",
    description: "Rotating cross pattern",
    frames: createRotatingCross(),
    tempo: 80,
  },
  {
    name: "Scanning",
    description: "Radar sweep effect",
    frames: createRadarSweep(),
    tempo: 60,
  },
  {
    name: "Building",
    description: "Bottom-up fill animation",
    frames: createBuildingBlocks(),
    tempo: 120,
  },
  {
    name: "Pulse",
    description: "Center-out wave effect",
    frames: createPulseWave(),
    tempo: 150,
  },
  {
    name: "SOS",
    description: "Morse code SOS signal",
    frames: createMorseSignal("...---..."),
    tempo: 100,
  },
  {
    name: "Heart",
    description: "Static heart shape",
    frames: [createHeartPattern(7)],
    tempo: 1000,
  },
  {
    name: "Wave",
    description: "Sine wave pattern",
    frames: [
      createWavePattern(7),
      createWavePattern(7, 2, 1.5),
      createWavePattern(7, 2, 2),
    ],
    tempo: 200,
  },
  {
    name: "Spiral",
    description: "Spiral pattern",
    frames: [createSpiralPattern(7)],
    tempo: 1000,
  },
  {
    name: "Diagonal",
    description: "Diagonal lines",
    frames: [createDiagonalPattern(7)],
    tempo: 1000,
  },
  {
    name: "CompactSpinner",
    description: "Compact spinner for buttons",
    frames: createCompactSpinner(),
    tempo: 100,
  },
  {
    name: "CompactPulse",
    description: "Compact pulse for buttons",
    frames: createCompactPulse(),
    tempo: 200,
  },
  {
    name: "Success",
    description: "Checkmark animation",
    frames: createCheckmark(),
    tempo: 150,
  },
  {
    name: "Error",
    description: "Error X animation",
    frames: createErrorX(),
    tempo: 150,
  },
];

export const getPresetByName = (name: string): PatternPreset | undefined => {
  return patternPresets.find((preset) => preset.name === name);
};

export const getRandomPreset = (): PatternPreset => {
  return patternPresets[Math.floor(Math.random() * patternPresets.length)];
};
