import './app.css'
import App from './App.svelte'

import dayjs from 'dayjs'
import WeekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(WeekOfYear)

const app = new App({
  target: document.getElementById('app')!,
})

export default app
