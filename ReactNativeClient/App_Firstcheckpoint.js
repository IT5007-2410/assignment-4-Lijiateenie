/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import IssueList from './IssueList.js';
import type {Node} from 'react';

//import 'react-native-gesture-handler';
//
//import { NavigationContainer } from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';
//
//import { Button, Header } from 'react-native-elements';
//import { View, Text } from 'react-native';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';



//export default function App() {
//  return (
//    <NavigationContainer>
//      <Stack.Navigator initialRouteName="Home">
//        <Stack.Screen name="Issue Tracker" component={IssueList} />
//      </Stack.Navigator>
//    </NavigationContainer>
//  );
//}
//    <View>
//      <Header
//        centerComponent={{ text: 'Issue Tracker', style: { color: '#fff' } }}
//      />
//      <Text style={{ fontSize: 20, padding: 10 }}>Welcome to Issue Tracker</Text>
//      <Button title="Get Started" onPress={() => alert("Let's go!")} />
//    </View>


export default class App extends React.Component
{
  render()
  {
    return(
    <>
    <Text>Issue Tracker</Text>
    <IssueList/>
    </>);
//    <View>
//      <Header
//        centerComponent={{ text: 'Issue Tracker', style: { color: '#fff' } }}
//      />
//      <Text style={{ fontSize: 20, padding: 10 }}>Welcome to Issue Tracker</Text>
//      <Button title="Get Started" onPress={() => alert("Let's go!")} />
//    </View>
//
//    <NavigationContainer>
//          <Stack.Navigator initialRouteName="Home">
//            <Stack.Screen name="Issue Tracker" component={IssueList} />
//          </Stack.Navigator>
//    </NavigationContainer>


  }
}
