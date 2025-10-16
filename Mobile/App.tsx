import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FlashMessage from 'react-native-flash-message';

import FrontPage from './src/screens/FrontPage';
import CartPage from './src/screens/CartScreen';
import { CartProvider } from './src/context/CartContext';

export type RootStackParamList = {
  Home: undefined;
  Cart: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={FrontPage}
          />
          <Stack.Screen
            name="Cart"
            component={CartPage}
          />
        </Stack.Navigator>
        {/* ✅ FlashMessage must be inside NavigationContainer */}
        <FlashMessage position="top" />
      </NavigationContainer>
    </CartProvider>
  );
}
