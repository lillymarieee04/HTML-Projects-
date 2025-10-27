const fetchButton = document.getElementById("fetch-button");
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const cardContainer = document.getElementById("card-container");
const errorMessage = document.getElementById("error-message");
const loader = document.getElementById("loader");


fetchButton.addEventListener("click", async () => {
  await fetchCards();
});

searchButton.addEventListener("click", async () => {
  const name = searchInput.value.trim();
  if (!name) {
    errorMessage.textContent = "Please enter a card name.";
    return;
  }
  await fetchCardByName(name);
});

async function fetchCardByName(name) {
  try {
    errorMessage.textContent = "";
    cardContainer.innerHTML = "";
    loader.style.display = "block";

    const url = "https://api.magicthegathering.io/v1/cards?name=" + encodeURIComponent(name);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Fetch failed: " + response.status);
    }

    const data = await response.json();

    if (!data.cards || data.cards.length === 0) {
      errorMessage.textContent = "No card found with name " + name + ".";
      cardContainer.innerHTML = "";
      return;
    }

    displayCards(data.cards);
  } catch (err) {
    errorMessage.textContent = "Error searching card: " + err.message;
    cardContainer.innerHTML = "";
  } finally {
    loader.style.display = "none";
  }
}


async function fetchCards() {
  try {
    errorMessage.textContent = "";
    cardContainer.innerHTML = "";
    loader.style.display = "block";

    const url = "https://api.magicthegathering.io/v1/cards?pageSize=100";
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Fetch failed: " + response.status);
    }

    const data = await response.json();
    displayCards(data.cards);
  } catch (err) {
    errorMessage.textContent = "Error fetching cards: " + err.message;
    cardContainer.innerHTML = "";
  } finally {
    loader.style.display = "none";
  }
}


function displayCards(cards) {
  cardContainer.innerHTML = "";

  cards.forEach(function(card) {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");

    const img = document.createElement("img");
    img.src = card.imageUrl || "";
    img.alt = card.name || "Unnamed card";

    const nameEl = document.createElement("div");
    nameEl.classList.add("name");
    nameEl.textContent = card.name || "Unknown name";

    const setEl = document.createElement("div");
    setEl.classList.add("set");
    setEl.textContent = card.setName ? "Set: " + card.setName : "";

    const rarityEl = document.createElement("div");
    rarityEl.classList.add("rarity");
    rarityEl.textContent = card.rarity ? "Rarity: " + card.rarity : "";

    cardDiv.appendChild(img);
    cardDiv.appendChild(nameEl);
    cardDiv.appendChild(setEl);
    cardDiv.appendChild(rarityEl);

    cardContainer.appendChild(cardDiv);
  });
}
