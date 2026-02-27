import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function App() {
  const [contador, setContador] = useState(0);

  function incrementar() {
    setContador(contador + 1);
  }
  
  function decrementar() {
    setContador(contador - 1);
  } 
  
  const restart = () => {setContador(0);} 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contador de Clique</Text>

      <Text style={styles.numero}>{contador}</Text>

      <View style={styles.linhaDeBotoes}>
        <TouchableOpacity style={styles.botaoMenos} onPress = {decrementar}>
          <AntDesign name="minus" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoRestart} onPress = {restart}>
          <MaterialCommunityIcons name="restart" size={24} color="black" />
          </TouchableOpacity>
        <TouchableOpacity style={styles.botaoMais} onPress = {incrementar}>
          <Entypo name="plus" size={24} color="black" />
          </TouchableOpacity>
          
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#130808',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#9525c2c2',
  },
  numero: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#ffe600',
  },
  linhaDeBotoes: {
    flexDirection: 'row',
    marginTop: 20,
    width:300,
    justifyContent:"space-around"
  },
  botaoMais:{
    backgroundColor: '#00ff55',
    height:40,
    width:80,
    alignItems:"center",
    flex:"'center",
    justifyContent:"center",
    fontWeight:"bold",
    borderRadius:30,
  },
  botaoMenos:{
    backgroundColor: '#f83a3a',
     height:40,
    width:80,
    alignItems:"center",
    flex:"'center",
    justifyContent:"center",
    fontWeight:"bold",
    borderRadius:30,
  },
  botaoRestart:{
     backgroundColor: '#916d0c',
     height:40,
    width:80,
    alignItems:"center",
    flex:"'center",
    justifyContent:"center",
    fontWeight:"bold",
    borderRadius:30,
  }
});
