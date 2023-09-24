import { defineConfig, presetWind, presetWebFonts, presetIcons } from 'unocss';

export default defineConfig({
	presets: [
		presetWind(),
		presetIcons(),
		presetWebFonts({
			// use axios with an https proxy
			provider: 'google',
			fonts: {
				sans: 'Roboto',
				mono: ['JetBrains Mono:400,	']
			}
		})
	]
});
