import React, { PureComponent as Component } from 'react'
import ThemeProvider from 'react-toolbox/lib/ThemeProvider'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'

import theme from './toolbox/theme'
import store, { history } from './MainApp/store-redux'
import MainApp from './MainApp'

import './toolbox/theme.css'

class App extends Component{
  render() {
    return (
      <Provider store={ store }>
        <ConnectedRouter history={ history }>
          <ThemeProvider theme={ theme }>
            <MainApp />
          </ThemeProvider>
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default App