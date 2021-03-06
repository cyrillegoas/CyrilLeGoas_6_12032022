import { wait } from './utils';
import params from './appParams';

function Gallery(gallery, photographerInfo) {
  // GALLERY
  this.gallery = gallery;
  this.cardsUnorderedList = gallery.querySelector('ul.gallery__cards');
  this.sortedMedia = photographerInfo.media;
  this.sortGalleryCardsBy();
  this.sortedMedia.forEach((media) => {
    media.isliked = false;
  });
  this.hourlyRate = photographerInfo.price;

  // LIKES
  this.likesCount = this.sortedMedia.reduce(
    (totalLikes, media) => totalLikes + media.likes,
    0
  );
  this.likeCounter = gallery.querySelector('.like-counter__total');

  // LIGHTBOX
  this.lightBox = gallery.querySelector('.lightbox-modal');
  const lightBoxCloseButton = gallery.querySelector(
    'button.lightbox-modal__close-btn'
  );
  this.lightBoxNextbutton = gallery.querySelector(
    'button.lightbox-modal__next-btn'
  );
  this.lightBoxPrevbutton = gallery.querySelector(
    'button.lightbox-modal__prev-btn'
  );

  // FILTER
  this.filter = gallery.querySelector('.filter');
  const filterbutton = this.filter.querySelector('.filter__btn');
  this.filterListBox = this.filter.querySelector('[role="listbox"]');
  this.listBoxOptions = Array.from(this.filterListBox.querySelectorAll('li'));
  this.selectedOptionIndex = 0;

  this.renderGalleryCards();
  this.updateLikeCounter();
  this.updateRate();

  // Event listeners
  // GALLERY
  this.cardsUnorderedList.addEventListener('click', (event) =>
    this.handleGalleryEvent(event)
  );
  this.cardsUnorderedList.addEventListener('keydown', (event) =>
    this.handleGalleryEvent(event)
  );

  // LIGHTBOX
  lightBoxCloseButton.addEventListener('click', () => this.closeLightBox());
  this.lightBoxNextbutton.addEventListener('click', () => this.nextMedia());
  this.lightBoxPrevbutton.addEventListener('click', () => this.prevMedia());
  this.lightBox.addEventListener('keydown', (event) =>
    this.handleKeyDown(event)
  );

  // FILTER
  filterbutton.addEventListener('click', () => this.toggleFilterListBox());
  this.filterListBox.addEventListener('click', (event) =>
    this.getClickedOption(event)
  );
  this.filterListBox.addEventListener('focus', () => {
    this.setActiveDescendant();
    this.setOptionfocus();
  });
  this.filterListBox.addEventListener('keydown', (event) =>
    this.filterKeyDown(event)
  );
}

/**
 * Add cards to the gallery for each entries of the media array
 */
Gallery.prototype.renderGalleryCards = function () {
  const html = this.sortedMedia
    .map(
      (media) =>
        `<li class="gallery__card" data-media-id="${media.id}">
            <figure class="photo-card">
              ${
                media.image
                  ? `<img
                    class="photo-card__img"
                    src="${params.cloudinaryBaseImg}${media.photographerId}/${media.image}"
                    alt="${media.title}, click or enter to open closeup view"
                    tabindex="0"
                    aria-haspopup="dialog"
                  />`
                  : `<video class="photo-card__video" tabindex="0" aria-haspopup="dialog">
                      <source src="${params.cloudinaryBaseVideo}${media.photographerId}/${media.video}" type="video/mp4" />
                    </video>`
              }
              <figcaption class="photo-card__description">
                <span class="photo-card__name">${media.title}</span>
                <div class="photo-card__likes">
                  <span class="photo-card__likes-count">${media.likes}</span>
                  <img
                    class="photo-card__likes-icon ${
                      media.isliked ? 'photo-card__likes-icon--liked' : null
                    }"
                    src="../../assets/utils/heart.svg"
                    alt="likes"
                    tabindex="0"
                  />
                </div>
              </figcaption>
            </figure>
          </li>`
    )
    .join('');
  this.cardsUnorderedList.innerHTML = html;
};

/**
 * Collection of compare functions
 */
Gallery.prototype.compareFn = {
  popularit??: (a, b) => b.likes - a.likes,
  date: (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  titre: (a, b) => (a.title > b.title ? 1 : b.title > a.title ? -1 : 0),
};

/**
 * Sorts the medias (mutate photographerInfo)
 * @param {function} sortFn - compare function used to sort the array.
 */
Gallery.prototype.sortGalleryCardsBy = function (
  sortFn = this.compareFn.popularit??
) {
  this.sortedMedia.sort(sortFn);
};

/**
 * Opens lightbox modal
 */
Gallery.prototype.openLightBox = async function () {
  this.lightBox.removeAttribute('hidden');
  await wait();
  this.lightBox.setAttribute('aria-hidden', 'false');
  this.focusBeforeOpenning = document.activeElement;
  this.lightBox.focus();
};

/**
 * Closes lightbox modal
 */
Gallery.prototype.closeLightBox = async function () {
  this.lightBox.setAttribute('aria-hidden', 'true');
  await wait(500);
  this.lightBox.setAttribute('hidden', '');
  this.focusBeforeOpenning.focus();
};

/**
 * Updates the displayed media
 */
Gallery.prototype.updateLightBoxMedia = function () {
  const media = this.sortedMedia[this.currentMediaIndex];
  const lightBoxContentWrapper = this.gallery.querySelector(
    '.lightbox-modal__content-wrapper'
  );
  const lightBoxTitle = this.gallery.querySelector('.lightbox-modal__title');

  lightBoxContentWrapper.innerHTML = `${
    media.image
      ? `<img
      class="lightbox-modal__img"
      src="${params.cloudinaryBaseImg}${media.photographerId}/${media.image}"
      alt="${media.title}" />`
      : `<video
          class="lightbox-modal__video"
          controls
        >
          <source src="${params.cloudinaryBaseVideo}${media.photographerId}/${media.video}"  type="video/mp4"/>
        </video>`
  }`;

  lightBoxTitle.textContent = `${media.title}`;
  this.lightBox.focus();
};

/**
 * Checks if the user clicked on the like icon or want to open the lightbox
 * @param {object} event - click or keydown event.
 */
Gallery.prototype.handleGalleryEvent = function (event) {
  if (
    (event.type === 'keydown' && event.key === 'Enter') ||
    event.type === 'click'
  ) {
    const el = event.target;
    if (
      el.classList.contains('photo-card__img') ||
      el.classList.contains('photo-card__video')
    ) {
      const { mediaId } = el.closest('.gallery__card').dataset;
      this.currentMediaIndex = this.sortedMedia.findIndex(
        (media) => media.id === +mediaId
      );
      this.updateLightBoxMedia();
      this.openLightBox();
    } else if (el.classList.contains('photo-card__likes-icon')) {
      this.updateCardLikes(el.parentElement);
    }
  }
};

/**
 * Updates the card like count
 */
Gallery.prototype.updateCardLikes = function (likeCounter) {
  const { mediaId } = likeCounter.closest('.gallery__card').dataset;
  const media = this.sortedMedia.find((media) => media.id === +mediaId);
  const count = likeCounter.firstElementChild;
  const icon = likeCounter.lastElementChild;
  if (icon.classList.contains('photo-card__likes-icon--liked')) {
    media.likes -= 1;
    this.likesCount -= 1;
  } else {
    media.likes += 1;
    this.likesCount += 1;
  }
  media.isliked = !media.isliked;
  icon.classList.toggle('photo-card__likes-icon--liked');
  count.textContent = media.likes;
  this.updateLikeCounter();
};

/**
 * Updates the displayed media in the lightbox by the next one in the array
 */
Gallery.prototype.nextMedia = function () {
  if (++this.currentMediaIndex >= this.sortedMedia.length)
    this.currentMediaIndex = 0;
  this.updateLightBoxMedia();
};

/**
 * Updates the displayed media in the lightbx by the previous one in the array
 */
Gallery.prototype.prevMedia = function () {
  if (--this.currentMediaIndex < 0)
    this.currentMediaIndex = this.sortedMedia.length - 1;
  this.updateLightBoxMedia();
};

/**
 * Keyboard control of the lightbox
 */
Gallery.prototype.handleKeyDown = function (event) {
  switch (event.key) {
    case 'Escape':
      this.closeLightBox();
      break;
    case 'ArrowLeft':
      this.prevMedia();
      break;
    case 'ArrowRight':
      this.nextMedia();
      break;
    case 'Tab':
      if (
        event.shiftKey &&
        document.activeElement === this.lightBoxPrevbutton
      ) {
        event.preventDefault();
        this.lightBoxNextbutton.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === this.lightBoxNextbutton
      ) {
        event.preventDefault();
        this.lightBoxPrevbutton.focus();
      }
      break;
    default:
      break;
  }
};

/**
 * Updates the gallery total likes
 */
Gallery.prototype.updateLikeCounter = function () {
  this.likeCounter.textContent = this.likesCount;
};

/**
 * Updates photographer hourly rate
 */
Gallery.prototype.updateRate = function () {
  this.gallery.querySelector(
    '.like-counter__rate'
  ).textContent = `${this.hourlyRate}??? / jour`;
};

/**
 * Open or close the "sort by" select options
 */
Gallery.prototype.toggleFilterListBox = async function () {
  const filterSelect = this.filter.querySelector('.filter__select');
  if (this.filterListBox.hasAttribute('hidden')) {
    this.filterListBox.removeAttribute('hidden');
    await wait();
    filterSelect.classList.add('filter__select--open');
    this.filterListBox.focus();
  } else {
    this.clearAllFocusDesc();
    filterSelect.classList.remove('filter__select--open');
    await wait(300);
    this.filterListBox.setAttribute('hidden', '');
  }
};

/**
 * Captures which option from the list was clicked
 */
Gallery.prototype.getClickedOption = function (event) {
  if (event.target !== event.currentTarget) {
    const clikedOption = event.target;
    this.selectedOptionIndex = this.listBoxOptions.findIndex(
      (option) => option === clikedOption
    );
    this.setOption();
  }
};

/**
 * Sorts the medias depending on the selected option
 */
Gallery.prototype.setOption = function () {
  const option = this.listBoxOptions[this.selectedOptionIndex];
  const buttonText = this.filter.querySelector('.filter__control-wrapper');
  this.sortGalleryCardsBy(this.compareFn[option.id]);
  buttonText.firstChild.textContent = option.innerText;
  this.toggleFilterListBox();
  this.renderGalleryCards();
};

/**
 * Sets listbox active descendant
 */
Gallery.prototype.setActiveDescendant = function () {
  const option = this.listBoxOptions[this.selectedOptionIndex];
  this.filterListBox.setAttribute('aria-activedescendant', option.id);
};

/**
 * Removes listbox active descendant
 */
Gallery.prototype.removeActiveDescendant = function () {
  this.filterListBox.removeAttribute('aria-activedescendant');
};

/**
 * Adds the focus class on the selected option
 */
Gallery.prototype.setOptionfocus = function () {
  const option = this.listBoxOptions[this.selectedOptionIndex];
  option.classList.add('filter__option-wrapper--focus');
};

/**
 * Removes the focus class
 */
Gallery.prototype.removeOptionfocus = function () {
  const option = this.listBoxOptions[this.selectedOptionIndex];
  option.classList.remove('filter__option-wrapper--focus');
};

/**
 * Removes the focus class from each option of the list and reset the active descendant
 */
Gallery.prototype.clearAllFocusDesc = function () {
  this.listBoxOptions.forEach((option) => {
    option.classList.remove('filter__option-wrapper--focus');
  });
  this.removeActiveDescendant();
};

/**
 * Keyboard controls of the select listbox
 */
Gallery.prototype.filterKeyDown = function (event) {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      if (this.selectedOptionIndex < this.listBoxOptions.length - 1) {
        this.removeOptionfocus();
        this.selectedOptionIndex += 1;
        this.setActiveDescendant();
        this.setOptionfocus();
      }
      break;
    case 'ArrowUp':
      event.preventDefault();
      if (this.selectedOptionIndex > 0) {
        this.removeOptionfocus();
        this.selectedOptionIndex -= 1;
        this.setActiveDescendant();
        this.setOptionfocus();
      }
      break;
    case 'Enter':
    case ' ':
      event.preventDefault();
      this.setOption();
      break;
    case 'Escape':
      this.toggleFilterListBox();
      break;
    default:
      break;
  }
};

export default function galleryInit(gallerySection, photographerInfo) {
  const gallery = new Gallery(gallerySection, photographerInfo);
}
