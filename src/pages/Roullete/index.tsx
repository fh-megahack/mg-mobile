import React from 'react';
import styles from './styles'

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import { Feather as Icon } from '@expo/vector-icons';

export default function Roulette() {
  return (
    <View style={styles.container}>

      <View style={styles.containerTop}>
        <Icon style={styles.arrowLeft} name="arrow-left" color="#FFF" size={30} />
        <Text style={styles.textTop}>Roleta</Text>
      </View>

      <View style={styles.containerBottom}>
        <View style={{ marginTop: 40 }}>
          <Image
            source={require('../../assets/login/roulette.png')}
          />
        </View>

        <Text style={styles.textRoulette0}>Ganhe Brindes!</Text>
        <Text style={styles.textRoulette1}>Concorra a brindes e descontos para</Text>
        <Text style={styles.textRoulette2}>poder usar neste estabelecimento!</Text>
        
        <View>
          <Image
              source={require('../../assets/login/rouletteGif.gif')}
              style={{width: 150, height:150, marginTop: 80 }}
            />
        </View>

        <TouchableOpacity style={styles.button}>
              <Image
                source={require('../../assets/login/iconBar.png')}
                style={{width: 25, height: 25, marginLeft: 30}}
              />
              <Text style={styles.buttonText}>
                Ir para o Bar
              </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}