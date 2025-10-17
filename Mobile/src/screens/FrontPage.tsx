import React from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useCart } from '../context/CartContext';
import { showMessage } from 'react-native-flash-message';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const demoProducts = [
  { id: 1, name: 'T-Shirt 👕', price: 500 },
  { id: 2, name: 'Jeans 👖', price: 1200 },
  { id: 3, name: 'Shoes 👟', price: 2500 },
];

export default function FrontPage({ navigation }: Props) {
  const { addToCart } = useCart();

  const handleAddToCart = (item: any) => {
    addToCart(item);
    showMessage({
      message: `${item.name} added to cart 🛒`,
      type: 'success',
      backgroundColor: '#28a745', // green
      color: '#fff',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🏬 UrbanKart Products</Text>

      <FlatList
        data={demoProducts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Text style={styles.productText}>
              {item.name} - ₹{item.price}
            </Text>
            <Button
              title="Add to Cart"
              onPress={() => handleAddToCart(item)}
            />
          </View>
        )}
      />

      <Button
        title="Go to Cart 🛒"
        onPress={() => navigation.navigate('Cart')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  productCard: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
  },
  productText: { fontSize: 16, marginBottom: 8 },
});
