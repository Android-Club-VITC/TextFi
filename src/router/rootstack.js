/* React & React Native imports */
import React,{useState} from 'react';
import { TouchableOpacity } from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import Clipboard from '@react-native-community/clipboard';


/* Components */
import CopiedModal from '../components/copiedModal';

/* Screens*/
import ChatList from '../screens/chatlist';
import ChatScreen from '../screens/chatscreen';
import Settings from "../screens/setttings";
import Logout from "../screens/logout";



const Stack = createStackNavigator();

const RootStack = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Stack.Navigator
      headerMode="screen"
      screenOptions={{
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor: '#6c5ce7', height: hp('8%')},
        headerTitleStyle: {color: '#ffffff', fontSize: hp('3.5%')},
      }}>
      <Stack.Screen
        name="chatlist"
        component={ChatList}
        options={({navigation}) => ({
          headerTitle: 'Chats',
          headerRight: () => (
            <>
              <TouchableOpacity onPress={() => navigation.navigate('settings')}>
                <Icon name='cog' type='font-awesome' color='#ffffff' style={{padding: hp('2%')}}/>
              </TouchableOpacity>
            </>
          ),
        })}
      />
      <Stack.Screen
        name="chatscreen"
        component={ChatScreen}
        options={({route}) => ({
          headerTitle: route.params.screenName,
          headerRight: () => (
            <>
              <TouchableOpacity onPress={() => {
                setModalVisible(true);
                Clipboard.setString(route.params.rid);
                setTimeout(() => {
                  setModalVisible(false);
                },1000)
              }
              }>
                <Icon name='copy' type='font-awesome' color='#ffffff' style={{padding: hp('2%')}}/>
              </TouchableOpacity>
              <CopiedModal visible={modalVisible} text="Room Code copied!" />
            </>
          ),
        })}
      />
      <Stack.Screen
        name="settings"
        component={Settings}
        options={{
          title: 'Settings',
        }}
      />
      <Stack.Screen
        name="logout"
        component={Logout}
        headerMode='none'
      />
    </Stack.Navigator>
  );
};

export default RootStack;
