let btnToggleDarkMode = document.querySelector("#btn-toggle-dark-mode");
let btnLeaveDetails = document.querySelector("#btn-leave-details");

// let btnRegionSelectorTitle = document.getElementById("region-selector-title");
// let btnsRegionSelectorMenu = document.getElementsByClassName("btn-selection");

let btnRegionSelectorTitle = document.querySelector("#region-selector-title");
let btnsRegionSelectorMenu = document.querySelectorAll(".btn-selection");

let regionSelectorMenuBox = document.querySelector("#region-selector-menu");

let inputFieldCountry = document.querySelector("#input-field-country");
let inputOptionsContainer = document.querySelector("#input-options-container");
let countriesSelectionBox = document.querySelector("#countries-selection-box");
let countryDetails = document.querySelector("#country-details");
let borderCountriesContainer = document.querySelector(
  "#border-countries-container"
);

let allCountriesLoadedArray = [];
let scrolledOnY;
let regionSelected = "none";

function loadAllCountries() {
  fetch("https://restcountries.com/v2/all")
    .then((response) => response.json())
    .then((results) => {
      for (let i = 80; i <= 100; i++) {
        countriesSelectionBox.appendChild(
          createCountryCard(
            results[i].name,
            results[i].flag,
            results[i].population,
            results[i].region,
            results[i].capital
          )
        );
      }

      allCountriesLoadedArray = [...results];

      // results.forEach((element) => {
      //   countriesSelectionBox.appendChild(
      //     createCountryCard(
      //       element.name,
      //       element.flag,
      //       element.population,
      //       element.region,
      //       element.capital
      //     )
      //   );
      // });
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

  allCountriesLoadedArray.forEach((country, index) => {
    if (country.name == targetCountry) {
      setupDetailPage(allCountriesLoadedArray[index]);
      if (!countriesSelectionBox.classList.contains("display-none")) {
        toggleShowDetailsPage();
      }
    }
  });

  // fetch(`https://restcountries.com/v2/name/${targetCountry}?fullText=true`)
  //   .then((response) => response.json())
  //   .then((result) => {
  //     setupDetailPage(result);
  //     if (!countriesSelectionBox.classList.contains("display-none")) {
  //       toggleShowDetailsPage();
  //     }
  //   });
}

function setupDetailPage(result) {
  let languages = "";
  result.languages.forEach((element, index) => {
    if (index != 0) {
      languages += ", ";
    }
    languages += element.name;
  });
  document.querySelector("#country-detail-flag").src = result.flag;
  document.querySelector("#country-detail-name").textContent =
    result.name != undefined ? result.name : "not available";
  document.querySelector("#detail-native-name").textContent =
    result.nativeName != undefined ? result.nativeName : "not available";
  document.querySelector("#detail-population").textContent =
    result.population != undefined
      ? result.population.toLocaleString("en-US")
      : "not available";
  document.querySelector("#detail-region").textContent =
    result.region != undefined ? result.region : "not available";
  document.querySelector("#detail-sub-region").textContent =
    result.subregion != undefined ? result.subregion : "not available";
  document.querySelector("#detail-capital").textContent =
    result.capital != undefined ? result.capital : "not available";
  document.querySelector("#detail-tld").textContent =
    result.topLevelDomain != undefined
      ? result.topLevelDomain
      : "not available";
  document.querySelector("#detail-currency").textContent =
    result.currencies != undefined
      ? result.currencies[0].name
      : "not available";
  document.querySelector("#detail-languages").textContent = languages;

  removeChildElementsFromBox(borderCountriesContainer);

  if (result.borders != undefined) {
    allCountriesLoadedArray.forEach((country) => {
      result.borders.forEach((border) => {
        if (border == country.alpha3Code) {
          borderCountriesContainer.appendChild(
            createBorderCountry(country.name)
          );
        }
      });
    });
  } else {
    let element = document.createElement("p");
    element.textContent = "not available";
    borderCountriesContainer.appendChild(element);
  }
}

function removeChildElementsFromBox(box) {
  while (box.childElementCount != 0) {
    box.removeChild(box.childNodes[0]);
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

function handleSelectionTitleClick(event) {
  document.querySelector("#region-selector-menu").classList.toggle("open");
}

function handleSelectionMenuClick(event) {
  let regionFilterArray = ["Africa", "America", "Asia", "Europe", "Oceania"];

  if (regionSelected == event.target.value) {
    btnRegionSelectorTitle.textContent = "Filter by Region";
    btnsRegionSelectorMenu.forEach((button, index) => {
      button.textContent = regionFilterArray[index];
    });
    regionSelected = "none";
  } else {
    regionSelected = event.target.value;
    btnsRegionSelectorMenu.forEach((button, index) => {
      button.textContent = regionFilterArray[index];
    });
    btnRegionSelectorTitle.textContent = regionSelected;
    btnsRegionSelectorMenu.forEach((button) => {
      if (button.value == regionSelected) {
        button.textContent = "Remove Region";
      }
    });
  }

  if (regionSelected == "none") {
    setupFilteredView(allCountriesLoadedArray);
  } else {
    let filteredArray = allCountriesLoadedArray.filter((country) => {
      if (country.region == regionSelected) {
        return country;
      }
    });
    setupFilteredView(filteredArray);
  }

  document.querySelector("#region-selector-menu").classList.toggle("open");
}

function setupFilteredView(filteredArray) {
  removeChildElementsFromBox(countriesSelectionBox);

  filteredArray.forEach((country) => {
    countriesSelectionBox.appendChild(
      createCountryCard(
        country.name,
        country.flag,
        country.population,
        country.region,
        country.capital
      )
    );
  });
}

function handleInputField() {

  let inputValue = inputFieldCountry.value;
  let filteredArray = [];

  for (let i = 0; i < allCountriesLoadedArray.length; i++) {
    if (
      allCountriesLoadedArray[i].name
        .substr(0, inputValue.length)
        .toUpperCase() == inputValue.toUpperCase()
    ) {


      filteredArray.push(allCountriesLoadedArray[i]);
    }
  }
  setupFilteredView(filteredArray);
}

function init() {
  inputFieldCountry.addEventListener("input", handleInputField);
  btnToggleDarkMode.addEventListener("click", toggleDarkMode);
  btnLeaveDetails.addEventListener("click", toggleShowDetailsPage);
  btnRegionSelectorTitle.addEventListener("click", handleSelectionTitleClick);
  btnsRegionSelectorMenu.forEach((button) => {
    button.addEventListener("click", handleSelectionMenuClick);
  });

  loadAllCountries();
}

window.onload = init();
