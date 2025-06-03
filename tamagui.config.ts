// tamagui.config.ts
import { createTamagui } from 'tamagui'
import { config } from '@tamagui/config/v3'

const tamaguiConfig = createTamagui(config)
const customFonts = {
  GeistMono: {
    family: 'GeistMono-Regular',
    weight: {
      400: 'GeistMono-Regular',
      500: 'GeistMono-Medium',
      700: 'GeistMono-Bold',
    },
    size: {
      4: 14,
      5: 16,
      6: 20,
      7: 24,
    },
    lineHeight: {
      4: 20,
      5: 22,
      6: 26,
      7: 30,
    },
    letterSpacing: {
      4: 0,
      5: 0,
      6: 0,
      7: 0,
    },
  }
}

const customConfig = createTamagui({
  ...config,
  fonts: {
    ...config.fonts,
    geistMono: customFonts.GeistMono,
    // geistMonoBold: customFonts.GeistMonoBold,
  },
})

export type Conf = typeof customConfig
declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig
