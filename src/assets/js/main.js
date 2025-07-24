/*==========================================================================================================================================================================*/
/* Slide Toggle */
let _slideUp = (target, duration = 500, displayCSS = "block") => {
  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = duration + "ms";
  target.style.height = target.offsetHeight + "px";
  target.offsetHeight;
  target.style.overflow = "hidden";
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  window.setTimeout(() => {
    target.style.display = "none";
    target.style.removeProperty("height");
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    target.style.removeProperty("overflow");
    target.style.removeProperty("transition-duration");
    target.style.removeProperty("transition-property");
    target.classList.remove("_slide");
  }, duration);
};

let _slideDown = (target, duration = 500, displayCSS = "block") => {
  target.style.removeProperty("display");
  let display = window.getComputedStyle(target).display;
  if (display === "none") display = displayCSS;
  target.style.display = display;
  let height = target.offsetHeight;
  target.style.overflow = "hidden";
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  target.offsetHeight;
  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = duration + "ms";
  target.style.height = height + "px";
  target.style.removeProperty("padding-top");
  target.style.removeProperty("padding-bottom");
  target.style.removeProperty("margin-top");
  target.style.removeProperty("margin-bottom");
  window.setTimeout(() => {
    target.style.removeProperty("height");
    target.style.removeProperty("overflow");
    target.style.removeProperty("transition-duration");
    target.style.removeProperty("transition-property");
    target.classList.remove("_slide");
  }, duration);
};

let _slideToggle = (target, duration = 500, displayCSS = "block") => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    if (window.getComputedStyle(target).display === "none") {
      return _slideDown(target, duration, displayCSS);
    } else {
      return _slideUp(target, duration, displayCSS);
    }
  }
};

class PhoneInputFormatter {
  constructor(input) {
    this.input = input;
    this.initEvents();
  }

  getInputNumbersValue() {
    return this.input.value ? this.input.value.replace(/\D/g, "") : "";
  }

  onPhonePaste(e) {
    const inputNumbersValue = this.getInputNumbersValue();
    const pasted = e.clipboardData || window.clipboardData;
    if (pasted) {
      const pastedText = pasted.getData("Text");
      if (/\D/g.test(pastedText)) {
        this.input.value = inputNumbersValue;
      }
    }
  }

  onPhoneInput(e) {
    let inputNumbersValue = this.getInputNumbersValue(),
      selectionStart = this.input.selectionStart,
      formattedInputValue = "";

    if (!inputNumbersValue) {
      return (this.input.value = "");
    }

    if (this.input.value.length !== selectionStart) {
      if (e.data && /\D/g.test(e.data)) {
        this.input.value = inputNumbersValue;
      }
      return;
    }

    if (["7", "8", "9"].includes(inputNumbersValue[0])) {
      if (inputNumbersValue[0] === "9") inputNumbersValue = "7" + inputNumbersValue;
      const firstSymbols = inputNumbersValue[0] === "8" ? "8" : "+7";
      formattedInputValue = firstSymbols + " ";
      if (inputNumbersValue.length > 1) {
        formattedInputValue += "(" + inputNumbersValue.substring(1, 4);
      }
      if (inputNumbersValue.length >= 5) {
        formattedInputValue += ") " + inputNumbersValue.substring(4, 7);
      }
      if (inputNumbersValue.length >= 8) {
        formattedInputValue += "-" + inputNumbersValue.substring(7, 9);
      }
      if (inputNumbersValue.length >= 10) {
        formattedInputValue += "-" + inputNumbersValue.substring(9, 11);
      }
    } else {
      formattedInputValue = "+" + inputNumbersValue.substring(0, 16);
    }
    this.input.value = formattedInputValue;
  }

  onPhoneKeyDown(e) {
    const inputValue = this.input.value.replace(/\D/g, "");
    if (e.keyCode === 8 && inputValue.length === 1) {
      this.input.value = "";
    }
  }

  initEvents() {
    this.input.addEventListener("keydown", e => this.onPhoneKeyDown(e));
    this.input.addEventListener("input", e => this.onPhoneInput(e), false);
    this.input.addEventListener("paste", e => this.onPhonePaste(e), false);
  }
}

class Accordion {
  constructor(header) {
    this.header = header;
    this.accordionItem = header.closest(".accordion-item");
    this.accordionBody = this.accordionItem.querySelector(".accordion-body");
    this.accordionCover = this.accordionItem.querySelector(".accordion-cover");
    this.button = this.accordionItem.querySelector(".accordion-buttom");

    if (!this.accordionItem.classList.contains("active")) {
      this.accordionBody.style.display = "none";
      this.accordionCover.style.display = "none";
    }

    this.initEvent();
  }

  toggleAccordion() {
    const isActive = this.accordionItem.classList.toggle("active");

    const windowWidth = window.innerWidth;

    if (isActive) {
      _slideDown(this.accordionBody, 300);

      // Показываем cover только если экран < 1382px
      if (windowWidth < 1382) {
        _slideDown(this.accordionCover, 300);
      } else {
        this.accordionCover.style.display = "none";
      }

      // Подстановка картинки в .accordions__cover
      const imgSrc = this.accordionItem.dataset.accordioSrc;
      const mainCoverImg = document.querySelector("[data-accordion-cover]");
      if (mainCoverImg && imgSrc) {
        mainCoverImg.src = imgSrc;
      }

      Accordion.closeOthers(this.accordionItem);
    } else {
      _slideUp(this.accordionBody, 300);
      if (windowWidth < 1382) {
        _slideUp(this.accordionCover, 300);
      }
    }
  }

  static closeOthers(currentItem) {
    const windowWidth = window.innerWidth;

    document.querySelectorAll(".accordion-item").forEach(otherItem => {
      if (otherItem !== currentItem) {
        otherItem.classList.remove("active");

        const body = otherItem.querySelector(".accordion-body");
        const cover = otherItem.querySelector(".accordion-cover");

        if (body) _slideUp(body, 300);
        if (cover && windowWidth < 1382) _slideUp(cover, 300);
      }
    });
  }

  initEvent() {
    if (this.button) {
      this.button.addEventListener("click", () => this.toggleAccordion());
    }
    if (this.header) {
      this.header.addEventListener("click", () => this.toggleAccordion());
    }
  }
}




document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('input[type="tel"]').forEach(input => {
    if (input) {
      new PhoneInputFormatter(input);
    }
  });
  document.querySelectorAll(".accordion-header").forEach(header => new Accordion(header));
});

document.addEventListener("DOMContentLoaded", () => {
  const menuHeader = document.querySelector(".mobile-menu");
  const burger = document.querySelector(".header__burger");

  if (burger && menuHeader) {
    burger.addEventListener("click", () => {
      // Переключаем классы у burger и menuHeader
      burger.classList.toggle("close");
      menuHeader.classList.toggle("active");
    });
  }

  if (!menuHeader) return; // Если menu-header не найден, ничего не делаем


  const popupTriggers = document.querySelectorAll("[data-popup]");
  const closeButtonsPopup = document.querySelectorAll(".popup__close, .popup-close");

  function closePopup() {
    document.querySelectorAll(".popup.show").forEach(popup => {
      popup.classList.remove("show");
    });
  }

  popupTriggers.forEach(popupTrigger => {
    popupTrigger.addEventListener("click", function (event) {
      event.preventDefault();

      const popupId = popupTrigger.getAttribute("data-popup");
      const popupElement = document.querySelector(popupId);

      if (!popupElement) {
        console.error(`Popup с id ${popupId} не найден.`);
        return;
      }

      closePopup(); // Закрываем все попапы перед открытием нового
      popupElement.classList.add("show");
    });
  });

  closeButtonsPopup.forEach(closeButton => {
    closeButton.addEventListener("click", function (event) {
      event.preventDefault();
      closePopup();
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closePopup();
    }
  });

  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("popup")) {
      closePopup();
    }
  });

  const tabsContainer = document.querySelector(".prices__tabs");
  if (!tabsContainer) return; // Проверка наличия табов на странице

  const tabButtons = tabsContainer.querySelectorAll(".prices__btn");
  const tabContents = tabsContainer.querySelectorAll(".prices__tab");

  // Убедимся, что первый таб активен (если не установлен вручную)
  if (!tabsContainer.querySelector(".prices__btn.active")) {
    tabButtons[0].classList.add("active");
    const firstTabId = tabButtons[0].dataset.tab;
    const firstTabContent = tabsContainer.querySelector(firstTabId);
    if (firstTabContent) firstTabContent.classList.add("active");
  }

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      const targetTabId = button.dataset.tab;
      const targetContent = tabsContainer.querySelector(targetTabId);

      if (!targetContent) return;

      // Удаляем активные классы
      tabButtons.forEach(btn => btn.classList.remove("active"));
      tabContents.forEach(tab => tab.classList.remove("active"));

      // Назначаем активные классы
      button.classList.add("active");
      targetContent.classList.add("active");

      if (window.innerWidth < 768) {
        button.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    });
  });

  let partnersSlider = null;
  const togglePartnersSlider = () => {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      if (partnersSlider) {
        partnersSlider.destroy(true, true);
        partnersSlider = null;
      }
    } else {
      partnersSlider = new Swiper(".partners__slider", {
        navigation: {
          nextEl: ".partners__btn-next",
          prevEl: ".partners__btn-prev",
        },
        autoplay: {
          delay: 2000,
        },
        slidesPerView: "auto",
      });
    }
  };

  togglePartnersSlider();

  window.addEventListener("resize", togglePartnersSlider);

  const gallarySlider = new Swiper(".gallary__slider", {
    navigation: {
      nextEl: ".gallary__btn-next",
      prevEl: ".gallary__btn-prev",
    },
    loop: true,
    // centeredSlides: true,
    // centerInsufficientSlides: true,
    initialSlide: 1,
    slidesPerView: "auto",
    scrollbar: {
      el: ".swiper-scrollbar",
      hide: true,
    },
  });

  const defaultPeriods = {
    90000: 5,
    100000: 7,
    120000: 9,
  };

  const select = document.getElementById("calc-select");
  const averageCheckInput = document.getElementById("average-check");

  const inputPeriod = document.getElementById("input-period");
  const inputDeal = document.getElementById("input-deal");

  const periodSliderEl = document.getElementById("slider-period");
  const dealSliderEl = document.getElementById("slider-deal");
  const resultEl = document.getElementById("result");
  const resultAll = document.getElementById("result-all");

  let averageCheck = 90000;

  // 🎚 init sliders
  noUiSlider.create(periodSliderEl, {
    start: 1,
    step: 1,
    range: { min: 1, max: 12 },
    connect: [true, false],
    tooltips: false,
  });

  noUiSlider.create(dealSliderEl, {
    start: 5,
    step: 1,
    range: { min: 1, max: 15 },
    connect: [true, false],
    tooltips: false,
  });

  // 🔄 функция пересчёта
  function recalculate() {
    const deals = parseInt(inputDeal.value) || 0;
    const period = parseInt(inputPeriod.value) || 1;
    const totalProfit = averageCheck * deals * period;
    const monthlyProfit = averageCheck * deals;

    resultEl.textContent = `${monthlyProfit.toLocaleString("ru-RU")} ₽ в мес`;
    if (period > 1) { resultAll.textContent = `${totalProfit.toLocaleString("ru-RU")} ₽ за ${period} мес.`; }
  }

  // 🖱️ Слайдер → input
  periodSliderEl.noUiSlider.on("update", function (values, handle) {
    inputPeriod.value = +values[handle];
    recalculate();
  });

  dealSliderEl.noUiSlider.on("update", function (values, handle) {
    inputDeal.value = +values[handle];
    recalculate();
  });

  // ⌨️ input → Слайдер
  inputPeriod.addEventListener("input", () => {
    let val = clamp(inputPeriod.value, 1, 12);
    inputPeriod.value = val;
    periodSliderEl.noUiSlider.set(val);
  });

  inputDeal.addEventListener("input", () => {
    let val = clamp(inputDeal.value, 1, 15);
    inputDeal.value = val;
    dealSliderEl.noUiSlider.set(val);
  });

  // 🔄 при выборе города / среднего чека
  select.addEventListener("change", () => {
    averageCheck = parseInt(select.value);
    const defaultDeals = defaultPeriods[averageCheck] || 1;

    // Обновляем поле и слайдеры
    averageCheckInput.value = averageCheck.toLocaleString("ru-RU") + " руб";

    dealSliderEl.noUiSlider.set(defaultDeals);

    recalculate();
  });

  // 🔐 ограничение ввода
  function clamp(value, min, max) {
    value = parseInt(value);
    if (isNaN(value)) return min;
    return Math.max(min, Math.min(max, value));
  }

  // 🔧 Инициализация
  inputPeriod.value = 1;
  inputDeal.value = 5;
  recalculate();

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetID = this.getAttribute("href");

      // Защита от пустых #
      if (targetID.length > 1) {
        const targetEl = document.querySelector(targetID);

        if (targetEl) {
          e.preventDefault();

          targetEl.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

        }
      }
    });
  });

});




new Swiper("#offersSlider", {
  slidesPerView: 1.2,
  spaceBetween: 12,
  loop: true,
  scrollbar: {
    el: "#offersSlider .swiper-scrollbar",
    hide: true,
  },
  navigation: {
    nextEl: "#offersSlider .swiper-button-next",
    prevEl: "#offersSlider .swiper-button-prev",
  },
  breakpoints: {
    768: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
  },
});

new Swiper("#reviewsSlider", {
  slidesPerView: 1.2,
  spaceBetween: 12,
  loop: false,
  scrollbar: {
    el: "#reviews .swiper-scrollbar",
    hide: false,
    draggable: true
  },
  navigation: {
    nextEl: "#reviewsSlider .swiper-button-next",
    prevEl: "#reviewsSlider .swiper-button-prev",
  },
  breakpoints: {
    768: {
      slidesPerView: 1.3,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 2.5,
      spaceBetween: 20,
    },
  },
});


document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('header');
  const buttonsTab = document.querySelectorAll(".working__controle button");
  const tabs = document.querySelectorAll(".working__tab");

  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      header.classList.add('header-show');
    } else {
      header.classList.remove('header-show');
    }
  });

  buttonsTab.forEach(button => {
    button.addEventListener("click", function () {
      // Удаляем активные классы
      buttonsTab.forEach(btn => btn.classList.remove("active"));
      tabs.forEach(tab => tab.classList.remove("active"));

      // Добавляем активный класс текущей кнопке и табу
      this.classList.add("active");
      const targetTab = document.querySelector(this.dataset.tab);
      if (targetTab) targetTab.classList.add("active");
    });
  });
});
