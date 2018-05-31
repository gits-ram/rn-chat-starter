import * as React from "react";
import { UIManager, Platform } from "react-native";
import { Image as AnimImage, View as AnimView } from "react-native-animatable";
import {
  Container,
  Content,
  Header,
  Body,
  Title,
  Button,
  Text,
  View,
  Icon,
  Footer,
  Spinner,
} from "native-base";
import * as Spiner from "../../../native-base-theme/components/Spinner";
import FadeInView from "../../components/FadeInView";

import styles from "./styles";

export interface Props {
  loginForm: any;
  onLogin: Function;
  showLoader: boolean;
}
export interface State {
  showSpinner: boolean;
  hasHeaderAppeared: boolean;
}
class Login extends React.Component<Props, State> {
  _headerRef: any;

  constructor() {
    //Enable LayoutAnimation for Android
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    super();
    this.state = {
      showSpinner: false,
      hasHeaderAppeared: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    //Receive showLoaderProps to display spinner from container and update state here..
    if (nextProps.showLoader != this.props.showLoader) {
      this.setState({ showSpinner: nextProps.showLoader });
    }
  }

  componentDidMount() {
    //Animate Logo/Header
    if (this._headerRef) {
      this._headerRef.bounceInDown(2000).then(() => {
        this.setState({ hasHeaderAppeared: true });
        // LayoutAnimation.spring();
      });
      setTimeout(() => {
        this.setState({ hasHeaderAppeared: true });
      }, 700);
    }
  }

  render() {
    const { showSpinner, hasHeaderAppeared } = this.state;
    return (
      <Container style={{ backgroundColor: "#f5f5f5" }}>
        <Header style={{ height: 210 }}>
          <Body style={{ alignItems: "center" }}>
            {/* <Icon name="md-planet" style={{ fontSize: 104 }} /> */}
            <AnimView useNativeDriver={true}>
              <AnimImage
                useNativeDriver={true}
                source={require("../../../assets/img/clientlogo.png")}
                style={styles.welcomeImage}
                ref={ref => {
                  this._headerRef = ref;
                }}
              />
            </AnimView>
            <Title>ReactNativeBaseApp</Title>
            <View>
              {/* <Text style={{ color: Platform.OS === "ios" ? "#FFF" : "#FFF" }}>
                Login - Header Area
              </Text> */}
            </View>
          </Body>
        </Header>
        <Content>
          {hasHeaderAppeared && (
            <FadeInView style={null}>
              {this.props.loginForm}
              <View padder>
                {showSpinner === true ? (
                  <Spinner color="#356CB1" />
                ) : (
                  <View style={{ flex: 1 }}>
                    <Button
                      block
                      onPress={() => {
                        this.props.onLogin();
                      }}>
                      <Text style={{ fontWeight: "bold", fontSize: 18 }}>Login</Text>
                    </Button>

                    <Button
                      block
                      style={{ marginTop: 7 }}
                      onPress={() => {
                        this.props.onRegister();
                      }}>
                      <Text style={{ fontWeight: "bold", fontSize: 18 }}>Register</Text>
                    </Button>
                  </View>
                )}
              </View>
            </FadeInView>
          )}
        </Content>
        <Footer style={{ backgroundColor: "#ebf2f9" }}>
          <View style={{ alignItems: "center", opacity: 0.5, flexDirection: "row" }}>
            <View padder>
              <Text style={{ color: "#333333" }}>Login - Footer Area</Text>
            </View>
          </View>
        </Footer>
      </Container>
    );
  }
}

export default Login;
