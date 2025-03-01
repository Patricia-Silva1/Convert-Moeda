const convertButton = document.getElementById("convert-button");
const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const inputCurrency = document.getElementById("input-currency");
const currencyValueToConvert = document.getElementById("currency-value-to-convert");
const currencyValueConverted = document.getElementById("currency-value");
const fromCurrencyName = document.getElementById("converted-from-name");
const fromCurrencyImage = document.getElementById("converted-from-img");
const toCurrencyName = document.getElementById("converted-to-name");
const toCurrencyImage = document.getElementById("converted-to-img");

// Objeto de moedas e bandeiras
const currencyData = {
    BRL: { name: "Real Brasileiro", img: "assets/real.png", symbol: "R$" },
    USD: { name: "Dólar Americano", img: "assets/dolar.png", symbol: "US$" },
    EUR: { name: "Euro", img: "assets/euro.png", symbol: "€" },
    GBP: { name: "Libra Esterlina", img: "assets/logo-libra.png", symbol: "£" },
    BTC: { name: "Bitcoin", img: "assets/cryto-bitcoin.png", symbol: "₿" },
    CHF : { name: "Franco Suíço", img: "assets/chf.static.svg", symbol: "CHF" }
    
};

async function fetchExchangeRates(baseCurrency) {
    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
        if (!response.ok) throw new Error("Erro ao buscar taxas de câmbio");
        const data = await response.json();
        return data.rates;
    } catch (error) {
        console.error("Erro na API de câmbio:", error);
        return null;
    }
}

async function convertValues() {
    if (fromCurrency.value === toCurrency.value) {
        inputCurrency.value = "";
        inputCurrency.setAttribute("disabled", true);
        currencyValueToConvert.innerHTML = "";
        currencyValueConverted.innerHTML = "";
        return;
    } else {
        inputCurrency.removeAttribute("disabled");
    }

    const inputValue = parseFloat(inputCurrency.value);
    if (isNaN(inputValue) || inputValue <= 0) {
        currencyValueToConvert.innerHTML = "";
        currencyValueConverted.innerHTML = "";
        return;
    }

    const rates = await fetchExchangeRates(fromCurrency.value);
    if (!rates) return;

    let conversionRate = rates[toCurrency.value];
    if (!conversionRate) {
        console.error("Taxa de conversão não encontrada para:", toCurrency.value);
        return;
    }

    // Exibir valores convertidos
    currencyValueToConvert.innerHTML = `${currencyData[fromCurrency.value].symbol} ${inputValue.toFixed(2)}`;
    currencyValueConverted.innerHTML = `${currencyData[toCurrency.value].symbol} ${(inputValue * conversionRate).toFixed(2)}`;
}

function updateCurrencyUI() {
    const fromData = currencyData[fromCurrency.value];
    const toData = currencyData[toCurrency.value];

    if (fromData) {
        fromCurrencyName.innerHTML = fromData.name;
        fromCurrencyImage.src = fromData.img;
    }
    if (toData) {
        toCurrencyName.innerHTML = toData.name;
        toCurrencyImage.src = toData.img;
    }
    
    // Chama a conversão se o valor de entrada não estiver vazio
    if (inputCurrency.value) {
        convertValues();
    }
}

// Eventos
fromCurrency.addEventListener("change", updateCurrencyUI);
toCurrency.addEventListener("change", updateCurrencyUI);
inputCurrency.addEventListener("input", convertValues);
convertButton.addEventListener("click", convertValues);
document.addEventListener("DOMContentLoaded", updateCurrencyUI);