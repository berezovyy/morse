export const DEMO_PATTERNS = [
  { id: 'Play', name: 'Play', description: 'Play button animation' },
  { id: 'Searching', name: 'Searching', description: 'Expanding circles' },
  { id: 'Syncing', name: 'Syncing', description: 'Up and down arrows' },
  { id: 'Importing', name: 'Importing', description: 'Expanding circles' },
  { id: 'Loading', name: 'Loading', description: 'Loading spinner' },
] as const;

export const CODE_EXAMPLES = {
  basic: `import { MorsePixelGrid } from '@morse/react'

export default function App() {
  return (
    <MorsePixelGrid
      pattern="loading"
      active={true}
      size="md"
    />
  )
}`,
  matrix: `import { MorseMatrixFlow } from '@morse/react'

export default function App() {
  return (
    <MorseMatrixFlow
      labels={['Loading', 'Processing', 'Complete']}
      active={true}
      tempo={2000}
    />
  )
}`,
  button: `import { MorseButton } from '@morse/react'

export default function App() {
  return (
    <MorseButton
      status="loading"
      onClick={() => console.log('clicked')}
    >
      Save Changes
    </MorseButton>
  )
}`,
} as const;

export const EXTERNAL_LINKS = {
  GITHUB: 'https://github.com/berezovyy/morse',
  DOCS: '/docs',
  EXAMPLES: '/examples',
} as const;

export const COPY_TIMEOUT = 2000;