import React, { Component } from 'react'
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  Button,
  Animated,
  Platform
} from 'react-native'

import styles from './styles'

const AnimatedKeyboardAvoidingView = Animated.createAnimatedComponent(KeyboardAvoidingView)

const UserPassInputs = props => {
  const commonProps = {
    autoCorrect : false,
    underlineColorAndroid : 'transparent',
    style : [ styles.input, { textAlign : 'center' }],
    onSubmitEditing : props._checkInputs,
    autoCapitalize : 'none'
  }

  const buttonProps = {
    disabled : props.shouldDisable,
    title : 'Log in',
    onPress : props.checkInputs
  }

  if(Platform.OS === "ios") buttonProps.color = 'white'

  return (
    <AnimatedKeyboardAvoidingView 
      style={ [ styles.inputs, props.extraHeight, { opacity : props.opacity } ] }
      behavior={ 'padding' }
    >
      <TextInput
        autoFocus
        placeholder={ 'User ID' }
        onChangeText={ props.onUsernameChange }
        { ...commonProps }
      />
      <TextInput
        secureTextEntry
        placeholder={ 'Password' }
        onChangeText={ props.onPasswordChange }
        { ...commonProps }
      />
      <View
        style={[
          styles.input,
          styles.loginButton,
        ]}
      >
        <Button { ...buttonProps }/>
      </View>
    </AnimatedKeyboardAvoidingView>
  )
}

export default UserPassInputs