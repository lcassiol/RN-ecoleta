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
  const ufPlaceHolder = {
    label: "Selecione o estado",
    value: null,
    color: "#9EA0A4",
  };

  const cityPlaceHolder = {
    label: "Selecione a cidade",
    value: null,
    color: "#9EA0A4",
  };
  const [ufs, setUFs] = useState<SelectProps[]>([]);
  const [cities, setCities] = useState<SelectProps[]>([]);
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

      setUFs(ufOptions);
    }

    getUfs();
  }, []);

  useEffect(() => {
    async function getCities() {
      if (selectedUF === null) {
        return;
      }

      const { data } = await api.get<IBGECityresponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`
      );

      const cityNames = data.map((city) => {
        return {
          label: city.nome,
          value: city.nome,
        };
      });

      setCities(cityNames);
    }

    getCities();
  }, [selectedUF]);

  function handleSelectUF(uf: string) {
    setSelectedUf(uf);
    setCities([]);
  }

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
          placeholder={ufPlaceHolder}
          onValueChange={(value) => handleSelectUF(value)}
          items={ufs}
          value={selectedUF}
        />
        <RNPickerSelect
          placeholder={cityPlaceHolder}
          onValueChange={(value) => setSelectedCity(value)}
          items={cities}
          value={selectedCity}
        />
        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

export default Home;
