import { CameraView, useCameraPermissions } from "expo-camera/next";
import * as MediaLibrary from "expo-media-library";
import { useRef, useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Audio } from "expo-av";
import { Sound } from "expo-av/build/Audio";

export default function Camera() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    MediaLibrary.usePermissions();
  const camera = useRef<CameraView | null>(null);
  const [sound, setSound] = useState<Sound>();
  const [taken, setTaken] = useState(0);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  async function takePhoto() {
    if (!camera || !camera.current) {
      return;
    }

    const photo = await camera.current.takePictureAsync({
      imageType: "png",
    });

    if (photo) {
    }

    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/camera-13695.mp3")
    );
    await sound.playAsync();
    setSound(sound);

    if (photo) {
      setTaken((x) => x + 1);
      await MediaLibrary.saveToLibraryAsync(photo.uri);
    }
  }

  if (!mediaLibraryPermission) {
    requestMediaLibraryPermission();
    return <View></View>;
  }

  if (!cameraPermission) {
    requestCameraPermission();
    return <View></View>;
  }

  if (!cameraPermission.granted || !mediaLibraryPermission.status) {
    return (
      <View style={styles.container}>
        <Text>Camera is unavailable as permissions were denied.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={"back"} ref={camera}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Taken: {taken}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <View style={styles.takePhotoButton}>
              <FontAwesome
                name="camera"
                size={48}
                style={styles.takePhotoButtonIcon}
              />
            </View>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    backgroundColor: "black",
    marginTop: 64,
    paddingHorizontal: 24,
    paddingVertical: 12,
    justifyContent: "space-between",
  },
  header: {
    color: "white",
    fontSize: 18,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  takePhotoButton: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderColor: "grey",
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  takePhotoButtonIcon: {
    color: "grey",
  },
});
