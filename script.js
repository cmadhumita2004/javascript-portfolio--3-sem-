// ---------- Quotes ----------

const quotes = [
    {
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt"
    },
    {
        text: "It always seems impossible until it's done.",
        author: "Nelson Mandela"
    },
    {
        text: "The secret of getting ahead is getting started.",
        author: "Mark Twain"
    },
    {
        text: "Well done is better than well said.",
        author: "Benjamin Franklin"
    },
    {
        text: "The future depends on what you do today.",
        author: "Mahatma Gandhi"
    },
    {
        text: "Great things are done by a series of small things brought together.",
        author: "Vincent van Gogh"
    },
    {
        text: "Learning never exhausts the mind.",
        author: "Leonardo da Vinci"
    },
    {
        text: "Success is the sum of small efforts repeated day in and day out.",
        author: "Robert Collier"
    },
    {
        text: "The journey of a thousand miles begins with a single step.",
        author: "Lao Tzu"
    },
    {
        text: "You are never too old to set another goal or to dream a new dream.",
        author: "C. S. Lewis"
    }
];

// ---------- HTML Elements ----------

const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const newQuoteBtn = document.getElementById("newQuoteBtn");
const copyBtn = document.getElementById("copyBtn");
const favoriteBtn = document.getElementById("favoriteBtn");
const message = document.getElementById("message");

const favoritesList = document.getElementById("favoritesList");
const favoritesEmpty = document.getElementById("favoritesEmpty");
const clearFavoritesBtn = document.getElementById("clearFavoritesBtn");

const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

// ---------- Current Quote ----------

let currentQuote = quotes[0];
let previousQuoteIndex = 0;

// ---------- Random Quote Generator ----------

function generateQuote() {
    let randomIndex;

    // Avoid repeating the previous quote when possible.
    do {
        randomIndex = Math.floor(Math.random() * quotes.length);
    } while (
        randomIndex === previousQuoteIndex &&
        quotes.length > 1
    );

    previousQuoteIndex = randomIndex;
    currentQuote = quotes[randomIndex];

    displayQuote();
}

function displayQuote() {
    quoteText.textContent = currentQuote.text;
    quoteAuthor.textContent = "— " + currentQuote.author;

    message.textContent = "";

    updateFavoriteButton();
}

newQuoteBtn.addEventListener("click", generateQuote);

// ---------- Copy Quote ----------

copyBtn.addEventListener("click", async function () {
    const textToCopy =
        '"' + currentQuote.text + '" — ' + currentQuote.author;

    try {
        await navigator.clipboard.writeText(textToCopy);

        message.textContent = "Quote copied to clipboard!";
    } catch (error) {
        message.textContent =
            "Clipboard access is unavailable. Please select and copy the quote.";
    }
});

// ---------- Favorite Quotes ----------

let favorites = [];

try {
    const savedFavorites = JSON.parse(
        localStorage.getItem("favoriteQuotes") || "[]"
    );

    if (Array.isArray(savedFavorites)) {
        favorites = savedFavorites.filter(function (favorite) {
            return (
                favorite &&
                typeof favorite.text === "string" &&
                typeof favorite.author === "string" &&
                quotes.some(function (quote) {
                    return (
                        quote.text === favorite.text &&
                        quote.author === favorite.author
                    );
                })
            );
        });
    }
} catch (error) {
    favorites = [];
}

function saveFavorites() {
    
    try {
        localStorage.setItem(
            "favoriteQuotes",
            JSON.stringify(favorites)
        );
        return true;
    } catch (error) {
        message.textContent = "Unable to save favorites in this browser.";
        return false;
    }
}// Dark Mode Button
themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-theme");

    if (document.body.classList.contains("dark-theme")) {
        themeToggle.textContent = "☀️";
    } else {
        themeToggle.textContent = "🌙";
    }
});
 function updateFavoriteButton() {
    const isFavorite = favorites.some(function (item) {
        return item.text === currentQuote.text &&
               item.author === currentQuote.author;
    });

    favoriteBtn.textContent = isFavorite
        ? "♥ Favorited"
        : "♡ Add to Favorites";

}
// Display saved favorite quotes
function renderFavorites() {
    const favoritesList = document.getElementById("favoritesList");
    const favoritesEmpty = document.getElementById("favoritesEmpty");
    const clearFavoritesBtn = document.getElementById("clearFavoritesBtn");

    favoritesList.innerHTML = "";

    favorites.forEach(function (item) {
        const li = document.createElement("li");
        li.textContent = '"' + item.text + '" — ' + item.author;
        favoritesList.appendChild(li);
    });

    favoritesEmpty.hidden = favorites.length > 0;
    clearFavoritesBtn.hidden = favorites.length === 0;
}

// Display favorites when the website opens
renderFavorites();