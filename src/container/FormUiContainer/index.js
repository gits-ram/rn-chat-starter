// @flow
import * as React from "react";
import { observer, inject } from "mobx-react/native";
import {
  Switch,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Picker,
  Dimensions,
  Slider,
} from "react-native";
import { DatePickerDialog } from "../../components/datepickerdialog";
import { Container, Segment, Button, Body, Content, ListItem, CheckBox } from "native-base";
import Constants from "../../global/constants";
import moment from "moment";

const height = Dimensions.get("window").height;

export interface Props {
  navigator: any;
}
export interface State {}

@inject("appStore", "peopleStore")
@observer
export default class FormUiContainer extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      dobText: "Choose a date",
      dobDate: null,
      switchToggle: false,
      pickerSelected: "",
      sliderValue: 4,
      segment: 1,
      checkBox1: true,
      checkBox2: false,
      checkBox3: true,
    };
  }

  goBack() {
    this.props.navigator.pop();
  }

  componentDidMount() {}

  componentWillUnmount() {}

  // DOB textbox click listener
  onDOBPress = () => {
    let dobDate = this.state.dobDate;

    if (!dobDate || dobDate == null) {
      dobDate = new Date();
      this.setState({
        dobDate: dobDate,
      });
    }

    //To open the dialog
    this.refs.dobDialog.open({
      date: dobDate,
      maxDate: new Date(), //To restirct future date
    });
  };

  // Call back for dob date picked event
  onDOBDatePicked = date => {
    this.setState({
      dobDate: date,
      dobText: moment(date).format("DD-MMM-YYYY"),
    });
  };

  render() {
    return (
      <Container style={styles.container}>
        <Content>
          <Text style={{ color: Constants.Colors.primaryAccent }}>Switch</Text>
          <View style={{ flex: 0, flexDirection: "row", justifyContent: "space-evenly" }}>
            <Text style={styles.datePickerText}>
              Tap Switch To Toggle: {this.state.switchToggle ? "True" : "False"}
            </Text>
            <Switch
              value={this.state.switchToggle}
              onValueChange={value => {
                this.setState({ switchToggle: value });
              }}
            />
          </View>

          <View style={styles.separator} />

          <Text style={{ color: Constants.Colors.primaryAccent }}>Date Picker</Text>
          <View style={{ flex: 0 }}>
            <TouchableOpacity onPress={this.onDOBPress.bind(this)}>
              <View style={styles.datePickerBox}>
                <Text style={styles.datePickerText}>{this.state.dobText}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.separator} />

          <Text style={{ color: Constants.Colors.primaryAccent }}>Picker</Text>
          <View style={{ flex: 0, flexDirection: "column" }}>
            <Text style={(styles.datePickerText, { marginTop: 6 })}>
              Choose From Picker : {this.state.pickerSelected}
            </Text>
            <Picker
              style={{ width: "40%", alignSelf: "center" }}
              selectedValue={this.state.pickerSelected}
              onValueChange={value => {
                this.setState({ pickerSelected: value });
              }}>
              <Picker.Item label="None" value="None" />
              <Picker.Item label="Whatsapp" value="whatsapp" />
              <Picker.Item label="Facebook" value="facebook" />
              <Picker.Item label="Instagram" value="instagram" />
            </Picker>
          </View>

          <View style={styles.separator} />

          <Text style={{ color: Constants.Colors.primaryAccent }}>Slider</Text>
          <Text style={(styles.datePickerText, { marginTop: 6 })}>
            Slider Value (1-10) : {this.state.sliderValue}
          </Text>
          <Slider
            minimumValue={1}
            maximumValue={10}
            minimumTrackTintColor={Constants.Colors.primaryAccent}
            maximumTractTintColor={Constants.Colors.primaryAccent}
            step={1}
            value={this.state.sliderValue}
            onValueChange={value => {
              this.setState({ sliderValue: value });
            }}
            style={styles.slider}
            thumbTintColor={Constants.Colors.primaryAccent}
          />

          <View style={styles.separator} />

          <Text style={{ color: Constants.Colors.primaryAccent }}>Segment/Option Button</Text>
          <Body style={{ flex: 1.5 }}>
            <Segment style={{ backgroundColor: "transparent" }}>
              <Button
                style={{
                  backgroundColor:
                    this.state.segment === 1 ? Constants.Colors.primaryAccent : "transparent",
                  borderColor: Constants.Colors.primaryAccent,
                }}
                first
                active={this.state.segment === 1 ? true : false}
                onPress={() => this.setState({ segment: 1 })}>
                <Text
                  style={{
                    color: this.state.segment === 1 ? "#FFF" : Constants.Colors.primaryAccent,
                  }}>
                  Apple
                </Text>
              </Button>
              <Button
                style={{
                  backgroundColor:
                    this.state.segment === 2 ? Constants.Colors.primaryAccent : "transparent",
                  borderColor: Constants.Colors.primaryAccent,
                }}
                first
                active={this.state.segment === 2 ? true : false}
                onPress={() => this.setState({ segment: 2 })}>
                <Text
                  style={{
                    color: this.state.segment === 2 ? "#FFF" : Constants.Colors.primaryAccent,
                  }}>
                  Android
                </Text>
              </Button>
              <Button
                style={{
                  backgroundColor:
                    this.state.segment === 3 ? Constants.Colors.primaryAccent : "transparent",
                  borderColor: Constants.Colors.primaryAccent,
                }}
                first
                active={this.state.segment === 3 ? true : false}
                onPress={() => this.setState({ segment: 3 })}>
                <Text
                  style={{
                    color: this.state.segment === 3 ? "#FFF" : Constants.Colors.primaryAccent,
                  }}>
                  Blackberry
                </Text>
              </Button>
            </Segment>
          </Body>

          <View style={styles.separator} />
          <Text style={{ color: Constants.Colors.primaryAccent }}>CheckBox</Text>
          <ListItem>
            <CheckBox
              checked={this.state.checkBox1}
              onPress={() => this.setState({ checkBox1: !this.state.checkBox1 })}
            />
            <Body style={{ marginLeft: 5 }}>
              <Text>iOS</Text>
            </Body>
          </ListItem>
          <ListItem>
            <CheckBox
              checked={this.state.checkBox2}
              color="red"
              onPress={() => this.setState({ checkBox2: !this.state.checkBox2 })}
            />
            <Body style={{ marginLeft: 5 }}>
              <Text>Windows</Text>
            </Body>
          </ListItem>
          <ListItem>
            <CheckBox
              checked={this.state.checkBox3}
              color="green"
              onPress={() => this.setState({ checkBox3: !this.state.checkBox3 })}
            />
            <Body style={{ marginLeft: 5 }}>
              <Text>Android</Text>
            </Body>
          </ListItem>

          {/* Place the date picker dialog component at end of your views and assign the references, event handlers to it.*/}
          <DatePickerDialog ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this)} />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
  },
  separator: {
    backgroundColor: Constants.Colors.greyBackground,
    height: 1,
    width: "90%",
    marginLeft: "5%",
    marginTop: 15,
    marginBottom: 10,
  },
  datePickerBox: {
    marginTop: 9,
    width: "80%",
    alignSelf: "center",
    borderColor: "#ABABAB",
    borderWidth: 0.5,
    padding: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    height: 38,
    justifyContent: "center",
  },
  datePickerText: {
    fontSize: 14,
    marginLeft: 5,
    borderWidth: 0,
    color: "#121212",
  },
  slider: {
    marginTop: 15,
    width: "90%",
    transform: [{ rotateZ: "0deg" }], //"-90deg" }],
    marginLeft: "5%",
  },
});
