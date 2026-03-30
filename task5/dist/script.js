let markReadbtn = document.getElementById("mark-read");
let unreadcount = document.getElementById("count");
let notificationcards = document.querySelectorAll(".notification-card");
let dots = document.querySelectorAll(".dot");

markReadbtn.addEventListener("click", () => {
  notificationcards.forEach((card) => {
    card.classList.remove("unread");
  });
  dots.forEach((dot) => {
    dot.style.display = "none";
  });
  unreadcount.innerText = "0";
});

notificationcards.forEach((card, index) => {
  card.addEventListener("click", () => {
    if (card.classList.contains("unread")) {
      card.classList.remove("unread");
      if (dots[index]) dots[index].style.display = "none";
      let currentCount = parseInt(unreadcount.innerText);
      if (currentCount > 0) {
        unreadcount.innerText = currentCount - 1;
      }
    }
  });
});
