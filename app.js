const state = {
  plan: null,
  file: null,
  images: new Map(),
  wardrobe: new Map(),
  itineraryStops: [{ location: "", startDate: "", endDate: "", notes: "" }]
};

const els = {
  manualText: document.querySelector("#manualText"),
  preferences: document.querySelector("#preferences"),
  fileInput: document.querySelector("#fileInput"),
  wardrobeProfile: document.querySelector("#wardrobeProfile"),
  travelerCount: document.querySelector("#travelerCount"),
  colorScheme: document.querySelector("#colorScheme"),
  luggageType: document.querySelector("#luggageType"),
  luggageDetails: document.querySelector("#luggageDetails"),
  laundryAccess: document.querySelector("#laundryAccess"),
  formality: document.querySelector("#formality"),
  climateComfort: document.querySelector("#climateComfort"),
  fitNotes: document.querySelector("#fitNotes"),
  addStopBtn: document.querySelector("#addStopBtn"),
  itineraryStops: document.querySelector("#itineraryStops"),
  wardrobeToggle: document.querySelector("#wardrobeToggle"),
  wardrobeBody: document.querySelector("#wardrobeBody"),
  wardrobeGrid: document.querySelector("#wardrobeGrid"),
  generateBtn: document.querySelector("#generateBtn"),
  imageBtn: document.querySelector("#imageBtn"),
  pngBtn: document.querySelector("#pngBtn"),
  pdfBtn: document.querySelector("#pdfBtn"),
  status: document.querySelector("#status"),
  board: document.querySelector("#board")
};

const wardrobeCategories = [
  {
    key: "shirts",
    label: "Tops & Shirts",
    items: ["white linen shirt", "silk blouse", "light blue button-down", "ivory tee", "blue print shirt", "black camisole"]
  },
  {
    key: "layers",
    label: "Jackets & Layers",
    items: ["tan blazer", "tobacco overshirt", "cream cardigan", "navy travel jacket", "cashmere wrap", "light rain shell"]
  },
  {
    key: "trousers",
    label: "Trousers & Denim",
    items: ["navy trousers", "cream trousers", "wide-leg linen pants", "dark denim", "travel pants", "blue linen pants"]
  },
  {
    key: "dresses",
    label: "Dresses",
    items: ["black dinner dress", "linen day dress", "silk slip dress", "printed sundress", "travel knit dress"]
  },
  {
    key: "skirts",
    label: "Skirts",
    items: ["silk midi skirt", "linen skirt", "tailored black skirt", "wrap skirt"]
  },
  {
    key: "shorts",
    label: "Shorts & Resort",
    items: ["linen shorts", "tailored shorts", "swimsuit", "cover-up", "sarong", "resort set"]
  },
  {
    key: "shoes",
    label: "Shoes",
    items: ["clean white trainers", "ballet flats", "strappy sandals", "low heels", "walking shoes", "brown loafers"]
  },
  {
    key: "accessories",
    label: "Accessories",
    items: ["belt", "sunglasses", "hat", "silk scarf", "watch", "laundry kit"]
  },
  {
    key: "bags",
    label: "Bags",
    items: ["crossbody bag", "evening clutch", "tote", "packable beach bag", "belt bag"]
  },
  {
    key: "jewelry",
    label: "Jewelry",
    items: ["gold hoops", "simple necklace", "statement earrings", "bracelet stack", "cocktail ring"]
  },
  {
    key: "beauty",
    label: "Beauty & Extras",
    items: ["makeup kit", "sunscreen", "hair tool", "steamer", "evening fragrance", "travel jewelry case"]
  }
];

const samplePlan = {
  title: "Awaiting Itinerary",
  subtitle: "Upload a trip or paste details to create a tailored packing board",
  dateLine: "Luxury travel editorial output",
  strategy: "The board will adapt the tone, title, route, laundry plan, outfits, and visuals to the submitted itinerary.",
  palette: ["Ink", "Ivory", "Tobacco", "Mist", "Stone"],
  destinations: [
    { name: "Stop One", nights: 2, mood: "Arrival polish", heroPrompt: "" },
    { name: "Stop Two", nights: 3, mood: "Signature days", heroPrompt: "" },
    { name: "Finale", nights: 2, mood: "Farewell dressing", heroPrompt: "" }
  ],
  laundry: {
    headline: "Laundry Strategy",
    bullets: ["Generated from trip length, climate, transfers, and hotel rhythm.", "Optimized for repeatable pieces and minimum overpacking."]
  },
  luggagePlan: {
    headline: "Luggage Plan",
    bags: ["Capacity guidance will adapt to the selected luggage and trip length."],
    constraints: ["Generated after itinerary submission.", "Color palette and traveler profile shape the final capsule."]
  },
  packingRecommendations: [
    { category: "Tops", quantity: "4-6", items: ["travel tee", "polished shirt", "dinner top"], reasoning: "Balanced for day repeats and evening changes." },
    { category: "Bottoms", quantity: "2-3", items: ["tailored trouser", "casual pant", "weather-appropriate option"], reasoning: "Repeatable neutrals carry the capsule." },
    { category: "Shoes", quantity: "2", items: ["walkable day shoe", "dinner shoe"], reasoning: "Enough range without overfilling luggage." }
  ],
  outfits: [
    { destination: "Stop One", label: "Arrival", dayLook: ["travel layer", "soft trouser", "clean shoe"], dinnerLook: ["linen shirt", "tailored layer", "polished shoe"], note: "Generated after itinerary submission." },
    { destination: "Stop Two", label: "Full Day", dayLook: ["walkable base", "light layer", "day shoe"], dinnerLook: ["dinner shirt", "structured layer", "dress shoe"], note: "Generated after itinerary submission." },
    { destination: "Finale", label: "Departure", dayLook: ["repeatable layer", "comfortable pant", "travel shoe"], dinnerLook: ["best shirt", "evening layer", "polished shoe"], note: "Generated after itinerary submission." }
  ],
  packingList: ["shirts", "trousers", "light layers", "dinner layer", "day shoes", "evening shoes"],
  bestLooks: ["Generated best look", "Generated strongest repeat", "Generated dinner capsule"],
  verdict: "The final verdict will explain what to pack, what to repeat, and where laundry matters.",
  illustrationPrompts: []
};

for (const category of wardrobeCategories) {
  state.wardrobe.set(category.key, new Set(category.items.slice(0, 3)));
}

function setStatus(message) {
  els.status.textContent = message;
}

function setBusy(isBusy) {
  for (const button of [els.generateBtn, els.imageBtn, els.pngBtn, els.pdfBtn]) {
    button.disabled = isBusy;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function list(items = []) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function selectedWardrobe() {
  return wardrobeCategories.map((category) => ({
    category: category.label,
    items: [...(state.wardrobe.get(category.key) || new Set())]
  })).filter((category) => category.items.length);
}

function blankStop() {
  return { location: "", startDate: "", endDate: "", notes: "" };
}

function stopNights(stop) {
  if (!stop.startDate || !stop.endDate) return null;
  const start = new Date(`${stop.startDate}T00:00:00`);
  const end = new Date(`${stop.endDate}T00:00:00`);
  const diff = Math.round((end - start) / 86400000);
  return Number.isFinite(diff) && diff > 0 ? diff : null;
}

function itineraryStopsFromDom() {
  return [...els.itineraryStops.querySelectorAll(".itinerary-stop")].map((row) => ({
    location: row.querySelector('[data-stop-field="location"]')?.value.trim() || "",
    startDate: row.querySelector('[data-stop-field="startDate"]')?.value || "",
    endDate: row.querySelector('[data-stop-field="endDate"]')?.value || "",
    notes: row.querySelector('[data-stop-field="notes"]')?.value.trim() || ""
  }));
}

function cleanItineraryStops() {
  return itineraryStopsFromDom()
    .map((stop) => ({ ...stop, nights: stopNights(stop) }))
    .filter((stop) => stop.location || stop.startDate || stop.endDate || stop.notes);
}

function renderItineraryStops(stops = state.itineraryStops) {
  state.itineraryStops = stops.length ? stops : [blankStop()];
  els.itineraryStops.innerHTML = state.itineraryStops.map((stop, index) => `
    <article class="itinerary-stop" data-index="${index}">
      <label class="field">
        <span>Location</span>
        <input data-stop-field="location" type="text" value="${escapeHtml(stop.location)}" placeholder="Paris, France">
      </label>
      <label class="field">
        <span>Start date</span>
        <input data-stop-field="startDate" type="date" value="${escapeHtml(stop.startDate)}">
      </label>
      <label class="field">
        <span>End date</span>
        <input data-stop-field="endDate" type="date" value="${escapeHtml(stop.endDate)}">
      </label>
      <label class="field stop-notes">
        <span>Plans or dress codes</span>
        <input data-stop-field="notes" type="text" value="${escapeHtml(stop.notes)}" placeholder="Museum day, beach club, black-tie dinner...">
      </label>
      <button class="remove-stop" type="button" data-index="${index}" aria-label="Remove location" ${state.itineraryStops.length === 1 ? "disabled" : ""}>Remove</button>
    </article>
  `).join("");
}

function addItineraryStop() {
  state.itineraryStops = itineraryStopsFromDom();
  state.itineraryStops.push(blankStop());
  renderItineraryStops(state.itineraryStops);
}

function removeItineraryStop(index) {
  state.itineraryStops = itineraryStopsFromDom();
  state.itineraryStops.splice(index, 1);
  renderItineraryStops(state.itineraryStops);
}

function selectedLabel(select) {
  return select.selectedOptions?.[0]?.textContent.trim() || select.value;
}

function tripProfile() {
  return {
    wardrobeProfile: els.wardrobeProfile.value,
    wardrobeProfileLabel: selectedLabel(els.wardrobeProfile),
    travelerCount: Math.max(1, Number(els.travelerCount.value || 1)),
    colorScheme: els.colorScheme.value.trim(),
    luggageType: els.luggageType.value,
    luggageTypeLabel: selectedLabel(els.luggageType),
    luggageDetails: els.luggageDetails.value.trim(),
    laundryAccess: els.laundryAccess.value,
    laundryAccessLabel: selectedLabel(els.laundryAccess),
    formality: els.formality.value,
    formalityLabel: selectedLabel(els.formality),
    climateComfort: els.climateComfort.value,
    climateComfortLabel: selectedLabel(els.climateComfort),
    fitNotes: els.fitNotes.value.trim()
  };
}

function renderWardrobe() {
  els.wardrobeGrid.innerHTML = wardrobeCategories.map((category) => {
    const selected = state.wardrobe.get(category.key) || new Set();
    return `
      <article class="wardrobe-card" data-category="${escapeHtml(category.key)}">
        <h2>${escapeHtml(category.label)}</h2>
        <div class="wardrobe-options">
          ${category.items.map((item) => `
            <button
              class="wardrobe-chip ${selected.has(item) ? "is-selected" : ""}"
              type="button"
              data-category="${escapeHtml(category.key)}"
              data-item="${escapeHtml(item)}"
              aria-pressed="${selected.has(item) ? "true" : "false"}"
            >${escapeHtml(item)}</button>
          `).join("")}
        </div>
        <input class="custom-piece" data-category="${escapeHtml(category.key)}" type="text" placeholder="+ add custom...">
      </article>
    `;
  }).join("");
}

function toggleWardrobeItem(categoryKey, item) {
  const selected = state.wardrobe.get(categoryKey) || new Set();
  if (selected.has(item)) {
    selected.delete(item);
  } else {
    selected.add(item);
  }
  state.wardrobe.set(categoryKey, selected);
  renderWardrobe();
}

function addWardrobeItem(input) {
  const value = input.value.trim();
  const category = wardrobeCategories.find((entry) => entry.key === input.dataset.category);
  if (!value || !category) return;
  if (!category.items.includes(value)) category.items.push(value);
  const selected = state.wardrobe.get(category.key) || new Set();
  selected.add(value);
  state.wardrobe.set(category.key, selected);
  input.value = "";
  renderWardrobe();
}

function imageTag(key, className, fallbackText) {
  const src = state.images.get(key);
  if (src) return `<img class="${className}" src="${src}" alt="">`;
  return `<div class="${className} placeholder">${escapeHtml(fallbackText)}</div>`;
}

function chunkOutfits(plan) {
  const byDestination = [];
  for (const destination of plan.destinations) {
    const outfits = plan.outfits.filter((outfit) => outfit.destination === destination.name);
    const fallback = outfits.length ? outfits : plan.outfits.slice(0, 2);
    const pair = fallback.length > 1 ? fallback.slice(0, 2) : [fallback[0], fallback[0]].filter(Boolean);
    byDestination.push({ destination, outfits: pair });
  }
  return byDestination;
}

function recommendationPanel(plan) {
  const recommendations = Array.isArray(plan.packingRecommendations) ? plan.packingRecommendations : [];
  const luggagePlan = plan.luggagePlan || {
    headline: "Luggage Plan",
    bags: ["Generated after itinerary submission."],
    constraints: []
  };
  return `
    <section class="recommendation-grid">
      <div class="panel recommendations">
        <h3>Automatic Pack</h3>
        <div class="recommendation-list">
          ${recommendations.map((recommendation) => `
            <article class="recommendation-card">
              <div>
                <strong>${escapeHtml(recommendation.category)}</strong>
                <span>${escapeHtml(recommendation.quantity)}</span>
              </div>
              <ul>${list(recommendation.items)}</ul>
              <p>${escapeHtml(recommendation.reasoning)}</p>
            </article>
          `).join("") || "<p>Generated clothing quantities will appear here.</p>"}
        </div>
      </div>
      <div class="panel luggage-panel">
        <h3>${escapeHtml(luggagePlan.headline)}</h3>
        <ul>${list(luggagePlan.bags)}</ul>
        <div class="packing-list">${(luggagePlan.constraints || []).map((item) => `<span class="pill">${escapeHtml(item)}</span>`).join("")}</div>
      </div>
    </section>
  `;
}

function renderBoard(plan = samplePlan) {
  state.plan = plan;
  const destinationGroups = chunkOutfits(plan);
  els.board.style.setProperty("--dest-count", String(Math.min(plan.destinations.length, 8)));
  els.board.innerHTML = `
    <header class="board-title">
      <div class="board-brand">The Packing Atelier • BeVvip.com</div>
      <h2>${escapeHtml(plan.title)}</h2>
      <p>${escapeHtml(plan.dateLine)} • ${escapeHtml(plan.strategy)}</p>
    </header>

    <section class="route">
      ${plan.destinations.map((destination, index) => `
        <div class="stop">
          <div class="num">${index + 1}</div>
          ${imageTag(`destination-${index}`, "landmark", "Sketch")}
          <h3>${escapeHtml(destination.name)}</h3>
          <p>${escapeHtml(destination.nights)} nights • ${escapeHtml(destination.mood)}</p>
        </div>
      `).join("")}
    </section>

    <section class="strategy-box">
      <div>
        <h3>${escapeHtml(plan.laundry.headline)}</h3>
        <div class="palette-row">${plan.palette.map((color) => `<span class="swatch">${escapeHtml(color)}</span>`).join("")}</div>
      </div>
      <ul>${list(plan.laundry.bullets)}</ul>
    </section>

    ${recommendationPanel(plan)}

    <section class="outfit-grid">
      ${destinationGroups.map((group, index) => `
        <aside class="destination-rail">
          <div class="num">${index + 1}</div>
          <h3>${escapeHtml(group.destination.name)}</h3>
          <p>${escapeHtml(group.destination.nights)} nights</p>
          <p><em>${escapeHtml(group.destination.mood)}</em></p>
        </aside>
        ${group.outfits.slice(0, 2).map((outfit, outfitIndex) => `
          <article class="outfit-card">
            <h4>${escapeHtml(outfit.label)}</h4>
            <div class="look-cols">
              <div class="look">
                <strong>Day</strong>
                <ul>${list(outfit.dayLook)}</ul>
              </div>
              <div class="look">
                <strong>Dinner</strong>
                <ul>${list(outfit.dinnerLook)}</ul>
              </div>
              ${imageTag(`item-${(index * 2) + outfitIndex}`, "item-art", "Look")}
            </div>
            <p class="note">${escapeHtml(outfit.note)}</p>
          </article>
        `).join("")}
      `).join("")}
    </section>

    <section class="bottom-grid">
      <div class="panel">
        <h3>Best Looks</h3>
        <ol>${list(plan.bestLooks)}</ol>
        <div class="packing-list">${plan.packingList.map((item) => `<span class="pill">${escapeHtml(item)}</span>`).join("")}</div>
      </div>
      <div class="panel gold">
        <h3>Packing Verdict</h3>
        <p>${escapeHtml(plan.verdict)}</p>
      </div>
    </section>
  `;
}

async function readFileAsPayload(file) {
  if (!file) return null;
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
  return {
    name: file.name,
    type: file.type || "application/octet-stream",
    base64
  };
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(data.error || "Request failed");
  return data;
}

async function generatePlan() {
  setBusy(true);
  setStatus("Reading itinerary and designing the board...");
  try {
    const file = els.fileInput.files[0] ? await readFileAsPayload(els.fileInput.files[0]) : null;
    const itineraryStops = cleanItineraryStops();
    if (!file && !itineraryStops.length && !els.manualText.value.trim()) {
      throw new Error("Add an uploaded itinerary, at least one location/date stop, or trip notes first.");
    }
    const data = await postJson("/api/create-plan", {
      manualText: els.manualText.value,
      itineraryStops,
      tripProfile: tripProfile(),
      preferences: els.preferences.value,
      wardrobe: selectedWardrobe(),
      file
    });
    state.images.clear();
    renderBoard(data.plan);
    setStatus(data.demo ? "Demo board created. Add OPENAI_API_KEY for itinerary-specific output." : "Board created. You can generate illustrations next.");
  } catch (error) {
    setStatus(error.message);
  } finally {
    setBusy(false);
  }
}

function illustrationJobs(plan) {
  const jobs = [];
  plan.destinations.slice(0, 8).forEach((destination, index) => {
    if (destination.heroPrompt) jobs.push({ key: `destination-${index}`, prompt: destination.heroPrompt });
  });
  plan.illustrationPrompts.slice(0, 8).forEach((prompt, index) => {
    jobs.push({ key: `item-${index}`, prompt });
  });
  return jobs;
}

async function generateIllustrations() {
  if (!state.plan) renderBoard(samplePlan);
  const jobs = illustrationJobs(state.plan);
  if (!jobs.length) {
    setStatus("This board has no illustration prompts yet.");
    return;
  }
  setBusy(true);
  try {
    for (let index = 0; index < jobs.length; index += 1) {
      const job = jobs[index];
      setStatus(`Generating illustration ${index + 1} of ${jobs.length}...`);
      const data = await postJson("/api/create-illustration", { prompt: job.prompt });
      if (data.image) state.images.set(job.key, data.image);
      renderBoard(state.plan);
    }
    setStatus("Illustrations added to the board.");
  } catch (error) {
    setStatus(error.message);
  } finally {
    setBusy(false);
  }
}

async function boardToPng() {
  const board = els.board;
  if (!window.html2canvas) {
    throw new Error("PNG exporter is still loading. Try again in a moment.");
  }
  const canvas = await window.html2canvas(board, {
    backgroundColor: "#fffdf8",
    scale: 2,
    useCORS: true,
    allowTaint: false,
    logging: false
  });
  return await new Promise((resolve) => canvas.toBlob(resolve, "image/png", 1));
}

async function downloadPng() {
  setBusy(true);
  setStatus("Preparing PNG...");
  try {
    const blob = await boardToPng();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(state.plan?.title || "packing-plan").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
    link.click();
    URL.revokeObjectURL(url);
    setStatus("PNG downloaded.");
  } catch (error) {
    setStatus(`PNG export needs browser support for HTML canvas snapshots. ${error.message || ""}`.trim());
  } finally {
    setBusy(false);
  }
}

async function downloadPdf() {
  setBusy(true);
  setStatus("Preparing PDF...");
  try {
    const blob = await boardToPng();
    const dataUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
    const jsPDF = window.jspdf?.jsPDF;
    if (!jsPDF) throw new Error("PDF exporter is still loading. Try again in a moment.");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [els.board.scrollWidth, els.board.scrollHeight]
    });
    pdf.addImage(dataUrl, "PNG", 0, 0, els.board.scrollWidth, els.board.scrollHeight);
    pdf.save(`${(state.plan?.title || "packing-plan").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`);
    setStatus("PDF downloaded.");
  } catch (error) {
    setStatus(error.message || "PDF export failed.");
  } finally {
    setBusy(false);
  }
}

els.generateBtn.addEventListener("click", generatePlan);
els.imageBtn.addEventListener("click", generateIllustrations);
els.pngBtn.addEventListener("click", downloadPng);
els.pdfBtn.addEventListener("click", downloadPdf);
els.addStopBtn.addEventListener("click", addItineraryStop);
els.itineraryStops.addEventListener("click", (event) => {
  const button = event.target.closest(".remove-stop");
  if (!button) return;
  removeItineraryStop(Number(button.dataset.index));
});
els.wardrobeToggle.addEventListener("click", () => {
  const builder = els.wardrobeToggle.closest(".wardrobe-builder");
  const isCollapsed = builder.classList.toggle("is-collapsed");
  els.wardrobeToggle.setAttribute("aria-expanded", String(!isCollapsed));
});
els.wardrobeGrid.addEventListener("click", (event) => {
  const chip = event.target.closest(".wardrobe-chip");
  if (!chip) return;
  toggleWardrobeItem(chip.dataset.category, chip.dataset.item);
});
els.wardrobeGrid.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  const input = event.target.closest(".custom-piece");
  if (!input) return;
  event.preventDefault();
  addWardrobeItem(input);
});
els.wardrobeGrid.addEventListener("blur", (event) => {
  const input = event.target.closest(".custom-piece");
  if (input) addWardrobeItem(input);
}, true);
renderItineraryStops();
renderWardrobe();
renderBoard(samplePlan);
