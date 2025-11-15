import { Text, View, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { useAppStore } from "../store/appStore";

export default function Index() {
  const { fetchFlights, fetchNotifications, loading } = useAppStore();

  useEffect(() => {
    // Fetch initial data from backend
    fetchFlights();
    fetchNotifications();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#6366f1" />
      ) : (
        <Image
          source={require("../assets/images/app-image.png")}
          style={styles.image}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0c0c0c",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
