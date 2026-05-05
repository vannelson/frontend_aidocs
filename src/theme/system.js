import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const customConfig = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: "'Manrope', sans-serif" },
        body: { value: "'Manrope', sans-serif" },
      },
      radii: {
        l4: { value: '28px' },
      },
    },
  },
})

export const system = createSystem(defaultConfig, customConfig)
