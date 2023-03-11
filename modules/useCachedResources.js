import { useEffect, useState } from "react";
import * as Font from "expo-font";

export default function useCachedResources() {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  async function loadResourcesAndDataAsync() {
    try {
      await Font.loadAsync({
        "Noto-Sans": require("../assets/fonts/NotoSansKR-Regular.otf"),
      });
    } catch (e) {
      console.warn(e);
    } finally {
      setIsLoadingComplete(true);
    }
  }

  loadResourcesAndDataAsync();

  return isLoadingComplete;
}
