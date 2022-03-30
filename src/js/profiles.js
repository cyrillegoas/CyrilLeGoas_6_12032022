import params from './appParams';
/**
 * Generate profiles cards from an array of list of photographers.
 * @param {object} photographers - collection of photographer information
 * @return {string} cards html for all photographers.
 */
function generatePhotographersCards(photographers) {
  const html = Object.values(photographers)
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
                  src="${params.cloudinaryBaseImg}${photographer.id}/${photographer.portrait}"
                  alt="${photographer.name}"
                />
                <img
                  class="photographer-thumb__img-clip"
                  src="./assets/utils/mask_card.svg"
                  tabindex="-1"
                ></img>
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
 * @param {object} photographers - collection of photographer information.
 */
export default function profilesInit(profilesUl, photographers) {
  const profileCardsHTML = generatePhotographersCards(photographers);
  profilesUl.innerHTML = profileCardsHTML;
}
