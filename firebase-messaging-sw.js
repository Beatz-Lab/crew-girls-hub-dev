/* Crew Girls Hub v8.0 — Firebase background notifications */
importScripts("https://www.gstatic.com/firebasejs/12.16.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.16.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDdCh0RPkFlidYS9cLA71v5HAeBJdctgQI",
  authDomain: "crew-girls-hub.firebaseapp.com",
  projectId: "crew-girls-hub",
  storageBucket: "crew-girls-hub.firebasestorage.app",
  messagingSenderId: "41680170398",
  appId: "1:41680170398:web:4127c9fbeb8bb234627a8f"
});

const messaging=firebase.messaging();

messaging.onBackgroundMessage(payload=>{
  const data=payload?.data || {};
  const title=data.title || "Crew Girls Hub";
  const options={
    body:data.body || "There is a new Crew Girls update.",
    icon:"./apple-touch-icon.png",
    badge:"./favicon.png",
    tag:data.tag || "crew-girls-update",
    renotify:true,
    data:{url:data.url || "./"}
  };
  return self.registration.showNotification(title,options);
});

self.addEventListener("notificationclick",event=>{
  event.notification.close();
  const destination=new URL(event.notification?.data?.url || "./",self.registration.scope).href;
  event.waitUntil((async()=>{
    const windows=await clients.matchAll({type:"window",includeUncontrolled:true});
    for(const client of windows){
      if(client.url.startsWith(self.registration.scope)){
        await client.focus();
        if("navigate" in client && client.url!==destination){
          try{await client.navigate(destination)}catch(error){}
        }
        return;
      }
    }
    if(clients.openWindow) await clients.openWindow(destination);
  })());
});
