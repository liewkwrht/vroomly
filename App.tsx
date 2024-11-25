import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import * as React from 'react'; 
import { SQLiteProvider } from 'expo-sqlite';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './screens/Home';
import WelcomePage from './screens/Welcome';
import LoginPage from './screens/Login';
import SignupPage from './screens/Signup';
import MainTabs from './components/MainTab';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
    'Support for defaultProps will be removed',
    'Encountered two children with the same key',
]);

const Stack = createNativeStackNavigator();

const loadDatabase = async () => {
  const dbName = 'database.db';
  const dbAsset = require(`./assets/${dbName}`);
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;
  
  const fileInto = await FileSystem.getInfoAsync(dbFilePath);
  if (!fileInto.exists) {
    await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}SQLite`, { intermediates: true });
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
};

export default function App() {
  const [dbLoaded, setDbLoaded] = React.useState<boolean>(false);

  React.useEffect(() => {
    loadDatabase()
      .then(() => setDbLoaded(true))
      .catch((e) => console.error(e));
  }, []);

  if (!dbLoaded) {
    return (
      <SafeAreaView>
      </SafeAreaView>
    ); 
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} > 
      <StatusBar style="auto" /> 
      <NavigationContainer>
        <React.Suspense fallback={
          <View>
          </View>
        }>
          <SQLiteProvider databaseName='database.db' useSuspense>
            <Stack.Navigator
                initialRouteName="Welcome"
                screenOptions={{ headerShown: false }}
            >
              <Stack.Screen
                name="Home"
                component={Home}
                options={{
                  headerTitle: 'Home',
                  headerLargeTitle: true,
                }}
              />
              <Stack.Screen name="Welcome" component={WelcomePage} />
              <Stack.Screen name="Login" component={LoginPage} />
              <Stack.Screen name="Signup" component={SignupPage} />
              <Stack.Screen name="MainTabs" component={MainTabs} />
            </Stack.Navigator>
          </SQLiteProvider>
        </React.Suspense>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
