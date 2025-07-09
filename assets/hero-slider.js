if (!customElements.get('hero-slider')) {
  class HeroSlider extends HTMLElement {
    constructor() {
      super();

      this.mountSlider();

      window.addEventListener('shopify:block:select', e => {
        if (!e.target.closest('hero-slider')) return;

        const selectedSlideIndex = +e.target.dataset.index;
        this.slider.slideTo(selectedSlideIndex, 600);
      });

      this.addKeyboardNavigation();
    }

    mountSlider() {
      const autoplayOptions = {
        delay: this.dataset.autoplayInterval
      };

      this.slider = new Swiper(this, {
        effect: 'fade',
        rewind: true,
        slidesPerView: 1,
        speed: 600,
        followFinger: false,
        navigation: {
          nextEl: '.swiper-button--next',
          prevEl: '.swiper-button--prev'
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        autoplay:
          this.dataset.autoplay === 'true' ? autoplayOptions : false,
        on: {
          init: this.handleSlideChange.bind(this),
          slideChange: this.handleSlideChange.bind(this)
        }
      });
    }

    handleSlideChange(swiper) {
      const headerInner = document.querySelector('.header__inner');
      const heroInners = document.querySelectorAll('.hero__inner');
      const swiperButtons = this.querySelectorAll('.swiper-button');

      if (!headerInner || !heroInners || !swiperButtons) {
        return;
      }

      // change --transparent-header-menu-text-color value on document style attributes
      document.documentElement.style.setProperty(
        '--transparent-header-menu-text-color',
        heroInners[swiper.activeIndex].dataset.headerMenuTextColor
      );

      // update swiper button colors with the active slide colors
      const activeSlide = this.querySelectorAll('.hero__content')[swiper.activeIndex];
      const classesToCopy = Array.from(activeSlide.classList).filter((className) =>
        className.startsWith('text-colors-')
      );

      swiperButtons.forEach((button) => {
        Array.from(button.classList).forEach((className) => {
          if (className.startsWith('text-colors-')) {
            button.classList.remove(className);
          }
        });

        classesToCopy.forEach((className) => {
          button.classList.add(className);
        });
      });
    }

    addKeyboardNavigation() {
      document.addEventListener('keydown', (event) => {
        if (this.isInViewport()) {
          if (event.key === 'ArrowRight') {
            const nextButton = this.querySelector('.swiper-button--next');
            if (nextButton) {
              nextButton.click();
            }
          }
          if (event.key === 'ArrowLeft') {
            const prevButton = this.querySelector('.swiper-button--prev');
            if (prevButton) {
              prevButton.click();
            }
          }
        }
      });
    }

    isInViewport() {
      const rect = this.getBoundingClientRect();
      return (
        rect.top < window.innerHeight && // top part in viewport
        rect.bottom > 0 && // bottom part in viewport
        rect.left < window.innerWidth && // left part in viewport
        rect.right > 0 // right part in viewport
      );
    }
  }

  customElements.define('hero-slider', HeroSlider);
}
