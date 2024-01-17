import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, LogBox, Platform, StyleSheet, Text, View } from 'react-native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, useTheme } from '@ui-kitten/components';
import ProjectScreen from './src/app/project';
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import HomeScreen from './src/app/home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import * as SQLite from 'expo-sqlite';
import { default as theme } from './custom-theme.json'
import { useEffect } from 'react';
import CameraScreen from './src/app/camera';

const Stack = createNativeStackNavigator();
function Logo() {
  return (
    <Image resizeMode='contain' style={{ width: 50, height: 50 }} source={require("./assets/icon.png")} />
  )
}

function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => { }
        }
      }
    }
  }

  const db = SQLite.openDatabase("db.db");
  db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () =>
    console.log('Foreign keys turned on')
  );
  return db;
}

export const db = openDatabase();

export default function App() {
  LogBox.ignoreAllLogs();

  useEffect(() => {
    console.log("CREATING TABLES")
    // db.transaction((tx) => {
    //   tx.executeSql(
    //     "DROP TABLE IF EXISTS areas"
    //   )
    // })
    // db.transaction((tx) => {
    //   tx.executeSql(
    //     "DROP TABLE IF EXISTS projects"
    //   )
    // })
    // db.transaction((tx) => {
    //   tx.executeSql(
    //     "DROP TABLE IF EXISTS customers"
    //   )
    // })


    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS projects(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, address TEXT, city TEXT, state TEXT, zip INT, phone INT, email TEXT, start TEXT, finish TEXT, notes TEXT, cost INT,completed INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
      );
    })

    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS areas(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, source TEXT, file TEXT, requirements TEXT, estimate INT, category TEXT, status TEXT, completed INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, project_id INT, FOREIGN KEY (project_id) REFERENCES projects(id))"
      )
    })
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS customers(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, address TEXT, city TEXT, state TEXT, zip INT, phone INT, email TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
      );
    })

  }, [])

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
        <NavigationContainer>
          <Stack.Navigator >
            <Stack.Screen name='Home' component={HomeScreen} options={{ headerShown: true, headerTitle: (props) => <Logo {...props} /> }} />
            <Stack.Screen name='Project' component={ProjectScreen} options={{
              title: "Manage Project"
            }} />
            <Stack.Screen name='Camera' component={CameraScreen} options={{ headerTitle: (props) => <Logo {...props} /> }} />
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </>
  );
}

