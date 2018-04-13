import React, { Component } from "react";
import { Text, StyleSheet, SectionList, TouchableOpacity, SafeAreaView } from "react-native";
import { Collapsible } from "../../components/collapsible";

const sections = [
  {
    title: "numbers",
    data: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"],
  },
  {
    title: "colors",
    data: [
      "yellow",
      "blue",
      "red",
      "orange",
      "green",
      "purple",
      "white",
      "black",
      "teal",
      "indigo",
      "grey",
      "mauve",
    ],
  },
  {
    title: "fruits",
    data: ["apple", "orange", "grape", "papaya", "banana", "guava"],
  },
];

export default class ExpSticSecListContainer extends Component {
  state = {
    activeSection: "fruits",
  };

  onPress = section => {
    this.setState({
      activeSection: this.state.activeSection === section.title ? "" : section.title,
    });
  };

  render() {
    return (
      <SafeAreaView>
        <SectionList
          stickySectionHeadersEnabled={true}
          sections={sections}
          keyExtractor={a => a}
          renderSectionHeader={({ section }) => (
            <TouchableOpacity onPress={() => this.onPress(section)}>
              <Text style={styles.header}>{section.title}</Text>
            </TouchableOpacity>
          )}
          renderItem={({ item, section }) => (
            <Collapsible key={item} collapsed={section.title !== this.state.activeSection}>
              <Text style={styles.item}>{item}</Text>
            </Collapsible>
          )}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    fontSize: 36,
    backgroundColor: "pink",
  },
  item: {
    fontSize: 40,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
});
