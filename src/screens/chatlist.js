/* React & React Native*/
import React, {useEffect, useState} from 'react';
import {
  TouchableWithoutFeedback,
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
} from 'react-native';
import {SpeedDial} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useIsFocused } from '@react-navigation/native';


/* Redux */
import {connect, useDispatch} from 'react-redux';
import {getRoomList} from '../actions/actions';

/* Firebase */
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

/* Components*/
import Chat from '../components/chatbox';
import Overlay from '../components/overlay';
import Loading from '../components/loading';

const ChatList = ({RoomList, navigation}) => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const [buttonTitle, setButtonTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  
  useEffect(async () => {
    console.log('listner for chatlist...')
    setLoading(true);
    await firestore()
    .collection('rooms')
    .where('members', 'array-contains-any', [auth().currentUser.uid])
    .onSnapshot(onResult, onError);
    return () => subscriber();
  },[isFocused]);

  function onResult(QuerySnapshot) {
    const tempData = [];
    QuerySnapshot.forEach(doc => {
      tempData.push(doc.data());
    });
    dispatch(getRoomList(tempData));
    setLoading(false);
  }

  function onError(error) {
    console.error(error);
  }


  function renderRooms(room) {
    console.log('inside render');
    console.log(room.item.name);
    return (
      <TouchableWithoutFeedback>
        <Chat
          chatName={room.item.name}
          notifications={room.item.unread}
          recent={room.item.recent.message}
          onPress={() =>
            navigation.navigate('chatscreen', {
              screenName: room.item.name,
              rid: room.item.rid,
              members: room.item.members,
            })
          }
        />
      </TouchableWithoutFeedback>
    );
  }

  if (loading) {
    return (
      <View style={{marginTop: hp('40%'), marginHorizontal: wp('20%')}}>
        <Loading />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <View>
        {/* <Chat chatName='chat 1' notifications='89' recent='Recent Text' onPress={() => navigation.navigate('chatscreen')}/> */}
        <TouchableWithoutFeedback>
          <FlatList
            data={RoomList}
            renderItem={renderRooms}
            keyExtractor={room => room.rid}></FlatList>
        </TouchableWithoutFeedback>
      </View>

      <SpeedDial
        isOpen={open}
        icon={{name: 'add', color: '#fff'}}
        openIcon={{name: 'close', color: '#fff'}}
        onOpen={() => setOpen(!open)}
        onClose={() => setOpen(!open)}
        color="#6c5ce7">
        <SpeedDial.Action
          icon={{name: 'add', color: '#fff'}}
          title="Create"
          onPress={() => {
            setVisible(true);
            setPlaceholder('Enter Chat Room Name');
            setButtonTitle('Create');
          }}
          color="#6c5ce7"
        />
        <SpeedDial.Action
          icon={{name: 'group', color: '#fff'}}
          title="Join"
          onPress={() => {
            setVisible(true);
            setPlaceholder('Enter Room Code');
            setButtonTitle('Join');
          }}
          color="#6c5ce7"
        />
      </SpeedDial>
      <Overlay
        visible={visible}
        toggleOverlay={() => setVisible(!visible)}
        buttonTitle={buttonTitle}
        placeholder={placeholder}
        setModalLoading={setModalLoading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapStateToProps = state => {
  return {
    RoomList: state.RoomList,
  };
};

export default connect(mapStateToProps)(ChatList);
