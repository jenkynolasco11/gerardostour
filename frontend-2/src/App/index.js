import React from 'react'
import { Provider } from 'react-redux'
import ThemeProvider from 'react-toolbox/lib/ThemeProvider'

import store, { history } from './store'
// import theme from '../toolbox/theme.js'

import MainApp from './components'

// import './toolbox/theme.css'

const App = () => (
    <Provider store={ store }>
        {/* <ThemeProvider theme={ theme }> */}
            {/* <ConnectedRouter history={ history }> */}
                <MainApp />
            {/* </ConnectedRouter> */}
        {/* </ThemeProvider> */}
    </Provider>
)

export default App
