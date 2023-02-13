// ==UserScript==
// @name         Darkness Autovote
// @namespace    blank
// @version      0.0.1
// @description  Autovote for Darkness service
// @author       Pablo http://github.com/pbl0
// @match        *://*m.rivalregions.com/*
// @updateURL    https://github.com/DarknessVote/darkness-autovote/raw/main/autovote.user.js
// ==/UserScript==

const darknessUrl = "https://darkness-active-missions.onrender.com/orders";
const minute = 1;

function vote(article) {
  $.ajax({
    dataType: "html",
    type: "POST",
    crossDomain: true,
    data: {
      c: c_html,
    },
    url: "/news/ratesec/" + article,
    success: function (data) {
      console.log(data);
      saveVoted(article);
    },
  });
}



function getArticles() {
  $.get(darknessUrl, function (data) {
    console.log("Missions", data);

    if (data.length == 0) {
      localStorage.setItem("darkness-last-vote", c());
    } else {
      for (let article of data) {
        voted = getVoted();
        if (!voted.includes(article)) {
          setTimeout(function () {
            vote(article['order']);
          }, 1500);
        }
        if (article == data[data.length - 1]) {
          localStorage.setItem("darkness-last-vote", c());
        }
      }
    }
  });
}


function saveVoted(article) {
  let voted = getVoted();

  if (!voted) {
    voted = [];
  }

  voted.push(article);

  localStorage.setItem("voted", JSON.stringify(voted));
}

function getVoted() {
  const tempVoted = localStorage.getItem("voted");
  let voted
  if (tempVoted){
    voted = JSON.parse(tempVoted) ;
  } else {
    localStorage.setItem("voted", "[]");
    voted = [];
  }

  return voted

}

$(document).ready(function () {
  const lastVote = localStorage.getItem("darkness-last-vote");
  if (c() - lastVote >= minute * 60 * 1000) {
    getArticles();
  }

  setInterval(() => {
    getArticles();
  }, minute * 60 * 1000);
});



