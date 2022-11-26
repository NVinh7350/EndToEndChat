import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { guestSelector } from '../../redux/selector'

const ChatRoom = () => {
    const guest = useSelector(guestSelector);

  return (
    <View>
      <Text>{guest?.userName}</Text>
    </View>
  )
}

export default ChatRoom

const styles = StyleSheet.create({})