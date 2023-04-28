import axios from "axios";


// performs 1 API call before storing the result in countriesPromise
async function buildLocalCache() {
    try {
        return (await axios.get('https://restcountries.com/v3.1/all')).data;

    } catch (e) {
        console.log(e);
    }
}


async function fetchCountry(requestedCountry) {
    // receives the promise from the cache
    const countryArray = await countriesPromise
    // loops through seeking out the requested country and returns its object
    const fetchedArray = countryArray
        // filters for the requested country
        .filter(countryArray =>  countryArray.name.common === requestedCountry)
        // maps the found results to a new array
        .map(fetchedCountry => fetchedCountry)
    return fetchedArray[0]
}


async function fetchCurrencies(fetchedCountry) {
    // grabs currency object and the name out of the country object
    const { currencies } = await fetchedCountry
    // empty list to push results too
    const currencyArray = []
    // // Try block to catch countries that don't have a currency
    try {
        // Iterates over the currency key extracting all key values from the objects inside before
        // iterating over the objects inside using extracted keys. pushing the first value in each array.
        Object.keys(currencies).forEach((key) => currencyArray.push(Object.values(currencies[key])[0]))
        return currencyArray
        // }
    } catch (e) {
        // catches the countries without currencies returns null
        return null
    }
}


async function fetchSubRegion(fetchedCountry) {
    const { subregion } = await fetchedCountry
    // if subregion not undefined returns subregion
    if (subregion) {
        return subregion
        // returns no subregion message if subregion undefined
    } else {
        return null
    }
}


async function fetchCapitals(fetchedCountry) {
    const { capital: capitalArray }= await fetchedCountry
    // if capital not undefined returns capitals
    if (capitalArray) {
        return capitalArray
        // returns no capital message if capitalArray undefined
    } else {

        return null
    }
}


async function fetchLanguages(fetchedCountry) {
    const { languages }= await fetchedCountry
    // returns all languages
    try {
        return Object.values(languages)
    } catch (e) {
        // returns null if no official languages
        return null
    }
}


async function constructSearchResult(fetchedCountry) {

    // primes output location
    const outputField = document.getElementById('search-result');
    // removes the previous print backs
    outputField.innerHTML = ''
    errorField.innerHTML = ''

    try {
        // fetches all the required data
        const {region, population, flags: {png: flagPNG, alt}, name: {common: commonName}} = await fetchedCountry;
        const currencyArray = await fetchCurrencies(fetchedCountry);
        const subRegion = await fetchSubRegion(fetchedCountry);
        const capitalArray = await fetchCapitals(fetchedCountry);
        const languageArray = await fetchLanguages(fetchedCountry);

        // creates the elements for printing on page
        const searchResult = document.createElement('div');
        const flag = document.createElement('img');
        const flagTitleWrapper = document.createElement('div');
        const flagWrapper = document.createElement('div');
        const countryTitle = document.createElement('h2');
        const pTagOne = document.createElement('p');
        const pTagTwo = document.createElement('p');
        const languageTag = document.createElement('p');

        // ensures the capitals are printed back correctly
        // if it has no official results it has null
        if (subRegion === null) {
            pTagOne.innerText =
                `${commonName} is situated in (the) ${region} and has no subregion. it has a population of ${population} people.`
        } else {
            pTagOne.innerText =
                `${commonName} is situated in ${subRegion}. it has a population of ${population} people.`
        }

        // adding the data to the elements
        countryTitle.innerText = commonName
        // sets the image
        flag.setAttribute('src', flagPNG)
        flag.setAttribute('alt', alt)

        // ensures the capitals are printed back correctly
        // if it has no official results it has null
        if (capitalArray === null) {
            pTagTwo.innerText = `${commonName} has no official capital.`
            // if more than 1 capital it correctly joins them and changes the wording
        } else if (capitalArray.length > 1) {
            pTagTwo.innerText = `The capitals are ${capitalArray.slice(0, -1).join(', ')} and ${capitalArray.slice(-1)}.`
        } else {
            pTagTwo.innerText = `The capital is ${capitalArray[0]}.`
        }

        // ensures currency is printed back correctly
        // if it has no official results it has null
        if (currencyArray === null) {
            pTagTwo.innerText += ` and has no official currency.`;
        } else if (currencyArray.length > 1) {
            // if more than 1 currency joins them correctly
            pTagTwo.innerText +=
                ` and you can pay with the ${currencyArray.slice(0, -1).join(', ')} and the ${currencyArray.slice(-1)}.`
        } else {
            pTagTwo.innerText += ` and you can pay with the ${currencyArray[0]}.`;
        }

        if (languageArray === null) {
            languageTag.innerText = `they have no official language.`
            // if more than 1 capital it correctly joins them and changes the wording
        } else if (languageArray.length > 1) {
            languageTag.innerText = `They speak ${languageArray.slice(0, -1).join(', ')} and ${languageArray.slice(-1)}.`
        } else {
            languageTag.innerText = `They speak ${languageArray[0]}.`
        }


        // adds classes to elements
        searchResult.setAttribute('class', 'search-result');
        flag.setAttribute('class', 'flag');
        flagWrapper.setAttribute('class', 'flag-wrapper');
        countryTitle.setAttribute('class', 'country-title');
        pTagOne.setAttribute('class', 'region-p');
        pTagTwo.setAttribute('class', 'capital-p');
        languageTag.setAttribute('class', 'language-p');

        // constructs the final result element and adds it to the page
        // adds flag to the inside the flag wrapper
        flagWrapper.appendChild(flag);
        // adds the title and flag to their div
        flagTitleWrapper.appendChild(flagWrapper);
        flagTitleWrapper.appendChild(countryTitle);
        // adds all other elements inside the result div
        searchResult.appendChild(flagTitleWrapper);
        searchResult.appendChild(pTagOne);
        searchResult.appendChild(pTagTwo);
        searchResult.appendChild(languageTag);
        // outputs the result div on the page
        outputField.appendChild(searchResult);
    }

    catch (e) {
        console.log(e)
        // clears the previous result
        outputField.innerHTML = ''
        // sends back an error
        errorField.innerText = 'No country found, Try capitalizing!'
    }
}


// makes a single api call storing the returned promise in a variable
const countriesPromise = buildLocalCache()
// eventListener for the search field
const searchField = document.getElementById('search-field')
const searchForm = document.getElementById('search-form')
const errorField = document.getElementById('error-field')

// event listener that handles the search
searchForm.addEventListener('submit', (e) => {
    // finds the country in the data set
    const fetchedCountry = fetchCountry(searchField.value)
    // hands the found country off to have a tile constructed
    void constructSearchResult(fetchedCountry)
    // prevents refresh on submit
    e.preventDefault()
});
