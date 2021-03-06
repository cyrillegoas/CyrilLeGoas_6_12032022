import { wait } from './utils';
import params from './appParams';

/**
 * Generate photographer info panel html.
 * @param {object} photographerInfo - photographer info for the current page.
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
        src="${params.cloudinaryBaseImg}${photographerInfo.id}/${photographerInfo.portrait}"
        alt="${photographerInfo.name}"
      />
      <img
        class="photographer-thumb__img-clip"
        src="../../assets/utils/mask_card-grey.svg"
        tabindex="-1"
      ></img>
    </div>`;
}

/**
 * Constructor function for contact modal
 * @param {object} modal - modal's container element.
 * @param {object} photographerInfo - photographer info for the current page
 */
function ContactModal(modal, photographerInfo) {
  if (!(modal instanceof Element)) {
    throw new Error('No modal found!');
  }
  this.modal = modal;
  const modalTitle = modal.querySelector('.contact-modal__title');
  this.closeModalButton = modal.querySelector('button.contact-modal__close');
  this.submitButton = modal.querySelector('button[aria-label="send message"]');
  this.form = modal.querySelector('form.contact-modal__form');

  modalTitle.innerHTML = `Contactez-moi<br />${photographerInfo.name}`;

  // Event listener
  modal.addEventListener('click', (event) => this.handleClickOutside(event));
  this.closeModalButton.addEventListener('click', () => this.closeModal());
  this.form.addEventListener('submit', (event) => this.submitForm(event));
  modal.addEventListener('keydown', (event) => this.handleKeyDown(event));
}

ContactModal.prototype.openModal = async function () {
  this.modal.removeAttribute('hidden');
  await wait();
  this.modal.setAttribute('aria-hidden', 'false');
  this.focusBeforeOpenning = document.activeElement;
  this.modal.focus();
};

ContactModal.prototype.closeModal = async function () {
  this.modal.setAttribute('aria-hidden', 'true');
  await wait(500);
  this.modal.setAttribute('hidden', '');
  this.focusBeforeOpenning.focus();
};

ContactModal.prototype.handleClickOutside = function (event) {
  if (event.currentTarget === event.target) this.closeModal();
};

ContactModal.prototype.handleKeyDown = function (event) {
  switch (event.key) {
    case 'Tab':
      if (event.shiftKey && document.activeElement === this.closeModalButton) {
        event.preventDefault();
        this.submitButton.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === this.submitButton
      ) {
        event.preventDefault();
        this.closeModalButton.focus();
      }
      break;
    case 'Escape':
      this.closeModal();
      break;
    default:
      break;
  }
};

/**
 * console log the user's inputs.
 * @param {object} event - submit event.
 */
ContactModal.prototype.submitForm = function (event) {
  event.preventDefault();
  const inputs = this.modal.querySelectorAll('input');
  const message = this.modal.querySelector('.contact-modal__message');
  Array.from(inputs).forEach((input) => {
    console.log(`${input.name}: ${input.value}`);
  });
  console.log(`${message.name}: ${message.value}`);
  this.closeModal();
};

/**
 * Fill the photographer information panel.
 * @param {object} infoSection - photographer info section element.
 * @param {object} photographerInfo - photographer info for the current page.
 */
export default function infoPanelInit(infoSection, photographerInfo) {
  const infoPanelHTML = generateInfoPanel(photographerInfo);
  infoSection.insertAdjacentHTML('afterbegin', infoPanelHTML);
  const openModalButton = document.querySelector(
    'button[aria-label="contact me"]'
  );
  const modal = new ContactModal(
    document.querySelector('.contact-modal'),
    photographerInfo
  );
  openModalButton.addEventListener('click', () => modal.openModal());
}
