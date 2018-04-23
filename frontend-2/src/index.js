import React from 'react'
import { render } from 'react-dom'
import { ThemeProvider } from 'react-toolbox/lib/ThemeProvider'

import registerServiceWorker from './registerServiceWorker'
import App from './App'

import theme from './toolbox/theme'
import './toolbox/theme.css'

const root = document.getElementById('root')

render(
    <ThemeProvider theme={ theme }>
        <App />
    </ThemeProvider>
, root)

// Live Reload
registerServiceWorker()
