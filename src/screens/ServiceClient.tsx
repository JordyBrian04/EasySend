import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface FAQProps {}

const FAQ = (props: FAQProps) => {
  return (
    <View style={styles.container}>
      <Text>FAQ</Text>
    </View>
  );
};

export default FAQ;

const styles = StyleSheet.create({
  container: {}
});
