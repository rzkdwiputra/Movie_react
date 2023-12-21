import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import COLORS from "../constants/Colors";
import FONTS from "../constants/Fonts";
import GenreCard from "../components/GenreCard";
import MovieCard from "../components/MovieCard";
import ItemSeparator from "../components/ItemSeparator";
import { FlatList } from "react-native-gesture-handler";
import { getMovies, getNowplayingMovies, getUpcomingMovies, getAllGenres } from "../services/MovieService";

const Genres = ["All", "Action", "Comedy", "Romace", "Horor", "Sci-Fi"];

const HomeScreen = ({ navigation }) => {
  const [activeGenre, setActiveGenre] = useState("All");
  const [nowPlayingMovies, setNowPlayingMovies] = useState({});
  const [Movies, setMOvies] = useState({});
  const [upcomingMovies, setUpcomingMovies] = useState({});
  const [genres, setGenres] = useState([{ name: "All" }]);
  

  useEffect(() => {
    getNowplayingMovies().then((movieResponse) => setNowPlayingMovies(movieResponse.data));
    getMovies().then((movieResponse) => setMOvies(movieResponse.data));
    getUpcomingMovies().then((movieResponse) => setUpcomingMovies(movieResponse.data));
    getAllGenres().then((genreResponse) => setGenres([...genres, ...genreResponse.data.genres]));
  }, []);

  const onGenreClicked = (name, genreId) => {
    
    setActiveGenre(name);
    getMovies(genreId).then((movieResponse) => {
      console.log("res :", movieResponse.data);
      setMOvies(movieResponse.data);
    });
  };

  return (
    <ScrollView Style={styles.container}>
      <StatusBar style="auto" translucent={false} backgroundColor={COLORS.BASIC_BACKGROUND} />
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Movie List</Text>
      </View>
      <View style={styles.genreListContainer}>
        <FlatList
          data={genres}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id?.toString() + item.name}
          ItemSeparatorComponent={() => <ItemSeparator width={20} />}
          ListHeaderComponent={() => <ItemSeparator width={20} />}
          ListFooterComponent={() => <ItemSeparator width={20} />}
          renderItem={({ item }) => <GenreCard key={item.id + item.name} genreId={item.id} genreName={item.name} active={item.name === activeGenre ? true : false} onPress={onGenreClicked} />}
        />
      </View>
      <View>
        <FlatList
          data={Movies.results}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <ItemSeparator width={20} />}
          ListHeaderComponent={() => <ItemSeparator width={20} />}
          ListFooterComponent={() => <ItemSeparator width={20} />}
          renderItem={({ item }) => (
            <MovieCard
              title={item.title}
              voteAverage={item.vote_average}
              voteCount={item.vote_count}
              poster={item.poster_path}
              heartLess={false}
              releaseDate={item.release_date}
              onPress={() => navigation.navigate("movie", { movieId: item.id })}
            />
          )}
        />
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Now PLaying</Text>
      </View>
      <View>
        <FlatList
          data={nowPlayingMovies.results}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <ItemSeparator width={20} />}
          ListHeaderComponent={() => <ItemSeparator width={20} />}
          ListFooterComponent={() => <ItemSeparator width={20} />}
          renderItem={({ item }) => (
            <MovieCard title={item.title} voteAverage={item.vote_average} voteCount={item.vote_count} poster={item.poster_path} releaseDate={item.release_date} size={0.6} onPress={() => navigation.navigate("movie", { movieId: item.id })} />
          )}
        />
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Coming Soon</Text>
      </View>
      <View>
        <FlatList
          data={upcomingMovies.results}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <ItemSeparator width={20} />}
          ListHeaderComponent={() => <ItemSeparator width={20} />}
          ListFooterComponent={() => <ItemSeparator width={20} />}
          renderItem={({ item }) => (
            <MovieCard title={item.title} voteAverage={item.vote_average} voteCount={item.vote_count} poster={item.poster_path} releaseDate={item.release_date} size={0.6} onPress={() => navigation.navigate("movie", { movieId: item.id })} />
          )}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BASIC_BACKGROUND,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: FONTS.REGULAR,
  },
  headerSubtittle: {
    fontSize: 13,
    color: COLORS.ACTIVE,
    fontFamily: FONTS.BOLD,
  },
  genreListContainer: {
    paddingVertical: 10,
  },
});

export default HomeScreen;
