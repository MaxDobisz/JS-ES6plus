import JSSlider from './modules/JSSlider.js';

const init = () => {
    const imagesList = document.querySelectorAll('.gallery__item');
    imagesList.forEach( img => {
        img.dataset.sliderGroupName = Math.random() > 0.5 ? 'nice' : 'good';
    });

    const jsSlider = new JSSlider('.gallery__item');
    jsSlider.run();
}

document.addEventListener('DOMContentLoaded', init);