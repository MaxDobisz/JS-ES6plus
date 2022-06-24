export default class JSSlider {
    constructor(galleryItemClassName) {
        this.imagesSelector = galleryItemClassName,
        this.imagesList = document.querySelectorAll(this.imagesSelector),
        this.sliderRootElement = document.querySelector('.js-slider'),
        this.navNext = document.querySelector('.js-slider__nav--next'),
        this.navPrev = document.querySelector('.js-slider__nav--prev'),
        this.interval = ''
    }

    run() {
        this.initEvents();
        this.initCustomEvents();
    }

    initEvents() {
        const {imagesList, sliderRootElement, navPrev, navNext} = this;
    
        imagesList.forEach( item =>  {
            item.addEventListener('click', ({currentTarget}) => this.fireCustomEvent(currentTarget, 'js-slider-img-click'));
            item.addEventListener('click', ({currentTarget}) => this.fireCustomEvent(currentTarget, 'js-slider-start'));
        });
        
        if(navNext) { 
            navNext.addEventListener('click', () => this.fireCustomEvent(sliderRootElement, 'js-slider-img-next'));
            navNext.addEventListener('mouseover', ({currentTarget}) => this.fireCustomEvent(currentTarget, 'js-slider-stop'));
            navNext.addEventListener('mouseleave', () => this.nextAuto() );
        }
    
        if(navPrev) { 
            navPrev.addEventListener('click', () => this.fireCustomEvent(sliderRootElement, 'js-slider-img-prev'));
            navPrev.addEventListener('mouseover', ({currentTarget}) => this.fireCustomEvent(currentTarget, 'js-slider-stop'));
            navPrev.addEventListener('mouseleave', () => this.nextAuto() );
        }
    
        const zoom = sliderRootElement.querySelector('.js-slider__zoom');
        if(zoom) {
            zoom.addEventListener('click', ({target, currentTarget}) => {
                if(target === currentTarget) {
                    this.fireCustomEvent(sliderRootElement, 'js-slider-close');
                }
            })
        }
    }

    fireCustomEvent(element, name) {
        const event = new CustomEvent(name, {
            bubbles: true,
        });
    
        element.dispatchEvent( event );
    }

    initCustomEvents() {
        const {imagesList, sliderRootElement, navPrev, navNext} = this;

        imagesList.forEach((img) => {
            img.addEventListener('js-slider-img-click', event => this.onImageClick(event));
            img.addEventListener('js-slider-start', () => this.nextAuto());
        });
    
        sliderRootElement.addEventListener('js-slider-img-next', this.onImageNext);
        sliderRootElement.addEventListener('js-slider-img-prev', this.onImagePrev);
        sliderRootElement.addEventListener('js-slider-close', this.onClose);
        sliderRootElement.addEventListener('js-slider-close', () => this.clear() );
        navNext.addEventListener('js-slider-stop', () => this.clear() );
        navPrev.addEventListener('js-slider-stop', () => this.clear() );
        
    }

    onImageClick({currentTarget}) {
        const {sliderRootElement, imagesSelector} = this;
        sliderRootElement.classList.add('js-slider--active');
        const src = currentTarget.querySelector('img').src;
        sliderRootElement.querySelector('.js-slider__image').src = src;
        const groupName = currentTarget.dataset.sliderGroupName;
        const thumbsList = document.querySelectorAll(imagesSelector + '[data-slider-group-name='+ groupName +']');
        const prototype = document.querySelector('.js-slider__thumbs-item--prototype');
        thumbsList.forEach( item => {
            const thumbElement = prototype.cloneNode(true);
            thumbElement.classList.remove('js-slider__thumbs-item--prototype');
            const thumbImg = thumbElement.querySelector('img');
            thumbImg.src = item.querySelector('img').src;

            if(thumbImg.src === src) {
                thumbImg.classList.add('js-slider__thumbs-image--current');
            }
            
            document.querySelector('.js-slider__thumbs').appendChild(thumbElement);
        })
    }

    onImageNext() {
        const currentImg = this.querySelector('.js-slider__thumbs-image--current');
        const nextImg = currentImg.parentElement.nextElementSibling;
        const sliderImage = this.querySelector('.js-slider__image');
    
        if(!nextImg) {
            const imgPrototype = this.querySelector('.js-slider__thumbs-item--prototype');
            const lastImg = imgPrototype.nextElementSibling;
            currentImg.classList.remove('js-slider__thumbs-image--current'); 
            lastImg.firstElementChild.classList.add('js-slider__thumbs-image--current');
            const lastImgSrc = lastImg.firstElementChild.getAttribute('src');
            sliderImage.setAttribute('src', lastImgSrc);
        } else {
            currentImg.classList.remove('js-slider__thumbs-image--current');
            nextImg.firstElementChild.classList.add('js-slider__thumbs-image--current');
            const nextElementSrc = nextImg.firstElementChild.getAttribute('src');
            sliderImage.setAttribute('src', nextElementSrc);
        };
    }

    onImagePrev() {
        const currentImg = this.querySelector('.js-slider__thumbs-image--current');
        const prevImg = currentImg.parentElement.previousElementSibling;
        const prevImgClassName = prevImg.className;
        const sliderImage = this.querySelector('.js-slider__image');
        
        if(prevImgClassName.includes('js-slider__thumbs-item--prototype')) {
            const imgPrototype = this.querySelector('.js-slider__thumbs-item--prototype');
            const lastImg = imgPrototype.parentElement.lastElementChild;
            currentImg.classList.remove('js-slider__thumbs-image--current'); 
            lastImg.firstElementChild.classList.add('js-slider__thumbs-image--current');
            const lastImgSrc = lastImg.firstElementChild.getAttribute('src');
            sliderImage.setAttribute('src', lastImgSrc);
        } else {
            currentImg.classList.remove('js-slider__thumbs-image--current');
            prevImg.firstElementChild.classList.add('js-slider__thumbs-image--current');
            const prevElementSrc = prevImg.firstElementChild.getAttribute('src');
            sliderImage.setAttribute('src', prevElementSrc);
        };
    }

    onClose({currentTarget}) {    
        currentTarget.classList.remove('js-slider--active');
        const thumbsList = this.querySelectorAll('.js-slider__thumbs-item:not(.js-slider__thumbs-item--prototype)');
        thumbsList.forEach( item => item.parentElement.removeChild(item));
    }
    
    nextAuto() {
        const {sliderRootElement} = this;
        const fireNextImg = () => {
            this.fireCustomEvent(sliderRootElement, 'js-slider-img-next');
        }

        this.interval = setInterval(fireNextImg, 2000);
    }

    clear() {
        clearInterval(this.interval)
    }
}