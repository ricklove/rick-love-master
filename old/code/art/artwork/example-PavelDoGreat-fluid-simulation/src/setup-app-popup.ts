import { ga } from './ga';
import { isMobile } from './utils';

export const setupAppPopup = () => {
    // Mobile promo section

    const promoPopup = document.querySelectorAll(`.promo`)?.[0] as HTMLDivElement;
    const promoPopupClose = document.querySelectorAll(`.promo-close`)?.[0] as HTMLDivElement;

    if (!promoPopup) { return; }

    if (isMobile()) {
        setTimeout(() => {
            promoPopup.style.display = `table`;
        }, 20000);
    }

    promoPopupClose.addEventListener(`click`, e => {
        promoPopup.style.display = `none`;
    });

    const appleLink = document.querySelector(`#apple_link`) as HTMLDivElement;
    appleLink.addEventListener(`click`, e => {
        ga(`send`, `event`, `link promo`, `app`);
        window.open(`https://apps.apple.com/us/app/fluid-simulation/id1443124993`);
    });

    const googleLink = document.querySelector(`#google_link`) as HTMLDivElement;
    googleLink.addEventListener(`click`, e => {
        ga(`send`, `event`, `link promo`, `app`);
        window.open(`https://play.google.com/store/apps/details?id=games.paveldogreat.fluidsimfree`);
    });
};
