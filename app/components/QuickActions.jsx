import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function QuickActions() {
  const [selectedImage, setSelectedImage] = useState(null);

  // Open camera
  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Camera access is needed to take photos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Open gallery
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Gallery access is needed to select photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.quickActions}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <View style={styles.quickButtonsContainer}>
        {/* Take Photo */}
        <TouchableOpacity style={styles.quickButton} onPress={takePhoto}>
          <LinearGradient
            colors={["#2563EB", "#3B82F6"]}
            style={styles.quickButtonGradient}
          >
            <Ionicons name="camera" size={20} color="#FFFFFF" />
            <Text style={styles.quickButtonText}>Take Photo</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* From Gallery */}
        <TouchableOpacity style={styles.quickButton} onPress={pickImage}>
          <LinearGradient
            colors={["#059669", "#10B981"]}
            style={styles.quickButtonGradient}
          >
            <Ionicons name="images" size={20} color="#FFFFFF" />
            <Text style={styles.quickButtonText}>From Gallery</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Preview Selected Image */}
      {selectedImage && (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Image
            source={{ uri: selectedImage }}
            style={{ width: 200, height: 200, borderRadius: 12 }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  quickActions: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
  },
  quickButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickButton: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  quickButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  quickButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
  },
});
