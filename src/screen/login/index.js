import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import InputField from '../../components/InputField'
import LoginInputForm from './loginInputForm'
import LoginHeader from './loginHeader'
import fireStore from '@react-native-firebase/firestore'
import {app} from '../../firebase/firebase-config'
const Login = ({ navigation }) => {
  
  // useEffect(()=>{
  //   const user1 = {
  //     userName : 'Vinh',
  //     chats: {'A1' : 123, 'A2': 456}
  //   };
  //   const user2 = {
  //     userName : 'Duyen',
  //     chats: {'A1' : 123}
  //   };
  //   // const chat1 = {
  //   //   id : 'A1',
  //   // };
  //   // const chat2 = {
  //   //   id : 'A2'
  //   // };

  //   ( async() =>{
  //     // await fireStore(app).collection('testUser').add(user1);
  //     // await fireStore(app).collection('testUser').add(user2);
  //     // await fireStore(app).collection('testUser').add(chat1);
  //     // await fireStore(app).collection('testUser').add(chat2);
  //     // const updateFS = await fireStore(app).collection('testUser').doc('8Qr9AhcUR6TNPNHMf1LU').update({
  //     //   array : fireStore.FieldValue.arrayUnion(11)
  //     // })
  //     // const getData = fireStore(app).collection('testUser').where('chats', 'array-contains','').get();
  //   //   const getData = fireStore(app).collection('testUser').orderBy('chats.'+'A1').get();
  //   //   getData.then((querySnapshot) => {
  //   //     querySnapshot.forEach((doc) => {
  //   //         console.log(doc.id, " => ", doc.id);
  //   //     });
  //   // })

  //   })()
  // }, [])
  const VinhPublicKey = 'Vinh123';
  // const DuyenPublicKey = 'Duyen456';
  const send = async() => {
    const timeSend = fireStore.FieldValue.serverTimestamp();
    const invitation = await fireStore(app).collection('testInvitation').add({
      sentBy: 'UO6wqwixH6vEzePZ0TVZ',
      recivedBy : 'QnoXpfqDDk002PLRzMUo',
      publicKey: {
        'UO6wqwixH6vEzePZ0TVZ' :  VinhPublicKey
      },
      status: 'sent',
      time: timeSend
    })
    await fireStore(app).collection('testUser').doc('QnoXpfqDDk002PLRzMUo').update({
      [`Invitations.${invitation.id}`] : timeSend
    })
    await fireStore(app).collection('testUser').doc('UO6wqwixH6vEzePZ0TVZ').update({
      [`Invitations.${invitation.id}`] : timeSend
    })
  }
  const accept = async() => {
    const messageId = fireStore(app).collection('m').doc().id;
    const guestId = 'UO6wqwixH6vEzePZ0TVZ';
    const ownerId = 'QnoXpfqDDk002PLRzMUo';
    const invitationId = '63Iu79b5wjgtuq2Vk9w1';
    const DuyenPublicKey = 'Duyen456';
    const timeAccept = fireStore.FieldValue.serverTimestamp();
    await fireStore(app).collection('testInvitation').doc(invitationId).update({
      [`publicKey.${ownerId}`] : DuyenPublicKey,
      status :'accepted',
      time : timeAccept
    })
    await fireStore(app).collection('testUser').doc(ownerId).update({
      // recivedInvitations : fireStore.FieldValue.arrayUnion(invitation.id)
      [`recivedInvitations.${invitationId}`] : timeAccept
    })
    await fireStore(app).collection('testUser').doc(guestId).update({
      // sentInvitations : fireStore.FieldValue.arrayUnion(invitation.id)
      [`sentInvitations.${invitationId}`] : timeAccept
    })
    const getPublicKey = await fireStore(app).collection('testInvitation').doc(invitationId).get();
    console.log(getPublicKey.data().publicKey);
    const chatRoom = await fireStore(app).collection('testChat').add({
      publicKey : getPublicKey.data().publicKey,
      lastMessage : {
        messageContent: 'Room has been created',
        messageTime: timeAccept,
        recivedBy: guestId,
        sentBy: ownerId
      },
      members: [ownerId, guestId]
    });
    await fireStore(app).collection('testUser').doc(ownerId).update({
      // recivedInvitations : fireStore.FieldValue.arrayUnion(invitation.id)
      [`chats.${chatRoom.id}`] : timeAccept
    })
    await fireStore(app).collection('testUser').doc(guestId).update({
      // sentInvitations : fireStore.FieldValue.arrayUnion(invitation.id)
      [`chats.${chatRoom.id}`] : timeAccept
    })
    
    await fireStore(app).collection('testMessage').doc(chatRoom.id).set({
      [`${messageId}`] : {
        messageContent: 'Room has been created',
        messageTime: timeAccept,
        recivedBy: guestId,
        sentBy: ownerId
      }
    })
  }
  const refuse = async() => {
    // const c = 'A4';
    // await fireStore(app).collection('testUser').doc('QnoXpfqDDk002PLRzMUo').update({
    //   [`chats.${c}`]: 123
    // })
    // const invitationId = 'e2RBeLWu5fjHpIefi0UF';
    // const getPublicKey = await fireStore(app).collection('testInvitation').doc(invitationId).get();
    // console.log(getPublicKey.data().publicKey);
    const getId =fireStore(app).collection('abc').doc();
    const guestId = 'UO6wqwixH6vEzePZ0TVZ';
    const ownerId = 'QnoXpfqDDk002PLRzMUo';
    const timeSend = fireStore.FieldValue.serverTimestamp();
    console.log(getId.id);
    await fireStore(app).collection('testMessage').doc('kLakVrHQ91XF6RIeFK7r').update({
      [`${fireStore(app).collection('abc').doc().id}`] : {
        messageContent: 'First Message',
        messageTime: timeSend,
        recivedBy: guestId,
        sentBy: ownerId
      }
    })
    await fireStore(app).collection('testChat').doc('kLakVrHQ91XF6RIeFK7r').update({
      lastMessage : {
        messageContent: 'First Message',
        messageTime: timeSend,
        recivedBy: guestId,
        sentBy: ownerId
      },
    })
    await fireStore(app).collection('testUser').doc(guestId).update({
      [`chats.${'kLakVrHQ91XF6RIeFK7r'}`] : timeSend
    })
    await fireStore(app).collection('testUser').doc(ownerId).update({
      [`chats.${'kLakVrHQ91XF6RIeFK7r'}`] : timeSend
    })
  }
  const getAllInvitations = async() => {
    const invitations = await fireStore(app).collection('users').doc('Op8hO1UneXU9HANZpXeIE04R1st1').get();
    // console.log(invitations.data().invitations);
  //   const result = await Promise.all(Object.keys(JSON.parse(owner)?.chats).map( async(element) => {
  //     const chatId = await fireStore(app).collection('chats').doc(element).get();
  //     return chatId.data();
  // }))
  const arr = Object.keys(invitations.data().invitations);
  const result = await Promise.all(arr.map(async(e)=>{
    const invitation = await fireStore(app).collection('invitations').doc(e).get();
    return invitation
  }))
  console.log(result)
  }

  return (
    <View style={styles.container}>
      <LoginHeader/>
      <LoginInputForm navigation= {navigation}/>

      {/* <TouchableOpacity onPress={() => send()}><Text>Send</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => accept()}><Text>Accpet</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => getAllInvitations()}><Text>Refuse</Text></TouchableOpacity> */}
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center'
    }
})