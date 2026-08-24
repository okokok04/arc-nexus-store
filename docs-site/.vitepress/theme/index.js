import DefaultTheme from 'vitepress/theme'
import './style.css'
import HomeHero from './HomeHero.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomeHero', HomeHero)
  },
}
