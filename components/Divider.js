import React from "react";
import { View, StyleSheet } from "react-native";

const Divider = () => {
  return <View style={styles.line} />;
};

const styles = StyleSheet.create({
  line: {
    height: 0.6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default Divider;
