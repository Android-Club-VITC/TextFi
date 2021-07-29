/* React & React Native imports */
import React, {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {GiftedChat} from 'react-native-gifted-chat';

/*Functions */
import { onSend } from './helper';

/*firebase*/
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ChatScreen = ({route}) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [isTyping, setTyping] = useState(false);
  const [send, setSend] = useState(false);
  const {rid, members} = route.params;

  const uid = auth().currentUser.uid;
  const name = uid.slice(uid.length - 4, uid.length);

  /*listener */
  useEffect(() => {
    console.log('listner.....')
    const subscriber = firestore()
    .collection('messages')
    .doc(rid)
    .onSnapshot(onResult, onError);
    return () => subscriber();
  },[]);

  function onResult(QuerySnapshot) {
    setMessages(QuerySnapshot.data().messages);
  }

  function onError(error) {
    console.error(error);
  }

  return (
    <SafeAreaView style={styles.container}>
      <GiftedChat
        messages={messages}
        inverted={false}
        text={text}
        onInputTextChanged={text => setText(text)}
        onSend={messages => {
          setTyping(false);
          setSend(true);
          onSend(messages, text, uid, name, rid);
          setSend(false);
        }}
        user={{
          _id: uid,
          name: name,
        }}
        renderAvatarOnTop={true}
        scrollToBottom={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatScreen;
