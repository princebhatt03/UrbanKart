import React from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useCart } from '../context/CartContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

export default function CartPage({ navigation }: Props) {
  const { cart } = useCart();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🛒 Your Cart</Text>

      {cart.length === 0 ? (
        <Text>Your cart is empty</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.cartItem}>
              {item.name} - ₹{item.price}
            </Text>
          )}
        />
      )}

      <Button
        title="Back to Home"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  cartItem: { fontSize: 16, marginBottom: 10 },
});
