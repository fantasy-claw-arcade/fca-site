/* Birthday packages: pick a location (and, at Las Vegas stores, a food option) before any packages show.
   Booking links: paste each store's Square Appointments booking URL per package.
   Las Vegas stores take two links per package: games only ("fantasy-claw") and with food ("fantasy-claw-food").
   Empty links fall back to the party request form (#eventsForm). Custom always goes to the form. */
(function () {
  var LV = { "fantasy-claw": "", "wizards-challenge": "", "ultimate-wizard": "",
             "fantasy-claw-food": "", "wizards-challenge-food": "", "ultimate-wizard-food": "" };
  var AR = { "fantasy-claw": "", "wizards-challenge": "", "ultimate-wizard": "" };
  var BOOKING = {
    "fashion-show": Object.assign({}, LV),
    "area15": Object.assign({}, LV),
    "miracle-mile": Object.assign({}, LV),
    "international-market-place": Object.assign({}, AR),
    "ala-moana": Object.assign({}, AR),
    "easton": Object.assign({}, AR)
  };

  var root = document.getElementById("packages");
  if (!root) return;
  var sets = root.querySelectorAll(".pkg-set");
  var food = root.querySelector(".pfood");
  var byo = root.querySelector("[data-byo]");
  var status = root.querySelector("[data-status]");
  var sub = root.querySelector("[data-status-sub]");
  var step = root.querySelector("[data-step]");
  var loc = null;
  root.classList.add("ploc-on");

  function picked(name) { var r = root.querySelector('input[name="' + name + '"]:checked'); return r ? r.value : null; }
  function storeName(id) {
    var i = root.querySelector('input[name="partyLoc"][value="' + id + '"]');
    return i ? i.parentNode.querySelector("span").firstChild.textContent.trim() : "";
  }

  function render(scroll) {
    var id = picked("partyLoc");
    var input = id && root.querySelector('input[name="partyLoc"][value="' + id + '"]');
    var type = input ? input.getAttribute("data-type") : null;
    var f = picked("partyFood");
    var needsFood = !!input && input.getAttribute("data-food") === "yes";
    var nofood = root.querySelector("[data-nofood]");
    if (nofood) nofood.textContent = id === "fashion-show" ? "No, we’ll bring our own or skip food" : "No, games only";
    food.hidden = !needsFood;
    if (byo) byo.hidden = id !== "fashion-show";
    var ready = type && (!needsFood || f);
    sets.forEach(function (s) { s.hidden = !(ready && s.getAttribute("data-set") === type); });
    root.classList.toggle("pfood-games", needsFood && f === "games");
    root.classList.toggle("pfood-yes", needsFood && f === "food");

    if (!type) { step.textContent = "2"; status.textContent = "Pick your arcade to see its packages."; sub.textContent = ""; return; }
    step.textContent = needsFood ? "3" : "2";
    if (!ready) { status.textContent = "Choose a food option to see packages."; sub.textContent = ""; return; }
    status.textContent = "Choose your package";
    sub.textContent = storeName(id) + (needsFood ? (f === "food" ? " · with pizza and drinks" : (id === "fashion-show" ? " · no food from us" : " · games only")) : (id === "area15" ? " · games only (no outside food or drink)" : (id === "miracle-mile" ? " · games only" : " · all about the games")));

    root.querySelectorAll('.pkg-set[data-set="lv"] [data-base]').forEach(function (p) {
      p.textContent = needsFood && f === "food" ? p.getAttribute("data-withfood") : p.getAttribute("data-base");
    });
    var links = BOOKING[id] || {};
    var suffix = needsFood && f === "food" ? "-food" : "";
    root.querySelectorAll('.pkg-set[data-set="' + type + '"] [data-pkg]').forEach(function (card) {
      var a = card.querySelector("[data-book]"); if (!a) return;
      var url = links[card.getAttribute("data-pkg") + suffix];
      if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
      else { a.href = "#eventsForm"; a.removeAttribute("target"); a.removeAttribute("rel"); }
    });
    if (scroll && window.innerWidth < 760) {
      document.getElementById("plocStatus").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }
  }

  root.querySelectorAll('input[name="partyLoc"]').forEach(function (r) {
    r.addEventListener("change", function () {
      if (loc && loc !== r.value) {
        root.querySelectorAll('input[name="partyFood"]').forEach(function (x) { x.checked = false; });
      }
      loc = r.value;
      try { localStorage.setItem("fcaPartyLoc", r.value); } catch (e) {}
      render(false);
      if (window.innerWidth < 760) (r.getAttribute("data-food") === "yes" ? food : document.getElementById("plocStatus")).scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  root.querySelectorAll('input[name="partyFood"]').forEach(function (r) { r.addEventListener("change", function () { render(true); }); });

  var q = new URLSearchParams(location.search).get("location");
  var saved = null; try { saved = localStorage.getItem("fcaPartyLoc"); } catch (e) {}
  var start = q || saved;
  var s = start && root.querySelector('input[name="partyLoc"][value="' + start + '"]');
  if (s && !s.disabled) { s.checked = true; loc = start; }
  render(false);
})();
