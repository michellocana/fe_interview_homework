import dayjs from 'dayjs'
import { writable } from 'svelte/store'

// Start showing 70 days before just like the actual Toggl Plan
export let timelineStartDate = writable(dayjs().subtract(70, 'days'))

// Start showing 68 days after just like the actual Toggl Plan
export let timelineEndDate = writable(dayjs().add(68, 'days'))
