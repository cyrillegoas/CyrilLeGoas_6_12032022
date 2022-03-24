import profilesInit from './profiles';
import infoInit from './photographerInfo';

const profilesUl = document.querySelector('ul.profiles');
const infoSection = document.querySelector('section.photographer-info');

profilesUl && profilesInit(profilesUl);
infoSection && infoInit(infoSection);
