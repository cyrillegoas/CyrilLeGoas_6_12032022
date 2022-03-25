function Gallery(gallery, photographerInfo) {
  this.gallery = gallery;
  this.cardsUnorderedList = this.gallery.querySelector('ul.gallery__cards');
  this.sortType = 'popularité';
  this.media = photographerInfo.media;
  this.sortedMedia = this.sortGalleryCardsBy(
    this.sort[this.sortType],
    this.media
  );

  this.renderGalleryCards();
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

export default function galleryInit(gallerySection, photographerInfo) {
  const gallery = new Gallery(gallerySection, photographerInfo);
}
