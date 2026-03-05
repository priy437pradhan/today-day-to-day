self.addEventListener("push", function (event) {

  const data = event.data.json();

  const options = {
    //body: data.message,
    icon: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    badge: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    data: {
      url: "https://todo-day-to-day.onrender.com"
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );

});

/* open app when notification clicked */

self.addEventListener("notificationclick", function (event) {

  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );

});