/* Birthday packages: pick a location, then show that location's packages.
   Booking links: paste each store's Square Appointments booking URL per package.
   Empty links fall back to the party request form (#eventsForm). */
(function () {
  var BOOKING = {
    "fashion-show":               { apprentice: "", sorcerer: "", "grand-wizard": "" },
    "area15":                     { apprentice: "", sorcerer: "", "grand-wizard": "" },
    "miracle-mile":               { apprentice: "", sorcerer: "", "grand-wizard": "" },
    "international-market-place": { apprentice: "", sorcerer: "", "grand-wizard": "" },
    "ala-moana":                  { apprentice: "", sorcerer: "", "grand-wizard": "" },
    "easton":                     { apprentice: "", sorcerer: "", "grand-wizard": "" }
  };
  var root = document.getElementById("packages");
  if (!root) return;
  var radios = root.querySelectorAll('input[name="partyLoc"]');
  var sets = root.querySelectorAll(".pkg-set");
  var status = root.querySelector("[data-status]");
  root.classList.add("ploc-on");

  function choose(id, remember) {
    var input = root.querySelector('input[name="partyLoc"][value="' + id + '"]');
    if (!input || input.disabled) return false;
    input.checked = true;
    var type = input.getAttribute("data-type");
    var name = input.parentNode.querySelector("span").firstChild.textContent.trim();
    root.classList.add("ploc-picked");
    sets.forEach(function (s) { s.inert = false; });
    sets.forEach(function (s) { s.hidden = s.getAttribute("data-set") !== type; });
    status.textContent = "Showing packages for " + name + " · " + (type === "room" ? "Party Room with tables and seating · pizza and drinks optional" : "Arcade Party, all about the games");
    var links = BOOKING[id] || {};
    root.querySelectorAll('.pkg-set[data-set="' + type + '"] [data-pkg]').forEach(function (card) {
      var a = card.querySelector("[data-book]"); if (!a) return;
      var url = links[card.getAttribute("data-pkg")];
      if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
      else { a.href = "#eventsForm"; a.removeAttribute("target"); }
    });
    if (remember) { try { localStorage.setItem("fcaPartyLoc", id); } catch (e) {} }
    return true;
  }

  // Before a pick: show the Party Room set dimmed as a preview.
  sets.forEach(function (s) { s.hidden = s.getAttribute("data-set") !== "room"; s.inert = true; });
  radios.forEach(function (r) { r.addEventListener("change", function () {
    choose(r.value, true);
    if (window.innerWidth < 760) document.getElementById("plocStatus").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }); });

  var q = new URLSearchParams(location.search).get("location");
  var saved = null; try { saved = localStorage.getItem("fcaPartyLoc"); } catch (e) {}
  if (!(q && choose(q, true)) && saved) choose(saved, false);
})();
