import { wait } from './utils';

function Gallery(gallery, photographerInfo) {
  this.gallery = gallery;
  this.cardsUnorderedList = gallery.querySelector('ul.gallery__cards');
  this.sortType = 'popularité';
  this.sortedMedia = this.sortGalleryCardsBy(
    this.sort[this.sortType],
    photographerInfo.media
  );
  this.sortedMedia.forEach((media) => {
    media.isliked = false;
  });
  this.likesCount = this.sortedMedia.reduce(
    (totalLikes, media) => totalLikes + media.likes,
    0
  );
  this.likeCounter = gallery.querySelector('.like-counter__total');
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

  this.renderGalleryCards();
  this.updateLikeCounter();

  // Event listeners
  this.cardsUnorderedList.addEventListener('click', (event) =>
    this.handleGalleryEvent(event)
  );
  this.cardsUnorderedList.addEventListener('keydown', (event) =>
    this.handleGalleryEvent(event)
  );
  lightBoxCloseButton.addEventListener('click', () => this.closeLightBox());
  this.lightBoxNextbutton.addEventListener('click', () => this.nextMedia());
  this.lightBoxPrevbutton.addEventListener('click', () => this.prevMedia());
  this.lightBox.addEventListener('keydown', (event) =>
    this.handleKeyDown(event)
  );
}

Gallery.prototype.renderGalleryCards = function () {
  const html = this.sortedMedia
    .map(
      (media) =>
        `<li class="gallery__card" data-media-id="${media.id}">
            <figure class="photo-card">
              <img
                class="photo-card__img"
                src="../../assets/medias/${media.photographerId}/${media.image}"
                alt="${media.title}, click or enter to open closeup view"
                tabindex="0"
                aria-haspopup="dialog"
              />
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

Gallery.prototype.sort = {
  popularité: (a, b) => a.likes < b.likes,
  date: (a, b) => new Date(a.date).getTime() < new Date(b.date).getTime(),
  titre: (a, b) => a.title > b.title,
};

Gallery.prototype.sortGalleryCardsBy = function (sortFn, media) {
  return media.sort(sortFn);
};

Gallery.prototype.openLightBox = async function () {
  this.lightBox.removeAttribute('hidden');
  await wait();
  this.lightBox.setAttribute('aria-hidden', 'false');
  this.focusBeforeOpenning = document.activeElement;
  this.lightBox.focus();
};

Gallery.prototype.closeLightBox = async function () {
  this.lightBox.setAttribute('aria-hidden', 'true');
  await wait(500);
  this.lightBox.setAttribute('hidden', '');
  this.focusBeforeOpenning.focus();
};

Gallery.prototype.updateLightBoxMedia = function () {
  const media = this.sortedMedia[this.currentMediaIndex];
  const lightBoxContent = this.gallery.querySelector('.lightbox-modal__img');
  const lightBoxTitle = this.gallery.querySelector('.lightbox-modal__title');

  lightBoxContent.src = `../../assets/medias/${media.photographerId}/${media.image}`;
  lightBoxContent.alt = `${media.title}`;
  lightBoxTitle.textContent = `${media.title}`;
};

Gallery.prototype.handleGalleryEvent = function (event) {
  if (
    (event.type === 'keydown' && event.key === 'Enter') ||
    event.type === 'click'
  ) {
    const el = event.target;
    if (el.classList.contains('photo-card__img')) {
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

Gallery.prototype.nextMedia = function () {
  if (++this.currentMediaIndex >= this.sortedMedia.length)
    this.currentMediaIndex = 0;
  this.updateLightBoxMedia();
};

Gallery.prototype.prevMedia = function () {
  if (--this.currentMediaIndex <= 0)
    this.currentMediaIndex = this.sortedMedia.length - 1;
  this.updateLightBoxMedia();
};

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

Gallery.prototype.updateLikeCounter = function () {
  this.likeCounter.textContent = this.likesCount;
};

export default function galleryInit(gallerySection, photographerInfo) {
  const gallery = new Gallery(gallerySection, photographerInfo);
}
