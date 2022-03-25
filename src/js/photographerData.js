export const photographerData = {};

export function buildPhotographer({ photographers, media }) {
  photographers.forEach((photographer) => {
    photographerData[photographer.id] = {
      id: photographer.id,
      name: photographer.name,
      portrait: photographer.portrait,
      city: photographer.city,
      country: photographer.country,
      tagline: photographer.tagline,
      price: photographer.price,
      media: media.filter((m) => m.photographerId === photographer.id),
    };
  });
}
