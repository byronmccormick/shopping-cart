import React, { useState, useEffect } from 'react';
import {View, FlatList, ScrollView, Modal} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Button, Card, IconButton, Badge } from 'react-native-paper';

const products = [
  { name: "Sledgehammer", price: 125.75 },
  { name: "Axe", price: 190.50 },
  { name: "Bandsaw", price: 562.13 },
  { name: "Chisel", price: 12.9 },
  { name: "Hacksaw", price: 18.45 },
];

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartVisible, setCartVisible] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      const storedCart = await AsyncStorage.getItem('cart');
      if(storedCart){
        setCart(JSON.parse(storedCart));
      }
    };
    loadCart();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.name === product.name);
      if(existingItem){
        return prevCart.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productName) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.name !== productName)
    );
  };


  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const toggleCart = () => setCartVisible((prev) => !prev);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <Navbar />
      <FlatList
        data={products}
        keyExtractor={(item) => item.name}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <ProductCard product={item} addToCart={addToCart} />
        )}
      />
      <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
        <IconButton
          icon="cart"
          size={30}
          iconColor="#ffffff"
          onPress={toggleCart}
          style={{ backgroundColor: '#6200ee', borderRadius: 50 }}
        />
        {cartItemCount > 0 && (
          <Badge style={{ position: 'absolute', top: -5, right: -5, backgroundColor: '#ff0000', color: '#fff' }}>{cartItemCount}</Badge>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isCartVisible}
        onRequestClose={toggleCart}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginHorizontal: 10}}>Cart <IconButton icon="close" onPress={toggleCart} /></Text>
            <ScrollView>
              {cart.length > 0 ? (
                cart.map((item) => (
                  <CartItem
                    key={item.name}
                    item={item}
                    removeFromCart={removeFromCart}
                  />
                ))
              ) : (
                <Text style={{ margin: 10, fontSize: 16 }}>Cart is empty.</Text>
              )}
              <Text style={{ fontSize: 18, fontWeight: 'bold', margin: 10}}>Total: ${cartTotal.toFixed(2)}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

//Components
const Navbar = () => (
  <View style={{ backgroundColor: '#6200ee', padding: 20 }}>
    <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>The ToolShed</Text>
  </View>
);

const ProductCard = ({ product, addToCart }) => (
  <Card style={{ flex: 1, margin: 5 }}>
    <Card.Content>
      <Text>{product.name}</Text>
      <Text>${product.price.toFixed(2)}</Text>
    </Card.Content>
    <View style={{width: 'fit-content', margin: 10}}>
      <Button buttonColor="#6200ee" mode="contained" onPress={() => addToCart(product)}>
        Add to Cart
      </Button>
    </View>
  </Card>
);

const CartItem = ({ item, removeFromCart }) => (
  <Card style={{ margin: 10 }}>
    <Card.Content>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
      <Text style={{ fontSize: 14, color: '#555' }}>
        Price: ${item.price.toFixed(2)} | Quantity: {item.quantity}
      </Text>
      <Text style={{ fontSize: 14, fontWeight: 'bold', marginVertical: 5 }}>
        Total: ${(item.price * item.quantity).toFixed(2)}
      </Text>
      <View style={{ marginTop: 10, width:'fit-content'}}>
        <Button textColor="#6200ee" mode="outlined" onPress={() => removeFromCart(item.name)}>Remove</Button>
      </View>
    </Card.Content>
  </Card>
);