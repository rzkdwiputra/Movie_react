import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View, Dimensions, Image, TouchableOpacity, Linking, FlatList, Share, TouchableNativeFeedback } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import COLORS from "../constants/Colors";
import FONTS from "../constants/Fonts";
import { getMovieById, getPoster, getVideo } from "../services/MovieService";
import ItemSeparator from "../components/ItemSeparator";
import MovieCard from "../components/MovieCard";
import CastCard from "../components/CastCard";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Ionicons } from "@expo/vector-icons";
import { APPEND_TO_RESPONSE as AR } from "../constants/Urls";

const { height, width } = Dimensions.get("window");

const setHeight = (h) => (height / 100) * h;
const setWidth = (w) => (width / 100) * w;

const MovieScreen = ({ route, navigation }) => {
  const { movieId } = route.params;
  const [movie, setMovie] = useState(null);
  const [isCastSelected, setIsCastSelected] = useState(true);
  const [bookmark, setBookmark] = useState(false);

  const navigateToMovieScreen = (movieId) => {
    navigation.replace("movie", { movieId });
  };

  const checkIsBookmarked = async (movieId) => {
    const bookmark = await AsyncStorage.getItem("@bookmarklist");
    const array = JSON.parse(bookmark);
    if (array && array.includes(movieId)) {
      setBookmark(true);
    } else {
      setBookmark(false);
    }
  };

  const onBookmarkClick = async (movieId) => {
    const bookmark = await AsyncStorage.getItem("@bookmarklist");
    if (bookmark) {
      let decoded = JSON.parse(bookmark);
      decoded.push(movieId);
      console.log("Data after parsing 2: ", decoded);
      await AsyncStorage.setItem("@bookmarklist", JSON.stringify(decoded));
    } else {
      await AsyncStorage.setItem("@bookmarklist", JSON.stringify([movieId]));
    }
    setBookmark(true);
  };
  const onUnBookmarkClick = async (movieId) => {
    const bookmark = await AsyncStorage.getItem("@bookmarklist");
    if (bookmark) {
      let decoded = JSON.parse(bookmark);
      if (Array.isArray(decoded)) {
        const index = decoded.indexOf(movieId);
        if (index !== -1) {
          decoded.splice(index, 1);
          await AsyncStorage.setItem("@bookmarklist", JSON.stringify(decoded));
          setBookmark(false);
        }
      }
    }
  };

  useEffect(() => {
    checkIsBookmarked(movieId);
    getMovieById(movieId, `${AR.VIDEOS},${AR.CREDITS},${AR.RECOMMENDATIONS},${AR.SIMILAR}`).then((response) => {
      setMovie(response?.data);
    });
  }, []);

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={["rgba(0, 0, 0, 0.5)", "rgba(217, 217, 217, 0)"]} start={[0, 0.3]} style={styles.linearGradient} />
      <View style={styles.moviePosterImageContainer}>
        <Image style={styles.moviePosterImage} resizeMode="cover" source={{ uri: getPoster(movie?.backdrop_path) }} />
      </View>
      <View style={styles.headerContainer}>
        <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={35} color={COLORS.WHITE} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={() => Share.share({ message: `${movie?.title}\n\n${movie?.homepage}` })}>
          <Text style={styles.headerText}>Share</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.playButton} onPress={() => Linking.openURL(getVideo(movie.videos.results[0].key))}>
        <Ionicons name="play-circle-outline" size={70} color={COLORS.WHITE} />
      </TouchableOpacity>

      <ItemSeparator height={setHeight(37)} />
      <View style={styles.movieTitleContainer}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {movie?.original_title}
        </Text>
        <View style={styles.row}>
          <TouchableNativeFeedback
            onPress={() => {
              if (bookmark) {
                onUnBookmarkClick(movieId);
              } else {
                onBookmarkClick(movieId);
              }
            }}
          >
            <Ionicons name={bookmark ? "bookmark" : "bookmark-outline"} size={22} color={bookmark ? COLORS.LIGHT_GRAY : COLORS.BLACK} />
          </TouchableNativeFeedback>
          <Ionicons name="heart" size={22} color={COLORS.HEART} />
          <Text style={styles.ratingText}>{movie?.vote_average}</Text>
        </View>
      </View>
      <Text style={styles.genreText}>
        {movie?.genres?.map((genre) => genre?.name)?.join(", ")} | {movie?.runtime} Min{" "}
      </Text>
      <View style={styles.overViewContainer}>
        <Text style={styles.overViewTitle}>Overview</Text>
        <Text style={styles.overViewText}> {movie?.overview} </Text>
      </View>
      <View>
        <Text style={styles.castTitle}>Cast</Text>
        <View style={styles.castSubContainer}>
          <TouchableOpacity activeOpacity={0.5} onPress={() => setIsCastSelected(true)}>
            <Text style={{ ...styles.castSubMenuText, color: isCastSelected ? COLORS.BLACK : COLORS.LIGHT_GRAY }}>Cast</Text>
          </TouchableOpacity>
          <Text>/ </Text>
          <TouchableOpacity activeOpacity={0.5} onPress={() => setIsCastSelected(false)}>
            <Text style={{ ...styles.castSubMenuText, color: isCastSelected ? COLORS.LIGHT_GRAY : COLORS.BLACK }}> Crew</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          style={{ marginVertical: 5 }}
          data={isCastSelected ? movie?.credits?.cast : movie?.credits?.crew}
          keyExtractor={(item) => `${item?.credit_id}${Math.random()}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={() => <ItemSeparator width={20} />}
          ItemSeparatorComponent={() => <ItemSeparator width={20} />}
          ListFooterComponent={() => <ItemSeparator width={20} />}
          renderItem={({ item }) => <CastCard originalName={item?.name} characterName={isCastSelected ? item?.character : item?.job} image={item?.profile_path} />}
        />
      </View>
      <Text style={styles.extraListTitle}>Recommended Movie</Text>
      <FlatList
        data={movie?.recommendations?.results}
        keyExtractor={(item) => `${item?.id.toString()}${Math.random()}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={() => <ItemSeparator width={20} />}
        ItemSeparatorComponent={() => <ItemSeparator width={20} />}
        ListFooterComponent={() => <ItemSeparator width={20} />}
        renderItem={({ item }) => (
          <MovieCard title={item.title} voteAverage={item.vote_average} voteCount={item.vote_count} poster={item.poster_path} releaseDate={item.release_date} size={0.6} onPress={() => navigateToMovieScreen(item.id)} />
        )}
      />
      <Text style={styles.extraListTitle}>Similar</Text>
      <FlatList
        data={movie?.similar?.results}
        keyExtractor={(item) => `${item?.id.toString()}${Math.random()}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={() => <ItemSeparator width={20} />}
        ItemSeparatorComponent={() => <ItemSeparator width={20} />}
        ListFooterComponent={() => <ItemSeparator width={20} />}
        renderItem={({ item }) => (
          <MovieCard title={item.title} voteAverage={item.vote_average} voteCount={item.vote_count} poster={item.poster_path} releaseDate={item.release_date} size={0.6} onPress={() => navigateToMovieScreen(item.id)} />
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BASIC_BACKGROUND,
  },
  moviePosterImageContainer: {
    height: setHeight(35),
    width: setWidth(145),
    alignItems: "center",
    position: "absolute",
    left: setWidth((100 - 145) / 2),
    top: 0,
    borderBottomRightRadius: 300,
    borderBottomLeftRadius: 300,
    elevation: 8,
  },
  moviePosterImage: {
    borderBottomRightRadius: 300,
    borderBottomLeftRadius: 300,
    width: setWidth(145),
    height: setHeight(35),
  },
  linearGradient: {
    width: setWidth(100),
    height: setHeight(6),
    position: "absolute",
    top: 0,
    elevation: 9,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    position: "absolute",
    right: 0,
    left: 0,
    top: 50,
    elevation: 20,
  },
  headerText: {
    color: COLORS.WHITE,
    fontFamily: FONTS.BOLD,
  },
  playButton: {
    position: "absolute",
    top: 110,
    left: setWidth(50) - 70 / 2,
    elevation: 10,
  },
  movieTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  movieTitle: {
    color: COLORS.BLACK,
    fontFamily: FONTS.EXTRA_BOLD,
    fontSize: 18,
    width: setWidth(60),
  },
  ratingText: {
    marginLeft: 5,
    color: COLORS.BLACK,
    fontFamily: FONTS.EXTRA_BOLD,
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  genreText: {
    color: COLORS.LIGHT_GRAY,
    paddingHorizontal: 20,
    paddingTop: 5,
    fontFamily: FONTS.BOLD,
    fontSize: 13,
  },
  overViewContainer: {
    backgroundColor: COLORS.EXTRA_LIGHT_GRAY,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
  },
  overViewTitle: {
    color: COLORS.BLACK,
    fontFamily: FONTS.BOLD,
    fontSize: 18,
  },
  overViewText: {
    color: COLORS.LIGHT_GRAY,
    paddingVertical: 5,
    fontFamily: FONTS.BOLD,
    textAlign: "justify",
  },
  castTitle: {
    marginLeft: 20,
    color: COLORS.BLACK,
    fontFamily: FONTS.BOLD,
    fontSize: 18,
  },
  castSubContainer: {
    marginLeft: 20,
    flexDirection: "row",
    marginVertical: 5,
  },
  castSubMenuText: {
    marginRight: 10,
    color: COLORS.BLACK,
    fontFamily: FONTS.BOLD,
    fontSize: 13,
  },
  extraListTitle: {
    marginLeft: 20,
    color: COLORS.BLACK,
    fontFamily: FONTS.BOLD,
    fontSize: 18,
    marginVertical: 8,
  },
});

export default MovieScreen;
