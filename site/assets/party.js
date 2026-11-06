/* Birthday packages: pick a location before any packages show.
   Booking links: paste each store's Square Appointments booking URL per package.
   Guests choose the package (and, at Fashion Show, the pizza & drinks add-on) in Square.
   Empty links fall back to the party request form (#eventsForm). Custom always goes to the form. */
(function () {
  var FS_URL = "https://app.squareup.com/appointments/book/xjld35tkodu5ho/LJACZK22D8AD7/start";
  var MM_URL = "https://app.squareup.com/appointments/book/qc789couihszx4/LVY1F82PQ830Y/start";
  var PKGS = ["fantasy-claw", "wizards-challenge", "ultimate-wizard"];
  function all(url) { var o = {}; PKGS.forEach(function (k) { o[k] = url; }); return o; }
  var BOOKING = {
    "fashion-show": all(FS_URL),
    "area15": all(""),
    "miracle-mile": all(MM_URL),
    "international-market-place": all(""),
    "ala-moana": all(""),
    "easton": all("")
  };
  var SUB = {
    "fashion-show": " · add pizza and drinks when you book, or bring your own",
    "area15": " · food available through AREA15",
    "miracle-mile": " · games only"
  };

  var root = document.getElementById("packages");
  if (!root) return;
  var sets = root.querySelectorAll(".pkg-set");
  var status = root.querySelector("[data-status]");
  var sub = root.querySelector("[data-status-sub]");
  var step = root.querySelector("[data-step]");
  root.classList.add("ploc-on");

  function storeName(id) {
    var i = root.querySelector('input[name="partyLoc"][value="' + id + '"]');
    return i ? i.parentNode.querySelector("span").firstChild.textContent.trim() : "";
  }

  function render() {
    var input = root.querySelector('input[name="partyLoc"]:checked');
    var id = input ? input.value : null;
    var type = input ? input.getAttribute("data-type") : null;
    sets.forEach(function (s) { s.hidden = !(type && s.getAttribute("data-set") === type); });
    root.classList.toggle("pfood-yes", !!input && input.getAttribute("data-addon") === "food");
    root.querySelectorAll("[data-note]").forEach(function (n) { n.hidden = n.getAttribute("data-note") !== id; });
    step.textContent = "2";
    if (!type) { status.textContent = "Pick your arcade to see its packages."; sub.textContent = ""; return; }
    status.textContent = "Choose your package";
    sub.textContent = storeName(id) + (SUB[id] || " · all about the games");
    var links = BOOKING[id] || {};
    root.querySelectorAll('.pkg-set[data-set="' + type + '"] [data-pkg]').forEach(function (card) {
      var a = card.querySelector("[data-book]"); if (!a) return;
      var url = links[card.getAttribute("data-pkg")];
      if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
      else { a.href = "#eventsForm"; a.removeAttribute("target"); a.removeAttribute("rel"); }
    });
  }

  root.querySelectorAll('input[name="partyLoc"]').forEach(function (r) {
    r.addEventListener("change", function () {
      try { localStorage.setItem("fcaPartyLoc", r.value); } catch (e) {}
      render();
      if (window.innerWidth < 760) document.getElementById("plocStatus").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    });
  });

  var q = new URLSearchParams(location.search).get("location");
  var saved = null; try { saved = localStorage.getItem("fcaPartyLoc"); } catch (e) {}
  var start = q || saved;
  var s = start && root.querySelector('input[name="partyLoc"][value="' + start + '"]');
  if (s && !s.disabled) s.checked = true;
  render();
})();
