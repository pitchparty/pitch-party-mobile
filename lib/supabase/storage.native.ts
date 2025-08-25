import * as aesjs from "aes-js";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

// As Expo's SecureStore does not support values larger than 2048
// bytes, an AES-256 key is generated and stored in SecureStore, while
// it is used to encrypt/decrypt values stored in AsyncStorage.
export class Storage {
  private async _encrypt(key: string, value: string) {
    const encryptionKey = crypto.getRandomValues(new Uint8Array(256 / 8));

    const cipher = new aesjs.ModeOfOperation.ctr(
      encryptionKey,
      new aesjs.Counter(1)
    );
    const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));

    if (Platform.OS === "web") {
      localStorage.setItem(
        `${key}_encryptionKey`,
        aesjs.utils.hex.fromBytes(encryptionKey)
      );
    } else {
      await SecureStore.setItemAsync(
        key,
        aesjs.utils.hex.fromBytes(encryptionKey)
      );
    }

    return aesjs.utils.hex.fromBytes(encryptedBytes);
  }

  private async _decrypt(key: string, value: string) {
    let encryptionKeyHex: string | null = null;

    if (Platform.OS === "web") {
      encryptionKeyHex = localStorage.getItem(`${key}_encryptionKey`);
    } else {
      encryptionKeyHex = await SecureStore.getItemAsync(key);
    }

    if (!encryptionKeyHex) {
      return null;
    }

    const cipher = new aesjs.ModeOfOperation.ctr(
      aesjs.utils.hex.toBytes(encryptionKeyHex),
      new aesjs.Counter(1)
    );
    const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(value));

    return aesjs.utils.utf8.fromBytes(decryptedBytes);
  }

  async setItem(key: string, value: string) {
    const encrypted = await this._encrypt(key, value);

    if (Platform.OS === "web") {
    //   localStorage.setItem(key, encrypted);
    return {}
    } else {
      await AsyncStorage.setItem(key, encrypted);
    }
  }

  async getItem(key: string) {
    let encrypted: string | null = null;

    if (Platform.OS === "web") {
    //   encrypted = localStorage.getItem(key);
    return {}
    } else {
      encrypted = await AsyncStorage.getItem(key);
    }

    if (!encrypted) return null;

    return await this._decrypt(key, encrypted);
  }

  async removeItem(key: string) {
    if (Platform.OS === "web") {
    //   localStorage.removeItem(key);
    //   localStorage.removeItem(`${key}_encryptionKey`);
    return {}
    } else {
      await AsyncStorage.removeItem(key);
      await SecureStore.deleteItemAsync(key);
    }
  }
}
