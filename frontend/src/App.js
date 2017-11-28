import React, { PureComponent as Component } from 'react'
import ThemeProvider from 'react-toolbox/lib/ThemeProvider'
import { Provider } from 'react-redux'

import theme from './toolbox/theme'
import store from './MainApp/store-redux'
import MainApp from './MainApp'

import './toolbox/theme.css'

class App extends Component{
  render() {
    return (
      <Provider store={ store }>
        <ThemeProvider theme={ theme }>
          <MainApp />
        </ThemeProvider>
      </Provider>
    )
  }
}

export default App