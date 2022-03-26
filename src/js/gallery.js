import { wait } from './utils';

function Gallery(gallery, photographerInfo) {
  this.gallery = gallery;
  this.cardsUnorderedList = gallery.querySelector('ul.gallery__cards');
  this.sortType = 'popularité';
  this.media = photographerInfo.media;
  this.sortedMedia = this.sortGalleryCardsBy(
    this.sort[this.sortType],
    this.media
  );
  this.lightBox = gallery.querySelector('.lightbox-modal');
  const lightBoxCloseButton = gallery.querySelector(
    'button.lightbox-modal__close-btn'
  );
  const lightBoxNextbutton = gallery.querySelector(
    'button.lightbox-modal__next-btn'
  );
  const lightBoxPrevbutton = gallery.querySelector(
    'button.lightbox-modal__prev-btn'
  );

  this.renderGalleryCards();

  // Event listeners
  this.cardsUnorderedList.addEventListener('click', (event) =>
    this.handleGalleryEvent(event)
  );
  lightBoxCloseButton.addEventListener('click', () => this.closeLightBox());
  lightBoxNextbutton.addEventListener('click', () => this.nextMedia());
  lightBoxPrevbutton.addEventListener('click', () => this.prevMedia());
}

Gallery.prototype.renderGalleryCards = function () {
  const html = this.sortedMedia
    .map(
      (media) =>
        `<li class="gallery__card">
            <figure class="photo-card">
              <img
                class="photo-card__img"
                src="../../assets/medias/${media.photographerId}/${media.image}"
                alt="${media.title}, click or enter to open closeup view"
                data-media-id="${media.id}"
                tabindex="0"
                aria-haspopup="dialog"
              />
              <figcaption class="photo-card__description">
                <span class="photo-card__name">${media.title}</span>
                <div class="photo-card__likes">
                  <span class="photo-card__likes-count">${media.likes}</span>
                  <img
                    class="photo-card__likes-icon"
                    src="../../assets/utils/heart.svg"
                    alt="likes"
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
};

Gallery.prototype.closeLightBox = async function () {
  this.lightBox.setAttribute('aria-hidden', 'true');
  await wait(500);
  this.lightBox.setAttribute('hidden', '');
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
  const el = event.target;
  if (el.classList.contains('photo-card__img')) {
    const { mediaId } = el.dataset;
    this.currentMediaIndex = this.sortedMedia.findIndex(
      (media) => media.id === +mediaId
    );
    this.updateLightBoxMedia();
    this.openLightBox();
  }
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

export default function galleryInit(gallerySection, photographerInfo) {
  const gallery = new Gallery(gallerySection, photographerInfo);
}
