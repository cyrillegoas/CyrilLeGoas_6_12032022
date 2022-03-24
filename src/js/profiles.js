import { fetchJson } from './utils';

const dataPath = '../../assets/data/photographer.json';

/**
 * Generate profiles cards from an array of list of photographers.
 * @param {Array<object>} photographers - list of photographers with their name / id / location / picture...
 * @return {string} cards html for all photographers.
 */
function generatePhotographersCards(photographers) {
  const html = photographers
    .map(
      (photographer) =>
        `<li class="profiles__card">
          <figure class="photographer-card">
            <a
              class="photographer-card__link"
              href="./src/pages/photographer.html?id=${photographer.id}"
              aria-label="link to ${photographer.name}'s photos gallery"
            >
              <div class="photographer-thumb">
                <img
                  class="photographer-thumb__img"
                  src="./assets/medias/${photographer.id}/${photographer.portrait}"
                  alt="${photographer.name}"
                />
                <object
                  class="photographer-thumb__img-clip"
                  data="./assets/utils/mask_card.svg"
                  type="image/svg+xml"
                  tabindex="-1"
                ></object>
              </div>
              <figcaption>
                <h2 class="photographer-card__name">${photographer.name}</h2>
              </figcaption>
            </a>
            <p class="photographer-card__description">
              <span class="photographer-card__location">${photographer.city}, ${photographer.country}</span>
              <span class="photographer-card__quote">${photographer.tagline}</span>
              <span class="photographer-card__rate">${photographer.price}€/jour</span>
            </p>
          </figure>
        </li>`
    )
    .join('');
  return html;
}

/**
 * Fill an unordered list with photographers cards.
 * @param {object} profilesUl - unordered list where photographers cards are added.
 */
export default async function profilesInit(profilesUl) {
  const { photographers } = await fetchJson(dataPath);
  const profileCardsHTML = generatePhotographersCards(photographers);
  profilesUl.innerHTML = profileCardsHTML;
}
