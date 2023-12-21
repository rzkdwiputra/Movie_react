import React from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import COLORS from "../constants/Colors";
import Fonts from "../constants/Fonts";

const { height, width } = Dimensions.get("screen");

const setWidth = (w) => (width / 100) * w;

const GenreCard = ({ genreId, genreName, active, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        ...styles.container,
        backgroundColor: active ? COLORS.ACTIVE : COLORS.WHITE,
      }}
      activeOpacity={0.5}
      onPress={() => onPress(genreName, genreId)}
    >
      <Text style={{ ...styles.genreText, color: active ? COLORS.WHITE : COLORS.BLACK }}>{genreName}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: COLORS.WHITE,
    paddingVertical: 8,
    elevation: 3,
    marginVertical: 2,
    width: setWidth(25),
  },
  genreText: {
    fontSize: 13,
    color: COLORS.ACTIVE,
    fontFamily: Fonts.BOLD,
  },
});

export default GenreCard;
