import React, { useState, useEffect } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import { ImageBackground, Image, View, Text } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import api from "../../services/api";

import styles from "./styles";

interface SelectProps {
  label: string;
  value: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityresponse {
  nome: string;
}

const Home = () => {
  const navigation = useNavigation();
  const [ufs, setUFs] = useState<SelectProps[]>([
    { label: "Selecione o estado", value: "" },
  ]);
  const [cities, setCities] = useState<SelectProps[]>([
    { label: "Selecione a cidade", value: "" },
  ]);
  const [selectedUF, setSelectedUf] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");

  function handleNavigateToPoints() {
    navigation.navigate("Points");
  }

  useEffect(() => {
    async function getUfs() {
      const { data } = await api.get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados/"
      );

      const ufOptions = data.map((uf) => {
        return {
          label: uf.sigla,
          value: uf.sigla,
        };
      });

      setUFs([...ufs, ...ufOptions]);
    }

    getUfs();
  }, []);

  useEffect(() => {
    async function getCities() {
      if (selectedUF === "0") {
        return;
      }

      const { data } = await api.get<IBGECityresponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`
      );

      const defaultCity = { label: "Selecione a cidade", value: "" };
      const cityNames = data.map((city) => {
        return {
          label: city.nome,
          value: city.nome,
        };
      });

      setCities([defaultCity, ...cityNames]);
    }

    getCities();
  }, [selectedUF]);

  return (
    <ImageBackground
      source={require("../../assets/home-background.png")}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require("../../assets/logo.png")} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>
          Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente
        </Text>
      </View>

      <View style={styles.footer}>
        <RNPickerSelect
          style={styles.select}
          onValueChange={(value) => console.log(value)}
          items={ufs}
        />
        <RNPickerSelect
          style={styles.select}
          onValueChange={(value) => console.log(value)}
          items={cities}
        />
        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>
            <Text style={styles.buttonText}>Entrar</Text>
          </View>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

export default Home;
