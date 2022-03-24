import params from './appParams';
import { fetchJson } from './utils';

/**
 * Generate photographer info panel html.
 * @param {object} photographerInfo - photographer info name / id / location / picture...
 * @return {string} info panel html.
 */
function generateInfoPanel(photographerInfo) {
  return `
    <div class="photographer-info__description">
      <h1 class="photographer-info__name">${photographerInfo.name}</h1>
      <span class="photographer-info__location">${photographerInfo.city}, ${photographerInfo.country}</span>
      <span class="photographer-info__quote">${photographerInfo.tagline}</span>
    </div>
    <div class="photographer-info__btn-wrapper">
      <button class="btn" aria-haspopup="dialog" aria-label="contact me">Contactez-moi</button>
    </div>
    <div class="photographer-thumb">
      <img 
        class="photographer-thumb__img"
        src="../../assets/medias/${photographerInfo.id}/${photographerInfo.portrait}"
        alt="${photographerInfo.name}"
      />
      <object
        class="photographer-thumb__img-clip"
        data="../../assets/utils/mask_card-grey.svg"
        type="image/svg+xml"
        tabindex="-1"
      ></object>
    </div>`;
}

/**
 * Fill the photographer information panel.
 * @param {object} infoSection - photographer info section element.
 */
export default async function infoInit(infoSection) {
  const { photographers } = await fetchJson(params.dataPath);
  const UrlParams = new URL(document.location).searchParams;
  const photographerId = +UrlParams.get('id');
  const photographerInfo = photographers.find(
    (photographer) => photographer.id === photographerId
  );
  const infoPanelHTML = generateInfoPanel(photographerInfo);
  infoSection.insertAdjacentHTML('afterbegin', infoPanelHTML);
}
