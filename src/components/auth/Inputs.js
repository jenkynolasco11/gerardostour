import React, { Component } from 'react'
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  Button,
  Platform
} from 'react-native'

import styles from './styles'

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
    <KeyboardAvoidingView 
      style={ [ styles.inputs, props.extraHeight ] }
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
    </KeyboardAvoidingView>
  )
}

export default UserPassInputs