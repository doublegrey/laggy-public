import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { RestAPI } from "./api/rest";
import DeviceDetector from "device-detector-js";

const firebaseConfig = {
  apiKey: "AIzaSyCwVbrjjo0wHyIYmHyyYSy9lz4n6kjZzt8",
  authDomain: "laggy-mining.firebaseapp.com",
  projectId: "laggy-mining",
  storageBucket: "laggy-mining.appspot.com",
  messagingSenderId: "770424420868",
  appId: "1:770424420868:web:74ad468d0fc6bec5849351",
  measurementId: "G-7NF9B3L6Z4",
};

export const requestForToken = () => {
  return getToken(messaging, {
    vapidKey:
      "BIQ2KbvzKrv3jjCfNa_u2FJJB-yj8f-ewIVee7V7n5z2pky6CtgW-I8FuacXrFqszMEzAWe8zefdP0mLhk4UTeU",
  })
    .then((currentToken) => {
      if (currentToken) {
        const deviceDetector = new DeviceDetector();
        const device = deviceDetector.parse(navigator.userAgent);
        RestAPI.subscribeToNotifications(
          currentToken,
          `${device.device?.brand || ""} ${device.os?.name || "Unknown"}, ${
            device.client?.name || "Browser"
          } ${device.client?.version || "0.1"}`
        );
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
    });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("payload", payload);
      resolve(payload);
    });
  });

initializeApp(firebaseConfig);
const messaging = getMessaging();
