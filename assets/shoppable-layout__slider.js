if (!customElements.get('shoppable-layout-slider')) {
  class ShoppableLayoutSlider extends HTMLElement {
    constructor() {
      super();
      this.style.opacity = '0'; // hidden until initialized
      this.style.transition = 'opacity 0.3s ease-out';

      if (Shopify.designMode) {
        window.addEventListener(
          'shopify:section:load',
          this.observeSection.bind(this)
        );
      }
      this.observeSection();
    }

    observeSection() {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.init();
              observer.disconnect(); // remove observer after initialized
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(this);
    }

    init() {
      if (this.swiper) return; // prevent reinitialization

      const swiperContainer = this.querySelector('.swiper-shoppable-slider');
      if (!swiperContainer) return;

      this.swiper = new Swiper(swiperContainer, {
        autoplay: false,
        spaceBetween: 20,
        slidesPerView: 'auto',
        navigation: {
          nextEl: '.swiper-button--next',
          prevEl: '.swiper-button--prev'
        },
        breakpoints: {
          1200: {
            spaceBetween: 40,
            slidesPerView: 3.8
          },
          990: {
            spaceBetween: 32,
            slidesPerView: 3.4
          },
          750: {
            spaceBetween: 24,
            slidesPerView: 2.4
          },
          360: {
            spaceBetween: 16,
            slidesPerView: 1.4
          }
        },
        on: {
          init: () => {
            this.style.opacity = '1'; // show after initialized
            this.playLoadedVideos();
          }
        }
      });
    }

    playLoadedVideos() {
      const videos = this.querySelectorAll('video');
      videos.forEach(video => {
        video.muted = true; // necessary for autoplay
        video.autoplay = true;
        video.playsInline = true;

        if (video.readyState >= 3) {
          video.play();
        } else {
          video.addEventListener('loadeddata', () => video.play());
        }
      });
    }

    open(event, index, id) {
      document.querySelector(`shoppable-drawer.shoppable-drawer--${id}`).openWithIndex(event, index);
    }
  }

  customElements.define('shoppable-layout-slider', ShoppableLayoutSlider);
}
