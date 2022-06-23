import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { requestForToken, onMessageListener } from "../firebase";

export function Notification() {
  const [notification, setNotification] = useState({ title: "", body: "" });
  const notify = () => toast(<ToastDisplay />);
  function ToastDisplay() {
    return (
      <div>
        <p>
          <b>{notification?.title}</b>
        </p>
        <p>{notification?.body}</p>
      </div>
    );
  }

  useEffect(() => {
    if (notification?.title) {
      toast(notification.body, {
        icon: "❗",
      });
    }
  }, [notification]);

  useEffect(() => {
    toast.success("Server connection established");
  }, []);

  requestForToken();

  onMessageListener()
    .then((payload: any) => {
      setNotification({
        title: payload?.notification?.title,
        body: payload?.notification?.body,
      });
    })
    .catch((err) => console.log("failed: ", err));

  return <Toaster />;
}
