import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Button, Text } from "native-base";
import { View as AnimView } from "react-native-animatable";

export interface Props {
  title: String;
  text: String;
  isUser: Boolean;
  options: Object[];
}

export interface State {}

class OptionsBlob extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //Animate Options Entrance
    if (this._viewRef) {
      if (this.props.animate === 1) {
        this._viewRef.fadeInLeft(700);
      } else if (this.props.animate === 2) {
        this._viewRef.fadeInDown(500);
      }
    }
  }

  _renderItem(item, chatAction) {
    let title = item.title.toUpperCase();
    return (
      <View style={{ paddingTop: 5, paddingBottom: 10, paddingLeft: 5, paddingRight: 5 }}>
        <Button
          rounded
          style={{ borderColor: "#333333", backgroundColor: "#fff" }}
          onPress={() => {
            chatAction(title, item.action);
          }}>
          <Text style={{ color: "#0078d7" }}> {title} </Text>
        </Button>
      </View>
    );
  }

  render() {
    const { optionsList, chatAction } = this.props;

    return (
      <AnimView
        useNativeDriver={true}
        ref={ref => {
          this._viewRef = ref;
        }}
        style={styles.rowStyle}>
        <FlatList
          ref={ref => {
            this.listRef = ref;
          }}
          horizontal={true}
          style={{ width: "100%" }}
          renderItem={({ item }) => this._renderItem(item, chatAction)}
          keyExtractor={item => "" + item.id}
          data={optionsList}
        />
      </AnimView>
    );
  }
}

const styles = StyleSheet.create({
  rowStyle: {
    flexDirection: "row",
    flex: 1,
    alignSelf: "flex-start",
    alignItems: "flex-start",
    marginBottom: 10,
  },
});

export default OptionsBlob;
