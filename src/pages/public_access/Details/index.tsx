import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Image, Animated, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import api from '../../../services/api'
import HomeStars from '../../../components/HomeStars/index'
import styles from './styles'

interface Params {
  bar_id: number;
}

interface Bar {
  name: string;
  street: string;
  address_number: number;
  neighborhood: string;
  city: string;
  uf: string;
  url_image: string;
  website: string;
}


export default function Rota() {

  const [data, setData] = useState<Bar>({} as Bar);

  const navigation = useNavigation();
  const route = useRoute();
  
  const translateY = new Animated.Value(0)

  function handleNavigationBack() {
    navigation.goBack()
  }

  const routeParam = route.params as Params;

  useEffect(() => {
    api.get(`bars/${routeParam.bar_id}`).then(response => {
      setData(response.data);
    });
  },[]);

  if (!data) {
    return null;
  }

  return (
    <>
    <SafeAreaView>
      <ScrollView>
    
    <View style={styles.container}>

      <View style={styles.header}>

        <View style={styles.topNav}>
          <TouchableOpacity onPress={handleNavigationBack} >
            <AntDesign name="arrowleft" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.textTop}>Detalhes</Text>
        </View>

        <View style={styles.barHeader}>
          <View style={styles.barHeaderContainer}>
            <View style={styles.heartView}>
              <TouchableOpacity style={styles.heartButton}>
                <AntDesign name="heart" size={35} color="red" />
              </TouchableOpacity>
            </View>
            <Image style={styles.barHeaderImage} source={{ uri: data.url_image }} />
            
            <View style={styles.barInfos}>
              <View>
                <Text style={styles.barHeaderTitle}>{data.name}</Text>
              </View>
              <View style={styles.rating}>
                <Text style={styles.infoText}>Descobertas</Text>

                <Text style={styles.infoText}>Avaliação</Text>
              </View>
              <View style={styles.counter}>
                <View style={styles.counterInfo}>
                  <MaterialCommunityIcons name="account-group" color="#FFCE39" size={30}/>
                  <Text style={styles.counterInfoText}>153</Text>
                </View>

                <View style={styles.counterInfo}>
                  <AntDesign name="star" color="#FFCE39" size={30}/>
                  <Text style={styles.counterInfoText}>4.8</Text>
                </View>
              </View>

            </View>
          </View>
        </View>
      </View>
        <View style={styles.containerMain}>
          <View style={styles.barLinks}>

            <View style={styles.barLocation}>
              <Entypo name="location" color="#F08A4B" size={18} />
              <Text style={styles.barLocationText}>{data.street}, {data.address_number} - {data.neighborhood}, {data.uf}</Text>
            </View>

            <View style={styles.barLink}>
              <Entypo name="link" color="#F08A4B" size={18} />
              <Text style={styles.barLinkText}>{data.website}</Text>
            </View>
          </View>

            <View style={styles.homeStars}>
              <Text style={styles.homeStarsText}>Estrelas da casa</Text>
              <HomeStars translateY={translateY} />
            </View>

            <View style={styles.favorites}>

            <View style={styles.favoritesTitle}>
              <Text style={styles.favoritesText}>Avaliações</Text>
              <Text style={styles.seeMore}>Ver Todas</Text>
            </View>

              <View style={styles.favoritesCard}>
                <View style={styles.favoritesCardHeader}>
                  <Image style={styles.favoritesImage} source={require('../../../assets/details/andreProfiles.jpg')} />
                  <Text style={styles.favoritesName}>André Fuzi</Text>
                </View>
                <View style={styles.favoritesCardFooter}>
                  <Text numberOfLines={1} style={styles.favoritesCardComment}>Um ótimo lugar, vale super a pena visitar!</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    
      </>
  );
}