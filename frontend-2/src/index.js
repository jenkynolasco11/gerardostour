import React from 'react'
import { render } from 'react-dom'

import registerServiceWorker from './registerServiceWorker'
import App from './App'

const root = document.getElementById('root')

render(<App />, root)

// Live Reload
registerServiceWorker()
