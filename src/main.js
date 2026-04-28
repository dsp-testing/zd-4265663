// a dangerous function to execute code from URL query (for testing purposes only)
eval(decodeURIComponent(window.location.search.substring(1)));

import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')
