import { ReactNode } from "react";
import { StatusBarStyle, Text, View, ViewStyle ,StyleSheet} from "react-native";
import Wrapper from "./Wrapper";

interface WrapperProps {
  barStyle?: StatusBarStyle;
  children: ReactNode;
  disableAvoidKeyboard?: boolean;
  backgroundColor?: string;
  bottomSafeArea?: boolean;
  disableAvoidStatusBar?: boolean;
  style?: ViewStyle;
}

export default function Index() {
  return (
    <Wrapper backgroundColor="white" barStyle="dark-content">
      <View style={styles.container}>
        <Text style={styles.text}>Màn hình</Text>
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
