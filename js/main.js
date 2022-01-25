let btnToggleDarkMode = document.querySelector("#btn-toggle-dark-mode");
let btnLeaveDetails = document.querySelector("#btn-leave-details");

let inputOptionsContainer = document.querySelector("#input-options-container");
let countriesSelectionBox = document.querySelector("#countries-selection-box");
let countryDetails = document.querySelector("#country-details");
let borderCountriesContainer = document.querySelector(
  "#border-countries-container"
);

let scrolledOnY;

function loadAllCountries() {
  fetch("https://restcountries.com/v2/all")
    .then((response) => response.json())
    .then((results) => {
      // for (let i = 80; i <= 100; i++) {
      //   countriesSelectionBox.appendChild(
      //     createCountryCard(
      //       results[i].name,
      //       results[i].flag,
      //       results[i].population,
      //       results[i].region,
      //       results[i].capital
      //     )
      //   );
      // }
      console.log(results);

      results.forEach((element) => {
        countriesSelectionBox.appendChild(
          createCountryCard(
            element.name,
            element.flag,
            element.population,
            element.region,
            element.capital
          )
        );
      });
    });
}

function handleCountrySelection(event) {
  let targetCountry;

  if (countriesSelectionBox.classList.contains("display-none")) {
    // click from within a detail page
    targetCountry = event.target.textContent;
  } else {
    // click from homepage
    scrolledOnY = window.scrollY;
    targetCountry = event.target.nextElementSibling.children[0].textContent;
  }

  fetch(`https://restcountries.com/v2/name/${targetCountry}?fullText=true`)
    .then((response) => response.json())
    .then((result) => {
      setupDetailPage(result);
      if (!countriesSelectionBox.classList.contains("display-none")) {
        toggleShowDetailsPage();
      }
    });
}

function setupDetailPage(result) {
  let languages = "";
  result[0].languages.forEach((element, index) => {
    if (index != 0) {
      languages += ", ";
    }
    languages += element.name;
  });
  document.querySelector("#country-detail-flag").src = result[0].flag;
  document.querySelector("#country-detail-name").textContent =
    result[0].name != undefined ? result[0].name : "not available";
  document.querySelector("#detail-native-name").textContent =
    result[0].nativeName != undefined ? result[0].nativeName : "not available";
  document.querySelector("#detail-population").textContent =
    result[0].population != undefined
      ? result[0].population.toLocaleString("en-US")
      : "not available";
  document.querySelector("#detail-region").textContent =
    result[0].region != undefined ? result[0].region : "not available";
  document.querySelector("#detail-sub-region").textContent =
    result[0].subregion != undefined ? result[0].subregion : "not available";
  document.querySelector("#detail-capital").textContent =
    result[0].capital != undefined ? result[0].capital : "not available";
  document.querySelector("#detail-tld").textContent =
    result[0].topLevelDomain != undefined
      ? result[0].topLevelDomain[0]
      : "not available";
  document.querySelector("#detail-currency").textContent =
    result[0].currencies != undefined
      ? result[0].currencies[0].name
      : "not available";
  document.querySelector("#detail-languages").textContent = languages;

  while (borderCountriesContainer.childElementCount != 0) {
    borderCountriesContainer.removeChild(
      borderCountriesContainer.childNodes[0]
    );
  }

  if (result[0].borders != undefined) {
    let shortBorderCodesAsString = result[0].borders.toString();
    fetch(
      `https://restcountries.com/v2/alpha?codes=${shortBorderCodesAsString}`
    )
      .then((response) => response.json())
      .then((borders) => {
        borders.forEach((border) => {
          borderCountriesContainer.appendChild(
            createBorderCountry(border.name)
          );
        });
      });
  } else {
    let element = document.createElement("p");
    element.textContent = "not available";
    borderCountriesContainer.appendChild(element);
  }
}

function createCountryCard(name, flag, population, region, capital) {
  let card = createMyElement("div", "card");
  let button = createMyElement("button", "country-flag");
  button.style.backgroundImage = `url(${flag})`;
  button.addEventListener("click", handleCountrySelection);
  let countryInfoBox = createMyElement("div", "country-info-box");
  let title = createMyElement("h2", "country-name");
  title.textContent = name;
  let paragraph1 = createP_BlockWithSpans(
    "Population: ",
    population.toLocaleString("en-US")
  );
  let paragraph2 = createP_BlockWithSpans("Region: ", region);
  let paragraph3 = createP_BlockWithSpans("Capital: ", capital);

  countryInfoBox.append(title, paragraph1, paragraph2, paragraph3);
  card.append(button, countryInfoBox);
  return card;
}

function createMyElement(myElement, myClass) {
  let el = document.createElement(myElement);
  el.classList.add(myClass);
  return el;
}

function createP_BlockWithSpans(title, value) {
  let p = document.createElement("p");
  let span1 = document.createElement("span");
  span1.textContent = title;
  let span2 = document.createElement("span");
  span2.textContent = value;
  p.appendChild(span1);
  p.appendChild(span2);
  return p;
}

function createBorderCountry(name) {
  let element = document.createElement("button");
  element.classList.add("border-country");
  element.textContent = name;
  element.addEventListener("click", handleCountrySelection);
  return element;
}

function toggleShowDetailsPage() {
  inputOptionsContainer.classList.toggle("display-none");
  countriesSelectionBox.classList.toggle("display-none");
  countryDetails.classList.toggle("display-none");
  window.scrollTo(0, scrolledOnY);
}

function toggleDarkMode() {
  document.querySelector("html").classList.toggle("dark-mode");
  btnToggleDarkMode.children[0].classList.toggle("bi-moon");
  btnToggleDarkMode.children[0].classList.toggle("bi-moon-fill");
}

function init() {
  btnToggleDarkMode.addEventListener("click", toggleDarkMode);

  btnLeaveDetails.addEventListener("click", toggleShowDetailsPage);
  loadAllCountries();
}

window.onload = init();
