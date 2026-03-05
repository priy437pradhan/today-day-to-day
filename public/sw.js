self.addEventListener("push", function (event) {
  const data = event.data.json();

  self.registration.showNotification(data.title, {

    icon: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
  });
});