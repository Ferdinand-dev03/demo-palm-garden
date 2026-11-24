/* ============================================================
   Palm Garden : données (à modifier sans toucher à la mise en page)
   ============================================================ */
const CONFIG = {
  marque: "Palm Garden",
  // Numéro de démo (Ferdinand). Remplacer par celui du restaurant s'il achète.
  whatsapp: "2250585685461",
  devise: "FCFA",
  latitude: 7.6538676,
  longitude: -5.0253774,
  heureOuverture: 9,   // 9 h 00
  derniereResa: 23,    // dernière réservation à 23 h 00
};

// Carte d'EXEMPLE pour la démo : plats et prix à remplacer par la vraie carte.
const PRODUITS = [
  { id: "pdj-complet", nom: "Petit-déjeuner complet", categorie: "Petit-déjeuner", prix: 3500, desc: "Pain, beurre, confiture, omelette, jus frais et boisson chaude" },
  { id: "omelette", nom: "Omelette garnie", categorie: "Petit-déjeuner", prix: 2500, desc: "Oignons, tomates, poivrons, servie avec du pain" },
  { id: "crepes", nom: "Crêpes au miel", categorie: "Petit-déjeuner", prix: 2000, desc: "Trois crêpes maison, miel local" },
  { id: "poulet-braise", nom: "Poulet braisé", categorie: "Plats", prix: 5000, desc: "Demi-poulet mariné, attiéké ou alloco" },
  { id: "poisson-braise", nom: "Poisson braisé", categorie: "Plats", prix: 6000, desc: "Carpe entière, attiéké, sauce tomate pimentée" },
  { id: "kedjenou", nom: "Kedjenou de poulet", categorie: "Plats", prix: 5500, desc: "Mijoté à l'étouffée, riz blanc" },
  { id: "brochettes", nom: "Brochettes de bœuf", categorie: "Grillades", prix: 4000, desc: "Quatre brochettes, frites ou alloco" },
  { id: "agneau", nom: "Côtes d'agneau grillées", categorie: "Grillades", prix: 8000, desc: "Herbes, légumes du moment" },
  { id: "plateau", nom: "Plateau lounge à partager", categorie: "Grillades", prix: 15000, desc: "Brochettes, ailes de poulet, saucisses, alloco, pour 3 à 4 personnes" },
  { id: "bissap", nom: "Jus de bissap maison", categorie: "Boissons", prix: 1500, desc: "Frais, légèrement sucré" },
  { id: "gingembre", nom: "Jus de gingembre", categorie: "Boissons", prix: 1500, desc: "Maison, bien relevé" },
  { id: "cocktail-palm", nom: "Cocktail Palm", categorie: "Boissons", prix: 3000, desc: "Sans alcool : ananas, passion, menthe" },
];

/* ============================================================
   Outils
   ============================================================ */
const $ = (s) => document.querySelector(s);
const ESP = " "; // espace fine insécable (milliers)
const prixTexte = (n) => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ESP)} ${CONFIG.devise}`;
const lienWa = (texte) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texte)}`;
const ouvrirWa = (texte) => window.open(lienWa(texte), "_blank", "noopener");
function reference(prefixe) {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let r = "";
  for (let i = 0; i < 4; i++) r += c[Math.floor(Math.random() * c.length)];
  return `${prefixe}-${r}`;
}
const heureTexte = (hhmm) => { const [h, m] = hhmm.split(":"); return `${Number(h)} h ${m}`; };

/* ============================================================
   La carte : aperçu sur l'accueil (une catégorie) et page menu.html (tout)
   ============================================================ */
// Photo d'illustration de chaque plat : champ "photo" si présent, sinon images/plats/<id>.webp
const photoPlat = (p) => p.photo || `images/plats/${p.id}.webp`;
const categories = [...new Set(PRODUITS.map((p) => p.categorie))];
let filtreActif = "Petit-déjeuner"; // catégorie affichée par défaut sur l'accueil

const platHTML = (p, i = 0) => `
      <li class="plat" style="--i:${Math.min(i, 8)}">
        <img class="plat-photo" src="${photoPlat(p)}" alt="" width="88" height="88" loading="lazy" onerror="this.style.visibility='hidden'">
        <h3 class="plat-nom">${p.nom}</h3>
        <span class="plat-prix">${prixTexte(p.prix)}</span>
        <p class="plat-desc">${p.desc}</p>
        <span class="plat-ajout"><button type="button" class="btn-ajout" data-id="${p.id}" aria-label="Ajouter ${p.nom} à la commande">Ajouter</button></span>
      </li>`;

function afficherFiltres() {
  // « Tout » mène à la page complète du menu
  $("#filtres").innerHTML = `<a class="filtre" href="menu.html">Tout</a>` + categories
    .map((c) => `<button type="button" class="filtre" aria-pressed="${c === filtreActif}" data-cat="${c}">${c}</button>`)
    .join("");
}
function afficherPlats() {
  $("#plats").innerHTML = PRODUITS.filter((p) => p.categorie === filtreActif).map(platHTML).join("");
}
if ($("#filtres")) {
  $("#filtres").addEventListener("click", (e) => {
    const b = e.target.closest("button.filtre");
    if (!b) return;
    filtreActif = b.dataset.cat;
    afficherFiltres();
    afficherPlats();
  });
}

// Page menu.html : toutes les catégories, chacune avec son titre
const menuComplet = $("#menuComplet");
if (menuComplet) {
  const ancre = (c) => "cat-" + c.toLowerCase().normalize("NFD").replace(/[^a-z]/g, "");
  $("#menuNav").innerHTML = categories.map((c) => `<a class="filtre" href="#${ancre(c)}">${c}</a>`).join("");
  menuComplet.innerHTML = categories.map((c) => `
    <section class="menu-categorie" id="${ancre(c)}">
      <h2>${c}</h2>
      <ul class="plats">${PRODUITS.filter((p) => p.categorie === c).map(platHTML).join("")}</ul>
    </section>`).join("");
}

// Bouton « Ajouter » (accueil et page menu)
document.addEventListener("click", (e) => {
  const b = e.target.closest(".btn-ajout");
  if (!b) return;
  ajouter(b.dataset.id);
  b.classList.add("ajoute");
  b.textContent = "Ajouté";
  setTimeout(() => { b.classList.remove("ajoute"); b.textContent = "Ajouter"; }, 1200);
});

/* ============================================================
   Panier (commande à emporter ou sur place)
   ============================================================ */
const CLE = "palmgarden-panier";
let panier = {};
function lirePanier() {
  const lu = {};
  try {
    const brut = JSON.parse(localStorage.getItem(CLE) || "{}");
    for (const [id, q] of Object.entries(brut)) {
      if (PRODUITS.some((p) => p.id === id) && Number.isInteger(q) && q > 0 && q < 100) lu[id] = q;
    }
  } catch (e) { /* stockage indisponible : panier vide */ }
  return lu;
}
panier = lirePanier();
// Sans stockage (navigation privée stricte), le panier vit seulement en mémoire
const stockageDispo = (() => { try { localStorage.setItem("pg-test", "1"); localStorage.removeItem("pg-test"); return true; } catch (e) { return false; } })();
// Accueil et menu.html partagent le panier : on le relit au retour sur la page (bouton Retour)
// et quand un autre onglet le modifie, pour ne jamais écraser ce que l'autre page a enregistré.
window.addEventListener("pageshow", (e) => { if (e.persisted) { panier = lirePanier(); majPanier(); } });
window.addEventListener("storage", (e) => { if (e.key === CLE) { panier = lirePanier(); majPanier(); } });
const sauver = () => { try { localStorage.setItem(CLE, JSON.stringify(panier)); } catch (e) {} };

const nbArticles = () => Object.values(panier).reduce((a, q) => a + q, 0);
const totalPanier = () => Object.entries(panier).reduce((a, [id, q]) => a + PRODUITS.find((p) => p.id === id).prix * q, 0);

function ajouter(id) {
  if (stockageDispo) panier = lirePanier(); // repartir de la dernière version enregistrée (autre page ou onglet)
  panier[id] = (panier[id] || 0) + 1; sauver(); majPanier();
  // petit rebond du bouton panier
  const b = $("#btnPanier");
  b.classList.remove("rebond"); void b.offsetWidth; b.classList.add("rebond");
}
function changer(id, delta) {
  panier[id] = (panier[id] || 0) + delta;
  if (panier[id] <= 0) delete panier[id];
  sauver(); majPanier();
}

function majPanier() {
  const n = nbArticles();
  // Le panier a changé : la question « Votre commande est partie ? » ne vaut plus pour ce contenu
  $("#confirmation").hidden = true;
  if ($("#cmdErreur")) $("#cmdErreur").hidden = true;
  $("#btnPanier").hidden = n === 0;
  $("#compteur").textContent = n;
  $("#totalBouton").textContent = prixTexte(totalPanier());
  $("#total").textContent = prixTexte(totalPanier());
  $("#lignes").innerHTML = Object.entries(panier)
    .map(([id, q]) => {
      const p = PRODUITS.find((x) => x.id === id);
      return `
        <li class="ligne">
          <div><div class="ligne-nom">${p.nom}</div><div class="ligne-prix">${prixTexte(p.prix)} × ${q}</div></div>
          <div class="quantite">
            <button type="button" data-moins="${id}" aria-label="Retirer un ${p.nom}">−</button>
            <span>${q}</span>
            <button type="button" data-plus="${id}" aria-label="Ajouter un ${p.nom}">+</button>
          </div>
        </li>`;
    })
    .join("");
  if (n === 0) fermerTiroir();
}
$("#lignes").addEventListener("click", (e) => {
  const plus = e.target.closest("[data-plus]");
  const moins = e.target.closest("[data-moins]");
  if (plus) changer(plus.dataset.plus, 1);
  if (moins) changer(moins.dataset.moins, -1);
});

// Pendant que le tiroir est ouvert, le reste de la page est inerte (Tab reste dans le tiroir)
const arrierePlan = () => document.querySelectorAll("header.entete, main, footer.pied, nav.barre-mobile, #btnPanier");
let focusAvant = null;
function ouvrirTiroir() {
  focusAvant = document.activeElement;
  $("#tiroir").hidden = false; $("#voile").hidden = false;
  $("#btnPanier").setAttribute("aria-expanded", "true");
  arrierePlan().forEach((el) => { el.inert = true; });
  $("#fermerTiroir").focus();
}
function fermerTiroir() {
  const etaitOuvert = !$("#tiroir").hidden;
  $("#tiroir").hidden = true; $("#voile").hidden = true; $("#confirmation").hidden = true;
  $("#btnPanier").setAttribute("aria-expanded", "false");
  arrierePlan().forEach((el) => { el.inert = false; });
  if (!etaitOuvert) return;
  // Rendre le focus : au bouton panier s'il est encore là, sinon à l'élément d'origine, sinon au contenu
  let cible = !$("#btnPanier").hidden ? $("#btnPanier") : focusAvant;
  if (!cible || !document.contains(cible) || cible === document.body) {
    cible = $("main");
    cible.setAttribute("tabindex", "-1");
  }
  cible.focus();
}
$("#btnPanier").addEventListener("click", ouvrirTiroir);
$("#fermerTiroir").addEventListener("click", fermerTiroir);
$("#voile").addEventListener("click", fermerTiroir);
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#tiroir").hidden) fermerTiroir(); });

function messageCommande(ref) {
  const lignes = Object.entries(panier).map(([id, q]) => {
    const p = PRODUITS.find((x) => x.id === id);
    return `- ${q} × ${p.nom} : ${prixTexte(p.prix * q)}`;
  });
  const mode = document.querySelector('input[name="mode"]:checked').value;
  const heure = $("#cmdHeure").value;
  const nom = $("#cmdNom").value.trim();
  return [
    `Bonjour ${CONFIG.marque}, je souhaite commander :`,
    ...lignes,
    `Total : ${prixTexte(totalPanier())}`,
    `Mode : ${mode}`,
    heure ? `Heure de passage : ${heureTexte(heure)}` : null,
    nom ? `Nom : ${nom}` : null,
    `Référence : ${ref}`,
  ].filter(Boolean).join("\n");
}
// Heure de passage : dans les horaires (9 h 00 à 23 h 30) et pas déjà passée aujourd'hui
function erreurHeurePassage(heure) {
  if (!heure) return "";
  if (heure < "09:00" || heure > "23:30") return "Heure de passage : choisissez entre 9 h 00 et 23 h 30.";
  const n = new Date();
  const maintenant = `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`;
  if (heure < maintenant) return "Cette heure de passage est déjà passée : choisissez une heure plus tard.";
  return "";
}
$("#btnCommander").addEventListener("click", () => {
  if (nbArticles() === 0) return;
  const err = erreurHeurePassage($("#cmdHeure").value);
  if (err) {
    $("#cmdErreur").textContent = err;
    $("#cmdErreur").hidden = false;
    $("#cmdHeure").focus();
    return;
  }
  $("#cmdErreur").hidden = true;
  ouvrirWa(messageCommande(reference("CMD")));
  $("#confirmation").hidden = false;
});
$("#confirmOui").addEventListener("click", () => { panier = {}; sauver(); majPanier(); });
$("#confirmNon").addEventListener("click", () => { $("#confirmation").hidden = true; });

if ($("#formReserver")) {
/* ============================================================
   Réservation
   ============================================================ */
const aujourdhui = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
const heures = [];
for (let h = CONFIG.heureOuverture; h <= CONFIG.derniereResa; h++) {
  heures.push(`${String(h).padStart(2, "0")}:00`);
  if (h < CONFIG.derniereResa) heures.push(`${String(h).padStart(2, "0")}:30`);
}
// Créneaux encore possibles pour une date : aujourd'hui, seulement ceux à au moins 30 min d'ici
function creneauxPour(date) {
  if (date !== aujourdhui()) return heures;
  const n = new Date(Date.now() + 30 * 60000);
  if (n.getDate() !== new Date().getDate()) return [];
  const limite = `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`;
  return heures.filter((h) => h >= limite);
}
const demain = () => { const d = new Date(); d.setDate(d.getDate() + 1); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
function majHeures() {
  const choix = creneauxPour($("#resDate").value);
  const avant = $("#resHeure").value || "20:00";
  const garde = choix.includes(avant) ? avant : (choix.includes("20:00") ? "20:00" : choix[0]);
  $("#resHeure").innerHTML = choix.map((h) => `<option value="${h}"${h === garde ? " selected" : ""}>${heureTexte(h)}</option>`).join("");
}
$("#resDate").min = aujourdhui();
// Plus aucun créneau aujourd'hui (tard le soir) : on propose demain par défaut
$("#resDate").value = creneauxPour(aujourdhui()).length ? aujourdhui() : demain();
majHeures();
$("#resDate").addEventListener("change", majHeures);
$("#resPersonnes").innerHTML =
  Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}"${i === 1 ? " selected" : ""}>${i + 1} ${i === 0 ? "personne" : "personnes"}</option>`).join("") +
  `<option value="Plus de 12">Plus de 12</option>`;

function dateLongue(iso) {
  const [a, m, j] = iso.split("-").map(Number);
  return new Date(a, m - 1, j).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

$("#formReserver").addEventListener("submit", (e) => {
  e.preventDefault();
  const date = $("#resDate").value;
  const err = $("#resErreur");
  if (!date || date < aujourdhui()) {
    err.textContent = "Choisissez une date à partir d'aujourd'hui.";
    err.hidden = false;
    $("#resDate").focus();
    return;
  }
  if (!creneauxPour(date).includes($("#resHeure").value)) {
    err.textContent = date === aujourdhui()
      ? "Cette heure est déjà passée (ou trop proche) : choisissez une heure plus tard ou un autre jour."
      : "Choisissez une heure.";
    err.hidden = false;
    majHeures();
    $("#resHeure").focus();
    return;
  }
  err.hidden = true;
  const nom = $("#resNom").value.trim();
  const demande = $("#resMessage").value.trim();
  const message = [
    `Bonjour ${CONFIG.marque}, je souhaite réserver une table :`,
    `- Date : ${dateLongue(date)}`,
    `- Heure : ${heureTexte($("#resHeure").value)}`,
    `- Personnes : ${$("#resPersonnes").value}`,
    `- Occasion : ${$("#resOccasion").value}`,
    nom ? `Nom : ${nom}` : null,
    demande ? `Demande : ${demande}` : null,
    `Référence : ${reference("RES")}`,
  ].filter(Boolean).join("\n");
  ouvrirWa(message);
});
}

/* ============================================================
   Carte géographique (affichée par défaut, chargement différé) et liens
   ============================================================ */
if ($("#lienItineraire")) $("#lienItineraire").href = `https://www.google.com/maps/dir/?api=1&destination=${CONFIG.latitude},${CONFIG.longitude}`;
// Carte affichée par défaut (chargée seulement quand on s'en approche : loading="lazy")
if ($("#carteGeo")) {
  const f = document.createElement("iframe");
  f.title = "Carte : Palm Garden à Bouaké";
  f.loading = "lazy";
  f.referrerPolicy = "no-referrer-when-downgrade";
  f.src = `https://www.google.com/maps?q=${CONFIG.latitude},${CONFIG.longitude}&z=16&output=embed`;
  $("#carteGeo").replaceChildren(f);
}
const lienQuestion = lienWa(`Bonjour ${CONFIG.marque}, j'ai une question.`);
if ($("#waPied")) $("#waPied").href = lienQuestion;
if ($("#waBarre")) $("#waBarre").href = lienQuestion;

const moinsAnimations = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Vidéo d'accueil : chargée seulement après la page (affichage plus rapide),
// et jamais si la personne a demandé moins d'animations. L'image fixe reste en dessous.
const video = $("#videoAccueil");
if (video && !moinsAnimations) {
  window.addEventListener("load", () => {
    video.src = video.dataset.src;
    video.addEventListener("playing", () => video.classList.add("prete"), { once: true });
    video.play().catch(() => {}); // lecture refusée (mode économie) : l'image reste
  });
}

// Barre de progression et ombre de l'en-tête (un seul calcul par image affichée)
const barre = $("#progression");
const entete = $("#entete");
let calculPrevu = false;
function majDefilement() {
  calculPrevu = false;
  const max = document.documentElement.scrollHeight - innerHeight;
  if (barre) barre.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  if (entete) entete.classList.toggle("decolle", scrollY > 8);
  // Soirées (téléphone) : la photo grossit doucement pendant que la carte traverse l'écran
  if (zoomActif) {
    imagesSoirees.forEach((img) => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const progres = Math.min(Math.max((innerHeight - r.top) / (innerHeight + r.height), 0), 1);
      img.style.setProperty("--zoom", (1 + progres * 0.18).toFixed(3));
    });
  }
}
const imagesSoirees = [...document.querySelectorAll(".evenement img")];
const ecranTelephone = window.matchMedia("(max-width: 759px)");
const zoomActif = ecranTelephone.matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches && imagesSoirees.length > 0;
addEventListener("scroll", () => {
  if (!calculPrevu) { calculPrevu = true; requestAnimationFrame(majDefilement); }
}, { passive: true });
majDefilement();

// Cartes événements : pré-remplissent l'occasion de la réservation
document.querySelectorAll(".evenement[data-occasion]").forEach((carte) => {
  carte.addEventListener("click", () => { if ($("#resOccasion")) $("#resOccasion").value = carte.dataset.occasion; });
});

// Galerie : le défilement ne démarre que lorsque la galerie arrive à l'écran
// (rien ne tourne pendant le chargement), puis se met en pause quand elle en sort
const piste = $("#galeriePiste");
function lancerGalerie() {
  piste.querySelectorAll("img").forEach((img) => {
    const copie = img.cloneNode(true);
    copie.alt = "";
    copie.setAttribute("aria-hidden", "true");
    piste.appendChild(copie);
  });
  piste.classList.add("defile");
}
if (piste && !moinsAnimations) {
  if ("IntersectionObserver" in window) {
    let lancee = false;
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !lancee) { lancee = true; lancerGalerie(); }
      piste.classList.toggle("hors-ecran", !e.isIntersecting);
    }, { rootMargin: "200px 0px" }).observe(piste);
  } else {
    lancerGalerie();
  }
}

// Apparitions douces au défilement (seulement transform et opacity : fluide sur téléphone)
if ("IntersectionObserver" in window && !moinsAnimations) {
  document.documentElement.classList.add("js");
  document.querySelectorAll(".moment, .evenement, .moments h2, .moments .surtitre, .carte h2, .reserver h2, .infos h2, .formulaire#formReserver, .carte-geo")
    .forEach((el) => el.classList.add("revele"));
  const obs = new IntersectionObserver((entrees) => {
    entrees.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -30px 0px", threshold: 0.01 });
  // Bienvenue (téléphone) : les atouts deviennent un carrousel qui défile tout seul
  const atouts = $(".atouts");
  if (atouts && ecranTelephone.matches) {
    const cadre = document.createElement("div");
    cadre.className = "atouts-cadre";
    atouts.before(cadre);
    cadre.appendChild(atouts);
    [...atouts.children].forEach((li) => {
      li.classList.remove("revele");
      const copie = li.cloneNode(true);
      copie.setAttribute("aria-hidden", "true");
      atouts.appendChild(copie);
    });
    atouts.classList.add("defile-atouts");
  }

  // Défilements automatiques : un appui met en pause, un second relance (pas seulement le doigt posé)
  document.querySelectorAll(".atouts-cadre, .galerie-cadre").forEach((cadre) => {
    cadre.setAttribute("title", "Toucher pour mettre en pause ou relancer le défilement");
    cadre.addEventListener("click", (e) => { if (!e.target.closest("a")) cadre.classList.toggle("en-pause"); });
  });

  // Carte : les plats s'animent quand la liste arrive à l'écran
  const obsPlats = new IntersectionObserver((entrees) => {
    entrees.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("anime"); obsPlats.unobserve(e.target); } });
  }, { threshold: 0.05 });
  document.querySelectorAll(".plats").forEach((ul) => obsPlats.observe(ul));

  document.querySelectorAll(".revele").forEach((el, i) => {
    // léger décalage entre éléments voisins (atouts, moments)
    const voisins = el.parentElement ? [...el.parentElement.children].filter((c) => c.classList.contains("revele")) : [];
    el.style.transitionDelay = `${Math.min(voisins.indexOf(el), 5) * 80}ms`;
    obs.observe(el);
  });
}

/* ============================================================
   Démarrage
   ============================================================ */
if ($("#filtres")) { afficherFiltres(); afficherPlats(); }
majPanier();
