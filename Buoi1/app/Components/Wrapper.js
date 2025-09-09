import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Wrapper = ({children, style, disableAvoidStatusBar=false,...props}) => {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' :'height'}
    style={[styles.wrapper,style]}
    {...props}>
        {!disableAvoidStatusBar && <StatusBar barStyle="dark-content" backgroundColor="cyan"/>}
        {children}
    </KeyboardAvoidingView>
  )
}

export default Wrapper

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        padding: 10, 
        margin: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10
    }
})