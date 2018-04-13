import { AsyncStorage } from "react-native";

var obj = {};
obj.read = async function(key) {
  let value = await AsyncStorage.getItem(`@AFLSStore:${key}`);

  return value;
};

obj.write = async function(key, value) {
  await AsyncStorage.setItem(`@AFLSStore:${key}`, value);
};

export default obj;
