import React, { Component } from "react";
import { View, Text, StyleSheet, SectionList, TouchableOpacity, SafeAreaView } from "react-native";
import { Collapsible } from "../../components/collapsible";
import Icon from "react-native-vector-icons/FontAwesome";
import Constants from "../../global/constants";

const sections = [
  {
    title: "Numbers",
    data: ["One", "Two", "3", "4", "5", "6", "seven", "eight", "nine", "ten", "Eleven", "Twelve"],
  },
  {
    title: "Colors",
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
      "Cyan",
      "Magenta",
      "AquaBlue",
      "Violet",
      "LimeYellow",
    ],
  },
  {
    title: "Fruits",
    data: ["apple", "orange", "grape", "papaya", "banana", "guava", "Mango", "Pineapple"],
  },
  {
    title: "Veggies",
    data: ["Carrot", "Beans", "Potato", "Turnip", "Raddish", "Coconut", "Tomato"],
  },
  {
    title: "Animals",
    data: ["Lion", "Tiger", "Bear", "Cow", "Bull", "Dog", "Cat", "Rhino", "Deer", "Hippo"],
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

  _renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "85%",
          backgroundColor: "#CED0CE",
          marginLeft: "4%",
        }}
      />
    );
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
              <View style={styles.header}>
                <Text
                  style={[
                    styles.headerText,
                    {
                      color:
                        this.state.activeSection === section.title
                          ? Constants.Colors.primaryAccent
                          : "grey",
                    },
                  ]}>
                  {section.title}
                </Text>
                {this.state.activeSection === section.title ? (
                  <Icon
                    name={"arrow-circle-o-up"}
                    color={Constants.Colors.primaryAccent}
                    size={25}
                  />
                ) : (
                  <Icon name={"arrow-circle-o-down"} color={"grey"} size={25} />
                )}
              </View>
            </TouchableOpacity>
          )}
          renderItem={({ item, section }) => (
            <Collapsible key={item} collapsed={section.title !== this.state.activeSection}>
              <View>
                <Text style={styles.item}>{item}</Text>
                {this._renderSeparator()}
              </View>
            </Collapsible>
          )}
          // ItemSeparatorComponent={this._renderSeparator}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 5,
    paddingRight: 20,
    paddingTop: 3,
    paddingBottom: 3,
    backgroundColor: Constants.Colors.greyBackground,
  },
  headerText: {
    fontSize: 24,
  },
  item: {
    fontSize: 16,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
});
