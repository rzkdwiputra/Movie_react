import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { getPoster } from "../services/MovieService";
import COLORS from "../constants/Colors";
import FONTS from "../constants/Fonts";

const CastCard = ({ originalName, image, characterName }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: getPoster(image) }} resizeMode={image ? "cover" : "contain"} style={styles.image} />
      <Text style={styles.originalName} numberOfLines={2}>
        {originalName}
      </Text>
      <Text style={styles.characterName} numberOfLines={2}>
        {characterName}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: 120,
    width: 80,
    borderRadius: 10,
    paddingBottom: 10,
  },
  originalName: {
    width: 80,
    color: COLORS.BLACK,
    fontFamily: FONTS.BOLD,
  },
  characterName: {
    width: 80,
    color: COLORS.LIGHT_GRAY,
    fontFamily: FONTS.BOLD,
    fontSize: 10,
  },
});

export default CastCard;
