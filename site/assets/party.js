/* Birthday packages: pick a location, then show that location's packages.
   Booking links: paste each store's Square Appointments booking URL per package.
   Party Room stores (food optional) also take a "-games" link per package, e.g. "sorcerer-games".
   Empty links fall back to the party request form (#eventsForm). */
(function () {
  var BOOKING = {
    "fashion-show": { apprentice: "", sorcerer: "", "grand-wizard": "",
                      "apprentice-games": "", "sorcerer-games": "", "grand-wizard-games": "" },
    "area15":       { apprentice: "", sorcerer: "", "grand-wizard": "",
                      "apprentice-games": "", "sorcerer-games": "", "grand-wizard-games": "" },
    "miracle-mile":               { apprentice: "", sorcerer: "", "grand-wizard": "" },
    "international-market-place": { apprentice: "", sorcerer: "", "grand-wizard": "" },
    "ala-moana":                  { apprentice: "", sorcerer: "", "grand-wizard": "" },
    "easton":                     { apprentice: "", sorcerer: "", "grand-wizard": "" }
  };
  var root = document.getElementById("packages");
  if (!root) return;
  var current = null;

  function games() {
    var g = root.querySelector('input[name="partyFood"]:checked');
    return !!g && g.value === "games";
  }
  function applyLinks() {
    if (!current) return;
    var links = BOOKING[current.id] || {};
    var suffix = current.type === "room" && games() ? "-games" : "";
    root.querySelectorAll('.pkg-set[data-set="' + current.type + '"] [data-pkg]').forEach(function (card) {
      var a = card.querySelector("[data-book]"); if (!a) return;
      var url = links[card.getAttribute("data-pkg") + suffix];
      if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
      else { a.href = "#eventsForm"; a.removeAttribute("target"); a.removeAttribute("rel"); }
    });
  }
  function applyFood() {
    var g = games();
    root.classList.toggle("pfood-games", g);
    root.querySelectorAll("[data-food]").forEach(function (p) {
      p.textContent = g ? p.getAttribute("data-games") : p.getAttribute("data-food");
    });
    applyLinks();
  }
  root.querySelectorAll('input[name="partyFood"]').forEach(function (r) { r.addEventListener("change", applyFood); });
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
    current = { id: id, type: type };
    applyLinks();
    if (remember) { try { localStorage.setItem("fcaPartyLoc", id); } catch (e) {} }
    return true;
  }

  // Before a pick: show the Party Room set dimmed as a preview.
  sets.forEach(function (s) { s.hidden = s.getAttribute("data-set") !== "room"; s.inert = true; });
  radios.forEach(function (r) { r.addEventListener("change", function () {
    choose(r.value, true);
    if (window.innerWidth < 760) document.getElementById("plocStatus").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }); });

  applyFood();
  var q = new URLSearchParams(location.search).get("location");
  var saved = null; try { saved = localStorage.getItem("fcaPartyLoc"); } catch (e) {}
  if (!(q && choose(q, true)) && saved) choose(saved, false);
})();
