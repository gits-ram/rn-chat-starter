import Autocomplete from "react-native-autocomplete-input";
import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const API = "https://swapi.co/api";
const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII"];

class AutoCompleteContainer extends Component {
  static renderFilm(actors) {
    // const { title, director, opening_crawl, episode_id } = film;
    // const roman = episode_id < ROMAN.length ? ROMAN[episode_id] : episode_id;
    const { name, height, mass, eye_color, hair_color, gender, skin_color } = actors;

    return (
      <View>
        <Text style={styles.titleText}>
          {name}
          {/* {roman}. {title} */}
        </Text>
        <Text style={styles.directorText}>
          ({height}:{mass}) ({gender})
        </Text>
        <Text style={styles.openingText}>
          Hair: {hair_color} Eyes: {eye_color} Skin: {skin_color}
        </Text>
      </View>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      films: [],
      query: "",
    };
  }

  componentDidMount() {
    fetch(`${API}/people/`) //films
      .then(res => res.json())
      .then(json => {
        const { results: obj } = json;
        this.setState({ films: obj });
      });

    setTimeout(() => {
      fetch("https://swapi.co/api/people/?page=2")
        .then(res => res.json())
        .then(json => {
          const { results: filmss } = json;
          let tempArr = [...this.state.films, ...filmss];
          this.setState({ films: tempArr });
        });
    }, 1000);
  }

  findFilm(query) {
    const { films } = this.state;

    if (query === "") {
      return [];
    }

    const regex = new RegExp(`${query.trim()}`, "i");
    return films.filter(film => film.name.search(regex) >= 0); //title.search
  }

  render() {
    const { query } = this.state;
    const films = this.findFilm(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

    return (
      <View style={styles.container}>
        <Autocomplete
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={styles.autocompleteContainer}
          data={films.length === 1 && comp(query, films[0].name) ? [] : films} //films[0].title
          defaultValue={query}
          onChangeText={text => this.setState({ query: text })}
          placeholder="Enter character name"
          renderItem={({ name, gender }) => (
            <TouchableOpacity onPress={() => this.setState({ query: name })}>
              <Text style={styles.itemText}>
                {name} ({gender})
                {/* {title} ({release_date.split("-")[0]}) */}
              </Text>
            </TouchableOpacity>
          )}
        />
        <View style={styles.descriptionContainer}>
          {films.length > 0 ? (
            AutoCompleteContainer.renderFilm(films[0])
          ) : (
            <Text style={styles.infoText}>Enter character names from StarWars</Text>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5FCFF",
    flex: 1,
    paddingTop: 25,
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1,
  },
  itemText: {
    fontSize: 15,
    margin: 2,
  },
  descriptionContainer: {
    // `backgroundColor` needs to be set otherwise the
    // autocomplete input will disappear on text input.
    backgroundColor: "#F5FCFF",
    marginTop: 25,
  },
  infoText: {
    textAlign: "center",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
    marginTop: 10,
    textAlign: "center",
  },
  directorText: {
    color: "grey",
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center",
  },
  openingText: {
    textAlign: "center",
  },
});

export default AutoCompleteContainer;
