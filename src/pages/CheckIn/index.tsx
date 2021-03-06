import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar, Text, View, TouchableOpacity, Modal, Alert, TouchableHighlight } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { AntDesign } from '@expo/vector-icons';
import LottieView from "lottie-react-native";

import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings([
  'Non-serializable values were found in the navigation state',
]);

// Estilos
import styles from './styles'
import BottomBar from '../../components/Navigator';
import api from '../../services/api';

interface User {
  id: number
  image: string
  name: string
  email: string
  whatsapp: string
  city: string
  uf: string
  password: string
  url_image: string
  points: Point
}

interface Point {
  user_id: number
  total_points: number
  rescue_points: number
}

interface Params {
  userInfo: User
}

interface ProductDescription {
  name: string
  url_image: string
}

interface RatingFull {
  id: number
  bar_id: number
  user_id: number
  rating: number
  comment: string
  user_name: string
  user_image: string
}

interface Bar {
  id: number
  name: string
  latitude: number
  longitude: number
  street: string
  address_number: number
  neighborhood: string
  uf: string
  city: string
  website: string
  url_image: string
  phone: number
  products: ProductDescription[]
  ratings: RatingFull[]
}

export default function CheckIn() {
  const route = useRoute()
  const navigation = useNavigation()

  const { userInfo } = route.params as Params

  const [modalVisible, setModalVisible] = useState(false);
  const [loadVisible, setLoadVisible] = useState(false);
  const [pointModalVisible, setPointModalVisible] = useState(false);


  const [hasPermission, setHasPermission] = useState<any>(null);
  const [scanned, setScanned] = useState(false);

  const checkinPoint = 50
  const [totalPoints, setTotalPoints] = useState(userInfo.points.total_points);
  const [rescuePoints, setRescuePoints] = useState(userInfo.points.rescue_points);

  function handleNavigateToHome() {
    navigation.navigate('Home')
  }

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanner = async (result: any) => {
    setLoadVisible(true)
    setScanned(true);

    if (result && result.data) {
      const barData: any = await api.get(`bars/${result.data}`)

      if (barData && barData.data) {
        const options = {
          "user_id": userInfo.id,
          "bar_id": barData.data.id
        }

        const barInfo = barData.data
        const checkIn = await api.post('discovery', options)
        if (checkIn && checkIn.data && checkIn.data.hasOwnProperty('id')) {

          const options = {
            user_id: userInfo.id,
            total_points: totalPoints + checkinPoint,
            rescue_points: rescuePoints + checkinPoint
          }
          api.put('points', options).then((result) => {
            setLoadVisible(false)
            setTimeout(() => {
              setPointModalVisible(true)
            }, 200)
            setTimeout(function () {
              setPointModalVisible(false)
              navigation.navigate('CheckInSuccess', { userInfo, barInfo })
            }, 3000)
          }).catch((error) => {

            setLoadVisible(false)
            navigation.navigate('CheckInSuccess', { userInfo, barInfo })
          })
        } else {
          setLoadVisible(false)
          setModalVisible(true)
          setScanned(false);
        }
      } else {
        setLoadVisible(false)
        setModalVisible(true)
        setScanned(false);
      }
    } else {
      setLoadVisible(false)
      setModalVisible(true)
      setScanned(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Ops...</Text>
              <Text style={styles.modalText}>Não foi possível realizar o check-in!</Text>
              <TouchableHighlight
                style={{ ...styles.openButton }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setScanned(false);
                }}
              >
                <Text style={styles.textStyle}>Tentar Novamente</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={pointModalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTextHead}>Parabéns!</Text>
              <Text style={styles.modalText}>você ganhou mais <Text style={styles.modalTextPoint}>{checkinPoint}</Text> pontos!</Text>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={loadVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}>
          <View style={styles.centeredView}>
            <LottieView
              autoPlay
              loop
              style={{
                width: '40%'
              }}
              source={require('./../../assets/lottie/lottie-beer.json')}
            />
          </View>
        </Modal>

        <View style={styles.header}>
          <TouchableOpacity onPress={handleNavigateToHome} >
            <AntDesign name="arrowleft" size={24} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.welcomeText}>Certo <Text style={styles.welcomeTextName}>{userInfo.name}</Text>,</Text>
            <Text style={styles.welcomeText}>Escaneie o Código QR e explore esse ambiente incrível!</Text>
          </View>
        </View>


        <View style={styles.mapContainer}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? () => { } : handleBarCodeScanner}
            style={styles.scanner}
          />
        </View>

        <BottomBar userInfo={userInfo} />

      </View>
    </>
  );
}
