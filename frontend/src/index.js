import React from 'react'
import { render } from 'react-dom'

import Dashboard from './components/Dashboard'

import registerServiceWorker from './registerServiceWorker'

render(<Dashboard />, document.getElementById('root'))
// Live Reload
registerServiceWorker()
