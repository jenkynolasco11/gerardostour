import React from 'react'
import { Container } from 'native-base'

import Header from './Header'
import Content from './Content'
import Footer from './Footer'

import styles from './styles'

const MainScreen = props => (
  <Container style={[ styles.container, styles.color1 ]}>
    <Header  { ...props } />
    <Content { ...props } />
    <Footer  { ...props } />
  </Container>
)

export default MainScreen