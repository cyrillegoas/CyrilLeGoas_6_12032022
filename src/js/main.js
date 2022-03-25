import params from './appParams';
import { fetchJson } from './utils';
import { buildPhotographer, photographerData } from './photographerData';
import profilesInit from './profiles';
import infoPanelInit from './photographerPanel';
import galleryInit from './gallery';

async function appInit() {
  const profilesUl = document.querySelector('ul.profiles');
  const infoSection = document.querySelector('section.photographer-info');
  const gallerySection = document.querySelector('section.gallery');
  const UrlParams = new URL(document.location).searchParams;
  const photographerId = +UrlParams.get('id');

  const data = await fetchJson(params.dataPath);
  buildPhotographer(data);

  profilesUl && profilesInit(profilesUl, photographerData);
  infoSection && infoPanelInit(infoSection, photographerData[photographerId]);
  gallerySection &&
    galleryInit(gallerySection, photographerData[photographerId]);
}

appInit();
