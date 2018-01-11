import React, { PureComponent as Component } from 'react'
import { Platform, Animated, Easing } from 'react-native'
import { Content, Form, Item, Input, Button, Text, Icon } from 'native-base'

import styles from './styles'

const AnimatedForm = Animated.createAnimatedComponent(Form)
const HEIGHT_START = 40

class UserPassInputs extends Component{
  state = { 
    opacity : new Animated.Value(0),
    top : new Animated.Value(0)
  }

  componentDidMount() {
    const { opacity, top } = this.state

    Animated.parallel([
      Animated.timing(opacity, {
        toValue : 1,
        delay : 200,
        duration : 500,
        easing : Easing.linear
      }),
      Animated.timing(top, {
        toValue : 1,
        delay : 200,
        duration : 500,
        easing : Easing.inOut(Easing.ease)
      })
    ]).start()
  }

  render() {
    const { user, pass, disabled, onSubmit, onChange } = this.props
    const { opacity, top } = this.state
    const isIOS = Platform.OS === 'ios'

    const marginTop = top.interpolate({
      inputRange: [0, 1],
      outputRange: [HEIGHT_START, 0]
    })

    return (
      <Content contentContainerStyle={ styles.content }>
        <AnimatedForm style={[ styles.form, { opacity, marginTop } ]}>
          <Item underline last style={ styles.underline }>
            { 
              // <Icon active name={ isIOS ? 'ios-contact' : 'md-contact' } />
            }
            <Input
              style={ [styles.input, styles.text] }
              autoCapitalize="none"
              autoCorrect={ false }
              placeholder="username"
              value={ user }
              onChangeText={ v => onChange(v, 'user') }
              clearTextOnFocus
            />
          </Item>
          <Item underline last style={ styles.underline }>
            {
              // <Icon active name={ isIOS ? 'ios-key' : 'md-key' } />
            }
            <Input
              style={ [styles.input, styles.text] }
              autoCapitalize="none"
              autoCorrect={ false }
              secureTextEntry
              placeholder="password"
              value={ pass }
              onChangeText={ v => onChange(v, 'pass') }
              clearTextOnFocus
            />
          </Item>
          <Button
            style={[ styles.button, disabled ? { backgroundColor : 'gray' } : {} ]}
            onPress={ onSubmit }
            block
            disabled={ disabled }
          >
            <Text style={ styles.text }> Login </Text>
          </Button>
        </AnimatedForm>
      </Content>
    )
  }
}

export default UserPassInputs