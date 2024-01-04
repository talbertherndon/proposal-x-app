import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import ProjectScreen from './src/app/project';
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import HomeScreen from './src/app/home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'expo-image';

import { default as theme } from './custom-theme.json'
const Stack = createNativeStackNavigator();

function Logo() {
  return (
    <Image resizeMode='contain' style={{ width: 50, height: 50 }} source={require("./assets/icon.png")} />
  )
}

export default function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name='Home' component={HomeScreen} options={{ headerTitle: (props) => <Logo {...props} /> }} />
            <Stack.Screen name='Project' component={ProjectScreen} options={{ title: "Proposal" }} />
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </>
  );
}

