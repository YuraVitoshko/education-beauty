import { a as slideUp, s as slideToggle, b as bodyLockToggle, c as bodyLockStatus, u as uniqArray } from "./common.min.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
let formValidate = {
  getErrors(form) {
    let error = 0;
    let formRequiredItems = form.querySelectorAll("[required]");
    if (formRequiredItems.length) {
      formRequiredItems.forEach((formRequiredItem) => {
        if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) {
          error += this.validateInput(formRequiredItem);
        }
      });
    }
    return error;
  },
  validateInput(formRequiredItem) {
    let error = 0;
    if (formRequiredItem.type === "email") {
      formRequiredItem.value = formRequiredItem.value.replace(" ", "");
      if (this.emailTest(formRequiredItem)) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    } else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
      this.addError(formRequiredItem);
      this.removeSuccess(formRequiredItem);
      error++;
    } else {
      if (!formRequiredItem.value.trim()) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    }
    return error;
  },
  addError(formRequiredItem) {
    formRequiredItem.classList.add("--form-error");
    formRequiredItem.parentElement.classList.add("--form-error");
    let inputError = formRequiredItem.parentElement.querySelector("[data-fls-form-error]");
    if (inputError) formRequiredItem.parentElement.removeChild(inputError);
    if (formRequiredItem.dataset.flsFormErrtext) {
      formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div data-fls-form-error>${formRequiredItem.dataset.flsFormErrtext}</div>`);
    }
  },
  removeError(formRequiredItem) {
    formRequiredItem.classList.remove("--form-error");
    formRequiredItem.parentElement.classList.remove("--form-error");
    if (formRequiredItem.parentElement.querySelector("[data-fls-form-error]")) {
      formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector("[data-fls-form-error]"));
    }
  },
  addSuccess(formRequiredItem) {
    formRequiredItem.classList.add("--form-success");
    formRequiredItem.parentElement.classList.add("--form-success");
  },
  removeSuccess(formRequiredItem) {
    formRequiredItem.classList.remove("--form-success");
    formRequiredItem.parentElement.classList.remove("--form-success");
  },
  removeFocus(formRequiredItem) {
    formRequiredItem.classList.remove("--form-focus");
    formRequiredItem.parentElement.classList.remove("--form-focus");
  },
  formClean(form) {
    form.reset();
    setTimeout(() => {
      let inputs = form.querySelectorAll("input,textarea");
      for (let index = 0; index < inputs.length; index++) {
        const el = inputs[index];
        formValidate.removeFocus(el);
        formValidate.removeSuccess(el);
        formValidate.removeError(el);
      }
      let checkboxes = form.querySelectorAll('input[type="checkbox"]');
      if (checkboxes.length) {
        checkboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });
      }
      if (window["flsSelect"]) {
        let selects = form.querySelectorAll("select[data-fls-select]");
        if (selects.length) {
          selects.forEach((select) => {
            window["flsSelect"].selectBuild(select);
          });
        }
      }
    }, 0);
  },
  emailTest(formRequiredItem) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
  }
};
class SelectConstructor {
  constructor(props, data = null) {
    let defaultConfig = {
      init: true,
      speed: 150
    };
    this.config = Object.assign(defaultConfig, props);
    this.selectClasses = {
      classSelect: "select",
      // Головний блок
      classSelectBody: "select__body",
      // Тіло селекту
      classSelectTitle: "select__title",
      // Заголовок
      classSelectValue: "select__value",
      // Значення у заголовку
      classSelectLabel: "select__label",
      // Лабел
      classSelectInput: "select__input",
      // Поле введення
      classSelectText: "select__text",
      // Оболонка текстових даних
      classSelectLink: "select__link",
      // Посилання в елементі
      classSelectOptions: "select__options",
      // Випадаючий список
      classSelectOptionsScroll: "select__scroll",
      // Оболонка при скролі
      classSelectOption: "select__option",
      // Пункт
      classSelectContent: "select__content",
      // Оболонка контенту в заголовку
      classSelectRow: "select__row",
      // Ряд
      classSelectData: "select__asset",
      // Додаткові дані
      classSelectDisabled: "--select-disabled",
      // Заборонено
      classSelectTag: "--select-tag",
      // Клас тега
      classSelectOpen: "--select-open",
      // Список відкритий
      classSelectActive: "--select-active",
      // Список вибрано
      classSelectFocus: "--select-focus",
      // Список у фокусі
      classSelectMultiple: "--select-multiple",
      // Мультивибір
      classSelectCheckBox: "--select-checkbox",
      // Стиль чекбоксу
      classSelectOptionSelected: "--select-selected",
      // Вибраний пункт
      classSelectPseudoLabel: "--select-pseudo-label"
      // Псевдолейбл
    };
    this._this = this;
    if (this.config.init) {
      const selectItems = data ? document.querySelectorAll(data) : document.querySelectorAll("select[data-fls-select]");
      if (selectItems.length) {
        this.selectsInit(selectItems);
      }
    }
  }
  // Конструктор CSS класу
  getSelectClass(className) {
    return `.${className}`;
  }
  // Геттер елементів псевдоселекту
  getSelectElement(selectItem, className) {
    return {
      originalSelect: selectItem.querySelector("select"),
      selectElement: selectItem.querySelector(this.getSelectClass(className))
    };
  }
  // Функція ініціалізації всіх селектів
  selectsInit(selectItems) {
    selectItems.forEach((originalSelect, index) => {
      this.selectInit(originalSelect, index + 1);
    });
    document.addEventListener("click", (function(e) {
      this.selectsActions(e);
    }).bind(this));
    document.addEventListener("keydown", (function(e) {
      this.selectsActions(e);
    }).bind(this));
    document.addEventListener("focusin", (function(e) {
      this.selectsActions(e);
    }).bind(this));
    document.addEventListener("focusout", (function(e) {
      this.selectsActions(e);
    }).bind(this));
  }
  // Функція ініціалізації конкретного селекту
  selectInit(originalSelect, index) {
    if (originalSelect.parentElement.classList.contains(this.selectClasses.classSelect)) return;
    index ? originalSelect.dataset.flsSelectId = index : null;
    index ? originalSelect.dataset.flsSelectId = index : null;
    if (originalSelect.options.length) {
      const _this = this;
      let selectItem = document.createElement("div");
      selectItem.classList.add(this.selectClasses.classSelect);
      originalSelect.parentNode.insertBefore(selectItem, originalSelect);
      selectItem.appendChild(originalSelect);
      originalSelect.hidden = true;
      if (this.getSelectPlaceholder(originalSelect)) {
        originalSelect.dataset.placeholder = this.getSelectPlaceholder(originalSelect).value;
        if (this.getSelectPlaceholder(originalSelect).label.show) {
          const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
          selectItemTitle.insertAdjacentHTML("afterbegin", `<span class="${this.selectClasses.classSelectLabel}">${this.getSelectPlaceholder(originalSelect).label.text ? this.getSelectPlaceholder(originalSelect).label.text : this.getSelectPlaceholder(originalSelect).value}</span>`);
        }
      }
      selectItem.insertAdjacentHTML("beforeend", `<div class="${this.selectClasses.classSelectBody}"><div hidden class="${this.selectClasses.classSelectOptions}"></div></div>`);
      this.selectBuild(originalSelect);
      originalSelect.dataset.flsSelectSpeed = originalSelect.dataset.flsSelectSpeed ? originalSelect.dataset.flsSelectSpeed : this.config.speed;
      this.config.speed = +originalSelect.dataset.flsSelectSpeed;
      originalSelect.addEventListener("change", function(e) {
        _this.selectChange(e);
      });
    }
  }
  // Конструктор псевдоселекту
  selectBuild(originalSelect) {
    const selectItem = originalSelect.parentElement;
    if (originalSelect.id) {
      selectItem.id = originalSelect.id;
      originalSelect.removeAttribute("id");
    }
    selectItem.dataset.flsSelectId = originalSelect.dataset.flsSelectId;
    originalSelect.dataset.flsSelectModif ? selectItem.classList.add(`select--${originalSelect.dataset.flsSelectModif}`) : null;
    originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectMultiple) : selectItem.classList.remove(this.selectClasses.classSelectMultiple);
    originalSelect.hasAttribute("data-fls-select-checkbox") && originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectCheckBox) : selectItem.classList.remove(this.selectClasses.classSelectCheckBox);
    this.setSelectTitleValue(selectItem, originalSelect);
    this.setOptions(selectItem, originalSelect);
    originalSelect.hasAttribute("data-fls-select-search") ? this.searchActions(selectItem) : null;
    originalSelect.hasAttribute("data-fls-select-open") ? this.selectAction(selectItem) : null;
    this.selectDisabled(selectItem, originalSelect);
  }
  // Функція реакцій на події
  selectsActions(e) {
    const t = e.target, type = e.type;
    const isSelect = t.closest(this.getSelectClass(this.selectClasses.classSelect));
    const isTag = t.closest(this.getSelectClass(this.selectClasses.classSelectTag));
    if (!isSelect && !isTag) return this.selectsСlose();
    const selectItem = isSelect || document.querySelector(`.${this.selectClasses.classSelect}[data-fls-select-id="${isTag.dataset.flsSelectId}"]`);
    const originalSelect = this.getSelectElement(selectItem).originalSelect;
    if (originalSelect.disabled) return;
    if (type === "click") {
      const tag = t.closest(this.getSelectClass(this.selectClasses.classSelectTag));
      const title = t.closest(this.getSelectClass(this.selectClasses.classSelectTitle));
      const option = t.closest(this.getSelectClass(this.selectClasses.classSelectOption));
      if (tag) {
        const optionItem = document.querySelector(`.${this.selectClasses.classSelect}[data-fls-select-id="${tag.dataset.flsSelectId}"] .select__option[data-fls-select-value="${tag.dataset.flsSelectValue}"]`);
        this.optionAction(selectItem, originalSelect, optionItem);
      } else if (title) {
        this.selectAction(selectItem);
      } else if (option) {
        this.optionAction(selectItem, originalSelect, option);
      }
    } else if (type === "focusin" || type === "focusout") {
      if (isSelect) selectItem.classList.toggle(this.selectClasses.classSelectFocus, type === "focusin");
    } else if (type === "keydown" && e.code === "Escape") {
      this.selectsСlose();
    }
  }
  // Функція закриття всіх селектів
  selectsСlose(selectOneGroup) {
    const selectsGroup = selectOneGroup ? selectOneGroup : document;
    const selectActiveItems = selectsGroup.querySelectorAll(`${this.getSelectClass(this.selectClasses.classSelect)}${this.getSelectClass(this.selectClasses.classSelectOpen)}`);
    if (selectActiveItems.length) {
      selectActiveItems.forEach((selectActiveItem) => {
        this.selectСlose(selectActiveItem);
      });
    }
  }
  // Функція закриття конкретного селекту
  selectСlose(selectItem) {
    const originalSelect = this.getSelectElement(selectItem).originalSelect;
    const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
    if (!selectOptions.classList.contains("_slide")) {
      selectItem.classList.remove(this.selectClasses.classSelectOpen);
      slideUp(selectOptions, originalSelect.dataset.flsSelectSpeed);
      setTimeout(() => {
        selectItem.style.zIndex = "";
      }, originalSelect.dataset.flsSelectSpeed);
    }
  }
  // Функція відкриття/закриття конкретного селекту
  selectAction(selectItem) {
    const originalSelect = this.getSelectElement(selectItem).originalSelect;
    const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
    selectOptions.querySelectorAll(`.${this.selectClasses.classSelectOption}`);
    const selectOpenzIndex = originalSelect.dataset.flsSelectZIndex ? originalSelect.dataset.flsSelectZIndex : 3;
    this.setOptionsPosition(selectItem);
    if (originalSelect.closest("[data-fls-select-one]")) {
      const selectOneGroup = originalSelect.closest("[data-fls-select-one]");
      this.selectsСlose(selectOneGroup);
    }
    setTimeout(() => {
      if (!selectOptions.classList.contains("--slide")) {
        selectItem.classList.toggle(this.selectClasses.classSelectOpen);
        slideToggle(selectOptions, originalSelect.dataset.flsSelectSpeed);
        if (selectItem.classList.contains(this.selectClasses.classSelectOpen)) {
          selectItem.style.zIndex = selectOpenzIndex;
        } else {
          setTimeout(() => {
            selectItem.style.zIndex = "";
          }, originalSelect.dataset.flsSelectSpeed);
        }
      }
    }, 0);
  }
  // Сеттер значення заголовка селекту
  setSelectTitleValue(selectItem, originalSelect) {
    const selectItemBody = this.getSelectElement(selectItem, this.selectClasses.classSelectBody).selectElement;
    const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
    if (selectItemTitle) selectItemTitle.remove();
    selectItemBody.insertAdjacentHTML("afterbegin", this.getSelectTitleValue(selectItem, originalSelect));
    originalSelect.hasAttribute("data-fls-select-search") ? this.searchActions(selectItem) : null;
  }
  // Конструктор значення заголовка
  getSelectTitleValue(selectItem, originalSelect) {
    let selectTitleValue = this.getSelectedOptionsData(originalSelect, 2).html;
    if (originalSelect.multiple && originalSelect.hasAttribute("data-fls-select-tags")) {
      selectTitleValue = this.getSelectedOptionsData(originalSelect).elements.map((option) => `<span role="button" data-fls-select-id="${selectItem.dataset.flsSelectId}" data-fls-select-value="${option.value}" class="--select-tag">${this.getSelectElementContent(option)}</span>`).join("");
      if (originalSelect.dataset.flsSelectTags && document.querySelector(originalSelect.dataset.flsSelectTags)) {
        document.querySelector(originalSelect.dataset.flsSelectTags).innerHTML = selectTitleValue;
        if (originalSelect.hasAttribute("data-fls-select-search")) selectTitleValue = false;
      }
    }
    selectTitleValue = selectTitleValue.length ? selectTitleValue : originalSelect.dataset.flsSelectPlaceholder || "";
    if (!originalSelect.hasAttribute("data-fls-select-tags")) {
      selectTitleValue = selectTitleValue ? selectTitleValue.map((item) => item.replace(/"/g, "&quot;")) : "";
    }
    let pseudoAttribute = "";
    let pseudoAttributeClass = "";
    if (originalSelect.hasAttribute("data-fls-select-pseudo-label")) {
      pseudoAttribute = originalSelect.dataset.flsSelectPseudoLabel ? ` data-fls-select-pseudo-label="${originalSelect.dataset.flsSelectPseudoLabel}"` : ` data-fls-select-pseudo-label="Заповніть атрибут"`;
      pseudoAttributeClass = ` ${this.selectClasses.classSelectPseudoLabel}`;
    }
    this.getSelectedOptionsData(originalSelect).values.length ? selectItem.classList.add(this.selectClasses.classSelectActive) : selectItem.classList.remove(this.selectClasses.classSelectActive);
    if (originalSelect.hasAttribute("data-fls-select-search")) {
      return `<div class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}"><input autocomplete="off" type="text" placeholder="${selectTitleValue}" data-fls-select-placeholder="${selectTitleValue}" class="${this.selectClasses.classSelectInput}"></span></div>`;
    } else {
      const customClass = this.getSelectedOptionsData(originalSelect).elements.length && this.getSelectedOptionsData(originalSelect).elements[0].dataset.flsSelectClass ? ` ${this.getSelectedOptionsData(originalSelect).elements[0].dataset.flsSelectClass}` : "";
      return `<button type="button" class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}${pseudoAttributeClass}"><span class="${this.selectClasses.classSelectContent}${customClass}">${selectTitleValue}</span></span></button>`;
    }
  }
  // Конструктор даних для значення заголовка
  getSelectElementContent(selectOption) {
    const selectOptionData = selectOption.dataset.flsSelectAsset ? `${selectOption.dataset.flsSelectAsset}` : "";
    const selectOptionDataHTML = selectOptionData.indexOf("img") >= 0 ? `<img src="${selectOptionData}" alt="">` : selectOptionData;
    let selectOptionContentHTML = ``;
    selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectRow}">` : "";
    selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectData}">` : "";
    selectOptionContentHTML += selectOptionData ? selectOptionDataHTML : "";
    selectOptionContentHTML += selectOptionData ? `</span>` : "";
    selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectText}">` : "";
    selectOptionContentHTML += selectOption.textContent;
    selectOptionContentHTML += selectOptionData ? `</span>` : "";
    selectOptionContentHTML += selectOptionData ? `</span>` : "";
    return selectOptionContentHTML;
  }
  // Отримання даних плейсхолдера
  getSelectPlaceholder(originalSelect) {
    const selectPlaceholder = Array.from(originalSelect.options).find((option) => !option.value);
    if (selectPlaceholder) {
      return {
        value: selectPlaceholder.textContent,
        show: selectPlaceholder.hasAttribute("data-fls-select-show"),
        label: {
          show: selectPlaceholder.hasAttribute("data-fls-select-label"),
          text: selectPlaceholder.dataset.flsSelectLabel
        }
      };
    }
  }
  // Отримання даних із вибраних елементів
  getSelectedOptionsData(originalSelect, type) {
    let selectedOptions = [];
    if (originalSelect.multiple) {
      selectedOptions = Array.from(originalSelect.options).filter((option) => option.value).filter((option) => option.selected);
    } else {
      selectedOptions.push(originalSelect.options[originalSelect.selectedIndex]);
    }
    return {
      elements: selectedOptions.map((option) => option),
      values: selectedOptions.filter((option) => option.value).map((option) => option.value),
      html: selectedOptions.map((option) => this.getSelectElementContent(option))
    };
  }
  // Конструктор елементів списку
  getOptions(originalSelect) {
    const selectOptionsScroll = originalSelect.hasAttribute("data-fls-select-scroll") ? `` : "";
    +originalSelect.dataset.flsSelectScroll ? +originalSelect.dataset.flsSelectScroll : null;
    let selectOptions = Array.from(originalSelect.options);
    if (selectOptions.length > 0) {
      let selectOptionsHTML = ``;
      if (this.getSelectPlaceholder(originalSelect) && !this.getSelectPlaceholder(originalSelect).show || originalSelect.multiple) {
        selectOptions = selectOptions.filter((option) => option.value);
      }
      selectOptionsHTML += `<div ${selectOptionsScroll} ${""} class="${this.selectClasses.classSelectOptionsScroll}">`;
      selectOptions.forEach((selectOption) => {
        selectOptionsHTML += this.getOption(selectOption, originalSelect);
      });
      selectOptionsHTML += `</div>`;
      return selectOptionsHTML;
    }
  }
  // Конструктор конкретного елемента списку
  getOption(selectOption, originalSelect) {
    const selectOptionSelected = selectOption.selected && originalSelect.multiple ? ` ${this.selectClasses.classSelectOptionSelected}` : "";
    const selectOptionHide = selectOption.selected && !originalSelect.hasAttribute("data-fls-select-show-selected") && !originalSelect.multiple ? `hidden` : ``;
    const selectOptionClass = selectOption.dataset.flsSelectClass ? ` ${selectOption.dataset.flsSelectClass}` : "";
    const selectOptionLink = selectOption.dataset.flsSelectHref ? selectOption.dataset.flsSelectHref : false;
    const selectOptionLinkTarget = selectOption.hasAttribute("data-fls-select-href-blank") ? `target="_blank"` : "";
    let selectOptionHTML = ``;
    selectOptionHTML += selectOptionLink ? `<a ${selectOptionLinkTarget} ${selectOptionHide} href="${selectOptionLink}" data-fls-select-value="${selectOption.value}" class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}">` : `<button ${selectOptionHide} class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}" data-fls-select-value="${selectOption.value}" type="button">`;
    selectOptionHTML += this.getSelectElementContent(selectOption);
    selectOptionHTML += selectOptionLink ? `</a>` : `</button>`;
    return selectOptionHTML;
  }
  // Сеттер елементів списку (options)
  setOptions(selectItem, originalSelect) {
    const selectItemOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
    selectItemOptions.innerHTML = this.getOptions(originalSelect);
  }
  // Визначаємо, де видобразити випадаючий список
  setOptionsPosition(selectItem) {
    const originalSelect = this.getSelectElement(selectItem).originalSelect;
    const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
    const selectItemScroll = this.getSelectElement(selectItem, this.selectClasses.classSelectOptionsScroll).selectElement;
    const customMaxHeightValue = +originalSelect.dataset.flsSelectScroll ? `${+originalSelect.dataset.flsSelectScroll}px` : ``;
    const selectOptionsPosMargin = +originalSelect.dataset.flsSelectOptionsMargin ? +originalSelect.dataset.flsSelectOptionsMargin : 10;
    if (!selectItem.classList.contains(this.selectClasses.classSelectOpen)) {
      selectOptions.hidden = false;
      const selectItemScrollHeight = selectItemScroll.offsetHeight ? selectItemScroll.offsetHeight : parseInt(window.getComputedStyle(selectItemScroll).getPropertyValue("max-height"));
      const selectOptionsHeight = selectOptions.offsetHeight > selectItemScrollHeight ? selectOptions.offsetHeight : selectItemScrollHeight + selectOptions.offsetHeight;
      const selectOptionsScrollHeight = selectOptionsHeight - selectItemScrollHeight;
      selectOptions.hidden = true;
      const selectItemHeight = selectItem.offsetHeight;
      const selectItemPos = selectItem.getBoundingClientRect().top;
      const selectItemTotal = selectItemPos + selectOptionsHeight + selectItemHeight + selectOptionsScrollHeight;
      const selectItemResult = window.innerHeight - (selectItemTotal + selectOptionsPosMargin);
      if (selectItemResult < 0) {
        const newMaxHeightValue = selectOptionsHeight + selectItemResult;
        if (newMaxHeightValue < 100) {
          selectItem.classList.add("select--show-top");
          selectItemScroll.style.maxHeight = selectItemPos < selectOptionsHeight ? `${selectItemPos - (selectOptionsHeight - selectItemPos)}px` : customMaxHeightValue;
        } else {
          selectItem.classList.remove("select--show-top");
          selectItemScroll.style.maxHeight = `${newMaxHeightValue}px`;
        }
      }
    } else {
      setTimeout(() => {
        selectItem.classList.remove("select--show-top");
        selectItemScroll.style.maxHeight = customMaxHeightValue;
      }, +originalSelect.dataset.flsSelectSpeed);
    }
  }
  // Обробник кліку на пункт списку
  optionAction(selectItem, originalSelect, optionItem) {
    const optionsBox = selectItem.querySelector(this.getSelectClass(this.selectClasses.classSelectOptions));
    if (optionsBox.classList.contains("--slide")) return;
    if (originalSelect.multiple) {
      optionItem.classList.toggle(this.selectClasses.classSelectOptionSelected);
      const selectedEls = this.getSelectedOptionsData(originalSelect).elements;
      for (const el of selectedEls) {
        el.removeAttribute("selected");
      }
      const selectedUI = selectItem.querySelectorAll(this.getSelectClass(this.selectClasses.classSelectOptionSelected));
      for (const el of selectedUI) {
        const val = el.dataset.flsSelectValue;
        const opt = originalSelect.querySelector(`option[value="${val}"]`);
        if (opt) opt.setAttribute("selected", "selected");
      }
    } else {
      if (!originalSelect.hasAttribute("data-fls-select-show-selected")) {
        setTimeout(() => {
          const hiddenOpt = selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`);
          if (hiddenOpt) hiddenOpt.hidden = false;
          optionItem.hidden = true;
        }, this.config.speed);
      }
      originalSelect.value = optionItem.dataset.flsSelectValue || optionItem.textContent;
      this.selectAction(selectItem);
    }
    this.setSelectTitleValue(selectItem, originalSelect);
    this.setSelectChange(originalSelect);
  }
  // Реакція на зміну оригінального select
  selectChange(e) {
    const originalSelect = e.target;
    this.selectBuild(originalSelect);
    this.setSelectChange(originalSelect);
  }
  // Обробник зміни у селекті
  setSelectChange(originalSelect) {
    if (originalSelect.hasAttribute("data-fls-select-validate")) {
      formValidate.validateInput(originalSelect);
    }
    if (originalSelect.hasAttribute("data-fls-select-submit") && originalSelect.value) {
      let tempButton = document.createElement("button");
      tempButton.type = "submit";
      originalSelect.closest("form").append(tempButton);
      tempButton.click();
      tempButton.remove();
    }
    const selectItem = originalSelect.parentElement;
    this.selectCallback(selectItem, originalSelect);
  }
  // Обробник disabled
  selectDisabled(selectItem, originalSelect) {
    if (originalSelect.disabled) {
      selectItem.classList.add(this.selectClasses.classSelectDisabled);
      this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = true;
    } else {
      selectItem.classList.remove(this.selectClasses.classSelectDisabled);
      this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = false;
    }
  }
  // Обробник пошуку за елементами списку
  searchActions(selectItem) {
    const selectInput = this.getSelectElement(selectItem, this.selectClasses.classSelectInput).selectElement;
    const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
    selectInput.addEventListener("input", () => {
      const inputValue = selectInput.value.toLowerCase();
      const selectOptionsItems = selectOptions.querySelectorAll(`.${this.selectClasses.classSelectOption}`);
      selectOptionsItems.forEach((item) => {
        const itemText = item.textContent.toLowerCase();
        item.hidden = !itemText.includes(inputValue);
      });
      if (selectOptions.hidden) {
        this.selectAction(selectItem);
      }
    });
  }
  // Коллбек функція
  selectCallback(selectItem, originalSelect) {
    document.dispatchEvent(new CustomEvent("selectCallback", {
      detail: {
        select: originalSelect
      }
    }));
  }
}
if (document.querySelector("select[data-fls-select]")) {
  window.addEventListener("load", () => {
    if (!window.flsSelect) window.flsSelect = new SelectConstructor({});
  });
}
function menuInit() {
  document.addEventListener("click", function(e) {
    if (bodyLockStatus && e.target.closest("[data-fls-menu]")) {
      bodyLockToggle();
      document.documentElement.toggleAttribute("data-fls-menu-open");
    }
  });
}
document.querySelector("[data-fls-menu]") ? window.addEventListener("load", menuInit) : null;
document.addEventListener("DOMContentLoaded", () => {
  const BREAKPOINT = 1300;
  const items = document.querySelectorAll(".menu__item");
  const isMobile = () => window.innerWidth <= BREAKPOINT;
  items.forEach((item) => {
    const external = item.querySelector(".menu__external");
    if (!external) return;
    item.addEventListener("click", (e) => {
      if (!isMobile()) return;
      if (e.target.closest("a")) return;
      e.preventDefault();
      items.forEach((i) => {
        if (i !== item) {
          const ext = i.querySelector(".menu__external");
          if (ext) closeExternal(ext, i);
        }
      });
      if (item.classList.contains("active")) {
        closeExternal(external, item);
      } else {
        openExternal(external, item);
      }
    });
  });
  function openExternal(el, item) {
    item.classList.add("active");
    el.style.overflow = "hidden";
    el.style.height = "0";
    el.style.paddingTop = "0";
    el.style.transition = "height 0.35s ease, padding-top 0.35s ease";
    requestAnimationFrame(() => {
      el.style.paddingTop = "16px";
      el.style.height = el.scrollHeight + "px";
    });
  }
  function closeExternal(el, item) {
    el.style.height = el.scrollHeight + "px";
    requestAnimationFrame(() => {
      el.style.height = "0";
      el.style.paddingTop = "0";
    });
    item.classList.remove("active");
  }
  window.addEventListener("resize", () => {
    if (!isMobile()) {
      document.querySelectorAll(".menu__external").forEach((el) => {
        el.removeAttribute("style");
      });
      items.forEach((item) => item.classList.remove("active"));
    }
  });
  const menuLinks = document.querySelectorAll(".menu a");
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      document.documentElement.removeAttribute("data-fls-scrolllock");
      document.documentElement.removeAttribute("data-fls-menu-open");
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  if (!header) return;
  let lastScroll = 0;
  let scrollTimer;
  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;
    if (currentScroll > lastScroll && currentScroll > 100) {
      header.classList.add("--hidden");
    } else {
      header.classList.remove("--hidden");
    }
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      header.classList.remove("--hidden");
    }, 500);
    lastScroll = currentScroll;
  });
});
class DynamicAdapt {
  constructor() {
    this.type = "max";
    this.init();
  }
  init() {
    this.objects = [];
    this.daClassname = "--dynamic";
    this.nodes = [...document.querySelectorAll("[data-fls-dynamic]")];
    this.nodes.forEach((node) => {
      const data = node.dataset.flsDynamic.trim();
      const dataArray = data.split(`,`);
      const object = {};
      object.element = node;
      object.parent = node.parentNode;
      object.destinationParent = dataArray[3] ? node.closest(dataArray[3].trim()) || document : document;
      dataArray[3] ? dataArray[3].trim() : null;
      const objectSelector = dataArray[0] ? dataArray[0].trim() : null;
      if (objectSelector) {
        const foundDestination = object.destinationParent.querySelector(objectSelector);
        if (foundDestination) {
          object.destination = foundDestination;
        }
      }
      object.breakpoint = dataArray[1] ? dataArray[1].trim() : `767.98`;
      object.place = dataArray[2] ? dataArray[2].trim() : `last`;
      object.index = this.indexInParent(object.parent, object.element);
      this.objects.push(object);
    });
    this.arraySort(this.objects);
    this.mediaQueries = this.objects.map(({ breakpoint }) => `(${this.type}-width: ${breakpoint / 16}em),${breakpoint}`).filter((item, index, self) => self.indexOf(item) === index);
    this.mediaQueries.forEach((media) => {
      const mediaSplit = media.split(",");
      const matchMedia = window.matchMedia(mediaSplit[0]);
      const mediaBreakpoint = mediaSplit[1];
      const objectsFilter = this.objects.filter(({ breakpoint }) => breakpoint === mediaBreakpoint);
      matchMedia.addEventListener("change", () => {
        this.mediaHandler(matchMedia, objectsFilter);
      });
      this.mediaHandler(matchMedia, objectsFilter);
    });
  }
  mediaHandler(matchMedia, objects) {
    if (matchMedia.matches) {
      objects.forEach((object) => {
        if (object.destination) {
          this.moveTo(object.place, object.element, object.destination);
        }
      });
    } else {
      objects.forEach(({ parent, element, index }) => {
        if (element.classList.contains(this.daClassname)) {
          this.moveBack(parent, element, index);
        }
      });
    }
  }
  moveTo(place, element, destination) {
    element.classList.add(this.daClassname);
    const index = place === "last" || place === "first" ? place : parseInt(place, 10);
    if (index === "last" || index >= destination.children.length) {
      destination.append(element);
    } else if (index === "first") {
      destination.prepend(element);
    } else {
      destination.children[index].before(element);
    }
  }
  moveBack(parent, element, index) {
    element.classList.remove(this.daClassname);
    if (parent.children[index] !== void 0) {
      parent.children[index].before(element);
    } else {
      parent.append(element);
    }
  }
  indexInParent(parent, element) {
    return [...parent.children].indexOf(element);
  }
  arraySort(arr) {
    if (this.type === "min") {
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }
          if (a.place === "first" || b.place === "last") {
            return -1;
          }
          if (a.place === "last" || b.place === "first") {
            return 1;
          }
          return 0;
        }
        return a.breakpoint - b.breakpoint;
      });
    } else {
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }
          if (a.place === "first" || b.place === "last") {
            return 1;
          }
          if (a.place === "last" || b.place === "first") {
            return -1;
          }
          return 0;
        }
        return b.breakpoint - a.breakpoint;
      });
      return;
    }
  }
}
if (document.querySelector("[data-fls-dynamic]")) {
  window.addEventListener("load", () => window.flsDynamic = new DynamicAdapt());
}
class ScrollWatcher {
  constructor(props) {
    let defaultConfig = {
      logging: true
    };
    this.config = Object.assign(defaultConfig, props);
    this.observer;
    !document.documentElement.hasAttribute("data-fls-watch") ? this.scrollWatcherRun() : null;
  }
  // Оновлюємо конструктор
  scrollWatcherUpdate() {
    this.scrollWatcherRun();
  }
  // Запускаємо конструктор
  scrollWatcherRun() {
    document.documentElement.setAttribute("data-fls-watch", "");
    this.scrollWatcherConstructor(document.querySelectorAll("[data-fls-watcher]"));
  }
  // Конструктор спостерігачів
  scrollWatcherConstructor(items) {
    if (items.length) {
      let uniqParams = uniqArray(Array.from(items).map(function(item) {
        if (item.dataset.flsWatcher === "navigator" && !item.dataset.flsWatcherThreshold) {
          let valueOfThreshold;
          if (item.clientHeight > 2) {
            valueOfThreshold = window.innerHeight / 2 / (item.clientHeight - 1);
            if (valueOfThreshold > 1) {
              valueOfThreshold = 1;
            }
          } else {
            valueOfThreshold = 1;
          }
          item.setAttribute(
            "data-fls-watcher-threshold",
            valueOfThreshold.toFixed(2)
          );
        }
        return `${item.dataset.flsWatcherRoot ? item.dataset.flsWatcherRoot : null}|${item.dataset.flsWatcherMargin ? item.dataset.flsWatcherMargin : "0px"}|${item.dataset.flsWatcherThreshold ? item.dataset.flsWatcherThreshold : 0}`;
      }));
      uniqParams.forEach((uniqParam) => {
        let uniqParamArray = uniqParam.split("|");
        let paramsWatch = {
          root: uniqParamArray[0],
          margin: uniqParamArray[1],
          threshold: uniqParamArray[2]
        };
        let groupItems = Array.from(items).filter(function(item) {
          let watchRoot = item.dataset.flsWatcherRoot ? item.dataset.flsWatcherRoot : null;
          let watchMargin = item.dataset.flsWatcherMargin ? item.dataset.flsWatcherMargin : "0px";
          let watchThreshold = item.dataset.flsWatcherThreshold ? item.dataset.flsWatcherThreshold : 0;
          if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) {
            return item;
          }
        });
        let configWatcher = this.getScrollWatcherConfig(paramsWatch);
        this.scrollWatcherInit(groupItems, configWatcher);
      });
    }
  }
  // Функція створення налаштувань
  getScrollWatcherConfig(paramsWatch) {
    let configWatcher = {};
    if (document.querySelector(paramsWatch.root)) {
      configWatcher.root = document.querySelector(paramsWatch.root);
    } else if (paramsWatch.root !== "null") ;
    configWatcher.rootMargin = paramsWatch.margin;
    if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
      return;
    }
    if (paramsWatch.threshold === "prx") {
      paramsWatch.threshold = [];
      for (let i = 0; i <= 1; i += 5e-3) {
        paramsWatch.threshold.push(i);
      }
    } else {
      paramsWatch.threshold = paramsWatch.threshold.split(",");
    }
    configWatcher.threshold = paramsWatch.threshold;
    return configWatcher;
  }
  // Функція створення нового спостерігача зі своїми налаштуваннями
  scrollWatcherCreate(configWatcher) {
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        this.scrollWatcherCallback(entry, observer);
      });
    }, configWatcher);
  }
  // Функція ініціалізації спостерігача зі своїми налаштуваннями
  scrollWatcherInit(items, configWatcher) {
    this.scrollWatcherCreate(configWatcher);
    items.forEach((item) => this.observer.observe(item));
  }
  // Функція обробки базових дій точок спрацьовування
  scrollWatcherIntersecting(entry, targetElement) {
    if (entry.isIntersecting) {
      !targetElement.classList.contains("--watcher-view") ? targetElement.classList.add("--watcher-view") : null;
    } else {
      targetElement.classList.contains("--watcher-view") ? targetElement.classList.remove("--watcher-view") : null;
    }
  }
  // Функція відключення стеження за об'єктом
  scrollWatcherOff(targetElement, observer) {
    observer.unobserve(targetElement);
  }
  // Функція обробки спостереження
  scrollWatcherCallback(entry, observer) {
    const targetElement = entry.target;
    this.scrollWatcherIntersecting(entry, targetElement);
    targetElement.hasAttribute("data-fls-watcher-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
    document.dispatchEvent(new CustomEvent("watcherCallback", {
      detail: {
        entry
      }
    }));
  }
}
document.querySelector("[data-fls-watcher]") ? window.addEventListener("load", () => new ScrollWatcher({})) : null;
function preloader() {
  const preloaderImages = document.querySelectorAll("img");
  const htmlDocument = document.documentElement;
  const isPreloaded = localStorage.getItem(location.href) && document.querySelector('[data-fls-preloader="true"]');
  if (preloaderImages.length && !isPreloaded) {
    let setValueProgress = function(value) {
      showPecentLoad.innerText = `${value}%`;
      const offset = circumference - value / 100 * circumference;
      progressBar.style.strokeDashoffset = offset;
    }, imageLoaded = function() {
      imagesLoadedCount++;
      progress = Math.round(100 / preloaderImages.length * imagesLoadedCount);
      const intervalId = setInterval(() => {
        if (counter >= progress) {
          clearInterval(intervalId);
        } else {
          setValueProgress(++counter);
        }
        if (counter >= 100) addLoadedClass();
      }, 10);
    };
    const preloaderTemplate = `
		<div class="fls-preloader">
			<div class="fls-preloader__body">

				<svg class="fls-preloader__progress" width="200" height="200">
					<circle class="fls-preloader__bg" cx="100" cy="100" r="80"></circle>
					<circle class="fls-preloader__bar" cx="100" cy="100" r="80"></circle>
				</svg>

				<div class="fls-preloader__counter">0%</div>

			</div>
		</div>`;
    document.body.insertAdjacentHTML("beforeend", preloaderTemplate);
    document.querySelector(".fls-preloader");
    const showPecentLoad = document.querySelector(".fls-preloader__counter"), progressBar = document.querySelector(".fls-preloader__bar");
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    progressBar.style.strokeDasharray = circumference;
    progressBar.style.strokeDashoffset = circumference;
    let imagesLoadedCount = 0;
    let counter = 0;
    let progress = 0;
    htmlDocument.setAttribute("data-fls-preloader-loading", "");
    htmlDocument.setAttribute("data-fls-scrolllock", "");
    preloaderImages.forEach((preloaderImage) => {
      const imgClone = document.createElement("img");
      imgClone.onload = imageLoaded;
      imgClone.onerror = imageLoaded;
      preloaderImage.dataset.src ? imgClone.src = preloaderImage.dataset.src : imgClone.src = preloaderImage.src;
    });
    setValueProgress(progress);
    const preloaderOnce = () => localStorage.setItem(location.href, "preloaded");
    document.querySelector('[data-fls-preloader="true"]') ? preloaderOnce() : null;
  } else {
    addLoadedClass();
  }
  function addLoadedClass() {
    htmlDocument.setAttribute("data-fls-preloader-loaded", "");
    htmlDocument.removeAttribute("data-fls-preloader-loading");
    htmlDocument.removeAttribute("data-fls-scrolllock");
  }
}
document.addEventListener("DOMContentLoaded", preloader);
document.addEventListener("DOMContentLoaded", () => {
  const btnUp = document.querySelector(".btn-up");
  const footer = document.querySelector(".footer");
  if (!btnUp) return;
  function setActive(show) {
    if (show) btnUp.classList.add("active");
    else btnUp.classList.remove("active");
  }
  function handleDesktop() {
    if (window.scrollY > 300) setActive(true);
    else setActive(false);
  }
  function handleMobile() {
    if (!footer) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setActive(entry.isIntersecting);
      });
    }, { threshold: 0.1 });
    observer.observe(footer);
  }
  function init() {
    if (window.innerWidth >= 768) {
      window.addEventListener("scroll", handleDesktop);
      handleDesktop();
    } else {
      handleMobile();
    }
  }
  init();
  window.addEventListener("resize", () => {
    btnUp.classList.remove("active");
    init();
  });
  btnUp.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var mixitup$1 = { exports: {} };
var hasRequiredMixitup;
function requireMixitup() {
  if (hasRequiredMixitup) return mixitup$1.exports;
  hasRequiredMixitup = 1;
  (function(module, exports$1) {
    (function(window2) {
      var mixitup2 = null, h = null;
      (function() {
        var VENDORS = ["webkit", "moz", "o", "ms"], canary = window2.document.createElement("div"), i = -1;
        for (i = 0; i < VENDORS.length && !window2.requestAnimationFrame; i++) {
          window2.requestAnimationFrame = window2[VENDORS[i] + "RequestAnimationFrame"];
        }
        if (typeof canary.nextElementSibling === "undefined") {
          Object.defineProperty(window2.Element.prototype, "nextElementSibling", {
            get: function() {
              var el = this.nextSibling;
              while (el) {
                if (el.nodeType === 1) {
                  return el;
                }
                el = el.nextSibling;
              }
              return null;
            }
          });
        }
        (function(ElementPrototype) {
          ElementPrototype.matches = ElementPrototype.matches || ElementPrototype.machesSelector || ElementPrototype.mozMatchesSelector || ElementPrototype.msMatchesSelector || ElementPrototype.oMatchesSelector || ElementPrototype.webkitMatchesSelector || function(selector) {
            return Array.prototype.indexOf.call(this.parentElement.querySelectorAll(selector), this) > -1;
          };
        })(window2.Element.prototype);
        if (!Object.keys) {
          Object.keys = (function() {
            var hasOwnProperty = Object.prototype.hasOwnProperty, hasDontEnumBug = false, dontEnums = [], dontEnumsLength = -1;
            hasDontEnumBug = !{
              toString: null
            }.propertyIsEnumerable("toString");
            dontEnums = [
              "toString",
              "toLocaleString",
              "valueOf",
              "hasOwnProperty",
              "isPrototypeOf",
              "propertyIsEnumerable",
              "constructor"
            ];
            dontEnumsLength = dontEnums.length;
            return function(obj) {
              var result = [], prop = "", i2 = -1;
              if (typeof obj !== "object" && (typeof obj !== "function" || obj === null)) {
                throw new TypeError("Object.keys called on non-object");
              }
              for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                  result.push(prop);
                }
              }
              if (hasDontEnumBug) {
                for (i2 = 0; i2 < dontEnumsLength; i2++) {
                  if (hasOwnProperty.call(obj, dontEnums[i2])) {
                    result.push(dontEnums[i2]);
                  }
                }
              }
              return result;
            };
          })();
        }
        if (!Array.isArray) {
          Array.isArray = function(arg) {
            return Object.prototype.toString.call(arg) === "[object Array]";
          };
        }
        if (typeof Object.create !== "function") {
          Object.create = /* @__PURE__ */ (function(undefined$1) {
            var Temp = function() {
            };
            return function(prototype, propertiesObject) {
              if (prototype !== Object(prototype) && prototype !== null) {
                throw TypeError("Argument must be an object, or null");
              }
              Temp.prototype = prototype || {};
              var result = new Temp();
              Temp.prototype = null;
              if (propertiesObject !== undefined$1) {
                Object.defineProperties(result, propertiesObject);
              }
              if (prototype === null) {
                result.__proto__ = null;
              }
              return result;
            };
          })();
        }
        if (!String.prototype.trim) {
          String.prototype.trim = function() {
            return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
          };
        }
        if (!Array.prototype.indexOf) {
          Array.prototype.indexOf = function(searchElement) {
            var n, k, t, len;
            if (this === null) {
              throw new TypeError();
            }
            t = Object(this);
            len = t.length >>> 0;
            if (len === 0) {
              return -1;
            }
            n = 0;
            if (arguments.length > 1) {
              n = Number(arguments[1]);
              if (n !== n) {
                n = 0;
              } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
              }
            }
            if (n >= len) {
              return -1;
            }
            for (k = n >= 0 ? n : Math.max(len - Math.abs(n), 0); k < len; k++) {
              if (k in t && t[k] === searchElement) {
                return k;
              }
            }
            return -1;
          };
        }
        if (!Function.prototype.bind) {
          Function.prototype.bind = function(oThis) {
            var aArgs, self, FNOP, fBound;
            if (typeof this !== "function") {
              throw new TypeError();
            }
            aArgs = Array.prototype.slice.call(arguments, 1);
            self = this;
            FNOP = function() {
            };
            fBound = function() {
              return self.apply(this instanceof FNOP ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
            };
            if (this.prototype) {
              FNOP.prototype = this.prototype;
            }
            fBound.prototype = new FNOP();
            return fBound;
          };
        }
        if (!window2.Element.prototype.dispatchEvent) {
          window2.Element.prototype.dispatchEvent = function(event) {
            try {
              return this.fireEvent("on" + event.type, event);
            } catch (err) {
            }
          };
        }
      })();
      mixitup2 = function(container, config, foreignDoc) {
        var el = null, returnCollection = false, instance = null, facade = null, doc = null, output = null, instances = [], id = "", elements = [], i = -1;
        doc = foreignDoc || window2.document;
        if (returnCollection = arguments[3]) {
          returnCollection = typeof returnCollection === "boolean";
        }
        if (typeof container === "string") {
          elements = doc.querySelectorAll(container);
        } else if (container && typeof container === "object" && h.isElement(container, doc)) {
          elements = [container];
        } else if (container && typeof container === "object" && container.length) {
          elements = container;
        } else {
          throw new Error(mixitup2.messages.errorFactoryInvalidContainer());
        }
        if (elements.length < 1) {
          throw new Error(mixitup2.messages.errorFactoryContainerNotFound());
        }
        for (i = 0; el = elements[i]; i++) {
          if (i > 0 && !returnCollection) break;
          if (!el.id) {
            id = "MixItUp" + h.randomHex();
            el.id = id;
          } else {
            id = el.id;
          }
          if (mixitup2.instances[id] instanceof mixitup2.Mixer) {
            instance = mixitup2.instances[id];
            if (!config || config && config.debug && config.debug.showWarnings !== false) {
              console.warn(mixitup2.messages.warningFactoryPreexistingInstance());
            }
          } else {
            instance = new mixitup2.Mixer();
            instance.attach(el, doc, id, config);
            mixitup2.instances[id] = instance;
          }
          facade = new mixitup2.Facade(instance);
          if (config && config.debug && config.debug.enable) {
            instances.push(instance);
          } else {
            instances.push(facade);
          }
        }
        if (returnCollection) {
          output = new mixitup2.Collection(instances);
        } else {
          output = instances[0];
        }
        return output;
      };
      mixitup2.use = function(extension) {
        mixitup2.Base.prototype.callActions.call(mixitup2, "beforeUse", arguments);
        if (typeof extension === "function" && extension.TYPE === "mixitup-extension") {
          if (typeof mixitup2.extensions[extension.NAME] === "undefined") {
            extension(mixitup2);
            mixitup2.extensions[extension.NAME] = extension;
          }
        } else if (extension.fn && extension.fn.jquery) {
          mixitup2.libraries.$ = extension;
        }
        mixitup2.Base.prototype.callActions.call(mixitup2, "afterUse", arguments);
      };
      mixitup2.instances = {};
      mixitup2.extensions = {};
      mixitup2.libraries = {};
      h = {
        /**
         * @private
         * @param   {HTMLElement}   el
         * @param   {string}        cls
         * @return  {boolean}
         */
        hasClass: function(el, cls) {
          return !!el.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
        },
        /**
         * @private
         * @param   {HTMLElement}   el
         * @param   {string}        cls
         * @return  {void}
         */
        addClass: function(el, cls) {
          if (!this.hasClass(el, cls)) el.className += el.className ? " " + cls : cls;
        },
        /**
         * @private
         * @param   {HTMLElement}   el
         * @param   {string}        cls
         * @return  {void}
         */
        removeClass: function(el, cls) {
          if (this.hasClass(el, cls)) {
            var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
            el.className = el.className.replace(reg, " ").trim();
          }
        },
        /**
         * Merges the properties of the source object onto the
         * target object. Alters the target object.
         *
         * @private
         * @param   {object}    destination
         * @param   {object}    source
         * @param   {boolean}   [deep=false]
         * @param   {boolean}   [handleErrors=false]
         * @return  {void}
         */
        extend: function(destination, source, deep, handleErrors) {
          var sourceKeys = [], key = "", i = -1;
          deep = deep || false;
          handleErrors = handleErrors || false;
          try {
            if (Array.isArray(source)) {
              for (i = 0; i < source.length; i++) {
                sourceKeys.push(i);
              }
            } else if (source) {
              sourceKeys = Object.keys(source);
            }
            for (i = 0; i < sourceKeys.length; i++) {
              key = sourceKeys[i];
              if (!deep || typeof source[key] !== "object" || this.isElement(source[key])) {
                destination[key] = source[key];
              } else if (Array.isArray(source[key])) {
                if (!destination[key]) {
                  destination[key] = [];
                }
                this.extend(destination[key], source[key], deep, handleErrors);
              } else {
                if (!destination[key]) {
                  destination[key] = {};
                }
                this.extend(destination[key], source[key], deep, handleErrors);
              }
            }
          } catch (err) {
            if (handleErrors) {
              this.handleExtendError(err, destination);
            } else {
              throw err;
            }
          }
          return destination;
        },
        /**
         * @private
         * @param   {Error}  err
         * @param   {object} destination
         * @return  {void}
         */
        handleExtendError: function(err, destination) {
          var re = /property "?(\w*)"?[,:] object/i, matches = null, erroneous = "", message = "", suggestion = "", probableMatch = "", key = "", mostMatchingChars = -1, i = -1;
          if (err instanceof TypeError && (matches = re.exec(err.message))) {
            erroneous = matches[1];
            for (key in destination) {
              i = 0;
              while (i < erroneous.length && erroneous.charAt(i) === key.charAt(i)) {
                i++;
              }
              if (i > mostMatchingChars) {
                mostMatchingChars = i;
                probableMatch = key;
              }
            }
            if (mostMatchingChars > 1) {
              suggestion = mixitup2.messages.errorConfigInvalidPropertySuggestion({
                probableMatch
              });
            }
            message = mixitup2.messages.errorConfigInvalidProperty({
              erroneous,
              suggestion
            });
            throw new TypeError(message);
          }
          throw err;
        },
        /**
         * @private
         * @param   {string} str
         * @return  {function}
         */
        template: function(str) {
          var re = /\${([\w]*)}/g, dynamics = {}, matches = null;
          while (matches = re.exec(str)) {
            dynamics[matches[1]] = new RegExp("\\${" + matches[1] + "}", "g");
          }
          return function(data) {
            var key = "", output = str;
            data = data || {};
            for (key in dynamics) {
              output = output.replace(dynamics[key], typeof data[key] !== "undefined" ? data[key] : "");
            }
            return output;
          };
        },
        /**
         * @private
         * @param   {HTMLElement}   el
         * @param   {string}        type
         * @param   {function}      fn
         * @param   {boolean}       useCapture
         * @return  {void}
         */
        on: function(el, type, fn, useCapture) {
          if (!el) return;
          if (el.addEventListener) {
            el.addEventListener(type, fn, useCapture);
          } else if (el.attachEvent) {
            el["e" + type + fn] = fn;
            el[type + fn] = function() {
              el["e" + type + fn](window2.event);
            };
            el.attachEvent("on" + type, el[type + fn]);
          }
        },
        /**
         * @private
         * @param   {HTMLElement}   el
         * @param   {string}        type
         * @param   {function}      fn
         * @return  {void}
         */
        off: function(el, type, fn) {
          if (!el) return;
          if (el.removeEventListener) {
            el.removeEventListener(type, fn, false);
          } else if (el.detachEvent) {
            el.detachEvent("on" + type, el[type + fn]);
            el[type + fn] = null;
          }
        },
        /**
         * @private
         * @param   {string}      eventType
         * @param   {object}      detail
         * @param   {Document}    [doc]
         * @return  {CustomEvent}
         */
        getCustomEvent: function(eventType, detail, doc) {
          var event = null;
          doc = doc || window2.document;
          if (typeof window2.CustomEvent === "function") {
            event = new window2.CustomEvent(eventType, {
              detail,
              bubbles: true,
              cancelable: true
            });
          } else if (typeof doc.createEvent === "function") {
            event = doc.createEvent("CustomEvent");
            event.initCustomEvent(eventType, true, true, detail);
          } else {
            event = doc.createEventObject(), event.type = eventType;
            event.returnValue = false;
            event.cancelBubble = false;
            event.detail = detail;
          }
          return event;
        },
        /**
         * @private
         * @param   {Event} e
         * @return  {Event}
         */
        getOriginalEvent: function(e) {
          if (e.touches && e.touches.length) {
            return e.touches[0];
          } else if (e.changedTouches && e.changedTouches.length) {
            return e.changedTouches[0];
          } else {
            return e;
          }
        },
        /**
         * @private
         * @param   {HTMLElement}   el
         * @param   {string}        selector
         * @return  {Number}
         */
        index: function(el, selector) {
          var i = 0;
          while ((el = el.previousElementSibling) !== null) {
            if (!selector || el.matches(selector)) {
              ++i;
            }
          }
          return i;
        },
        /**
         * Converts a dash or snake-case string to camel case.
         *
         * @private
         * @param   {string}    str
         * @param   {boolean}   [isPascal]
         * @return  {string}
         */
        camelCase: function(str) {
          return str.toLowerCase().replace(/([_-][a-z])/g, function($1) {
            return $1.toUpperCase().replace(/[_-]/, "");
          });
        },
        /**
         * Converts a dash or snake-case string to pascal case.
         *
         * @private
         * @param   {string}    str
         * @param   {boolean}   [isPascal]
         * @return  {string}
         */
        pascalCase: function(str) {
          return (str = this.camelCase(str)).charAt(0).toUpperCase() + str.slice(1);
        },
        /**
         * Converts a camel or pascal-case string to dash case.
         *
         * @private
         * @param   {string}    str
         * @return  {string}
         */
        dashCase: function(str) {
          return str.replace(/([A-Z])/g, "-$1").replace(/^-/, "").toLowerCase();
        },
        /**
         * @private
         * @param   {HTMLElement}       el
         * @param   {HTMLHtmlElement}   [doc]
         * @return  {boolean}
         */
        isElement: function(el, doc) {
          doc = doc || window2.document;
          if (window2.HTMLElement && el instanceof window2.HTMLElement) {
            return true;
          } else if (doc.defaultView && doc.defaultView.HTMLElement && el instanceof doc.defaultView.HTMLElement) {
            return true;
          } else {
            return el !== null && el.nodeType === 1 && typeof el.nodeName === "string";
          }
        },
        /**
         * @private
         * @param   {string}            htmlString
         * @param   {HTMLHtmlElement}   [doc]
         * @return  {DocumentFragment}
         */
        createElement: function(htmlString, doc) {
          var frag = null, temp = null;
          doc = doc || window2.document;
          frag = doc.createDocumentFragment();
          temp = doc.createElement("div");
          temp.innerHTML = htmlString.trim();
          while (temp.firstChild) {
            frag.appendChild(temp.firstChild);
          }
          return frag;
        },
        /**
         * @private
         * @param   {Node} node
         * @return  {void}
         */
        removeWhitespace: function(node) {
          var deleting;
          while (node && node.nodeName === "#text") {
            deleting = node;
            node = node.previousSibling;
            deleting.parentElement && deleting.parentElement.removeChild(deleting);
          }
        },
        /**
         * @private
         * @param   {Array<*>}  a
         * @param   {Array<*>}  b
         * @return  {boolean}
         */
        isEqualArray: function(a, b) {
          var i = a.length;
          if (i !== b.length) return false;
          while (i--) {
            if (a[i] !== b[i]) return false;
          }
          return true;
        },
        /**
         * @private
         * @param   {object}  a
         * @param   {object}  b
         * @return  {boolean}
         */
        deepEquals: function(a, b) {
          var key;
          if (typeof a === "object" && a && typeof b === "object" && b) {
            if (Object.keys(a).length !== Object.keys(b).length) return false;
            for (key in a) {
              if (!b.hasOwnProperty(key) || !this.deepEquals(a[key], b[key])) return false;
            }
          } else if (a !== b) {
            return false;
          }
          return true;
        },
        /**
         * @private
         * @param   {Array<*>}  oldArray
         * @return  {Array<*>}
         */
        arrayShuffle: function(oldArray) {
          var newArray = oldArray.slice(), len = newArray.length, i = len, p = -1, t = [];
          while (i--) {
            p = ~~(Math.random() * len);
            t = newArray[i];
            newArray[i] = newArray[p];
            newArray[p] = t;
          }
          return newArray;
        },
        /**
         * @private
         * @param   {object}    list
         */
        arrayFromList: function(list) {
          var output, i;
          try {
            return Array.prototype.slice.call(list);
          } catch (err) {
            output = [];
            for (i = 0; i < list.length; i++) {
              output.push(list[i]);
            }
            return output;
          }
        },
        /**
         * @private
         * @param   {function}  func
         * @param   {Number}    wait
         * @param   {boolean}   immediate
         * @return  {function}
         */
        debounce: function(func, wait, immediate) {
          var timeout;
          return function() {
            var self = this, args = arguments, callNow = immediate && !timeout, later = null;
            later = function() {
              timeout = null;
              if (!immediate) {
                func.apply(self, args);
              }
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(self, args);
          };
        },
        /**
         * @private
         * @param   {HTMLElement}   element
         * @return  {object}
         */
        position: function(element) {
          var xPosition = 0, yPosition = 0, offsetParent = element;
          while (element) {
            xPosition -= element.scrollLeft;
            yPosition -= element.scrollTop;
            if (element === offsetParent) {
              xPosition += element.offsetLeft;
              yPosition += element.offsetTop;
              offsetParent = element.offsetParent;
            }
            element = element.parentElement;
          }
          return {
            x: xPosition,
            y: yPosition
          };
        },
        /**
         * @private
         * @param   {object}    node1
         * @param   {object}    node2
         * @return  {Number}
         */
        getHypotenuse: function(node1, node2) {
          var distanceX = node1.x - node2.x, distanceY = node1.y - node2.y;
          distanceX = distanceX < 0 ? distanceX * -1 : distanceX, distanceY = distanceY < 0 ? distanceY * -1 : distanceY;
          return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
        },
        /**
         * Calcuates the area of intersection between two rectangles and expresses it as
         * a ratio in comparison to the area of the first rectangle.
         *
         * @private
         * @param   {Rect}  box1
         * @param   {Rect}  box2
         * @return  {number}
         */
        getIntersectionRatio: function(box1, box2) {
          var controlArea = box1.width * box1.height, intersectionX = -1, intersectionY = -1, intersectionArea = -1, ratio = -1;
          intersectionX = Math.max(0, Math.min(box1.left + box1.width, box2.left + box2.width) - Math.max(box1.left, box2.left));
          intersectionY = Math.max(0, Math.min(box1.top + box1.height, box2.top + box2.height) - Math.max(box1.top, box2.top));
          intersectionArea = intersectionY * intersectionX;
          ratio = intersectionArea / controlArea;
          return ratio;
        },
        /**
         * @private
         * @param   {object}            el
         * @param   {string}            selector
         * @param   {boolean}           [includeSelf]
         * @param   {HTMLHtmlElement}   [doc]
         * @return  {Element|null}
         */
        closestParent: function(el, selector, includeSelf, doc) {
          var parent = el.parentNode;
          doc = doc || window2.document;
          if (includeSelf && el.matches(selector)) {
            return el;
          }
          while (parent && parent != doc.body) {
            if (parent.matches && parent.matches(selector)) {
              return parent;
            } else if (parent.parentNode) {
              parent = parent.parentNode;
            } else {
              return null;
            }
          }
          return null;
        },
        /**
         * @private
         * @param   {HTMLElement}       el
         * @param   {string}            selector
         * @param   {HTMLHtmlElement}   [doc]
         * @return  {NodeList}
         */
        children: function(el, selector, doc) {
          var children = [], tempId = "";
          doc = doc || window2.doc;
          if (el) {
            if (!el.id) {
              tempId = "Temp" + this.randomHexKey();
              el.id = tempId;
            }
            children = doc.querySelectorAll("#" + el.id + " > " + selector);
            if (tempId) {
              el.removeAttribute("id");
            }
          }
          return children;
        },
        /**
         * Creates a clone of a provided array, with any empty strings removed.
         *
         * @private
         * @param   {Array<*>} originalArray
         * @return  {Array<*>}
         */
        clean: function(originalArray) {
          var cleanArray = [], i = -1;
          for (i = 0; i < originalArray.length; i++) {
            if (originalArray[i] !== "") {
              cleanArray.push(originalArray[i]);
            }
          }
          return cleanArray;
        },
        /**
         * Abstracts an ES6 promise into a q-like deferred interface for storage and deferred resolution.
         *
         * @private
         * @param  {object} libraries
         * @return {h.Deferred}
         */
        defer: function(libraries) {
          var deferred = null, promiseWrapper = null, $ = null;
          promiseWrapper = new this.Deferred();
          if (mixitup2.features.has.promises) {
            promiseWrapper.promise = new Promise(function(resolve, reject) {
              promiseWrapper.resolve = resolve;
              promiseWrapper.reject = reject;
            });
          } else if (($ = window2.jQuery || libraries.$) && typeof $.Deferred === "function") {
            deferred = $.Deferred();
            promiseWrapper.promise = deferred.promise();
            promiseWrapper.resolve = deferred.resolve;
            promiseWrapper.reject = deferred.reject;
          } else if (window2.console) {
            console.warn(mixitup2.messages.warningNoPromiseImplementation());
          }
          return promiseWrapper;
        },
        /**
         * @private
         * @param   {Array<Promise>}    tasks
         * @param   {object}            libraries
         * @return  {Promise<Array>}
         */
        all: function(tasks, libraries) {
          var $ = null;
          if (mixitup2.features.has.promises) {
            return Promise.all(tasks);
          } else if (($ = window2.jQuery || libraries.$) && typeof $.when === "function") {
            return $.when.apply($, tasks).done(function() {
              return arguments;
            });
          }
          if (window2.console) {
            console.warn(mixitup2.messages.warningNoPromiseImplementation());
          }
          return [];
        },
        /**
         * @private
         * @param   {HTMLElement}   el
         * @param   {string}        property
         * @param   {Array<string>} vendors
         * @return  {string}
         */
        getPrefix: function(el, property, vendors) {
          var i = -1, prefix = "";
          if (h.dashCase(property) in el.style) return "";
          for (i = 0; prefix = vendors[i]; i++) {
            if (prefix + property in el.style) {
              return prefix.toLowerCase();
            }
          }
          return "unsupported";
        },
        /**
         * @private
         * @return  {string}
         */
        randomHex: function() {
          return ("00000" + (Math.random() * 16777216 << 0).toString(16)).substr(-6).toUpperCase();
        },
        /**
         * @private
         * @param   {HTMLDocument}  [doc]
         * @return  {object}
         */
        getDocumentState: function(doc) {
          doc = typeof doc.body === "object" ? doc : window2.document;
          return {
            scrollTop: window2.pageYOffset,
            scrollLeft: window2.pageXOffset,
            docHeight: doc.documentElement.scrollHeight,
            docWidth: doc.documentElement.scrollWidth,
            viewportHeight: doc.documentElement.clientHeight,
            viewportWidth: doc.documentElement.clientWidth
          };
        },
        /**
         * @private
         * @param   {object}    obj
         * @param   {function}  fn
         * @return  {function}
         */
        bind: function(obj, fn) {
          return function() {
            return fn.apply(obj, arguments);
          };
        },
        /**
         * @private
         * @param   {HTMLElement}   el
         * @return  {boolean}
         */
        isVisible: function(el) {
          var styles = null;
          if (el.offsetParent) return true;
          styles = window2.getComputedStyle(el);
          if (styles.position === "fixed" && styles.visibility !== "hidden" && styles.opacity !== "0") {
            return true;
          }
          return false;
        },
        /**
         * @private
         * @param   {object}    obj
         */
        seal: function(obj) {
          if (typeof Object.seal === "function") {
            Object.seal(obj);
          }
        },
        /**
         * @private
         * @param   {object}    obj
         */
        freeze: function(obj) {
          if (typeof Object.freeze === "function") {
            Object.freeze(obj);
          }
        },
        /**
         * @private
         * @param   {string}    control
         * @param   {string}    specimen
         * @return  {boolean}
         */
        compareVersions: function(control, specimen) {
          var controlParts = control.split("."), specimenParts = specimen.split("."), controlPart = -1, specimenPart = -1, i = -1;
          for (i = 0; i < controlParts.length; i++) {
            controlPart = parseInt(controlParts[i].replace(/[^\d.]/g, ""));
            specimenPart = parseInt(specimenParts[i].replace(/[^\d.]/g, "") || 0);
            if (specimenPart < controlPart) {
              return false;
            } else if (specimenPart > controlPart) {
              return true;
            }
          }
          return true;
        },
        /**
         * @private
         * @constructor
         */
        Deferred: function() {
          this.promise = null;
          this.resolve = null;
          this.reject = null;
          this.id = h.randomHex();
        },
        /**
         * @private
         * @param   {object}  obj
         * @return  {boolean}
         */
        isEmptyObject: function(obj) {
          var key = "";
          if (typeof Object.keys === "function") {
            return Object.keys(obj).length === 0;
          }
          for (key in obj) {
            if (obj.hasOwnProperty(key)) {
              return false;
            }
          }
          return true;
        },
        /**
         * @param   {mixitup.Config.ClassNames}   classNames
         * @param   {string}                      elementName
         * @param   {string}                      [modifier]
         * @return  {string}
         */
        getClassname: function(classNames, elementName, modifier) {
          var classname = "";
          classname += classNames.block;
          if (classname.length) {
            classname += classNames.delineatorElement;
          }
          classname += classNames["element" + this.pascalCase(elementName)];
          if (!modifier) return classname;
          if (classname.length) {
            classname += classNames.delineatorModifier;
          }
          classname += modifier;
          return classname;
        },
        /**
         * Returns the value of a property on a given object via its string key.
         *
         * @param   {object}    obj
         * @param   {string}    stringKey
         * @return  {*} value
         */
        getProperty: function(obj, stringKey) {
          var parts = stringKey.split("."), returnCurrent = null, current = "", i = 0;
          if (!stringKey) {
            return obj;
          }
          returnCurrent = function(obj2) {
            if (!obj2) {
              return null;
            } else {
              return obj2[current];
            }
          };
          while (i < parts.length) {
            current = parts[i];
            obj = returnCurrent(obj);
            i++;
          }
          if (typeof obj !== "undefined") {
            return obj;
          } else {
            return null;
          }
        }
      };
      mixitup2.h = h;
      mixitup2.Base = function() {
      };
      mixitup2.Base.prototype = {
        constructor: mixitup2.Base,
        /**
         * Calls any registered hooks for the provided action.
         *
         * @memberof    mixitup.Base
         * @private
         * @instance
         * @since       2.0.0
         * @param       {string}    actionName
         * @param       {Array<*>}  args
         * @return      {void}
         */
        callActions: function(actionName, args) {
          var self = this, hooks = self.constructor.actions[actionName], extensionName = "";
          if (!hooks || h.isEmptyObject(hooks)) return;
          for (extensionName in hooks) {
            hooks[extensionName].apply(self, args);
          }
        },
        /**
         * Calls any registered hooks for the provided filter.
         *
         * @memberof    mixitup.Base
         * @private
         * @instance
         * @since       2.0.0
         * @param       {string}    filterName
         * @param       {*}         input
         * @param       {Array<*>}  args
         * @return      {*}
         */
        callFilters: function(filterName, input, args) {
          var self = this, hooks = self.constructor.filters[filterName], output = input, extensionName = "";
          if (!hooks || h.isEmptyObject(hooks)) return output;
          args = args || [];
          for (extensionName in hooks) {
            args = h.arrayFromList(args);
            args.unshift(output);
            output = hooks[extensionName].apply(self, args);
          }
          return output;
        }
      };
      mixitup2.BaseStatic = function() {
        this.actions = {};
        this.filters = {};
        this.extend = function(extension) {
          h.extend(this.prototype, extension);
        };
        this.registerAction = function(hookName, extensionName, func) {
          (this.actions[hookName] = this.actions[hookName] || {})[extensionName] = func;
        };
        this.registerFilter = function(hookName, extensionName, func) {
          (this.filters[hookName] = this.filters[hookName] || {})[extensionName] = func;
        };
      };
      mixitup2.Features = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.boxSizingPrefix = "";
        this.transformPrefix = "";
        this.transitionPrefix = "";
        this.boxSizingPrefix = "";
        this.transformProp = "";
        this.transformRule = "";
        this.transitionProp = "";
        this.perspectiveProp = "";
        this.perspectiveOriginProp = "";
        this.has = new mixitup2.Has();
        this.canary = null;
        this.BOX_SIZING_PROP = "boxSizing";
        this.TRANSITION_PROP = "transition";
        this.TRANSFORM_PROP = "transform";
        this.PERSPECTIVE_PROP = "perspective";
        this.PERSPECTIVE_ORIGIN_PROP = "perspectiveOrigin";
        this.VENDORS = ["Webkit", "moz", "O", "ms"];
        this.TWEENABLE = [
          "opacity",
          "width",
          "height",
          "marginRight",
          "marginBottom",
          "x",
          "y",
          "scale",
          "translateX",
          "translateY",
          "translateZ",
          "rotateX",
          "rotateY",
          "rotateZ"
        ];
        this.callActions("afterConstruct");
      };
      mixitup2.BaseStatic.call(mixitup2.Features);
      mixitup2.Features.prototype = Object.create(mixitup2.Base.prototype);
      h.extend(
        mixitup2.Features.prototype,
        /** @lends mixitup.Features */
        {
          constructor: mixitup2.Features,
          /**
           * @private
           * @return  {void}
           */
          init: function() {
            var self = this;
            self.callActions("beforeInit", arguments);
            self.canary = document.createElement("div");
            self.setPrefixes();
            self.runTests();
            self.callActions("beforeInit", arguments);
          },
          /**
           * @private
           * @return  {void}
           */
          runTests: function() {
            var self = this;
            self.callActions("beforeRunTests", arguments);
            self.has.promises = typeof window2.Promise === "function";
            self.has.transitions = self.transitionPrefix !== "unsupported";
            self.callActions("afterRunTests", arguments);
            h.freeze(self.has);
          },
          /**
           * @private
           * @return  {void}
           */
          setPrefixes: function() {
            var self = this;
            self.callActions("beforeSetPrefixes", arguments);
            self.transitionPrefix = h.getPrefix(self.canary, "Transition", self.VENDORS);
            self.transformPrefix = h.getPrefix(self.canary, "Transform", self.VENDORS);
            self.boxSizingPrefix = h.getPrefix(self.canary, "BoxSizing", self.VENDORS);
            self.boxSizingProp = self.boxSizingPrefix ? self.boxSizingPrefix + h.pascalCase(self.BOX_SIZING_PROP) : self.BOX_SIZING_PROP;
            self.transitionProp = self.transitionPrefix ? self.transitionPrefix + h.pascalCase(self.TRANSITION_PROP) : self.TRANSITION_PROP;
            self.transformProp = self.transformPrefix ? self.transformPrefix + h.pascalCase(self.TRANSFORM_PROP) : self.TRANSFORM_PROP;
            self.transformRule = self.transformPrefix ? "-" + self.transformPrefix + "-" + self.TRANSFORM_PROP : self.TRANSFORM_PROP;
            self.perspectiveProp = self.transformPrefix ? self.transformPrefix + h.pascalCase(self.PERSPECTIVE_PROP) : self.PERSPECTIVE_PROP;
            self.perspectiveOriginProp = self.transformPrefix ? self.transformPrefix + h.pascalCase(self.PERSPECTIVE_ORIGIN_PROP) : self.PERSPECTIVE_ORIGIN_PROP;
            self.callActions("afterSetPrefixes", arguments);
          }
        }
      );
      mixitup2.Has = function() {
        this.transitions = false;
        this.promises = false;
        h.seal(this);
      };
      mixitup2.features = new mixitup2.Features();
      mixitup2.features.init();
      mixitup2.ConfigAnimation = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.enable = true;
        this.effects = "fade scale";
        this.effectsIn = "";
        this.effectsOut = "";
        this.duration = 600;
        this.easing = "ease";
        this.applyPerspective = true;
        this.perspectiveDistance = "3000px";
        this.perspectiveOrigin = "50% 50%";
        this.queue = true;
        this.queueLimit = 3;
        this.animateResizeContainer = true;
        this.animateResizeTargets = false;
        this.staggerSequence = null;
        this.reverseOut = false;
        this.nudge = true;
        this.clampHeight = true;
        this.clampWidth = true;
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.ConfigAnimation);
      mixitup2.ConfigAnimation.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.ConfigAnimation.prototype.constructor = mixitup2.ConfigAnimation;
      mixitup2.ConfigBehavior = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.liveSort = false;
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.ConfigBehavior);
      mixitup2.ConfigBehavior.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.ConfigBehavior.prototype.constructor = mixitup2.ConfigBehavior;
      mixitup2.ConfigCallbacks = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.onMixStart = null;
        this.onMixBusy = null;
        this.onMixEnd = null;
        this.onMixFail = null;
        this.onMixClick = null;
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.ConfigCallbacks);
      mixitup2.ConfigCallbacks.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.ConfigCallbacks.prototype.constructor = mixitup2.ConfigCallbacks;
      mixitup2.ConfigControls = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.enable = true;
        this.live = false;
        this.scope = "global";
        this.toggleLogic = "or";
        this.toggleDefault = "all";
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.ConfigControls);
      mixitup2.ConfigControls.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.ConfigControls.prototype.constructor = mixitup2.ConfigControls;
      mixitup2.ConfigClassNames = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.block = "mixitup";
        this.elementContainer = "container";
        this.elementFilter = "control";
        this.elementSort = "control";
        this.elementMultimix = "control";
        this.elementToggle = "control";
        this.modifierActive = "active";
        this.modifierDisabled = "disabled";
        this.modifierFailed = "failed";
        this.delineatorElement = "-";
        this.delineatorModifier = "-";
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.ConfigClassNames);
      mixitup2.ConfigClassNames.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.ConfigClassNames.prototype.constructor = mixitup2.ConfigClassNames;
      mixitup2.ConfigData = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.uidKey = "";
        this.dirtyCheck = false;
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.ConfigData);
      mixitup2.ConfigData.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.ConfigData.prototype.constructor = mixitup2.ConfigData;
      mixitup2.ConfigDebug = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.enable = false;
        this.showWarnings = true;
        this.fauxAsync = false;
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.ConfigDebug);
      mixitup2.ConfigDebug.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.ConfigDebug.prototype.constructor = mixitup2.ConfigDebug;
      mixitup2.ConfigLayout = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.allowNestedTargets = true;
        this.containerClassName = "";
        this.siblingBefore = null;
        this.siblingAfter = null;
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.ConfigLayout);
      mixitup2.ConfigLayout.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.ConfigLayout.prototype.constructor = mixitup2.ConfigLayout;
      mixitup2.ConfigLoad = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.filter = "all";
        this.sort = "default:asc";
        this.dataset = null;
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.ConfigLoad);
      mixitup2.ConfigLoad.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.ConfigLoad.prototype.constructor = mixitup2.ConfigLoad;
      mixitup2.ConfigSelectors = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.target = ".mix";
        this.control = "";
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.ConfigSelectors);
      mixitup2.ConfigSelectors.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.ConfigSelectors.prototype.constructor = mixitup2.ConfigSelectors;
      mixitup2.ConfigRender = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.target = null;
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.ConfigRender);
      mixitup2.ConfigRender.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.ConfigRender.prototype.constructor = mixitup2.ConfigRender;
      mixitup2.ConfigTemplates = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.ConfigTemplates);
      mixitup2.ConfigTemplates.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.ConfigTemplates.prototype.constructor = mixitup2.ConfigTemplates;
      mixitup2.Config = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.animation = new mixitup2.ConfigAnimation();
        this.behavior = new mixitup2.ConfigBehavior();
        this.callbacks = new mixitup2.ConfigCallbacks();
        this.controls = new mixitup2.ConfigControls();
        this.classNames = new mixitup2.ConfigClassNames();
        this.data = new mixitup2.ConfigData();
        this.debug = new mixitup2.ConfigDebug();
        this.layout = new mixitup2.ConfigLayout();
        this.load = new mixitup2.ConfigLoad();
        this.selectors = new mixitup2.ConfigSelectors();
        this.render = new mixitup2.ConfigRender();
        this.templates = new mixitup2.ConfigTemplates();
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.Config);
      mixitup2.Config.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.Config.prototype.constructor = mixitup2.Config;
      mixitup2.MixerDom = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.document = null;
        this.body = null;
        this.container = null;
        this.parent = null;
        this.targets = [];
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.MixerDom);
      mixitup2.MixerDom.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.MixerDom.prototype.constructor = mixitup2.MixerDom;
      mixitup2.UiClassNames = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.base = "";
        this.active = "";
        this.disabled = "";
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.UiClassNames);
      mixitup2.UiClassNames.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.UiClassNames.prototype.constructor = mixitup2.UiClassNames;
      mixitup2.CommandDataset = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.dataset = null;
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.CommandDataset);
      mixitup2.CommandDataset.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.CommandDataset.prototype.constructor = mixitup2.CommandDataset;
      mixitup2.CommandMultimix = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.filter = null;
        this.sort = null;
        this.insert = null;
        this.remove = null;
        this.changeLayout = null;
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.CommandMultimix);
      mixitup2.CommandMultimix.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.CommandMultimix.prototype.constructor = mixitup2.CommandMultimix;
      mixitup2.CommandFilter = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.selector = "";
        this.collection = null;
        this.action = "show";
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.CommandFilter);
      mixitup2.CommandFilter.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.CommandFilter.prototype.constructor = mixitup2.CommandFilter;
      mixitup2.CommandSort = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.sortString = "";
        this.attribute = "";
        this.order = "asc";
        this.collection = null;
        this.next = null;
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.CommandSort);
      mixitup2.CommandSort.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.CommandSort.prototype.constructor = mixitup2.CommandSort;
      mixitup2.CommandInsert = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.index = 0;
        this.collection = [];
        this.position = "before";
        this.sibling = null;
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.CommandInsert);
      mixitup2.CommandInsert.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.CommandInsert.prototype.constructor = mixitup2.CommandInsert;
      mixitup2.CommandRemove = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.targets = [];
        this.collection = [];
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.CommandRemove);
      mixitup2.CommandRemove.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.CommandRemove.prototype.constructor = mixitup2.CommandRemove;
      mixitup2.CommandChangeLayout = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.containerClassName = "";
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.CommandChangeLayout);
      mixitup2.CommandChangeLayout.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.CommandChangeLayout.prototype.constructor = mixitup2.CommandChangeLayout;
      mixitup2.ControlDefinition = function(type, selector, live, parent) {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.type = type;
        this.selector = selector;
        this.live = live || false;
        this.parent = parent || "";
        this.callActions("afterConstruct");
        h.freeze(this);
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.ControlDefinition);
      mixitup2.ControlDefinition.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.ControlDefinition.prototype.constructor = mixitup2.ControlDefinition;
      mixitup2.controlDefinitions = [];
      mixitup2.controlDefinitions.push(new mixitup2.ControlDefinition("multimix", "[data-filter][data-sort]"));
      mixitup2.controlDefinitions.push(new mixitup2.ControlDefinition("filter", "[data-filter]"));
      mixitup2.controlDefinitions.push(new mixitup2.ControlDefinition("sort", "[data-sort]"));
      mixitup2.controlDefinitions.push(new mixitup2.ControlDefinition("toggle", "[data-toggle]"));
      mixitup2.Control = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.el = null;
        this.selector = "";
        this.bound = [];
        this.pending = -1;
        this.type = "";
        this.status = "inactive";
        this.filter = "";
        this.sort = "";
        this.canDisable = false;
        this.handler = null;
        this.classNames = new mixitup2.UiClassNames();
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.Control);
      mixitup2.Control.prototype = Object.create(mixitup2.Base.prototype);
      h.extend(
        mixitup2.Control.prototype,
        /** @lends mixitup.Control */
        {
          constructor: mixitup2.Control,
          /**
           * @private
           * @param {HTMLElement} el
           * @param {string}      type
           * @param {string}      selector
           */
          init: function(el, type, selector) {
            var self = this;
            this.callActions("beforeInit", arguments);
            self.el = el;
            self.type = type;
            self.selector = selector;
            if (self.selector) {
              self.status = "live";
            } else {
              self.canDisable = typeof self.el.disable === "boolean";
              switch (self.type) {
                case "filter":
                  self.filter = self.el.getAttribute("data-filter");
                  break;
                case "toggle":
                  self.filter = self.el.getAttribute("data-toggle");
                  break;
                case "sort":
                  self.sort = self.el.getAttribute("data-sort");
                  break;
                case "multimix":
                  self.filter = self.el.getAttribute("data-filter");
                  self.sort = self.el.getAttribute("data-sort");
                  break;
              }
            }
            self.bindClick();
            mixitup2.controls.push(self);
            this.callActions("afterInit", arguments);
          },
          /**
           * @private
           * @param  {mixitup.Mixer} mixer
           * @return {boolean}
           */
          isBound: function(mixer) {
            var self = this, isBound = false;
            this.callActions("beforeIsBound", arguments);
            isBound = self.bound.indexOf(mixer) > -1;
            return self.callFilters("afterIsBound", isBound, arguments);
          },
          /**
           * @private
           * @param  {mixitup.Mixer} mixer
           * @return {void}
           */
          addBinding: function(mixer) {
            var self = this;
            this.callActions("beforeAddBinding", arguments);
            if (!self.isBound()) {
              self.bound.push(mixer);
            }
            this.callActions("afterAddBinding", arguments);
          },
          /**
           * @private
           * @param  {mixitup.Mixer} mixer
           * @return {void}
           */
          removeBinding: function(mixer) {
            var self = this, removeIndex = -1;
            this.callActions("beforeRemoveBinding", arguments);
            if ((removeIndex = self.bound.indexOf(mixer)) > -1) {
              self.bound.splice(removeIndex, 1);
            }
            if (self.bound.length < 1) {
              self.unbindClick();
              removeIndex = mixitup2.controls.indexOf(self);
              mixitup2.controls.splice(removeIndex, 1);
              if (self.status === "active") {
                self.renderStatus(self.el, "inactive");
              }
            }
            this.callActions("afterRemoveBinding", arguments);
          },
          /**
           * @private
           * @return {void}
           */
          bindClick: function() {
            var self = this;
            this.callActions("beforeBindClick", arguments);
            self.handler = function(e) {
              self.handleClick(e);
            };
            h.on(self.el, "click", self.handler);
            this.callActions("afterBindClick", arguments);
          },
          /**
           * @private
           * @return {void}
           */
          unbindClick: function() {
            var self = this;
            this.callActions("beforeUnbindClick", arguments);
            h.off(self.el, "click", self.handler);
            self.handler = null;
            this.callActions("afterUnbindClick", arguments);
          },
          /**
           * @private
           * @param   {MouseEvent} e
           * @return  {void}
           */
          handleClick: function(e) {
            var self = this, button = null, mixer = null, isActive = false, returnValue = void 0, command = {}, clone = null, commands = [], i = -1;
            this.callActions("beforeHandleClick", arguments);
            this.pending = 0;
            mixer = self.bound[0];
            if (!self.selector) {
              button = self.el;
            } else {
              button = h.closestParent(e.target, mixer.config.selectors.control + self.selector, true, mixer.dom.document);
            }
            if (!button) {
              self.callActions("afterHandleClick", arguments);
              return;
            }
            switch (self.type) {
              case "filter":
                command.filter = self.filter || button.getAttribute("data-filter");
                break;
              case "sort":
                command.sort = self.sort || button.getAttribute("data-sort");
                break;
              case "multimix":
                command.filter = self.filter || button.getAttribute("data-filter");
                command.sort = self.sort || button.getAttribute("data-sort");
                break;
              case "toggle":
                command.filter = self.filter || button.getAttribute("data-toggle");
                if (self.status === "live") {
                  isActive = h.hasClass(button, self.classNames.active);
                } else {
                  isActive = self.status === "active";
                }
                break;
            }
            for (i = 0; i < self.bound.length; i++) {
              clone = new mixitup2.CommandMultimix();
              h.extend(clone, command);
              commands.push(clone);
            }
            commands = self.callFilters("commandsHandleClick", commands, arguments);
            self.pending = self.bound.length;
            for (i = 0; mixer = self.bound[i]; i++) {
              command = commands[i];
              if (!command) {
                continue;
              }
              if (!mixer.lastClicked) {
                mixer.lastClicked = button;
              }
              mixitup2.events.fire("mixClick", mixer.dom.container, {
                state: mixer.state,
                instance: mixer,
                originalEvent: e,
                control: mixer.lastClicked
              }, mixer.dom.document);
              if (typeof mixer.config.callbacks.onMixClick === "function") {
                returnValue = mixer.config.callbacks.onMixClick.call(mixer.lastClicked, mixer.state, e, mixer);
                if (returnValue === false) {
                  continue;
                }
              }
              if (self.type === "toggle") {
                isActive ? mixer.toggleOff(command.filter) : mixer.toggleOn(command.filter);
              } else {
                mixer.multimix(command);
              }
            }
            this.callActions("afterHandleClick", arguments);
          },
          /**
           * @param   {object}          command
           * @param   {Array<string>}   toggleArray
           * @return  {void}
           */
          update: function(command, toggleArray) {
            var self = this, actions = new mixitup2.CommandMultimix();
            self.callActions("beforeUpdate", arguments);
            self.pending--;
            self.pending = Math.max(0, self.pending);
            if (self.pending > 0) return;
            if (self.status === "live") {
              self.updateLive(command, toggleArray);
            } else {
              actions.sort = self.sort;
              actions.filter = self.filter;
              self.callFilters("actionsUpdate", actions, arguments);
              self.parseStatusChange(self.el, command, actions, toggleArray);
            }
            self.callActions("afterUpdate", arguments);
          },
          /**
           * @param   {mixitup.CommandMultimix} command
           * @param   {Array<string>}           toggleArray
           * @return  {void}
           */
          updateLive: function(command, toggleArray) {
            var self = this, controlButtons = null, actions = null, button = null, i = -1;
            self.callActions("beforeUpdateLive", arguments);
            if (!self.el) return;
            controlButtons = self.el.querySelectorAll(self.selector);
            for (i = 0; button = controlButtons[i]; i++) {
              actions = new mixitup2.CommandMultimix();
              switch (self.type) {
                case "filter":
                  actions.filter = button.getAttribute("data-filter");
                  break;
                case "sort":
                  actions.sort = button.getAttribute("data-sort");
                  break;
                case "multimix":
                  actions.filter = button.getAttribute("data-filter");
                  actions.sort = button.getAttribute("data-sort");
                  break;
                case "toggle":
                  actions.filter = button.getAttribute("data-toggle");
                  break;
              }
              actions = self.callFilters("actionsUpdateLive", actions, arguments);
              self.parseStatusChange(button, command, actions, toggleArray);
            }
            self.callActions("afterUpdateLive", arguments);
          },
          /**
           * @param   {HTMLElement}             button
           * @param   {mixitup.CommandMultimix} command
           * @param   {mixitup.CommandMultimix} actions
           * @param   {Array<string>}           toggleArray
           * @return  {void}
           */
          parseStatusChange: function(button, command, actions, toggleArray) {
            var self = this, alias = "", toggle = "", i = -1;
            self.callActions("beforeParseStatusChange", arguments);
            switch (self.type) {
              case "filter":
                if (command.filter === actions.filter) {
                  self.renderStatus(button, "active");
                } else {
                  self.renderStatus(button, "inactive");
                }
                break;
              case "multimix":
                if (command.sort === actions.sort && command.filter === actions.filter) {
                  self.renderStatus(button, "active");
                } else {
                  self.renderStatus(button, "inactive");
                }
                break;
              case "sort":
                if (command.sort.match(/:asc/g)) {
                  alias = command.sort.replace(/:asc/g, "");
                }
                if (command.sort === actions.sort || alias === actions.sort) {
                  self.renderStatus(button, "active");
                } else {
                  self.renderStatus(button, "inactive");
                }
                break;
              case "toggle":
                if (toggleArray.length < 1) self.renderStatus(button, "inactive");
                if (command.filter === actions.filter) {
                  self.renderStatus(button, "active");
                }
                for (i = 0; i < toggleArray.length; i++) {
                  toggle = toggleArray[i];
                  if (toggle === actions.filter) {
                    self.renderStatus(button, "active");
                    break;
                  }
                  self.renderStatus(button, "inactive");
                }
                break;
            }
            self.callActions("afterParseStatusChange", arguments);
          },
          /**
           * @param   {HTMLElement}   button
           * @param   {string}        status
           * @return  {void}
           */
          renderStatus: function(button, status) {
            var self = this;
            self.callActions("beforeRenderStatus", arguments);
            switch (status) {
              case "active":
                h.addClass(button, self.classNames.active);
                h.removeClass(button, self.classNames.disabled);
                if (self.canDisable) self.el.disabled = false;
                break;
              case "inactive":
                h.removeClass(button, self.classNames.active);
                h.removeClass(button, self.classNames.disabled);
                if (self.canDisable) self.el.disabled = false;
                break;
              case "disabled":
                if (self.canDisable) self.el.disabled = true;
                h.addClass(button, self.classNames.disabled);
                h.removeClass(button, self.classNames.active);
                break;
            }
            if (self.status !== "live") {
              self.status = status;
            }
            self.callActions("afterRenderStatus", arguments);
          }
        }
      );
      mixitup2.controls = [];
      mixitup2.StyleData = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.x = 0;
        this.y = 0;
        this.top = 0;
        this.right = 0;
        this.bottom = 0;
        this.left = 0;
        this.width = 0;
        this.height = 0;
        this.marginRight = 0;
        this.marginBottom = 0;
        this.opacity = 0;
        this.scale = new mixitup2.TransformData();
        this.translateX = new mixitup2.TransformData();
        this.translateY = new mixitup2.TransformData();
        this.translateZ = new mixitup2.TransformData();
        this.rotateX = new mixitup2.TransformData();
        this.rotateY = new mixitup2.TransformData();
        this.rotateZ = new mixitup2.TransformData();
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.StyleData);
      mixitup2.StyleData.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.StyleData.prototype.constructor = mixitup2.StyleData;
      mixitup2.TransformData = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.value = 0;
        this.unit = "";
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.TransformData);
      mixitup2.TransformData.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.TransformData.prototype.constructor = mixitup2.TransformData;
      mixitup2.TransformDefaults = function() {
        mixitup2.StyleData.apply(this);
        this.callActions("beforeConstruct");
        this.scale.value = 0.01;
        this.scale.unit = "";
        this.translateX.value = 20;
        this.translateX.unit = "px";
        this.translateY.value = 20;
        this.translateY.unit = "px";
        this.translateZ.value = 20;
        this.translateZ.unit = "px";
        this.rotateX.value = 90;
        this.rotateX.unit = "deg";
        this.rotateY.value = 90;
        this.rotateY.unit = "deg";
        this.rotateX.value = 90;
        this.rotateX.unit = "deg";
        this.rotateZ.value = 180;
        this.rotateZ.unit = "deg";
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.TransformDefaults);
      mixitup2.TransformDefaults.prototype = Object.create(mixitup2.StyleData.prototype);
      mixitup2.TransformDefaults.prototype.constructor = mixitup2.TransformDefaults;
      mixitup2.transformDefaults = new mixitup2.TransformDefaults();
      mixitup2.EventDetail = function() {
        this.state = null;
        this.futureState = null;
        this.instance = null;
        this.originalEvent = null;
      };
      mixitup2.Events = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.mixStart = null;
        this.mixBusy = null;
        this.mixEnd = null;
        this.mixFail = null;
        this.mixClick = null;
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.Events);
      mixitup2.Events.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.Events.prototype.constructor = mixitup2.Events;
      mixitup2.Events.prototype.fire = function(eventType, el, detail, doc) {
        var self = this, event = null, eventDetail = new mixitup2.EventDetail();
        self.callActions("beforeFire", arguments);
        if (typeof self[eventType] === "undefined") {
          throw new Error('Event type "' + eventType + '" not found.');
        }
        eventDetail.state = new mixitup2.State();
        h.extend(eventDetail.state, detail.state);
        if (detail.futureState) {
          eventDetail.futureState = new mixitup2.State();
          h.extend(eventDetail.futureState, detail.futureState);
        }
        eventDetail.instance = detail.instance;
        if (detail.originalEvent) {
          eventDetail.originalEvent = detail.originalEvent;
        }
        event = h.getCustomEvent(eventType, eventDetail, doc);
        self.callFilters("eventFire", event, arguments);
        el.dispatchEvent(event);
      };
      mixitup2.events = new mixitup2.Events();
      mixitup2.QueueItem = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.args = [];
        this.instruction = null;
        this.triggerElement = null;
        this.deferred = null;
        this.isToggling = false;
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.QueueItem);
      mixitup2.QueueItem.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.QueueItem.prototype.constructor = mixitup2.QueueItem;
      mixitup2.Mixer = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.config = new mixitup2.Config();
        this.id = "";
        this.isBusy = false;
        this.isToggling = false;
        this.incPadding = true;
        this.controls = [];
        this.targets = [];
        this.origOrder = [];
        this.cache = {};
        this.toggleArray = [];
        this.targetsMoved = 0;
        this.targetsImmovable = 0;
        this.targetsBound = 0;
        this.targetsDone = 0;
        this.staggerDuration = 0;
        this.effectsIn = null;
        this.effectsOut = null;
        this.transformIn = [];
        this.transformOut = [];
        this.queue = [];
        this.state = null;
        this.lastOperation = null;
        this.lastClicked = null;
        this.userCallback = null;
        this.userDeferred = null;
        this.dom = new mixitup2.MixerDom();
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.Mixer);
      mixitup2.Mixer.prototype = Object.create(mixitup2.Base.prototype);
      h.extend(
        mixitup2.Mixer.prototype,
        /** @lends mixitup.Mixer */
        {
          constructor: mixitup2.Mixer,
          /**
           * @private
           * @instance
           * @since 3.0.0
           * @param {HTMLElement} container
           * @param {HTMLElement} document
           * @param {string}      id
           * @param {object}      [config]
           */
          attach: function(container, document2, id, config) {
            var self = this, target = null, i = -1;
            self.callActions("beforeAttach", arguments);
            self.id = id;
            if (config) {
              h.extend(self.config, config, true, true);
            }
            self.sanitizeConfig();
            self.cacheDom(container, document2);
            if (self.config.layout.containerClassName) {
              h.addClass(self.dom.container, self.config.layout.containerClassName);
            }
            if (!mixitup2.features.has.transitions) {
              self.config.animation.enable = false;
            }
            if (typeof window2.console === "undefined") {
              self.config.debug.showWarnings = false;
            }
            if (self.config.data.uidKey) {
              self.config.controls.enable = false;
            }
            self.indexTargets();
            self.state = self.getInitialState();
            for (i = 0; target = self.lastOperation.toHide[i]; i++) {
              target.hide();
            }
            if (self.config.controls.enable) {
              self.initControls();
              self.buildToggleArray(null, self.state);
              self.updateControls({
                filter: self.state.activeFilter,
                sort: self.state.activeSort
              });
            }
            self.parseEffects();
            self.callActions("afterAttach", arguments);
          },
          /**
           * @private
           * @instance
           * @since 3.0.0
           * @return {void}
           */
          sanitizeConfig: function() {
            var self = this;
            self.callActions("beforeSanitizeConfig", arguments);
            self.config.controls.scope = self.config.controls.scope.toLowerCase().trim();
            self.config.controls.toggleLogic = self.config.controls.toggleLogic.toLowerCase().trim();
            self.config.controls.toggleDefault = self.config.controls.toggleDefault.toLowerCase().trim();
            self.config.animation.effects = self.config.animation.effects.trim();
            self.callActions("afterSanitizeConfig", arguments);
          },
          /**
           * @private
           * @instance
           * @since   3.0.0
           * @return  {mixitup.State}
           */
          getInitialState: function() {
            var self = this, state = new mixitup2.State(), operation = new mixitup2.Operation();
            self.callActions("beforeGetInitialState", arguments);
            state.activeContainerClassName = self.config.layout.containerClassName;
            if (self.config.load.dataset) {
              if (!self.config.data.uidKey || typeof self.config.data.uidKey !== "string") {
                throw new TypeError(mixitup2.messages.errorConfigDataUidKeyNotSet());
              }
              operation.startDataset = operation.newDataset = state.activeDataset = self.config.load.dataset.slice();
              operation.startContainerClassName = operation.newContainerClassName = state.activeContainerClassName;
              operation.show = self.targets.slice();
              state = self.callFilters("stateGetInitialState", state, arguments);
            } else {
              state.activeFilter = self.parseFilterArgs([self.config.load.filter]).command;
              state.activeSort = self.parseSortArgs([self.config.load.sort]).command;
              state.totalTargets = self.targets.length;
              state = self.callFilters("stateGetInitialState", state, arguments);
              if (state.activeSort.collection || state.activeSort.attribute || state.activeSort.order === "random" || state.activeSort.order === "desc") {
                operation.newSort = state.activeSort;
                self.sortOperation(operation);
                self.printSort(false, operation);
                self.targets = operation.newOrder;
              } else {
                operation.startOrder = operation.newOrder = self.targets;
              }
              operation.startFilter = operation.newFilter = state.activeFilter;
              operation.startSort = operation.newSort = state.activeSort;
              operation.startContainerClassName = operation.newContainerClassName = state.activeContainerClassName;
              if (operation.newFilter.selector === "all") {
                operation.newFilter.selector = self.config.selectors.target;
              } else if (operation.newFilter.selector === "none") {
                operation.newFilter.selector = "";
              }
            }
            operation = self.callFilters("operationGetInitialState", operation, [state]);
            self.lastOperation = operation;
            if (operation.newFilter) {
              self.filterOperation(operation);
            }
            state = self.buildState(operation);
            return state;
          },
          /**
           * Caches references of DOM elements neccessary for the mixer's functionality.
           *
           * @private
           * @instance
           * @since   3.0.0
           * @param   {HTMLElement}       el
           * @param   {HTMLHtmlElement}   document
           * @return  {void}
           */
          cacheDom: function(el, document2) {
            var self = this;
            self.callActions("beforeCacheDom", arguments);
            self.dom.document = document2;
            self.dom.body = self.dom.document.querySelector("body");
            self.dom.container = el;
            self.dom.parent = el;
            self.callActions("afterCacheDom", arguments);
          },
          /**
           * Indexes all child elements of the mixer matching the `selectors.target`
           * selector, instantiating a mixitup.Target for each one.
           *
           * @private
           * @instance
           * @since   3.0.0
           * @return  {void}
           */
          indexTargets: function() {
            var self = this, target = null, el = null, dataset = null, i = -1;
            self.callActions("beforeIndexTargets", arguments);
            self.dom.targets = self.config.layout.allowNestedTargets ? self.dom.container.querySelectorAll(self.config.selectors.target) : h.children(self.dom.container, self.config.selectors.target, self.dom.document);
            self.dom.targets = h.arrayFromList(self.dom.targets);
            self.targets = [];
            if ((dataset = self.config.load.dataset) && dataset.length !== self.dom.targets.length) {
              throw new Error(mixitup2.messages.errorDatasetPrerenderedMismatch());
            }
            if (self.dom.targets.length) {
              for (i = 0; el = self.dom.targets[i]; i++) {
                target = new mixitup2.Target();
                target.init(el, self, dataset ? dataset[i] : void 0);
                target.isInDom = true;
                self.targets.push(target);
              }
              self.dom.parent = self.dom.targets[0].parentElement === self.dom.container ? self.dom.container : self.dom.targets[0].parentElement;
            }
            self.origOrder = self.targets;
            self.callActions("afterIndexTargets", arguments);
          },
          initControls: function() {
            var self = this, definition = "", controlElements = null, el = null, parent = null, delagators = null, control = null, i = -1, j = -1;
            self.callActions("beforeInitControls", arguments);
            switch (self.config.controls.scope) {
              case "local":
                parent = self.dom.container;
                break;
              case "global":
                parent = self.dom.document;
                break;
              default:
                throw new Error(mixitup2.messages.errorConfigInvalidControlsScope());
            }
            for (i = 0; definition = mixitup2.controlDefinitions[i]; i++) {
              if (self.config.controls.live || definition.live) {
                if (definition.parent) {
                  delagators = self.dom[definition.parent];
                  if (!delagators || delagators.length < 0) continue;
                  if (typeof delagators.length !== "number") {
                    delagators = [delagators];
                  }
                } else {
                  delagators = [parent];
                }
                for (j = 0; el = delagators[j]; j++) {
                  control = self.getControl(el, definition.type, definition.selector);
                  self.controls.push(control);
                }
              } else {
                controlElements = parent.querySelectorAll(self.config.selectors.control + definition.selector);
                for (j = 0; el = controlElements[j]; j++) {
                  control = self.getControl(el, definition.type, "");
                  if (!control) continue;
                  self.controls.push(control);
                }
              }
            }
            self.callActions("afterInitControls", arguments);
          },
          /**
           * @private
           * @instance
           * @since   3.0.0
           * @param   {HTMLElement} el
           * @param   {string}      type
           * @param   {string}      selector
           * @return  {mixitup.Control|null}
           */
          getControl: function(el, type, selector) {
            var self = this, control = null, i = -1;
            self.callActions("beforeGetControl", arguments);
            if (!selector) {
              for (i = 0; control = mixitup2.controls[i]; i++) {
                if (control.el === el && control.isBound(self)) {
                  return self.callFilters("controlGetControl", null, arguments);
                } else if (control.el === el && control.type === type && control.selector === selector) {
                  control.addBinding(self);
                  return self.callFilters("controlGetControl", control, arguments);
                }
              }
            }
            control = new mixitup2.Control();
            control.init(el, type, selector);
            control.classNames.base = h.getClassname(self.config.classNames, type);
            control.classNames.active = h.getClassname(self.config.classNames, type, self.config.classNames.modifierActive);
            control.classNames.disabled = h.getClassname(self.config.classNames, type, self.config.classNames.modifierDisabled);
            control.addBinding(self);
            return self.callFilters("controlGetControl", control, arguments);
          },
          /**
           * Creates a compound selector by joining the `toggleArray` value as per the
           * defined toggle logic.
           *
           * @private
           * @instance
           * @since   3.0.0
           * @return  {string}
           */
          getToggleSelector: function() {
            var self = this, delineator = self.config.controls.toggleLogic === "or" ? ", " : "", toggleSelector = "";
            self.callActions("beforeGetToggleSelector", arguments);
            self.toggleArray = h.clean(self.toggleArray);
            toggleSelector = self.toggleArray.join(delineator);
            if (toggleSelector === "") {
              toggleSelector = self.config.controls.toggleDefault;
            }
            return self.callFilters("selectorGetToggleSelector", toggleSelector, arguments);
          },
          /**
           * Breaks compound selector strings in an array of discreet selectors,
           * as per the active `controls.toggleLogic` configuration option. Accepts
           * either a dynamic command object, or a state object.
           *
           * @private
           * @instance
           * @since   2.0.0
           * @param   {object}        [command]
           * @param   {mixitup.State} [state]
           * @return  {void}
           */
          buildToggleArray: function(command, state) {
            var self = this, activeFilterSelector = "";
            self.callActions("beforeBuildToggleArray", arguments);
            if (command && command.filter) {
              activeFilterSelector = command.filter.selector.replace(/\s/g, "");
            } else if (state) {
              activeFilterSelector = state.activeFilter.selector.replace(/\s/g, "");
            } else {
              return;
            }
            if (activeFilterSelector === self.config.selectors.target || activeFilterSelector === "all") {
              activeFilterSelector = "";
            }
            if (self.config.controls.toggleLogic === "or") {
              self.toggleArray = activeFilterSelector.split(",");
            } else {
              self.toggleArray = self.splitCompoundSelector(activeFilterSelector);
            }
            self.toggleArray = h.clean(self.toggleArray);
            self.callActions("afterBuildToggleArray", arguments);
          },
          /**
           * Takes a compound selector (e.g. `.cat-1.cat-2`, `[data-cat="1"][data-cat="2"]`)
           * and breaks into its individual selectors.
           *
           * @private
           * @instance
           * @since   3.0.0
           * @param   {string} compoundSelector
           * @return  {string[]}
           */
          splitCompoundSelector: function(compoundSelector) {
            var partials = compoundSelector.split(/([\.\[])/g), toggleArray = [], selector = "", i = -1;
            if (partials[0] === "") {
              partials.shift();
            }
            for (i = 0; i < partials.length; i++) {
              if (i % 2 === 0) {
                selector = "";
              }
              selector += partials[i];
              if (i % 2 !== 0) {
                toggleArray.push(selector);
              }
            }
            return toggleArray;
          },
          /**
           * Updates controls to their active/inactive state based on the command or
           * current state of the mixer.
           *
           * @private
           * @instance
           * @since   2.0.0
           * @param   {object} command
           * @return  {void}
           */
          updateControls: function(command) {
            var self = this, control = null, output = new mixitup2.CommandMultimix(), i = -1;
            self.callActions("beforeUpdateControls", arguments);
            if (command.filter) {
              output.filter = command.filter.selector;
            } else {
              output.filter = self.state.activeFilter.selector;
            }
            if (command.sort) {
              output.sort = self.buildSortString(command.sort);
            } else {
              output.sort = self.buildSortString(self.state.activeSort);
            }
            if (output.filter === self.config.selectors.target) {
              output.filter = "all";
            }
            if (output.filter === "") {
              output.filter = "none";
            }
            h.freeze(output);
            for (i = 0; control = self.controls[i]; i++) {
              control.update(output, self.toggleArray);
            }
            self.callActions("afterUpdateControls", arguments);
          },
          /**
           * @private
           * @instance
           * @since   3.0.0
           * @param   {mixitup.CommandSort}   command
           * @return  {string}
           */
          buildSortString: function(command) {
            var self = this;
            var output = "";
            output += command.sortString;
            if (command.next) {
              output += " " + self.buildSortString(command.next);
            }
            return output;
          },
          /**
           * @private
           * @instance
           * @since   3.0.0
           * @param   {object}        command
           * @param   {Operation}     operation
           * @return  {Promise.<mixitup.State>}
           */
          insertTargets: function(command, operation) {
            var self = this, nextSibling = null, insertionIndex = -1, frag = null, target = null, el = null, i = -1;
            self.callActions("beforeInsertTargets", arguments);
            if (typeof command.index === "undefined") command.index = 0;
            nextSibling = self.getNextSibling(command.index, command.sibling, command.position);
            frag = self.dom.document.createDocumentFragment();
            if (nextSibling) {
              insertionIndex = h.index(nextSibling, self.config.selectors.target);
            } else {
              insertionIndex = self.targets.length;
            }
            if (command.collection) {
              for (i = 0; el = command.collection[i]; i++) {
                if (self.dom.targets.indexOf(el) > -1) {
                  throw new Error(mixitup2.messages.errorInsertPreexistingElement());
                }
                el.style.display = "none";
                frag.appendChild(el);
                frag.appendChild(self.dom.document.createTextNode(" "));
                if (!h.isElement(el, self.dom.document) || !el.matches(self.config.selectors.target)) continue;
                target = new mixitup2.Target();
                target.init(el, self);
                target.isInDom = true;
                self.targets.splice(insertionIndex, 0, target);
                insertionIndex++;
              }
              self.dom.parent.insertBefore(frag, nextSibling);
            }
            operation.startOrder = self.origOrder = self.targets;
            self.callActions("afterInsertTargets", arguments);
          },
          /**
           * @private
           * @instance
           * @since   3.0.0
           * @param   {Number}      [index]
           * @param   {Element}     [sibling]
           * @param   {string}      [position]
           * @return  {Element}
           */
          getNextSibling: function(index, sibling, position) {
            var self = this, element = null;
            index = Math.max(index, 0);
            if (sibling && position === "before") {
              element = sibling;
            } else if (sibling && position === "after") {
              element = sibling.nextElementSibling || null;
            } else if (self.targets.length > 0 && typeof index !== "undefined") {
              element = index < self.targets.length || !self.targets.length ? self.targets[index].dom.el : self.targets[self.targets.length - 1].dom.el.nextElementSibling;
            } else if (self.targets.length === 0 && self.dom.parent.children.length > 0) {
              if (self.config.layout.siblingAfter) {
                element = self.config.layout.siblingAfter;
              } else if (self.config.layout.siblingBefore) {
                element = self.config.layout.siblingBefore.nextElementSibling;
              } else {
                self.dom.parent.children[0];
              }
            } else ;
            return self.callFilters("elementGetNextSibling", element, arguments);
          },
          /**
           * @private
           * @instance
           * @since   2.0.0
           * @param   {Operation}     operation
           * @return  {void}
           */
          filterOperation: function(operation) {
            var self = this, testResult = false, index = -1, action = "", target = null, i = -1;
            self.callActions("beforeFilterOperation", arguments);
            action = operation.newFilter.action;
            for (i = 0; target = operation.newOrder[i]; i++) {
              if (operation.newFilter.collection) {
                testResult = operation.newFilter.collection.indexOf(target.dom.el) > -1;
              } else {
                if (operation.newFilter.selector === "") {
                  testResult = false;
                } else {
                  testResult = target.dom.el.matches(operation.newFilter.selector);
                }
              }
              self.evaluateHideShow(testResult, target, action, operation);
            }
            if (operation.toRemove.length) {
              for (i = 0; target = operation.show[i]; i++) {
                if (operation.toRemove.indexOf(target) > -1) {
                  operation.show.splice(i, 1);
                  if ((index = operation.toShow.indexOf(target)) > -1) {
                    operation.toShow.splice(index, 1);
                  }
                  operation.toHide.push(target);
                  operation.hide.push(target);
                  i--;
                }
              }
            }
            operation.matching = operation.show.slice();
            if (operation.show.length === 0 && operation.newFilter.selector !== "" && self.targets.length !== 0) {
              operation.hasFailed = true;
            }
            self.callActions("afterFilterOperation", arguments);
          },
          /**
           * @private
           * @instance
           * @since   3.0.0
           * @param   {boolean}   testResult
           * @param   {Element}   target
           * @param   {string}    action
           * @param   {Operation} operation
           * @return  {void}
           */
          evaluateHideShow: function(testResult, target, action, operation) {
            var self = this, filteredTestResult = false, args = Array.prototype.slice.call(arguments, 1);
            filteredTestResult = self.callFilters("testResultEvaluateHideShow", testResult, args);
            self.callActions("beforeEvaluateHideShow", arguments);
            if (filteredTestResult === true && action === "show" || filteredTestResult === false && action === "hide") {
              operation.show.push(target);
              !target.isShown && operation.toShow.push(target);
            } else {
              operation.hide.push(target);
              target.isShown && operation.toHide.push(target);
            }
            self.callActions("afterEvaluateHideShow", arguments);
          },
          /**
           * @private
           * @instance
           * @since   2.0.0
           * @param   {Operation}     operation
           * @return  {void}
           */
          sortOperation: function(operation) {
            var self = this, newOrder = [], target = null, el = null, i = -1;
            self.callActions("beforeSortOperation", arguments);
            operation.startOrder = self.targets;
            if (operation.newSort.collection) {
              newOrder = [];
              for (i = 0; el = operation.newSort.collection[i]; i++) {
                if (self.dom.targets.indexOf(el) < 0) {
                  throw new Error(mixitup2.messages.errorSortNonExistentElement());
                }
                target = new mixitup2.Target();
                target.init(el, self);
                target.isInDom = true;
                newOrder.push(target);
              }
              operation.newOrder = newOrder;
            } else if (operation.newSort.order === "random") {
              operation.newOrder = h.arrayShuffle(operation.startOrder);
            } else if (operation.newSort.attribute === "") {
              operation.newOrder = self.origOrder.slice();
              if (operation.newSort.order === "desc") {
                operation.newOrder.reverse();
              }
            } else {
              operation.newOrder = operation.startOrder.slice();
              operation.newOrder.sort(function(a, b) {
                return self.compare(a, b, operation.newSort);
              });
            }
            if (h.isEqualArray(operation.newOrder, operation.startOrder)) {
              operation.willSort = false;
            }
            self.callActions("afterSortOperation", arguments);
          },
          /**
           * @private
           * @instance
           * @since   2.0.0
           * @param   {mixitup.Target}        a
           * @param   {mixitup.Target}        b
           * @param   {mixitup.CommandSort}   command
           * @return  {Number}
           */
          compare: function(a, b, command) {
            var self = this, order = command.order, attrA = self.getAttributeValue(a, command.attribute), attrB = self.getAttributeValue(b, command.attribute);
            if (isNaN(attrA * 1) || isNaN(attrB * 1)) {
              attrA = attrA.toLowerCase();
              attrB = attrB.toLowerCase();
            } else {
              attrA = attrA * 1;
              attrB = attrB * 1;
            }
            if (attrA < attrB) {
              return order === "asc" ? -1 : 1;
            }
            if (attrA > attrB) {
              return order === "asc" ? 1 : -1;
            }
            if (attrA === attrB && command.next) {
              return self.compare(a, b, command.next);
            }
            return 0;
          },
          /**
           * Reads the values of any data attributes present the provided target element
           * which match the current sort command.
           *
           * @private
           * @instance
           * @since   3.0.0
           * @param   {mixitup.Target}    target
           * @param   {string}            [attribute]
           * @return  {(String|Number)}
           */
          getAttributeValue: function(target, attribute) {
            var self = this, value = "";
            value = target.dom.el.getAttribute("data-" + attribute);
            if (value === null) {
              if (self.config.debug.showWarnings) {
                console.warn(mixitup2.messages.warningInconsistentSortingAttributes({
                  attribute: "data-" + attribute
                }));
              }
            }
            return self.callFilters("valueGetAttributeValue", value || 0, arguments);
          },
          /**
           * Inserts elements into the DOM in the appropriate
           * order using a document fragment for minimal
           * DOM thrashing
           *
           * @private
           * @instance
           * @since   2.0.0
           * @param   {boolean}   isResetting
           * @param   {Operation} operation
           * @return  {void}
           */
          printSort: function(isResetting, operation) {
            var self = this, startOrder = isResetting ? operation.newOrder : operation.startOrder, newOrder = isResetting ? operation.startOrder : operation.newOrder, nextSibling = startOrder.length ? startOrder[startOrder.length - 1].dom.el.nextElementSibling : null, frag = window2.document.createDocumentFragment(), whitespace = null, target = null, el = null, i = -1;
            self.callActions("beforePrintSort", arguments);
            for (i = 0; target = startOrder[i]; i++) {
              el = target.dom.el;
              if (el.style.position === "absolute") continue;
              h.removeWhitespace(el.previousSibling);
              el.parentElement.removeChild(el);
            }
            whitespace = nextSibling ? nextSibling.previousSibling : self.dom.parent.lastChild;
            if (whitespace && whitespace.nodeName === "#text") {
              h.removeWhitespace(whitespace);
            }
            for (i = 0; target = newOrder[i]; i++) {
              el = target.dom.el;
              if (h.isElement(frag.lastChild)) {
                frag.appendChild(window2.document.createTextNode(" "));
              }
              frag.appendChild(el);
            }
            if (self.dom.parent.firstChild && self.dom.parent.firstChild !== nextSibling) {
              frag.insertBefore(window2.document.createTextNode(" "), frag.childNodes[0]);
            }
            if (nextSibling) {
              frag.appendChild(window2.document.createTextNode(" "));
              self.dom.parent.insertBefore(frag, nextSibling);
            } else {
              self.dom.parent.appendChild(frag);
            }
            self.callActions("afterPrintSort", arguments);
          },
          /**
           * Parses user-defined sort strings (i.e. `default:asc`) into sort commands objects.
           *
           * @private
           * @instance
           * @since   3.0.0
           * @param   {string}                sortString
           * @param   {mixitup.CommandSort}   command
           * @return  {mixitup.CommandSort}
           */
          parseSortString: function(sortString, command) {
            var self = this, rules = sortString.split(" "), current = command, rule = [], i = -1;
            for (i = 0; i < rules.length; i++) {
              rule = rules[i].split(":");
              current.sortString = rules[i];
              current.attribute = h.dashCase(rule[0]);
              current.order = rule[1] || "asc";
              switch (current.attribute) {
                case "default":
                  current.attribute = "";
                  break;
                case "random":
                  current.attribute = "";
                  current.order = "random";
                  break;
              }
              if (!current.attribute || current.order === "random") break;
              if (i < rules.length - 1) {
                current.next = new mixitup2.CommandSort();
                h.freeze(current);
                current = current.next;
              }
            }
            return self.callFilters("commandsParseSort", command, arguments);
          },
          /**
           * Parses all effects out of the user-defined `animation.effects` string into
           * their respective properties and units.
           *
           * @private
           * @instance
           * @since   2.0.0
           * @return  {void}
           */
          parseEffects: function() {
            var self = this, transformName = "", effectsIn = self.config.animation.effectsIn || self.config.animation.effects, effectsOut = self.config.animation.effectsOut || self.config.animation.effects;
            self.callActions("beforeParseEffects", arguments);
            self.effectsIn = new mixitup2.StyleData();
            self.effectsOut = new mixitup2.StyleData();
            self.transformIn = [];
            self.transformOut = [];
            self.effectsIn.opacity = self.effectsOut.opacity = 1;
            self.parseEffect("fade", effectsIn, self.effectsIn, self.transformIn);
            self.parseEffect("fade", effectsOut, self.effectsOut, self.transformOut, true);
            for (transformName in mixitup2.transformDefaults) {
              if (!(mixitup2.transformDefaults[transformName] instanceof mixitup2.TransformData)) {
                continue;
              }
              self.parseEffect(transformName, effectsIn, self.effectsIn, self.transformIn);
              self.parseEffect(transformName, effectsOut, self.effectsOut, self.transformOut, true);
            }
            self.parseEffect("stagger", effectsIn, self.effectsIn, self.transformIn);
            self.parseEffect("stagger", effectsOut, self.effectsOut, self.transformOut, true);
            self.callActions("afterParseEffects", arguments);
          },
          /**
           * @private
           * @instance
           * @since   2.0.0
           * @param   {string}    effectName
           * @param   {string}    effectString
           * @param   {StyleData} effects
           * @param   {String[]}  transform
           * @param   {boolean}   [isOut]
           */
          parseEffect: function(effectName, effectString, effects, transform, isOut) {
            var self = this, re = /\(([^)]+)\)/, propIndex = -1, str = "", match = [], val = "", units = ["%", "px", "em", "rem", "vh", "vw", "deg"], unit = "", i = -1;
            self.callActions("beforeParseEffect", arguments);
            if (typeof effectString !== "string") {
              throw new TypeError(mixitup2.messages.errorConfigInvalidAnimationEffects());
            }
            if (effectString.indexOf(effectName) < 0) {
              if (effectName === "stagger") {
                self.staggerDuration = 0;
              }
              return;
            }
            propIndex = effectString.indexOf(effectName + "(");
            if (propIndex > -1) {
              str = effectString.substring(propIndex);
              match = re.exec(str);
              val = match[1];
            }
            switch (effectName) {
              case "fade":
                effects.opacity = val ? parseFloat(val) : 0;
                break;
              case "stagger":
                self.staggerDuration = val ? parseFloat(val) : 100;
                break;
              default:
                if (isOut && self.config.animation.reverseOut && effectName !== "scale") {
                  effects[effectName].value = (val ? parseFloat(val) : mixitup2.transformDefaults[effectName].value) * -1;
                } else {
                  effects[effectName].value = val ? parseFloat(val) : mixitup2.transformDefaults[effectName].value;
                }
                if (val) {
                  for (i = 0; unit = units[i]; i++) {
                    if (val.indexOf(unit) > -1) {
                      effects[effectName].unit = unit;
                      break;
                    }
                  }
                } else {
                  effects[effectName].unit = mixitup2.transformDefaults[effectName].unit;
                }
                transform.push(
                  effectName + "(" + effects[effectName].value + effects[effectName].unit + ")"
                );
            }
            self.callActions("afterParseEffect", arguments);
          },
          /**
           * @private
           * @instance
           * @since   2.0.0
           * @param   {Operation}     operation
           * @return  {State}
           */
          buildState: function(operation) {
            var self = this, state = new mixitup2.State(), target = null, i = -1;
            self.callActions("beforeBuildState", arguments);
            for (i = 0; target = self.targets[i]; i++) {
              if (!operation.toRemove.length || operation.toRemove.indexOf(target) < 0) {
                state.targets.push(target.dom.el);
              }
            }
            for (i = 0; target = operation.matching[i]; i++) {
              state.matching.push(target.dom.el);
            }
            for (i = 0; target = operation.show[i]; i++) {
              state.show.push(target.dom.el);
            }
            for (i = 0; target = operation.hide[i]; i++) {
              if (!operation.toRemove.length || operation.toRemove.indexOf(target) < 0) {
                state.hide.push(target.dom.el);
              }
            }
            state.id = self.id;
            state.container = self.dom.container;
            state.activeFilter = operation.newFilter;
            state.activeSort = operation.newSort;
            state.activeDataset = operation.newDataset;
            state.activeContainerClassName = operation.newContainerClassName;
            state.hasFailed = operation.hasFailed;
            state.totalTargets = self.targets.length;
            state.totalShow = operation.show.length;
            state.totalHide = operation.hide.length;
            state.totalMatching = operation.matching.length;
            state.triggerElement = operation.triggerElement;
            return self.callFilters("stateBuildState", state, arguments);
          },
          /**
           * @private
           * @instance
           * @since   2.0.0
           * @param   {boolean}   shouldAnimate
           * @param   {Operation} operation
           * @return  {void}
           */
          goMix: function(shouldAnimate, operation) {
            var self = this, deferred = null;
            self.callActions("beforeGoMix", arguments);
            if (!self.config.animation.duration || !self.config.animation.effects || !h.isVisible(self.dom.container)) {
              shouldAnimate = false;
            }
            if (!operation.toShow.length && !operation.toHide.length && !operation.willSort && !operation.willChangeLayout) {
              shouldAnimate = false;
            }
            if (!operation.startState.show.length && !operation.show.length) {
              shouldAnimate = false;
            }
            mixitup2.events.fire("mixStart", self.dom.container, {
              state: operation.startState,
              futureState: operation.newState,
              instance: self
            }, self.dom.document);
            if (typeof self.config.callbacks.onMixStart === "function") {
              self.config.callbacks.onMixStart.call(
                self.dom.container,
                operation.startState,
                operation.newState,
                self
              );
            }
            h.removeClass(self.dom.container, h.getClassname(self.config.classNames, "container", self.config.classNames.modifierFailed));
            if (!self.userDeferred) {
              deferred = self.userDeferred = h.defer(mixitup2.libraries);
            } else {
              deferred = self.userDeferred;
            }
            self.isBusy = true;
            if (!shouldAnimate || !mixitup2.features.has.transitions) {
              if (self.config.debug.fauxAsync) {
                setTimeout(function() {
                  self.cleanUp(operation);
                }, self.config.animation.duration);
              } else {
                self.cleanUp(operation);
              }
              return self.callFilters("promiseGoMix", deferred.promise, arguments);
            }
            if (window2.pageYOffset !== operation.docState.scrollTop) {
              window2.scrollTo(operation.docState.scrollLeft, operation.docState.scrollTop);
            }
            if (self.config.animation.applyPerspective) {
              self.dom.parent.style[mixitup2.features.perspectiveProp] = self.config.animation.perspectiveDistance;
              self.dom.parent.style[mixitup2.features.perspectiveOriginProp] = self.config.animation.perspectiveOrigin;
            }
            if (self.config.animation.animateResizeContainer && operation.startHeight !== operation.newHeight && operation.viewportDeltaY !== operation.startHeight - operation.newHeight) {
              self.dom.parent.style.height = operation.startHeight + "px";
            }
            if (self.config.animation.animateResizeContainer && operation.startWidth !== operation.newWidth && operation.viewportDeltaX !== operation.startWidth - operation.newWidth) {
              self.dom.parent.style.width = operation.startWidth + "px";
            }
            if (operation.startHeight === operation.newHeight) {
              self.dom.parent.style.height = operation.startHeight + "px";
            }
            if (operation.startWidth === operation.newWidth) {
              self.dom.parent.style.width = operation.startWidth + "px";
            }
            if (operation.startHeight === operation.newHeight && operation.startWidth === operation.newWidth) {
              self.dom.parent.style.overflow = "hidden";
            }
            requestAnimationFrame(function() {
              self.moveTargets(operation);
            });
            return self.callFilters("promiseGoMix", deferred.promise, arguments);
          },
          /**
           * @private
           * @instance
           * @since   2.0.0
           * @param   {Operation}     operation
           * @return  {void}
           */
          getStartMixData: function(operation) {
            var self = this, parentStyle = window2.getComputedStyle(self.dom.parent), parentRect = self.dom.parent.getBoundingClientRect(), target = null, data = {}, i = -1, boxSizing = parentStyle[mixitup2.features.boxSizingProp];
            self.incPadding = boxSizing === "border-box";
            self.callActions("beforeGetStartMixData", arguments);
            for (i = 0; target = operation.show[i]; i++) {
              data = target.getPosData();
              operation.showPosData[i] = {
                startPosData: data
              };
            }
            for (i = 0; target = operation.toHide[i]; i++) {
              data = target.getPosData();
              operation.toHidePosData[i] = {
                startPosData: data
              };
            }
            operation.startX = parentRect.left;
            operation.startY = parentRect.top;
            operation.startHeight = self.incPadding ? parentRect.height : parentRect.height - parseFloat(parentStyle.paddingTop) - parseFloat(parentStyle.paddingBottom) - parseFloat(parentStyle.borderTop) - parseFloat(parentStyle.borderBottom);
            operation.startWidth = self.incPadding ? parentRect.width : parentRect.width - parseFloat(parentStyle.paddingLeft) - parseFloat(parentStyle.paddingRight) - parseFloat(parentStyle.borderLeft) - parseFloat(parentStyle.borderRight);
            self.callActions("afterGetStartMixData", arguments);
          },
          /**
           * @private
           * @instance
           * @since   2.0.0
           * @param   {Operation}     operation
           * @return  {void}
           */
          setInter: function(operation) {
            var self = this, target = null, i = -1;
            self.callActions("beforeSetInter", arguments);
            if (self.config.animation.clampHeight) {
              self.dom.parent.style.height = operation.startHeight + "px";
              self.dom.parent.style.overflow = "hidden";
            }
            if (self.config.animation.clampWidth) {
              self.dom.parent.style.width = operation.startWidth + "px";
              self.dom.parent.style.overflow = "hidden";
            }
            for (i = 0; target = operation.toShow[i]; i++) {
              target.show();
            }
            if (operation.willChangeLayout) {
              h.removeClass(self.dom.container, operation.startContainerClassName);
              h.addClass(self.dom.container, operation.newContainerClassName);
            }
            self.callActions("afterSetInter", arguments);
          },
          /**
           * @private
           * @instance
           * @since   2.0.0
           * @param   {Operation}     operation
           * @return  {void}
           */
          getInterMixData: function(operation) {
            var self = this, target = null, i = -1;
            self.callActions("beforeGetInterMixData", arguments);
            for (i = 0; target = operation.show[i]; i++) {
              operation.showPosData[i].interPosData = target.getPosData();
            }
            for (i = 0; target = operation.toHide[i]; i++) {
              operation.toHidePosData[i].interPosData = target.getPosData();
            }
            self.callActions("afterGetInterMixData", arguments);
          },
          /**
           * @private
           * @instance
           * @since   2.0.0
           * @param   {Operation}     operation
           * @return  {void}
           */
          setFinal: function(operation) {
            var self = this, target = null, i = -1;
            self.callActions("beforeSetFinal", arguments);
            operation.willSort && self.printSort(false, operation);
            for (i = 0; target = operation.toHide[i]; i++) {
              target.hide();
            }
            self.callActions("afterSetFinal", arguments);
          },
          /**
           * @private
           * @instance
           * @since   2.0.0
           * @param   {Operation}     operation
           * @return  {void}
           */
          getFinalMixData: function(operation) {
            var self = this, parentStyle = null, parentRect = null, target = null, i = -1;
            self.callActions("beforeGetFinalMixData", arguments);
            for (i = 0; target = operation.show[i]; i++) {
              operation.showPosData[i].finalPosData = target.getPosData();
            }
            for (i = 0; target = operation.toHide[i]; i++) {
              operation.toHidePosData[i].finalPosData = target.getPosData();
            }
            if (self.config.animation.clampHeight || self.config.animation.clampWidth) {
              self.dom.parent.style.height = self.dom.parent.style.width = self.dom.parent.style.overflow = "";
            }
            if (!self.incPadding) {
              parentStyle = window2.getComputedStyle(self.dom.parent);
            }
            parentRect = self.dom.parent.getBoundingClientRect();
            operation.newX = parentRect.left;
            operation.newY = parentRect.top;
            operation.newHeight = self.incPadding ? parentRect.height : parentRect.height - parseFloat(parentStyle.paddingTop) - parseFloat(parentStyle.paddingBottom) - parseFloat(parentStyle.borderTop) - parseFloat(parentStyle.borderBottom);
            operation.newWidth = self.incPadding ? parentRect.width : parentRect.width - parseFloat(parentStyle.paddingLeft) - parseFloat(parentStyle.paddingRight) - parseFloat(parentStyle.borderLeft) - parseFloat(parentStyle.borderRight);
            operation.viewportDeltaX = operation.docState.viewportWidth - this.dom.document.documentElement.clientWidth;
            operation.viewportDeltaY = operation.docState.viewportHeight - this.dom.document.documentElement.clientHeight;
            if (operation.willSort) {
              self.printSort(true, operation);
            }
            for (i = 0; target = operation.toShow[i]; i++) {
              target.hide();
            }
            for (i = 0; target = operation.toHide[i]; i++) {
              target.show();
            }
            if (operation.willChangeLayout) {
              h.removeClass(self.dom.container, operation.newContainerClassName);
              h.addClass(self.dom.container, self.config.layout.containerClassName);
            }
            self.callActions("afterGetFinalMixData", arguments);
          },
          /**
           * @private
           * @instance
           * @since    3.0.0
           * @param    {Operation}     operation
           */
          getTweenData: function(operation) {
            var self = this, target = null, posData = null, effectNames = Object.getOwnPropertyNames(self.effectsIn), effectName = "", effect = null, widthChange = -1, heightChange = -1, i = -1, j = -1;
            self.callActions("beforeGetTweenData", arguments);
            for (i = 0; target = operation.show[i]; i++) {
              posData = operation.showPosData[i];
              posData.posIn = new mixitup2.StyleData();
              posData.posOut = new mixitup2.StyleData();
              posData.tweenData = new mixitup2.StyleData();
              if (target.isShown) {
                posData.posIn.x = posData.startPosData.x - posData.interPosData.x;
                posData.posIn.y = posData.startPosData.y - posData.interPosData.y;
              } else {
                posData.posIn.x = posData.posIn.y = 0;
              }
              posData.posOut.x = posData.finalPosData.x - posData.interPosData.x;
              posData.posOut.y = posData.finalPosData.y - posData.interPosData.y;
              posData.posIn.opacity = target.isShown ? 1 : self.effectsIn.opacity;
              posData.posOut.opacity = 1;
              posData.tweenData.opacity = posData.posOut.opacity - posData.posIn.opacity;
              if (!target.isShown && !self.config.animation.nudge) {
                posData.posIn.x = posData.posOut.x;
                posData.posIn.y = posData.posOut.y;
              }
              posData.tweenData.x = posData.posOut.x - posData.posIn.x;
              posData.tweenData.y = posData.posOut.y - posData.posIn.y;
              if (self.config.animation.animateResizeTargets) {
                posData.posIn.width = posData.startPosData.width;
                posData.posIn.height = posData.startPosData.height;
                widthChange = (posData.startPosData.width || posData.finalPosData.width) - posData.interPosData.width;
                posData.posIn.marginRight = posData.startPosData.marginRight - widthChange;
                heightChange = (posData.startPosData.height || posData.finalPosData.height) - posData.interPosData.height;
                posData.posIn.marginBottom = posData.startPosData.marginBottom - heightChange;
                posData.posOut.width = posData.finalPosData.width;
                posData.posOut.height = posData.finalPosData.height;
                widthChange = (posData.finalPosData.width || posData.startPosData.width) - posData.interPosData.width;
                posData.posOut.marginRight = posData.finalPosData.marginRight - widthChange;
                heightChange = (posData.finalPosData.height || posData.startPosData.height) - posData.interPosData.height;
                posData.posOut.marginBottom = posData.finalPosData.marginBottom - heightChange;
                posData.tweenData.width = posData.posOut.width - posData.posIn.width;
                posData.tweenData.height = posData.posOut.height - posData.posIn.height;
                posData.tweenData.marginRight = posData.posOut.marginRight - posData.posIn.marginRight;
                posData.tweenData.marginBottom = posData.posOut.marginBottom - posData.posIn.marginBottom;
              }
              for (j = 0; effectName = effectNames[j]; j++) {
                effect = self.effectsIn[effectName];
                if (!(effect instanceof mixitup2.TransformData) || !effect.value) continue;
                posData.posIn[effectName].value = effect.value;
                posData.posOut[effectName].value = 0;
                posData.tweenData[effectName].value = posData.posOut[effectName].value - posData.posIn[effectName].value;
                posData.posIn[effectName].unit = posData.posOut[effectName].unit = posData.tweenData[effectName].unit = effect.unit;
              }
            }
            for (i = 0; target = operation.toHide[i]; i++) {
              posData = operation.toHidePosData[i];
              posData.posIn = new mixitup2.StyleData();
              posData.posOut = new mixitup2.StyleData();
              posData.tweenData = new mixitup2.StyleData();
              posData.posIn.x = target.isShown ? posData.startPosData.x - posData.interPosData.x : 0;
              posData.posIn.y = target.isShown ? posData.startPosData.y - posData.interPosData.y : 0;
              posData.posOut.x = self.config.animation.nudge ? 0 : posData.posIn.x;
              posData.posOut.y = self.config.animation.nudge ? 0 : posData.posIn.y;
              posData.tweenData.x = posData.posOut.x - posData.posIn.x;
              posData.tweenData.y = posData.posOut.y - posData.posIn.y;
              if (self.config.animation.animateResizeTargets) {
                posData.posIn.width = posData.startPosData.width;
                posData.posIn.height = posData.startPosData.height;
                widthChange = posData.startPosData.width - posData.interPosData.width;
                posData.posIn.marginRight = posData.startPosData.marginRight - widthChange;
                heightChange = posData.startPosData.height - posData.interPosData.height;
                posData.posIn.marginBottom = posData.startPosData.marginBottom - heightChange;
              }
              posData.posIn.opacity = 1;
              posData.posOut.opacity = self.effectsOut.opacity;
              posData.tweenData.opacity = posData.posOut.opacity - posData.posIn.opacity;
              for (j = 0; effectName = effectNames[j]; j++) {
                effect = self.effectsOut[effectName];
                if (!(effect instanceof mixitup2.TransformData) || !effect.value) continue;
                posData.posIn[effectName].value = 0;
                posData.posOut[effectName].value = effect.value;
                posData.tweenData[effectName].value = posData.posOut[effectName].value - posData.posIn[effectName].value;
                posData.posIn[effectName].unit = posData.posOut[effectName].unit = posData.tweenData[effectName].unit = effect.unit;
              }
            }
            self.callActions("afterGetTweenData", arguments);
          },
          /**
           * @private
           * @instance
           * @since   3.0.0
           * @param   {Operation}     operation
           * @return  {void}
           */
          moveTargets: function(operation) {
            var self = this, target = null, moveData = null, posData = null, statusChange = "", willTransition = false, staggerIndex = -1, i = -1, checkProgress = self.checkProgress.bind(self);
            self.callActions("beforeMoveTargets", arguments);
            for (i = 0; target = operation.show[i]; i++) {
              moveData = new mixitup2.IMoveData();
              posData = operation.showPosData[i];
              statusChange = target.isShown ? "none" : "show";
              willTransition = self.willTransition(
                statusChange,
                operation.hasEffect,
                posData.posIn,
                posData.posOut
              );
              if (willTransition) {
                staggerIndex++;
              }
              target.show();
              moveData.posIn = posData.posIn;
              moveData.posOut = posData.posOut;
              moveData.statusChange = statusChange;
              moveData.staggerIndex = staggerIndex;
              moveData.operation = operation;
              moveData.callback = willTransition ? checkProgress : null;
              target.move(moveData);
            }
            for (i = 0; target = operation.toHide[i]; i++) {
              posData = operation.toHidePosData[i];
              moveData = new mixitup2.IMoveData();
              statusChange = "hide";
              willTransition = self.willTransition(statusChange, posData.posIn, posData.posOut);
              moveData.posIn = posData.posIn;
              moveData.posOut = posData.posOut;
              moveData.statusChange = statusChange;
              moveData.staggerIndex = i;
              moveData.operation = operation;
              moveData.callback = willTransition ? checkProgress : null;
              target.move(moveData);
            }
            if (self.config.animation.animateResizeContainer) {
              self.dom.parent.style[mixitup2.features.transitionProp] = "height " + self.config.animation.duration + "ms ease, width " + self.config.animation.duration + "ms ease ";
              requestAnimationFrame(function() {
                if (operation.startHeight !== operation.newHeight && operation.viewportDeltaY !== operation.startHeight - operation.newHeight) {
                  self.dom.parent.style.height = operation.newHeight + "px";
                }
                if (operation.startWidth !== operation.newWidth && operation.viewportDeltaX !== operation.startWidth - operation.newWidth) {
                  self.dom.parent.style.width = operation.newWidth + "px";
                }
              });
            }
            if (operation.willChangeLayout) {
              h.removeClass(self.dom.container, self.config.layout.ContainerClassName);
              h.addClass(self.dom.container, operation.newContainerClassName);
            }
            self.callActions("afterMoveTargets", arguments);
          },
          /**
           * @private
           * @instance
           * @return  {boolean}
           */
          hasEffect: function() {
            var self = this, EFFECTABLES = [
              "scale",
              "translateX",
              "translateY",
              "translateZ",
              "rotateX",
              "rotateY",
              "rotateZ"
            ], effectName = "", effect = null, result = false, value = -1, i = -1;
            if (self.effectsIn.opacity !== 1) {
              return self.callFilters("resultHasEffect", true, arguments);
            }
            for (i = 0; effectName = EFFECTABLES[i]; i++) {
              effect = self.effectsIn[effectName];
              value = effect.value !== "undefined" ? effect.value : effect;
              if (value !== 0) {
                result = true;
                break;
              }
            }
            return self.callFilters("resultHasEffect", result, arguments);
          },
          /**
           * Determines if a target element will transition in
           * some fasion and therefore requires binding of
           * transitionEnd
           *
           * @private
           * @instance
           * @since   3.0.0
           * @param   {string}        statusChange
           * @param   {boolean}       hasEffect
           * @param   {StyleData}     posIn
           * @param   {StyleData}     posOut
           * @return  {boolean}
           */
          willTransition: function(statusChange, hasEffect, posIn, posOut) {
            var self = this, result = false;
            if (!h.isVisible(self.dom.container)) {
              result = false;
            } else if (statusChange !== "none" && hasEffect || posIn.x !== posOut.x || posIn.y !== posOut.y) {
              result = true;
            } else if (self.config.animation.animateResizeTargets) {
              result = posIn.width !== posOut.width || posIn.height !== posOut.height || posIn.marginRight !== posOut.marginRight || posIn.marginTop !== posOut.marginTop;
            } else {
              result = false;
            }
            return self.callFilters("resultWillTransition", result, arguments);
          },
          /**
           * @private
           * @instance
           * @since   2.0.0
           * @param   {Operation}     operation
           * @return  {void}
           */
          checkProgress: function(operation) {
            var self = this;
            self.targetsDone++;
            if (self.targetsBound === self.targetsDone) {
              self.cleanUp(operation);
            }
          },
          /**
           * @private
           * @instance
           * @since   2.0.0
           * @param   {Operation}     operation
           * @return  {void}
           */
          cleanUp: function(operation) {
            var self = this, target = null, whitespaceBefore = null, whitespaceAfter = null, nextInQueue = null, i = -1;
            self.callActions("beforeCleanUp", arguments);
            self.targetsMoved = self.targetsImmovable = self.targetsBound = self.targetsDone = 0;
            for (i = 0; target = operation.show[i]; i++) {
              target.cleanUp();
              target.show();
            }
            for (i = 0; target = operation.toHide[i]; i++) {
              target.cleanUp();
              target.hide();
            }
            if (operation.willSort) {
              self.printSort(false, operation);
            }
            self.dom.parent.style[mixitup2.features.transitionProp] = self.dom.parent.style.height = self.dom.parent.style.width = self.dom.parent.style.overflow = self.dom.parent.style[mixitup2.features.perspectiveProp] = self.dom.parent.style[mixitup2.features.perspectiveOriginProp] = "";
            if (operation.willChangeLayout) {
              h.removeClass(self.dom.container, operation.startContainerClassName);
              h.addClass(self.dom.container, operation.newContainerClassName);
            }
            if (operation.toRemove.length) {
              for (i = 0; target = self.targets[i]; i++) {
                if (operation.toRemove.indexOf(target) > -1) {
                  if ((whitespaceBefore = target.dom.el.previousSibling) && whitespaceBefore.nodeName === "#text" && (whitespaceAfter = target.dom.el.nextSibling) && whitespaceAfter.nodeName === "#text") {
                    h.removeWhitespace(whitespaceBefore);
                  }
                  if (!operation.willSort) {
                    self.dom.parent.removeChild(target.dom.el);
                  }
                  self.targets.splice(i, 1);
                  target.isInDom = false;
                  i--;
                }
              }
              self.origOrder = self.targets;
            }
            if (operation.willSort) {
              self.targets = operation.newOrder;
            }
            self.state = operation.newState;
            self.lastOperation = operation;
            self.dom.targets = self.state.targets;
            mixitup2.events.fire("mixEnd", self.dom.container, {
              state: self.state,
              instance: self
            }, self.dom.document);
            if (typeof self.config.callbacks.onMixEnd === "function") {
              self.config.callbacks.onMixEnd.call(self.dom.container, self.state, self);
            }
            if (operation.hasFailed) {
              mixitup2.events.fire("mixFail", self.dom.container, {
                state: self.state,
                instance: self
              }, self.dom.document);
              if (typeof self.config.callbacks.onMixFail === "function") {
                self.config.callbacks.onMixFail.call(self.dom.container, self.state, self);
              }
              h.addClass(self.dom.container, h.getClassname(self.config.classNames, "container", self.config.classNames.modifierFailed));
            }
            if (typeof self.userCallback === "function") {
              self.userCallback.call(self.dom.container, self.state, self);
            }
            if (typeof self.userDeferred.resolve === "function") {
              self.userDeferred.resolve(self.state);
            }
            self.userCallback = null;
            self.userDeferred = null;
            self.lastClicked = null;
            self.isToggling = false;
            self.isBusy = false;
            if (self.queue.length) {
              self.callActions("beforeReadQueueCleanUp", arguments);
              nextInQueue = self.queue.shift();
              self.userDeferred = nextInQueue.deferred;
              self.isToggling = nextInQueue.isToggling;
              self.lastClicked = nextInQueue.triggerElement;
              if (nextInQueue.instruction.command instanceof mixitup2.CommandMultimix) {
                self.multimix.apply(self, nextInQueue.args);
              } else {
                self.dataset.apply(self, nextInQueue.args);
              }
            }
            self.callActions("afterCleanUp", arguments);
          },
          /**
           * @private
           * @instance
           * @since   2.0.0
           * @param   {Array<*>}  args
           * @return  {mixitup.UserInstruction}
           */
          parseMultimixArgs: function(args) {
            var self = this, instruction = new mixitup2.UserInstruction(), arg = null, i = -1;
            instruction.animate = self.config.animation.enable;
            instruction.command = new mixitup2.CommandMultimix();
            for (i = 0; i < args.length; i++) {
              arg = args[i];
              if (arg === null) continue;
              if (typeof arg === "object") {
                h.extend(instruction.command, arg);
              } else if (typeof arg === "boolean") {
                instruction.animate = arg;
              } else if (typeof arg === "function") {
                instruction.callback = arg;
              }
            }
            if (instruction.command.insert && !(instruction.command.insert instanceof mixitup2.CommandInsert)) {
              instruction.command.insert = self.parseInsertArgs([instruction.command.insert]).command;
            }
            if (instruction.command.remove && !(instruction.command.remove instanceof mixitup2.CommandRemove)) {
              instruction.command.remove = self.parseRemoveArgs([instruction.command.remove]).command;
            }
            if (instruction.command.filter && !(instruction.command.filter instanceof mixitup2.CommandFilter)) {
              instruction.command.filter = self.parseFilterArgs([instruction.command.filter]).command;
            }
            if (instruction.command.sort && !(instruction.command.sort instanceof mixitup2.CommandSort)) {
              instruction.command.sort = self.parseSortArgs([instruction.command.sort]).command;
            }
            if (instruction.command.changeLayout && !(instruction.command.changeLayout instanceof mixitup2.CommandChangeLayout)) {
              instruction.command.changeLayout = self.parseChangeLayoutArgs([instruction.command.changeLayout]).command;
            }
            instruction = self.callFilters("instructionParseMultimixArgs", instruction, arguments);
            h.freeze(instruction);
            return instruction;
          },
          /**
           * @private
           * @instance
           * @since   2.0.0
           * @param   {Array<*>}  args
           * @return  {mixitup.UserInstruction}
           */
          parseFilterArgs: function(args) {
            var self = this, instruction = new mixitup2.UserInstruction(), arg = null, i = -1;
            instruction.animate = self.config.animation.enable;
            instruction.command = new mixitup2.CommandFilter();
            for (i = 0; i < args.length; i++) {
              arg = args[i];
              if (typeof arg === "string") {
                instruction.command.selector = arg;
              } else if (arg === null) {
                instruction.command.collection = [];
              } else if (typeof arg === "object" && h.isElement(arg, self.dom.document)) {
                instruction.command.collection = [arg];
              } else if (typeof arg === "object" && typeof arg.length !== "undefined") {
                instruction.command.collection = h.arrayFromList(arg);
              } else if (typeof arg === "object") {
                h.extend(instruction.command, arg);
              } else if (typeof arg === "boolean") {
                instruction.animate = arg;
              } else if (typeof arg === "function") {
                instruction.callback = arg;
              }
            }
            if (instruction.command.selector && instruction.command.collection) {
              throw new Error(mixitup2.messages.errorFilterInvalidArguments());
            }
            instruction = self.callFilters("instructionParseFilterArgs", instruction, arguments);
            h.freeze(instruction);
            return instruction;
          },
          parseSortArgs: function(args) {
            var self = this, instruction = new mixitup2.UserInstruction(), arg = null, sortString = "", i = -1;
            instruction.animate = self.config.animation.enable;
            instruction.command = new mixitup2.CommandSort();
            for (i = 0; i < args.length; i++) {
              arg = args[i];
              if (arg === null) continue;
              switch (typeof arg) {
                case "string":
                  sortString = arg;
                  break;
                case "object":
                  if (arg.length) {
                    instruction.command.collection = h.arrayFromList(arg);
                  }
                  break;
                case "boolean":
                  instruction.animate = arg;
                  break;
                case "function":
                  instruction.callback = arg;
                  break;
              }
            }
            if (sortString) {
              instruction.command = self.parseSortString(sortString, instruction.command);
            }
            instruction = self.callFilters("instructionParseSortArgs", instruction, arguments);
            h.freeze(instruction);
            return instruction;
          },
          /**
           * @private
           * @instance
           * @since   2.0.0
           * @param   {Array<*>}  args
           * @return  {mixitup.UserInstruction}
           */
          parseInsertArgs: function(args) {
            var self = this, instruction = new mixitup2.UserInstruction(), arg = null, i = -1;
            instruction.animate = self.config.animation.enable;
            instruction.command = new mixitup2.CommandInsert();
            for (i = 0; i < args.length; i++) {
              arg = args[i];
              if (arg === null) continue;
              if (typeof arg === "number") {
                instruction.command.index = arg;
              } else if (typeof arg === "string" && ["before", "after"].indexOf(arg) > -1) {
                instruction.command.position = arg;
              } else if (typeof arg === "string") {
                instruction.command.collection = h.arrayFromList(h.createElement(arg).childNodes);
              } else if (typeof arg === "object" && h.isElement(arg, self.dom.document)) {
                !instruction.command.collection.length ? instruction.command.collection = [arg] : instruction.command.sibling = arg;
              } else if (typeof arg === "object" && arg.length) {
                !instruction.command.collection.length ? instruction.command.collection = arg : instruction.command.sibling = arg[0];
              } else if (typeof arg === "object" && arg.childNodes && arg.childNodes.length) {
                !instruction.command.collection.length ? instruction.command.collection = h.arrayFromList(arg.childNodes) : instruction.command.sibling = arg.childNodes[0];
              } else if (typeof arg === "object") {
                h.extend(instruction.command, arg);
              } else if (typeof arg === "boolean") {
                instruction.animate = arg;
              } else if (typeof arg === "function") {
                instruction.callback = arg;
              }
            }
            if (instruction.command.index && instruction.command.sibling) {
              throw new Error(mixitup2.messages.errorInsertInvalidArguments());
            }
            if (!instruction.command.collection.length && self.config.debug.showWarnings) {
              console.warn(mixitup2.messages.warningInsertNoElements());
            }
            instruction = self.callFilters("instructionParseInsertArgs", instruction, arguments);
            h.freeze(instruction);
            return instruction;
          },
          /**
           * @private
           * @instance
           * @since   3.0.0
           * @param   {Array<*>}  args
           * @return  {mixitup.UserInstruction}
           */
          parseRemoveArgs: function(args) {
            var self = this, instruction = new mixitup2.UserInstruction(), target = null, arg = null, i = -1;
            instruction.animate = self.config.animation.enable;
            instruction.command = new mixitup2.CommandRemove();
            for (i = 0; i < args.length; i++) {
              arg = args[i];
              if (arg === null) continue;
              switch (typeof arg) {
                case "number":
                  if (self.targets[arg]) {
                    instruction.command.targets[0] = self.targets[arg];
                  }
                  break;
                case "string":
                  instruction.command.collection = h.arrayFromList(self.dom.parent.querySelectorAll(arg));
                  break;
                case "object":
                  if (arg && arg.length) {
                    instruction.command.collection = arg;
                  } else if (h.isElement(arg, self.dom.document)) {
                    instruction.command.collection = [arg];
                  } else {
                    h.extend(instruction.command, arg);
                  }
                  break;
                case "boolean":
                  instruction.animate = arg;
                  break;
                case "function":
                  instruction.callback = arg;
                  break;
              }
            }
            if (instruction.command.collection.length) {
              for (i = 0; target = self.targets[i]; i++) {
                if (instruction.command.collection.indexOf(target.dom.el) > -1) {
                  instruction.command.targets.push(target);
                }
              }
            }
            if (!instruction.command.targets.length && self.config.debug.showWarnings) {
              console.warn(mixitup2.messages.warningRemoveNoElements());
            }
            h.freeze(instruction);
            return instruction;
          },
          /**
           * @private
           * @instance
           * @since   3.0.0
           * @param   {Array<*>}  args
           * @return  {mixitup.UserInstruction}
           */
          parseDatasetArgs: function(args) {
            var self = this, instruction = new mixitup2.UserInstruction(), arg = null, i = -1;
            instruction.animate = self.config.animation.enable;
            instruction.command = new mixitup2.CommandDataset();
            for (i = 0; i < args.length; i++) {
              arg = args[i];
              if (arg === null) continue;
              switch (typeof arg) {
                case "object":
                  if (Array.isArray(arg) || typeof arg.length === "number") {
                    instruction.command.dataset = arg;
                  } else {
                    h.extend(instruction.command, arg);
                  }
                  break;
                case "boolean":
                  instruction.animate = arg;
                  break;
                case "function":
                  instruction.callback = arg;
                  break;
              }
            }
            h.freeze(instruction);
            return instruction;
          },
          /**
           * @private
           * @instance
           * @since   3.0.0
           * @param   {Array<*>}  args
           * @return  {mixitup.UserInstruction}
           */
          parseChangeLayoutArgs: function(args) {
            var self = this, instruction = new mixitup2.UserInstruction(), arg = null, i = -1;
            instruction.animate = self.config.animation.enable;
            instruction.command = new mixitup2.CommandChangeLayout();
            for (i = 0; i < args.length; i++) {
              arg = args[i];
              if (arg === null) continue;
              switch (typeof arg) {
                case "string":
                  instruction.command.containerClassName = arg;
                  break;
                case "object":
                  h.extend(instruction.command, arg);
                  break;
                case "boolean":
                  instruction.animate = arg;
                  break;
                case "function":
                  instruction.callback = arg;
                  break;
              }
            }
            h.freeze(instruction);
            return instruction;
          },
          /**
           * @private
           * @instance
           * @since       3.0.0
           * @param       {mixitup.QueueItem}         queueItem
           * @return      {Promise.<mixitup.State>}
           */
          queueMix: function(queueItem) {
            var self = this, deferred = null, toggleSelector = "";
            self.callActions("beforeQueueMix", arguments);
            deferred = h.defer(mixitup2.libraries);
            if (self.config.animation.queue && self.queue.length < self.config.animation.queueLimit) {
              queueItem.deferred = deferred;
              self.queue.push(queueItem);
              if (self.config.controls.enable) {
                if (self.isToggling) {
                  self.buildToggleArray(queueItem.instruction.command);
                  toggleSelector = self.getToggleSelector();
                  self.updateControls({
                    filter: {
                      selector: toggleSelector
                    }
                  });
                } else {
                  self.updateControls(queueItem.instruction.command);
                }
              }
            } else {
              if (self.config.debug.showWarnings) {
                console.warn(mixitup2.messages.warningMultimixInstanceQueueFull());
              }
              deferred.resolve(self.state);
              mixitup2.events.fire("mixBusy", self.dom.container, {
                state: self.state,
                instance: self
              }, self.dom.document);
              if (typeof self.config.callbacks.onMixBusy === "function") {
                self.config.callbacks.onMixBusy.call(self.dom.container, self.state, self);
              }
            }
            return self.callFilters("promiseQueueMix", deferred.promise, arguments);
          },
          /**
           * @private
           * @instance
           * @since   3.0.0
           * @param   {Array.<object>}    newDataset
           * @return  {Operation}
           */
          getDataOperation: function(newDataset) {
            var self = this, operation = new mixitup2.Operation(), startDataset = [];
            operation = self.callFilters("operationUnmappedGetDataOperation", operation, arguments);
            if (self.dom.targets.length && !(startDataset = self.state.activeDataset || []).length) {
              throw new Error(mixitup2.messages.errorDatasetNotSet());
            }
            operation.id = h.randomHex();
            operation.startState = self.state;
            operation.startDataset = startDataset;
            operation.newDataset = newDataset.slice();
            self.diffDatasets(operation);
            operation.startOrder = self.targets;
            operation.newOrder = operation.show;
            if (self.config.animation.enable) {
              self.getStartMixData(operation);
              self.setInter(operation);
              operation.docState = h.getDocumentState(self.dom.document);
              self.getInterMixData(operation);
              self.setFinal(operation);
              self.getFinalMixData(operation);
              self.parseEffects();
              operation.hasEffect = self.hasEffect();
              self.getTweenData(operation);
            }
            self.targets = operation.show.slice();
            operation.newState = self.buildState(operation);
            Array.prototype.push.apply(self.targets, operation.toRemove);
            operation = self.callFilters("operationMappedGetDataOperation", operation, arguments);
            return operation;
          },
          /**
           * @private
           * @instance
           * @since   3.0.0
           * @param   {mixitup.Operation} operation
           * @return  {void}
           */
          diffDatasets: function(operation) {
            var self = this, persistantStartIds = [], persistantNewIds = [], insertedTargets = [], data = null, target = null, el = null, frag = null, nextEl = null, uids = {}, id = "", i = -1;
            self.callActions("beforeDiffDatasets", arguments);
            for (i = 0; data = operation.newDataset[i]; i++) {
              if (typeof (id = data[self.config.data.uidKey]) === "undefined" || id.toString().length < 1) {
                throw new TypeError(mixitup2.messages.errorDatasetInvalidUidKey({
                  uidKey: self.config.data.uidKey
                }));
              }
              if (!uids[id]) {
                uids[id] = true;
              } else {
                throw new Error(mixitup2.messages.errorDatasetDuplicateUid({
                  uid: id
                }));
              }
              if ((target = self.cache[id]) instanceof mixitup2.Target) {
                if (self.config.data.dirtyCheck && !h.deepEquals(data, target.data)) {
                  el = target.render(data);
                  target.data = data;
                  if (el !== target.dom.el) {
                    if (target.isInDom) {
                      target.unbindEvents();
                      self.dom.parent.replaceChild(el, target.dom.el);
                    }
                    if (!target.isShown) {
                      el.style.display = "none";
                    }
                    target.dom.el = el;
                    if (target.isInDom) {
                      target.bindEvents();
                    }
                  }
                }
                el = target.dom.el;
              } else {
                target = new mixitup2.Target();
                target.init(null, self, data);
                target.hide();
              }
              if (!target.isInDom) {
                if (!frag) {
                  frag = self.dom.document.createDocumentFragment();
                }
                if (frag.lastElementChild) {
                  frag.appendChild(self.dom.document.createTextNode(" "));
                }
                frag.appendChild(target.dom.el);
                target.isInDom = true;
                target.unbindEvents();
                target.bindEvents();
                target.hide();
                operation.toShow.push(target);
                insertedTargets.push(target);
              } else {
                nextEl = target.dom.el.nextElementSibling;
                persistantNewIds.push(id);
                if (frag) {
                  if (frag.lastElementChild) {
                    frag.appendChild(self.dom.document.createTextNode(" "));
                  }
                  self.insertDatasetFrag(frag, target.dom.el, insertedTargets);
                  frag = null;
                }
              }
              operation.show.push(target);
            }
            if (frag) {
              nextEl = nextEl || self.config.layout.siblingAfter;
              if (nextEl) {
                frag.appendChild(self.dom.document.createTextNode(" "));
              }
              self.insertDatasetFrag(frag, nextEl, insertedTargets);
            }
            for (i = 0; data = operation.startDataset[i]; i++) {
              id = data[self.config.data.uidKey];
              target = self.cache[id];
              if (operation.show.indexOf(target) < 0) {
                operation.hide.push(target);
                operation.toHide.push(target);
                operation.toRemove.push(target);
              } else {
                persistantStartIds.push(id);
              }
            }
            if (!h.isEqualArray(persistantStartIds, persistantNewIds)) {
              operation.willSort = true;
            }
            self.callActions("afterDiffDatasets", arguments);
          },
          /**
           * @private
           * @instance
           * @since   3.1.5
           * @param   {DocumentFragment}          frag
           * @param   {(HTMLElement|null)}        nextEl
           * @param   {Array.<mixitup.Target>}    targets
           * @return  {void}
           */
          insertDatasetFrag: function(frag, nextEl, targets) {
            var self = this;
            var insertAt = nextEl ? h.arrayFromList(self.dom.parent.children).indexOf(nextEl) : self.targets.length;
            self.dom.parent.insertBefore(frag, nextEl);
            while (targets.length) {
              self.targets.splice(insertAt, 0, targets.shift());
              insertAt++;
            }
          },
          /**
           * @private
           * @instance
           * @since   3.0.0
           * @param   {mixitup.CommandSort} sortCommandA
           * @param   {mixitup.CommandSort} sortCommandB
           * @return  {boolean}
           */
          willSort: function(sortCommandA, sortCommandB) {
            var self = this, result = false;
            if (self.config.behavior.liveSort || sortCommandA.order === "random" || sortCommandA.attribute !== sortCommandB.attribute || sortCommandA.order !== sortCommandB.order || sortCommandA.collection !== sortCommandB.collection || sortCommandA.next === null && sortCommandB.next || sortCommandA.next && sortCommandB.next === null) {
              result = true;
            } else if (sortCommandA.next && sortCommandB.next) {
              result = self.willSort(sortCommandA.next, sortCommandB.next);
            } else {
              result = false;
            }
            return self.callFilters("resultWillSort", result, arguments);
          },
          /**
           * A shorthand method for `.filter('all')`. Shows all targets in the container.
           *
           * @example
           *
           * .show()
           *
           * @example <caption>Example: Showing all targets</caption>
           *
           * mixer.show()
           *     .then(function(state) {
           *         console.log(state.totalShow === state.totalTargets); // true
           *     });
           *
           * @public
           * @instance
           * @since       3.0.0
           * @return      {Promise.<mixitup.State>}
           */
          show: function() {
            var self = this;
            return self.filter("all");
          },
          /**
           * A shorthand method for `.filter('none')`. Hides all targets in the container.
           *
           * @example
           *
           * .hide()
           *
           * @example <caption>Example: Hiding all targets</caption>
           *
           * mixer.hide()
           *     .then(function(state) {
           *         console.log(state.totalShow === 0); // true
           *         console.log(state.totalHide === state.totalTargets); // true
           *     });
           *
           * @public
           * @instance
           * @since       3.0.0
           * @return      {Promise.<mixitup.State>}
           */
          hide: function() {
            var self = this;
            return self.filter("none");
          },
          /**
           * Returns a boolean indicating whether or not a MixItUp operation is
           * currently in progress.
           *
           * @example
           *
           * .isMixing()
           *
           * @example <caption>Example: Checking the status of a mixer</caption>
           *
           * mixer.sort('random', function() {
           *     console.log(mixer.isMixing()) // false
           * });
           *
           * console.log(mixer.isMixing()) // true
           *
           * @public
           * @instance
           * @since   2.0.0
           * @return  {boolean}
           */
          isMixing: function() {
            var self = this;
            return self.isBusy;
          },
          /**
           * Filters all targets in the container by a provided selector string, or the values `'all'`
           * or `'none'`. Only targets matching the selector will be shown.
           *
           * @example
           *
           * .filter(selector [, animate] [, callback])
           *
           * @example <caption>Example 1: Filtering targets by a class selector</caption>
           *
           * mixer.filter('.category-a')
           *     .then(function(state) {
           *         console.log(state.totalShow === containerEl.querySelectorAll('.category-a').length); // true
           *     });
           *
           * @example <caption>Example 2: Filtering targets by an attribute selector</caption>
           *
           * mixer.filter('[data-category~="a"]')
           *     .then(function(state) {
           *         console.log(state.totalShow === containerEl.querySelectorAll('[data-category~="a"]').length); // true
           *     });
           *
           * @example <caption>Example 3: Filtering targets by a compound selector</caption>
           *
           * // Show only those targets with the classes 'category-a' AND 'category-b'
           *
           * mixer.filter('.category-a.category-c')
           *     .then(function(state) {
           *         console.log(state.totalShow === containerEl.querySelectorAll('.category-a.category-c').length); // true
           *     });
           *
           * @example <caption>Example 4: Filtering via an element collection</caption>
           *
           * var collection = Array.from(container.querySelectorAll('.mix'));
           *
           * console.log(collection.length); // 34
           *
           * // Filter the collection manually using Array.prototype.filter
           *
           * var filtered = collection.filter(function(target) {
           *    return parseInt(target.getAttribute('data-price')) > 10;
           * });
           *
           * console.log(filtered.length); // 22
           *
           * // Pass the filtered collection to MixItUp
           *
           * mixer.filter(filtered)
           *    .then(function(state) {
           *        console.log(state.activeFilter.collection.length === 22); // true
           *    });
           *
           * @public
           * @instance
           * @since       2.0.0
           * @param       {(string|HTMLElement|Array.<HTMLElement>)} selector
           *      Any valid CSS selector (i.e. `'.category-a'`), or the values `'all'` or `'none'`. The filter method also accepts a reference to single target element or a collection of target elements to show.
           * @param       {boolean}   [animate=true]
           *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
           * @param       {function}  [callback=null]
           *      An optional callback function to be invoked after the operation has completed.
           * @return      {Promise.<mixitup.State>}
           *      A promise resolving with the current state object.
           */
          filter: function() {
            var self = this, instruction = self.parseFilterArgs(arguments);
            return self.multimix({
              filter: instruction.command
            }, instruction.animate, instruction.callback);
          },
          /**
           * Adds an additional selector to the currently active filter selector, concatenating
           * as per the logic defined in `controls.toggleLogic`.
           *
           * @example
           *
           * .toggleOn(selector [, animate] [, callback])
           *
           * @example <caption>Example: Toggling on a filter selector</caption>
           *
           * console.log(mixer.getState().activeFilter.selector); // '.category-a'
           *
           * mixer.toggleOn('.category-b')
           *     .then(function(state) {
           *         console.log(state.activeFilter.selector); // '.category-a, .category-b'
           *     });
           *
           * @public
           * @instance
           * @since       3.0.0
           * @param       {string}    selector
           *      Any valid CSS selector (i.e. `'.category-a'`)
           * @param       {boolean}   [animate=true]
           *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
           * @param       {function}  [callback=null]
           *      An optional callback function to be invoked after the operation has completed.
           * @return      {Promise.<mixitup.State>}
           *      A promise resolving with the current state object.
           */
          toggleOn: function() {
            var self = this, instruction = self.parseFilterArgs(arguments), selector = instruction.command.selector, toggleSelector = "";
            self.isToggling = true;
            if (self.toggleArray.indexOf(selector) < 0) {
              self.toggleArray.push(selector);
            }
            toggleSelector = self.getToggleSelector();
            return self.multimix({
              filter: toggleSelector
            }, instruction.animate, instruction.callback);
          },
          /**
           * Removes a selector from the active filter selector.
           *
           * @example
           *
           * .toggleOff(selector [, animate] [, callback])
           *
           * @example <caption>Example: Toggling off a filter selector</caption>
           *
           * console.log(mixer.getState().activeFilter.selector); // '.category-a, .category-b'
           *
           * mixer.toggleOff('.category-b')
           *     .then(function(state) {
           *         console.log(state.activeFilter.selector); // '.category-a'
           *     });
           *
           * @public
           * @instance
           * @since       3.0.0
           * @param       {string}    selector
           *      Any valid CSS selector (i.e. `'.category-a'`)
           * @param       {boolean}   [animate=true]
           *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
           * @param       {function}  [callback=null]
           *      An optional callback function to be invoked after the operation has completed.
           * @return      {Promise.<mixitup.State>}
           *      A promise resolving with the current state object.
           */
          toggleOff: function() {
            var self = this, instruction = self.parseFilterArgs(arguments), selector = instruction.command.selector, selectorIndex = self.toggleArray.indexOf(selector), toggleSelector = "";
            self.isToggling = true;
            if (selectorIndex > -1) {
              self.toggleArray.splice(selectorIndex, 1);
            }
            toggleSelector = self.getToggleSelector();
            return self.multimix({
              filter: toggleSelector
            }, instruction.animate, instruction.callback);
          },
          /**
           * Sorts all targets in the container according to a provided sort string.
           *
           * @example
           *
           * .sort(sortString [, animate] [, callback])
           *
           * @example <caption>Example 1: Sorting by the default DOM order</caption>
           *
           * // Reverse the default order of the targets
           *
           * mixer.sort('default:desc')
           *     .then(function(state) {
           *         console.log(state.activeSort.attribute === 'default'); // true
           *         console.log(state.activeSort.order === 'desc'); // true
           *     });
           *
           * @example <caption>Example 2: Sorting by a custom data-attribute</caption>
           *
           * // Sort the targets by the value of a `data-published-date` attribute
           *
           * mixer.sort('published-date:asc')
           *     .then(function(state) {
           *         console.log(state.activeSort.attribute === 'published-date'); // true
           *         console.log(state.activeSort.order === 'asc'); // true
           *     });
           *
           * @example <caption>Example 3: Sorting by multiple attributes</caption>
           *
           * // Sort the targets by the value of a `data-published-date` attribute, then by `data-title`
           *
           * mixer.sort('published-date:desc data-title:asc')
           *     .then(function(state) {
           *         console.log(state.activeSort.attribute === 'published-date'); // true
           *         console.log(state.activeSort.order === 'desc'); // true
           *
           *         console.log(state.activeSort.next.attribute === 'title'); // true
           *         console.log(state.activeSort.next.order === 'asc'); // true
           *     });
           *
           * @example <caption>Example 4: Sorting by random</caption>
           *
           * mixer.sort('random')
           *     .then(function(state) {
           *         console.log(state.activeSort.order === 'random') // true
           *     });
           *
           * @example <caption>Example 5: Sorting via an element collection</caption>
           *
           * var collection = Array.from(container.querySelectorAll('.mix'));
           *
           * // Swap the position of two elements in the collection:
           *
           * var temp = collection[1];
           *
           * collection[1] = collection[0];
           * collection[0] = temp;
           *
           * // Pass the sorted collection to MixItUp
           *
           * mixer.sort(collection)
           *     .then(function(state) {
           *         console.log(state.targets[0] === collection[0]); // true
           *     });
           *
           * @public
           * @instance
           * @since       2.0.0
           * @param       {(string|Array.<HTMLElement>)}    sortString
           *      A valid sort string (e.g. `'default'`, `'published-date:asc'`, or `'random'`). The sort method also accepts an array of all target elements in a user-defined order.
           * @param       {boolean}   [animate=true]
           *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
           * @param       {function}  [callback=null]
           *      An optional callback function to be invoked after the operation has completed.
           * @return      {Promise.<mixitup.State>}
           *      A promise resolving with the current state object.
           */
          sort: function() {
            var self = this, instruction = self.parseSortArgs(arguments);
            return self.multimix({
              sort: instruction.command
            }, instruction.animate, instruction.callback);
          },
          /**
           * Changes the layout of the container by adding, removing or updating a
           * layout-specific class name. If `animation.animateResizetargets` is
           * enabled, MixItUp will attempt to gracefully animate the width, height,
           * and position of targets between layout states.
           *
           * @example
           *
           * .changeLayout(containerClassName [, animate] [, callback])
           *
           * @example <caption>Example 1: Adding a new class name to the container</caption>
           *
           * mixer.changeLayout('container-list')
           *      .then(function(state) {
           *          console.log(state.activeContainerClass === 'container-list'); // true
           *      });
           *
           * @example <caption>Example 2: Removing a previously added class name from the container</caption>
           *
           * mixer.changeLayout('')
           *      .then(function(state) {
           *          console.log(state.activeContainerClass === ''); // true
           *      });
           *
           * @public
           * @instance
           * @since       2.0.0
           * @param       {string}    containerClassName
           *      A layout-specific class name to add to the container.
           * @param       {boolean}   [animate=true]
           *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
           * @param       {function}  [callback=null]
           *      An optional callback function to be invoked after the operation has completed.
           * @return      {Promise.<mixitup.State>}
           *      A promise resolving with the current state object.
           */
          changeLayout: function() {
            var self = this, instruction = self.parseChangeLayoutArgs(arguments);
            return self.multimix({
              changeLayout: instruction.command
            }, instruction.animate, instruction.callback);
          },
          /**
           * Updates the contents and order of the container to reflect the provided dataset,
           * if the dataset API is in use.
           *
           * The dataset API is designed for use in API-driven JavaScript applications, and
           * can be used instead of DOM-based methods such as `.filter()`, `.sort()`,
           * `.insert()`, etc. When used, insertion, removal, sorting and pagination can be
           * achieved purely via changes to your data model, without the uglyness of having
           * to interact with or query the DOM directly.
           *
           * @example
           *
           * .dataset(dataset [, animate] [, callback])
           *
           * @example <caption>Example 1: Rendering a dataset</caption>
           *
           * var myDataset = [
           *     {id: 1, ...},
           *     {id: 2, ...},
           *     {id: 3, ...}
           * ];
           *
           * mixer.dataset(myDataset)
           *     .then(function(state) {
           *         console.log(state.totalShow === 3); // true
           *     });
           *
           * @example <caption>Example 2: Sorting a dataset</caption>
           *
           * // Create a new dataset in reverse order
           *
           * var newDataset = myDataset.slice().reverse();
           *
           * mixer.dataset(newDataset)
           *     .then(function(state) {
           *         console.log(state.activeDataset[0] === myDataset[2]); // true
           *     });
           *
           * @example <caption>Example 3: Removing an item from the dataset</caption>
           *
           * console.log(myDataset.length); // 3
           *
           * // Create a new dataset with the last item removed.
           *
           * var newDataset = myDataset.slice().pop();
           *
           * mixer.dataset(newDataset)
           *     .then(function(state) {
           *         console.log(state.totalShow === 2); // true
           *     });
           *
           * @public
           * @instance
           * @since       3.0.0
           * @param       {Array.<object>}    dataset
           *      An array of objects, each one representing the underlying data model of a target to be rendered.
           * @param       {boolean}           [animate=true]
           *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
           * @param       {function}          [callback=null]
           *      An optional callback function to be invoked after the operation has completed.
           * @return      {Promise.<mixitup.State>}
           *      A promise resolving with the current state object.
           */
          dataset: function() {
            var self = this, instruction = self.parseDatasetArgs(arguments), operation = null, queueItem = null, animate = false;
            self.callActions("beforeDataset", arguments);
            if (!self.isBusy) {
              if (instruction.callback) self.userCallback = instruction.callback;
              animate = instruction.animate ^ self.config.animation.enable ? instruction.animate : self.config.animation.enable;
              operation = self.getDataOperation(instruction.command.dataset);
              return self.goMix(animate, operation);
            } else {
              queueItem = new mixitup2.QueueItem();
              queueItem.args = arguments;
              queueItem.instruction = instruction;
              return self.queueMix(queueItem);
            }
          },
          /**
           * Performs simultaneous `filter`, `sort`, `insert`, `remove` and `changeLayout`
           * operations as requested.
           *
           * @example
           *
           * .multimix(multimixCommand [, animate] [, callback])
           *
           * @example <caption>Example 1: Performing simultaneous filtering and sorting</caption>
           *
           * mixer.multimix({
           *     filter: '.category-b',
           *     sort: 'published-date:desc'
           * })
           *     .then(function(state) {
           *         console.log(state.activeFilter.selector === '.category-b'); // true
           *         console.log(state.activeSort.attribute === 'published-date'); // true
           *     });
           *
           * @example <caption>Example 2: Performing simultaneous sorting, insertion, and removal</caption>
           *
           * console.log(mixer.getState().totalShow); // 6
           *
           * // NB: When inserting via `multimix()`, an object should be provided as the value
           * // for the `insert` portion of the command, allowing for a collection of elements
           * // and an insertion index to be specified.
           *
           * mixer.multimix({
           *     sort: 'published-date:desc', // Sort the container, including any new elements
           *     insert: {
           *         collection: [newElementReferenceA, newElementReferenceB], // Add 2 new elements at index 5
           *         index: 5
           *     },
           *     remove: existingElementReference // Remove 1 existing element
           * })
           *     .then(function(state) {
           *         console.log(state.activeSort.attribute === 'published-date'); // true
           *         console.log(state.totalShow === 7); // true
           *     });
           *
           * @public
           * @instance
           * @since       2.0.0
           * @param       {object}    multimixCommand
           *      An object containing one or more things to do
           * @param       {boolean}   [animate=true]
           *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
           * @param       {function}  [callback=null]
           *      An optional callback function to be invoked after the operation has completed.
           * @return      {Promise.<mixitup.State>}
           *      A promise resolving with the current state object.
           */
          multimix: function() {
            var self = this, operation = null, animate = false, queueItem = null, instruction = self.parseMultimixArgs(arguments);
            self.callActions("beforeMultimix", arguments);
            if (!self.isBusy) {
              operation = self.getOperation(instruction.command);
              if (self.config.controls.enable) {
                if (instruction.command.filter && !self.isToggling) {
                  self.toggleArray.length = 0;
                  self.buildToggleArray(operation.command);
                }
                if (self.queue.length < 1) {
                  self.updateControls(operation.command);
                }
              }
              if (instruction.callback) self.userCallback = instruction.callback;
              animate = instruction.animate ^ self.config.animation.enable ? instruction.animate : self.config.animation.enable;
              self.callFilters("operationMultimix", operation, arguments);
              return self.goMix(animate, operation);
            } else {
              queueItem = new mixitup2.QueueItem();
              queueItem.args = arguments;
              queueItem.instruction = instruction;
              queueItem.triggerElement = self.lastClicked;
              queueItem.isToggling = self.isToggling;
              return self.queueMix(queueItem);
            }
          },
          /**
           * @private
           * @instance
           * @since   3.0.0
           * @param   {object}            multimixCommand
           * @param   {boolean}           [isPreFetch]
           *      An optional boolean indicating that the operation is being pre-fetched for execution at a later time.
           * @return  {Operation|null}
           */
          getOperation: function(multimixCommand) {
            var self = this, sortCommand = multimixCommand.sort, filterCommand = multimixCommand.filter, changeLayoutCommand = multimixCommand.changeLayout, removeCommand = multimixCommand.remove, insertCommand = multimixCommand.insert, operation = new mixitup2.Operation();
            operation = self.callFilters("operationUnmappedGetOperation", operation, arguments);
            operation.id = h.randomHex();
            operation.command = multimixCommand;
            operation.startState = self.state;
            operation.triggerElement = self.lastClicked;
            if (self.isBusy) {
              if (self.config.debug.showWarnings) {
                console.warn(mixitup2.messages.warningGetOperationInstanceBusy());
              }
              return null;
            }
            if (insertCommand) {
              self.insertTargets(insertCommand, operation);
            }
            if (removeCommand) {
              operation.toRemove = removeCommand.targets;
            }
            operation.startSort = operation.newSort = operation.startState.activeSort;
            operation.startOrder = operation.newOrder = self.targets;
            if (sortCommand) {
              operation.startSort = operation.startState.activeSort;
              operation.newSort = sortCommand;
              operation.willSort = self.willSort(sortCommand, operation.startState.activeSort);
              if (operation.willSort) {
                self.sortOperation(operation);
              }
            }
            operation.startFilter = operation.startState.activeFilter;
            if (filterCommand) {
              operation.newFilter = filterCommand;
            } else {
              operation.newFilter = h.extend(new mixitup2.CommandFilter(), operation.startFilter);
            }
            if (operation.newFilter.selector === "all") {
              operation.newFilter.selector = self.config.selectors.target;
            } else if (operation.newFilter.selector === "none") {
              operation.newFilter.selector = "";
            }
            self.filterOperation(operation);
            operation.startContainerClassName = operation.startState.activeContainerClassName;
            if (changeLayoutCommand) {
              operation.newContainerClassName = changeLayoutCommand.containerClassName;
              if (operation.newContainerClassName !== operation.startContainerClassName) {
                operation.willChangeLayout = true;
              }
            } else {
              operation.newContainerClassName = operation.startContainerClassName;
            }
            if (self.config.animation.enable) {
              self.getStartMixData(operation);
              self.setInter(operation);
              operation.docState = h.getDocumentState(self.dom.document);
              self.getInterMixData(operation);
              self.setFinal(operation);
              self.getFinalMixData(operation);
              self.parseEffects();
              operation.hasEffect = self.hasEffect();
              self.getTweenData(operation);
            }
            if (operation.willSort) {
              self.targets = operation.newOrder;
            }
            operation.newState = self.buildState(operation);
            return self.callFilters("operationMappedGetOperation", operation, arguments);
          },
          /**
           * Renders a previously created operation at a specific point in its path, as
           * determined by a multiplier between 0 and 1.
           *
           * @example
           * .tween(operation, multiplier)
           *
           * @private
           * @instance
           * @since   3.0.0
           * @param   {mixitup.Operation}     operation
           *      An operation object created via the `getOperation` method
           *
           * @param   {Float}                 multiplier
           *      Any number between 0 and 1 representing the percentage complete of the operation
           * @return  {void}
           */
          tween: function(operation, multiplier) {
            var target = null, posData = null, toHideIndex = -1, i = -1;
            multiplier = Math.min(multiplier, 1);
            multiplier = Math.max(multiplier, 0);
            for (i = 0; target = operation.show[i]; i++) {
              posData = operation.showPosData[i];
              target.applyTween(posData, multiplier);
            }
            for (i = 0; target = operation.hide[i]; i++) {
              if (target.isShown) {
                target.hide();
              }
              if ((toHideIndex = operation.toHide.indexOf(target)) > -1) {
                posData = operation.toHidePosData[toHideIndex];
                if (!target.isShown) {
                  target.show();
                }
                target.applyTween(posData, multiplier);
              }
            }
          },
          /**
           * Inserts one or more new target elements into the container at a specified
           * index.
           *
           * To be indexed as targets, new elements must match the `selectors.target`
           * selector (`'.mix'` by default).
           *
           * @example
           *
           * .insert(newElements [, index] [, animate], [, callback])
           *
           * @example <caption>Example 1: Inserting a single element via reference</caption>
           *
           * console.log(mixer.getState().totalShow); // 0
           *
           * // Create a new element
           *
           * var newElement = document.createElement('div');
           * newElement.classList.add('mix');
           *
           * mixer.insert(newElement)
           *     .then(function(state) {
           *         console.log(state.totalShow === 1); // true
           *     });
           *
           * @example <caption>Example 2: Inserting a single element via HTML string</caption>
           *
           * console.log(mixer.getState().totalShow); // 1
           *
           * // Create a new element via reference
           *
           * var newElementHtml = '&lt;div class="mix"&gt;&lt;/div&gt;';
           *
           * // Create and insert the new element at index 1
           *
           * mixer.insert(newElementHtml, 1)
           *     .then(function(state) {
           *         console.log(state.totalShow === 2); // true
           *         console.log(state.show[1].outerHTML === newElementHtml); // true
           *     });
           *
           * @example <caption>Example 3: Inserting multiple elements via reference</caption>
           *
           * console.log(mixer.getState().totalShow); // 2
           *
           * // Create an array of new elements to insert.
           *
           * var newElement1 = document.createElement('div');
           * var newElement2 = document.createElement('div');
           *
           * newElement1.classList.add('mix');
           * newElement2.classList.add('mix');
           *
           * var newElementsCollection = [newElement1, newElement2];
           *
           * // Insert the new elements starting at index 1
           *
           * mixer.insert(newElementsCollection, 1)
           *     .then(function(state) {
           *         console.log(state.totalShow === 4); // true
           *         console.log(state.show[1] === newElement1); // true
           *         console.log(state.show[2] === newElement2); // true
           *     });
           *
           * @example <caption>Example 4: Inserting a jQuery collection object containing one or more elements</caption>
           *
           * console.log(mixer.getState().totalShow); // 4
           *
           * var $newElement = $('&lt;div class="mix"&gt;&lt;/div&gt;');
           *
           * // Insert the new elements starting at index 3
           *
           * mixer.insert($newElement, 3)
           *     .then(function(state) {
           *         console.log(state.totalShow === 5); // true
           *         console.log(state.show[3] === $newElement[0]); // true
           *     });
           *
           * @public
           * @instance
           * @since       2.0.0
           * @param       {(HTMLElement|Array.<HTMLElement>|string)}    newElements
           *      A reference to a single element to insert, an array-like collection of elements, or an HTML string representing a single element.
           * @param       {number}    index=0
           *      The index at which to insert the new element(s). `0` by default.
           * @param       {boolean}   [animate=true]
           *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
           * @param       {function}  [callback=null]
           *      An optional callback function to be invoked after the operation has completed.
           * @return      {Promise.<mixitup.State>}
           *      A promise resolving with the current state object.
           */
          insert: function() {
            var self = this, args = self.parseInsertArgs(arguments);
            return self.multimix({
              insert: args.command
            }, args.animate, args.callback);
          },
          /**
           * Inserts one or more new elements before a provided reference element.
           *
           * @example
           *
           * .insertBefore(newElements, referenceElement [, animate] [, callback])
           *
           * @example <caption>Example: Inserting a new element before a reference element</caption>
           *
           * // An existing reference element is chosen at index 2
           *
           * var referenceElement = mixer.getState().show[2];
           *
           * // Create a new element
           *
           * var newElement = document.createElement('div');
           * newElement.classList.add('mix');
           *
           * mixer.insertBefore(newElement, referenceElement)
           *     .then(function(state) {
           *         // The new element is inserted into the container at index 2, before the reference element
           *
           *         console.log(state.show[2] === newElement); // true
           *
           *         // The reference element is now at index 3
           *
           *         console.log(state.show[3] === referenceElement); // true
           *     });
           *
           * @public
           * @instance
           * @since       3.0.0
           * @param       {(HTMLElement|Array.<HTMLElement>|string)}    newElements
           *      A reference to a single element to insert, an array-like collection of elements, or an HTML string representing a single element.
           * @param       {HTMLElement}    referenceElement
           *      A reference to an existing element in the container to insert new elements before.
           *@param       {boolean}   [animate=true]
           *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
           * @param       {function}  [callback=null]
           *      An optional callback function to be invoked after the operation has completed.
           * @return      {Promise.<mixitup.State>}
           *      A promise resolving with the current state object.
           */
          insertBefore: function() {
            var self = this, args = self.parseInsertArgs(arguments);
            return self.insert(args.command.collection, "before", args.command.sibling, args.animate, args.callback);
          },
          /**
           * Inserts one or more new elements after a provided reference element.
           *
           * @example
           *
           * .insertAfter(newElements, referenceElement [, animate] [, callback])
           *
           * @example <caption>Example: Inserting a new element after a reference element</caption>
           *
           * // An existing reference element is chosen at index 2
           *
           * var referenceElement = mixer.getState().show[2];
           *
           * // Create a new element
           *
           * var newElement = document.createElement('div');
           * newElement.classList.add('mix');
           *
           * mixer.insertAfter(newElement, referenceElement)
           *     .then(function(state) {
           *         // The new element is inserted into the container at index 3, after the reference element
           *
           *         console.log(state.show[3] === newElement); // true
           *     });
           *
           * @public
           * @instance
           * @since       3.0.0
           * @param       {(HTMLElement|Array.<HTMLElement>|string)}    newElements
           *      A reference to a single element to insert, an array-like collection of elements, or an HTML string representing a single element.
           * @param       {HTMLElement}    referenceElement
           *      A reference to an existing element in the container to insert new elements after.
           * @param       {boolean}   [animate=true]
           *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
           * @param       {function}  [callback=null]
           *      An optional callback function to be invoked after the operation has completed.
           * @return      {Promise.<mixitup.State>}
           *      A promise resolving with the current state object.
           */
          insertAfter: function() {
            var self = this, args = self.parseInsertArgs(arguments);
            return self.insert(args.command.collection, "after", args.command.sibling, args.animate, args.callback);
          },
          /**
           * Inserts one or more new elements into the container before all existing targets.
           *
           * @example
           *
           * .prepend(newElements [,animate] [,callback])
           *
           * @example <caption>Example: Prepending a new element</caption>
           *
           * // Create a new element
           *
           * var newElement = document.createElement('div');
           * newElement.classList.add('mix');
           *
           * // Insert the element into the container
           *
           * mixer.prepend(newElement)
           *     .then(function(state) {
           *         console.log(state.show[0] === newElement); // true
           *     });
           *
           * @public
           * @instance
           * @since       3.0.0
           * @param       {(HTMLElement|Array.<HTMLElement>|string)}    newElements
           *      A reference to a single element to insert, an array-like collection of elements, or an HTML string representing a single element.
           * @param       {boolean}   [animate=true]
           *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
           * @param       {function}  [callback=null]
           *      An optional callback function to be invoked after the operation has completed.
           * @return      {Promise.<mixitup.State>}
           *      A promise resolving with the current state object.
           */
          prepend: function() {
            var self = this, args = self.parseInsertArgs(arguments);
            return self.insert(0, args.command.collection, args.animate, args.callback);
          },
          /**
           * Inserts one or more new elements into the container after all existing targets.
           *
           * @example
           *
           * .append(newElements [,animate] [,callback])
           *
           * @example <caption>Example: Appending a new element</caption>
           *
           * // Create a new element
           *
           * var newElement = document.createElement('div');
           * newElement.classList.add('mix');
           *
           * // Insert the element into the container
           *
           * mixer.append(newElement)
           *     .then(function(state) {
           *         console.log(state.show[state.show.length - 1] === newElement); // true
           *     });
           *
           * @public
           * @instance
           * @since       3.0.0
           * @param       {(HTMLElement|Array.<HTMLElement>|string)}    newElements
           *      A reference to a single element to insert, an array-like collection of elements, or an HTML string representing a single element.
           * @param       {boolean}   [animate=true]
           *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
           * @param       {function}  [callback=null]
           *      An optional callback function to be invoked after the operation has completed.
           * @return      {Promise.<mixitup.State>}
           *      A promise resolving with the current state object.
           */
          append: function() {
            var self = this, args = self.parseInsertArgs(arguments);
            return self.insert(self.state.totalTargets, args.command.collection, args.animate, args.callback);
          },
          /**
           * Removes one or more existing target elements from the container.
           *
           * @example
           *
           * .remove(elements [, animate] [, callback])
           *
           * @example <caption>Example 1: Removing an element by reference</caption>
           *
           * var elementToRemove = containerEl.firstElementChild;
           *
           * mixer.remove(elementToRemove)
           *      .then(function(state) {
           *          console.log(state.targets.indexOf(elementToRemove) === -1); // true
           *      });
           *
           * @example <caption>Example 2: Removing a collection of elements by reference</caption>
           *
           * var elementsToRemove = containerEl.querySelectorAll('.category-a');
           *
           * console.log(elementsToRemove.length) // 3
           *
           * mixer.remove(elementsToRemove)
           *      .then(function() {
           *          console.log(containerEl.querySelectorAll('.category-a').length); // 0
           *      });
           *
           * @example <caption>Example 3: Removing one or more elements by selector</caption>
           *
           * mixer.remove('.category-a')
           *      .then(function() {
           *          console.log(containerEl.querySelectorAll('.category-a').length); // 0
           *      });
           *
           * @example <caption>Example 4: Removing an element by index</caption>
           *
           * console.log(mixer.getState.totalShow); // 4
           *
           * // Remove the element at index 3
           *
           * mixer.remove(3)
           *      .then(function(state) {
           *          console.log(state.totalShow); // 3
           *          console.log(state.show[3]); // undefined
           *      });
           *
           *
           * @public
           * @instance
           * @since       3.0.0
           * @param       {(HTMLElement|Array.<HTMLElement>|string|number)}    elements
           *      A reference to a single element to remove, an array-like collection of elements, a selector string, or the index of an element to remove.
           * @param       {boolean}   [animate=true]
           *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
           * @param       {function}  [callback=null]
           *      An optional callback function to be invoked after the operation has completed.
           * @return      {Promise.<mixitup.State>}
           *      A promise resolving with the current state object.
           */
          remove: function() {
            var self = this, args = self.parseRemoveArgs(arguments);
            return self.multimix({
              remove: args.command
            }, args.animate, args.callback);
          },
          /**
           * Retrieves the the value of any property or sub-object within the current
           * mixitup configuration, or the whole configuration object.
           *
           * @example
           *
           * .getConfig([stringKey])
           *
           * @example <caption>Example 1: retrieve the entire configuration object</caption>
           *
           * var config = mixer.getConfig(); // Config { ... }
           *
           * @example <caption>Example 2: retrieve a named sub-object of configuration object</caption>
           *
           * var animation = mixer.getConfig('animation'); // ConfigAnimation { ... }
           *
           * @example <caption>Example 3: retrieve a value of configuration object via a dot-notation string key</caption>
           *
           * var effects = mixer.getConfig('animation.effects'); // 'fade scale'
           *
           * @public
           * @instance
           * @since       2.0.0
           * @param       {string}    [stringKey]    A "dot-notation" string key
           * @return      {*}
           */
          getConfig: function(stringKey) {
            var self = this, value = null;
            if (!stringKey) {
              value = self.config;
            } else {
              value = h.getProperty(self.config, stringKey);
            }
            return self.callFilters("valueGetConfig", value, arguments);
          },
          /**
           * Updates the configuration of the mixer, after it has been instantiated.
           *
           * See the Configuration Object documentation for a full list of avilable
           * configuration options.
           *
           * @example
           *
           * .configure(config)
           *
           * @example <caption>Example 1: Updating animation options</caption>
           *
           * mixer.configure({
           *     animation: {
           *         effects: 'fade translateX(-100%)',
           *         duration: 300
           *     }
           * });
           *
           * @example <caption>Example 2: Removing a callback after it has been set</caption>
           *
           * var mixer;
           *
           * function handleMixEndOnce() {
           *     // Do something ..
           *
           *     // Then nullify the callback
           *
           *     mixer.configure({
           *         callbacks: {
           *             onMixEnd: null
           *         }
           *     });
           * };
           *
           * // Instantiate a mixer with a callback defined
           *
           * mixer = mixitup(containerEl, {
           *     callbacks: {
           *         onMixEnd: handleMixEndOnce
           *     }
           * });
           *
           * @public
           * @instance
           * @since       3.0.0
           * @param       {object}    config
           *      An object containing one of more configuration options.
           * @return      {void}
           */
          configure: function(config) {
            var self = this;
            self.callActions("beforeConfigure", arguments);
            h.extend(self.config, config, true, true);
            self.callActions("afterConfigure", arguments);
          },
          /**
           * Returns an object containing information about the current state of the
           * mixer. See the State Object documentation for more information.
           *
           * NB: State objects are immutable and should therefore be regenerated
           * after any operation.
           *
           * @example
           *
           * .getState();
           *
           * @example <caption>Example: Retrieving a state object</caption>
           *
           * var state = mixer.getState();
           *
           * console.log(state.totalShow + 'targets are currently shown');
           *
           * @public
           * @instance
           * @since       2.0.0
           * @return      {mixitup.State} An object reflecting the current state of the mixer.
           */
          getState: function() {
            var self = this, state = null;
            state = new mixitup2.State();
            h.extend(state, self.state);
            h.freeze(state);
            return self.callFilters("stateGetState", state, arguments);
          },
          /**
           * Forces the re-indexing all targets within the container.
           *
           * This should only be used if some other piece of code in your application
           * has manipulated the contents of your container, which should be avoided.
           *
           * If you need to add or remove target elements from the container, use
           * the built-in `.insert()` or `.remove()` methods, and MixItUp will keep
           * itself up to date.
           *
           * @example
           *
           * .forceRefresh()
           *
           * @example <caption>Example: Force refreshing the mixer after external DOM manipulation</caption>
           *
           * console.log(mixer.getState().totalShow); // 3
           *
           * // An element is removed from the container via some external DOM manipulation code:
           *
           * containerEl.removeChild(containerEl.firstElementChild);
           *
           * // The mixer does not know that the number of targets has changed:
           *
           * console.log(mixer.getState().totalShow); // 3
           *
           * mixer.forceRefresh();
           *
           * // After forceRefresh, the mixer is in sync again:
           *
           * console.log(mixer.getState().totalShow); // 2
           *
           * @public
           * @instance
           * @since 2.1.2
           * @return {void}
           */
          forceRefresh: function() {
            var self = this;
            self.indexTargets();
          },
          /**
           * Forces the re-rendering of all targets when using the Dataset API.
           *
           * By default, targets are only re-rendered when `data.dirtyCheck` is
           * enabled, and an item's data has changed when `dataset()` is called.
           *
           * The `forceRender()` method allows for the re-rendering of all targets
           * in response to some arbitrary event, such as the changing of the target
           * render function.
           *
           * Targets are rendered against their existing data.
           *
           * @example
           *
           * .forceRender()
           *
           * @example <caption>Example: Force render targets after changing the target render function</caption>
           *
           * console.log(container.innerHTML); // ... &lt;span class="mix"&gt;Foo&lt;/span&gt; ...
           *
           * mixer.configure({
           *     render: {
           *         target: (item) => `&lt;a href="/${item.slug}/" class="mix"&gt;${item.title}&lt;/a&gt;`
           *     }
           * });
           *
           * mixer.forceRender();
           *
           * console.log(container.innerHTML); // ... &lt;a href="/foo/" class="mix"&gt;Foo&lt;/a&gt; ...
           *
           * @public
           * @instance
           * @since 3.2.1
           * @return {void}
           */
          forceRender: function() {
            var self = this, target = null, el = null, id = "";
            for (id in self.cache) {
              target = self.cache[id];
              el = target.render(target.data);
              if (el !== target.dom.el) {
                if (target.isInDom) {
                  target.unbindEvents();
                  self.dom.parent.replaceChild(el, target.dom.el);
                }
                if (!target.isShown) {
                  el.style.display = "none";
                }
                target.dom.el = el;
                if (target.isInDom) {
                  target.bindEvents();
                }
              }
            }
            self.state = self.buildState(self.lastOperation);
          },
          /**
           * Removes mixitup functionality from the container, unbinds all control
           * event handlers, and deletes the mixer instance from MixItUp's internal
           * cache.
           *
           * This should be performed whenever a mixer's container is removed from
           * the DOM, such as during a page change in a single page application,
           * or React's `componentWillUnmount()`.
           *
           * @example
           *
           * .destroy([cleanUp])
           *
           * @example <caption>Example: Destroying the mixer before removing its container element</caption>
           *
           * mixer.destroy();
           *
           * containerEl.parentElement.removeChild(containerEl);
           *
           * @public
           * @instance
           * @since   2.0.0
           * @param   {boolean}   [cleanUp=false]
           *     An optional boolean dictating whether or not to clean up any inline `display: none;` styling applied to hidden targets.
           * @return  {void}
           */
          destroy: function(cleanUp) {
            var self = this, control = null, target = null, i = 0;
            self.callActions("beforeDestroy", arguments);
            for (i = 0; control = self.controls[i]; i++) {
              control.removeBinding(self);
            }
            for (i = 0; target = self.targets[i]; i++) {
              if (cleanUp) {
                target.show();
              }
              target.unbindEvents();
            }
            if (self.dom.container.id.match(/^MixItUp/)) {
              self.dom.container.removeAttribute("id");
            }
            delete mixitup2.instances[self.id];
            self.callActions("afterDestroy", arguments);
          }
        }
      );
      mixitup2.IMoveData = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.posIn = null;
        this.posOut = null;
        this.operation = null;
        this.callback = null;
        this.statusChange = "";
        this.duration = -1;
        this.staggerIndex = -1;
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.IMoveData);
      mixitup2.IMoveData.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.IMoveData.prototype.constructor = mixitup2.IMoveData;
      mixitup2.TargetDom = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.el = null;
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.TargetDom);
      mixitup2.TargetDom.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.TargetDom.prototype.constructor = mixitup2.TargetDom;
      mixitup2.Target = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.id = "";
        this.sortString = "";
        this.mixer = null;
        this.callback = null;
        this.isShown = false;
        this.isBound = false;
        this.isExcluded = false;
        this.isInDom = false;
        this.handler = null;
        this.operation = null;
        this.data = null;
        this.dom = new mixitup2.TargetDom();
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.Target);
      mixitup2.Target.prototype = Object.create(mixitup2.Base.prototype);
      h.extend(mixitup2.Target.prototype, {
        constructor: mixitup2.Target,
        /**
         * Initialises a newly instantiated Target.
         *
         * @private
         * @instance
         * @since   3.0.0
         * @param   {(Element|null)}    el
         * @param   {object}            mixer
         * @param   {object}            [data]
         * @return  {void}
         */
        init: function(el, mixer, data) {
          var self = this, id = "";
          self.callActions("beforeInit", arguments);
          self.mixer = mixer;
          if (!el) {
            el = self.render(data);
          }
          self.cacheDom(el);
          self.bindEvents();
          if (self.dom.el.style.display !== "none") {
            self.isShown = true;
          }
          if (data && mixer.config.data.uidKey) {
            if (typeof (id = data[mixer.config.data.uidKey]) === "undefined" || id.toString().length < 1) {
              throw new TypeError(mixitup2.messages.errorDatasetInvalidUidKey({
                uidKey: mixer.config.data.uidKey
              }));
            }
            self.id = id;
            self.data = data;
            mixer.cache[id] = self;
          }
          self.callActions("afterInit", arguments);
        },
        /**
         * Renders the target element using a user-defined renderer function.
         *
         * @private
         * @instance
         * @since   3.1.4
         * @param   {object} data
         * @return  {void}
         */
        render: function(data) {
          var self = this, render = null, el = null, temp = null, output = "";
          self.callActions("beforeRender", arguments);
          render = self.callFilters("renderRender", self.mixer.config.render.target, arguments);
          if (typeof render !== "function") {
            throw new TypeError(mixitup2.messages.errorDatasetRendererNotSet());
          }
          output = render(data);
          if (output && typeof output === "object" && h.isElement(output)) {
            el = output;
          } else if (typeof output === "string") {
            temp = document.createElement("div");
            temp.innerHTML = output;
            el = temp.firstElementChild;
          }
          return self.callFilters("elRender", el, arguments);
        },
        /**
         * Caches references of DOM elements neccessary for the target's functionality.
         *
         * @private
         * @instance
         * @since   3.0.0
         * @param   {Element} el
         * @return  {void}
         */
        cacheDom: function(el) {
          var self = this;
          self.callActions("beforeCacheDom", arguments);
          self.dom.el = el;
          self.callActions("afterCacheDom", arguments);
        },
        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {string}    attributeName
         * @return  {void}
         */
        getSortString: function(attributeName) {
          var self = this, value = self.dom.el.getAttribute("data-" + attributeName) || "";
          self.callActions("beforeGetSortString", arguments);
          value = isNaN(value * 1) ? value.toLowerCase() : value * 1;
          self.sortString = value;
          self.callActions("afterGetSortString", arguments);
        },
        /**
         * @private
         * @instance
         * @since   3.0.0
         * @return  {void}
         */
        show: function() {
          var self = this;
          self.callActions("beforeShow", arguments);
          if (!self.isShown) {
            self.dom.el.style.display = "";
            self.isShown = true;
          }
          self.callActions("afterShow", arguments);
        },
        /**
         * @private
         * @instance
         * @since   3.0.0
         * @return  {void}
         */
        hide: function() {
          var self = this;
          self.callActions("beforeHide", arguments);
          if (self.isShown) {
            self.dom.el.style.display = "none";
            self.isShown = false;
          }
          self.callActions("afterHide", arguments);
        },
        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {mixitup.IMoveData} moveData
         * @return  {void}
         */
        move: function(moveData) {
          var self = this;
          self.callActions("beforeMove", arguments);
          if (!self.isExcluded) {
            self.mixer.targetsMoved++;
          }
          self.applyStylesIn(moveData);
          requestAnimationFrame(function() {
            self.applyStylesOut(moveData);
          });
          self.callActions("afterMove", arguments);
        },
        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {object}    posData
         * @param   {number}    multiplier
         * @return  {void}
         */
        applyTween: function(posData, multiplier) {
          var self = this, propertyName = "", tweenData = null, posIn = posData.posIn, currentTransformValues = [], currentValues = new mixitup2.StyleData(), i = -1;
          self.callActions("beforeApplyTween", arguments);
          currentValues.x = posIn.x;
          currentValues.y = posIn.y;
          if (multiplier === 0) {
            self.hide();
          } else if (!self.isShown) {
            self.show();
          }
          for (i = 0; propertyName = mixitup2.features.TWEENABLE[i]; i++) {
            tweenData = posData.tweenData[propertyName];
            if (propertyName === "x") {
              if (!tweenData) continue;
              currentValues.x = posIn.x + tweenData * multiplier;
            } else if (propertyName === "y") {
              if (!tweenData) continue;
              currentValues.y = posIn.y + tweenData * multiplier;
            } else if (tweenData instanceof mixitup2.TransformData) {
              if (!tweenData.value) continue;
              currentValues[propertyName].value = posIn[propertyName].value + tweenData.value * multiplier;
              currentValues[propertyName].unit = tweenData.unit;
              currentTransformValues.push(
                propertyName + "(" + currentValues[propertyName].value + tweenData.unit + ")"
              );
            } else {
              if (!tweenData) continue;
              currentValues[propertyName] = posIn[propertyName] + tweenData * multiplier;
              self.dom.el.style[propertyName] = currentValues[propertyName];
            }
          }
          if (currentValues.x || currentValues.y) {
            currentTransformValues.unshift("translate(" + currentValues.x + "px, " + currentValues.y + "px)");
          }
          if (currentTransformValues.length) {
            self.dom.el.style[mixitup2.features.transformProp] = currentTransformValues.join(" ");
          }
          self.callActions("afterApplyTween", arguments);
        },
        /**
         * Applies the initial styling to a target element before any transition
         * is applied.
         *
         * @private
         * @instance
         * @param   {mixitup.IMoveData} moveData
         * @return  {void}
         */
        applyStylesIn: function(moveData) {
          var self = this, posIn = moveData.posIn, isFading = self.mixer.effectsIn.opacity !== 1, transformValues = [];
          self.callActions("beforeApplyStylesIn", arguments);
          transformValues.push("translate(" + posIn.x + "px, " + posIn.y + "px)");
          if (self.mixer.config.animation.animateResizeTargets) {
            if (moveData.statusChange !== "show") {
              self.dom.el.style.width = posIn.width + "px";
              self.dom.el.style.height = posIn.height + "px";
            }
            self.dom.el.style.marginRight = posIn.marginRight + "px";
            self.dom.el.style.marginBottom = posIn.marginBottom + "px";
          }
          isFading && (self.dom.el.style.opacity = posIn.opacity);
          if (moveData.statusChange === "show") {
            transformValues = transformValues.concat(self.mixer.transformIn);
          }
          self.dom.el.style[mixitup2.features.transformProp] = transformValues.join(" ");
          self.callActions("afterApplyStylesIn", arguments);
        },
        /**
         * Applies a transition followed by the final styles for the element to
         * transition towards.
         *
         * @private
         * @instance
         * @param   {mixitup.IMoveData} moveData
         * @return  {void}
         */
        applyStylesOut: function(moveData) {
          var self = this, transitionRules = [], transformValues = [], isResizing = self.mixer.config.animation.animateResizeTargets, isFading = typeof self.mixer.effectsIn.opacity !== "undefined";
          self.callActions("beforeApplyStylesOut", arguments);
          transitionRules.push(self.writeTransitionRule(
            mixitup2.features.transformRule,
            moveData.staggerIndex
          ));
          if (moveData.statusChange !== "none") {
            transitionRules.push(self.writeTransitionRule(
              "opacity",
              moveData.staggerIndex,
              moveData.duration
            ));
          }
          if (isResizing) {
            transitionRules.push(self.writeTransitionRule(
              "width",
              moveData.staggerIndex,
              moveData.duration
            ));
            transitionRules.push(self.writeTransitionRule(
              "height",
              moveData.staggerIndex,
              moveData.duration
            ));
            transitionRules.push(self.writeTransitionRule(
              "margin",
              moveData.staggerIndex,
              moveData.duration
            ));
          }
          if (!moveData.callback) {
            self.mixer.targetsImmovable++;
            if (self.mixer.targetsMoved === self.mixer.targetsImmovable) {
              self.mixer.cleanUp(moveData.operation);
            }
            return;
          }
          self.operation = moveData.operation;
          self.callback = moveData.callback;
          !self.isExcluded && self.mixer.targetsBound++;
          self.isBound = true;
          self.applyTransition(transitionRules);
          if (isResizing && moveData.posOut.width > 0 && moveData.posOut.height > 0) {
            self.dom.el.style.width = moveData.posOut.width + "px";
            self.dom.el.style.height = moveData.posOut.height + "px";
            self.dom.el.style.marginRight = moveData.posOut.marginRight + "px";
            self.dom.el.style.marginBottom = moveData.posOut.marginBottom + "px";
          }
          if (!self.mixer.config.animation.nudge && moveData.statusChange === "hide") {
            transformValues.push("translate(" + moveData.posOut.x + "px, " + moveData.posOut.y + "px)");
          }
          switch (moveData.statusChange) {
            case "hide":
              isFading && (self.dom.el.style.opacity = self.mixer.effectsOut.opacity);
              transformValues = transformValues.concat(self.mixer.transformOut);
              break;
            case "show":
              isFading && (self.dom.el.style.opacity = 1);
          }
          if (self.mixer.config.animation.nudge || !self.mixer.config.animation.nudge && moveData.statusChange !== "hide") {
            transformValues.push("translate(" + moveData.posOut.x + "px, " + moveData.posOut.y + "px)");
          }
          self.dom.el.style[mixitup2.features.transformProp] = transformValues.join(" ");
          self.callActions("afterApplyStylesOut", arguments);
        },
        /**
         * Combines the name of a CSS property with the appropriate duration and delay
         * values to created a valid transition rule.
         *
         * @private
         * @instance
         * @since   3.0.0
         * @param   {string}    property
         * @param   {number}    staggerIndex
         * @param   {number}    duration
         * @return  {string}
         */
        writeTransitionRule: function(property, staggerIndex, duration) {
          var self = this, delay = self.getDelay(staggerIndex), rule = "";
          rule = property + " " + (duration > 0 ? duration : self.mixer.config.animation.duration) + "ms " + delay + "ms " + (property === "opacity" ? "linear" : self.mixer.config.animation.easing);
          return self.callFilters("ruleWriteTransitionRule", rule, arguments);
        },
        /**
         * Calculates the transition delay for each target element based on its index, if
         * staggering is applied. If defined, A custom `animation.staggerSeqeuence`
         * function can be used to manipulate the order of indices to produce custom
         * stagger effects (e.g. for use in a grid with irregular row lengths).
         *
         * @private
         * @instance
         * @since   2.0.0
         * @param   {number}    index
         * @return  {number}
         */
        getDelay: function(index) {
          var self = this, delay = -1;
          if (typeof self.mixer.config.animation.staggerSequence === "function") {
            index = self.mixer.config.animation.staggerSequence.call(self, index, self.state);
          }
          delay = !!self.mixer.staggerDuration ? index * self.mixer.staggerDuration : 0;
          return self.callFilters("delayGetDelay", delay, arguments);
        },
        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {string[]}  rules
         * @return  {void}
         */
        applyTransition: function(rules) {
          var self = this, transitionString = rules.join(", ");
          self.callActions("beforeApplyTransition", arguments);
          self.dom.el.style[mixitup2.features.transitionProp] = transitionString;
          self.callActions("afterApplyTransition", arguments);
        },
        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {Event} e
         * @return  {void}
         */
        handleTransitionEnd: function(e) {
          var self = this, propName = e.propertyName, canResize = self.mixer.config.animation.animateResizeTargets;
          self.callActions("beforeHandleTransitionEnd", arguments);
          if (self.isBound && e.target.matches(self.mixer.config.selectors.target) && (propName.indexOf("transform") > -1 || propName.indexOf("opacity") > -1 || canResize && propName.indexOf("height") > -1 || canResize && propName.indexOf("width") > -1 || canResize && propName.indexOf("margin") > -1)) {
            self.callback.call(self, self.operation);
            self.isBound = false;
            self.callback = null;
            self.operation = null;
          }
          self.callActions("afterHandleTransitionEnd", arguments);
        },
        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {Event}     e
         * @return  {void}
         */
        eventBus: function(e) {
          var self = this;
          self.callActions("beforeEventBus", arguments);
          switch (e.type) {
            case "webkitTransitionEnd":
            case "transitionend":
              self.handleTransitionEnd(e);
          }
          self.callActions("afterEventBus", arguments);
        },
        /**
         * @private
         * @instance
         * @since   3.0.0
         * @return  {void}
         */
        unbindEvents: function() {
          var self = this;
          self.callActions("beforeUnbindEvents", arguments);
          h.off(self.dom.el, "webkitTransitionEnd", self.handler);
          h.off(self.dom.el, "transitionend", self.handler);
          self.callActions("afterUnbindEvents", arguments);
        },
        /**
         * @private
         * @instance
         * @since   3.0.0
         * @return  {void}
         */
        bindEvents: function() {
          var self = this, transitionEndEvent = "";
          self.callActions("beforeBindEvents", arguments);
          transitionEndEvent = mixitup2.features.transitionPrefix === "webkit" ? "webkitTransitionEnd" : "transitionend";
          self.handler = function(e) {
            return self.eventBus(e);
          };
          h.on(self.dom.el, transitionEndEvent, self.handler);
          self.callActions("afterBindEvents", arguments);
        },
        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {boolean}   [getBox]
         * @return  {PosData}
         */
        getPosData: function(getBox) {
          var self = this, styles = {}, rect = null, posData = new mixitup2.StyleData();
          self.callActions("beforeGetPosData", arguments);
          posData.x = self.dom.el.offsetLeft;
          posData.y = self.dom.el.offsetTop;
          if (self.mixer.config.animation.animateResizeTargets || getBox) {
            rect = self.dom.el.getBoundingClientRect();
            posData.top = rect.top;
            posData.right = rect.right;
            posData.bottom = rect.bottom;
            posData.left = rect.left;
            posData.width = rect.width;
            posData.height = rect.height;
          }
          if (self.mixer.config.animation.animateResizeTargets) {
            styles = window2.getComputedStyle(self.dom.el);
            posData.marginBottom = parseFloat(styles.marginBottom);
            posData.marginRight = parseFloat(styles.marginRight);
          }
          return self.callFilters("posDataGetPosData", posData, arguments);
        },
        /**
         * @private
         * @instance
         * @since       3.0.0
         * @return      {void}
         */
        cleanUp: function() {
          var self = this;
          self.callActions("beforeCleanUp", arguments);
          self.dom.el.style[mixitup2.features.transformProp] = "";
          self.dom.el.style[mixitup2.features.transitionProp] = "";
          self.dom.el.style.opacity = "";
          if (self.mixer.config.animation.animateResizeTargets) {
            self.dom.el.style.width = "";
            self.dom.el.style.height = "";
            self.dom.el.style.marginRight = "";
            self.dom.el.style.marginBottom = "";
          }
          self.callActions("afterCleanUp", arguments);
        }
      });
      mixitup2.Collection = function(instances) {
        var instance = null, i = -1;
        this.callActions("beforeConstruct");
        for (i = 0; instance = instances[i]; i++) {
          this[i] = instance;
        }
        this.length = instances.length;
        this.callActions("afterConstruct");
        h.freeze(this);
      };
      mixitup2.BaseStatic.call(mixitup2.Collection);
      mixitup2.Collection.prototype = Object.create(mixitup2.Base.prototype);
      h.extend(
        mixitup2.Collection.prototype,
        /** @lends mixitup.Collection */
        {
          constructor: mixitup2.Collection,
          /**
           * Calls a method on all instances in the collection by passing the method
           * name as a string followed by any applicable parameters to be curried into
           * to the method.
           *
           * @example
           * .mixitup(methodName[,arg1][,arg2..]);
           *
           * @example
           * var collection = new Collection([mixer1, mixer2]);
           *
           * return collection.mixitup('filter', '.category-a')
           *     .then(function(states) {
           *         state.forEach(function(state) {
           *             console.log(state.activeFilter.selector); // .category-a
           *         });
           *     });
           *
           * @public
           * @instance
           * @since       3.0.0
           * @param       {string}  methodName
           * @return      {Promise<Array<mixitup.State>>}
           */
          mixitup: function(methodName) {
            var self = this, instance = null, args = Array.prototype.slice.call(arguments), tasks = [], i = -1;
            this.callActions("beforeMixitup");
            args.shift();
            for (i = 0; instance = self[i]; i++) {
              tasks.push(instance[methodName].apply(instance, args));
            }
            return self.callFilters("promiseMixitup", h.all(tasks, mixitup2.libraries), arguments);
          }
        }
      );
      mixitup2.Operation = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.id = "";
        this.args = [];
        this.command = null;
        this.showPosData = [];
        this.toHidePosData = [];
        this.startState = null;
        this.newState = null;
        this.docState = null;
        this.willSort = false;
        this.willChangeLayout = false;
        this.hasEffect = false;
        this.hasFailed = false;
        this.triggerElement = null;
        this.show = [];
        this.hide = [];
        this.matching = [];
        this.toShow = [];
        this.toHide = [];
        this.toMove = [];
        this.toRemove = [];
        this.startOrder = [];
        this.newOrder = [];
        this.startSort = null;
        this.newSort = null;
        this.startFilter = null;
        this.newFilter = null;
        this.startDataset = null;
        this.newDataset = null;
        this.viewportDeltaX = 0;
        this.viewportDeltaY = 0;
        this.startX = 0;
        this.startY = 0;
        this.startHeight = 0;
        this.startWidth = 0;
        this.newX = 0;
        this.newY = 0;
        this.newHeight = 0;
        this.newWidth = 0;
        this.startContainerClassName = "";
        this.startDisplay = "";
        this.newContainerClassName = "";
        this.newDisplay = "";
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.Operation);
      mixitup2.Operation.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.Operation.prototype.constructor = mixitup2.Operation;
      mixitup2.State = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.id = "";
        this.activeFilter = null;
        this.activeSort = null;
        this.activeContainerClassName = "";
        this.container = null;
        this.targets = [];
        this.hide = [];
        this.show = [];
        this.matching = [];
        this.totalTargets = -1;
        this.totalShow = -1;
        this.totalHide = -1;
        this.totalMatching = -1;
        this.hasFailed = false;
        this.triggerElement = null;
        this.activeDataset = null;
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.State);
      mixitup2.State.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.State.prototype.constructor = mixitup2.State;
      mixitup2.UserInstruction = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.command = {};
        this.animate = false;
        this.callback = null;
        this.callActions("afterConstruct");
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.UserInstruction);
      mixitup2.UserInstruction.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.UserInstruction.prototype.constructor = mixitup2.UserInstruction;
      mixitup2.Messages = function() {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct");
        this.ERROR_FACTORY_INVALID_CONTAINER = "[MixItUp] An invalid selector or element reference was passed to the mixitup factory function";
        this.ERROR_FACTORY_CONTAINER_NOT_FOUND = "[MixItUp] The provided selector yielded no container element";
        this.ERROR_CONFIG_INVALID_ANIMATION_EFFECTS = "[MixItUp] Invalid value for `animation.effects`";
        this.ERROR_CONFIG_INVALID_CONTROLS_SCOPE = "[MixItUp] Invalid value for `controls.scope`";
        this.ERROR_CONFIG_INVALID_PROPERTY = '[MixitUp] Invalid configuration object property "${erroneous}"${suggestion}';
        this.ERROR_CONFIG_INVALID_PROPERTY_SUGGESTION = '. Did you mean "${probableMatch}"?';
        this.ERROR_CONFIG_DATA_UID_KEY_NOT_SET = "[MixItUp] To use the dataset API, a UID key must be specified using `data.uidKey`";
        this.ERROR_DATASET_INVALID_UID_KEY = '[MixItUp] The specified UID key "${uidKey}" is not present on one or more dataset items';
        this.ERROR_DATASET_DUPLICATE_UID = '[MixItUp] The UID "${uid}" was found on two or more dataset items. UIDs must be unique.';
        this.ERROR_INSERT_INVALID_ARGUMENTS = "[MixItUp] Please provider either an index or a sibling and position to insert, not both";
        this.ERROR_INSERT_PREEXISTING_ELEMENT = "[MixItUp] An element to be inserted already exists in the container";
        this.ERROR_FILTER_INVALID_ARGUMENTS = "[MixItUp] Please provide either a selector or collection `.filter()`, not both";
        this.ERROR_DATASET_NOT_SET = "[MixItUp] To use the dataset API with pre-rendered targets, a starting dataset must be set using `load.dataset`";
        this.ERROR_DATASET_PRERENDERED_MISMATCH = "[MixItUp] `load.dataset` does not match pre-rendered targets";
        this.ERROR_DATASET_RENDERER_NOT_SET = "[MixItUp] To insert an element via the dataset API, a target renderer function must be provided to `render.target`";
        this.ERROR_SORT_NON_EXISTENT_ELEMENT = "[MixItUp] An element to be sorted does not already exist in the container";
        this.WARNING_FACTORY_PREEXISTING_INSTANCE = "[MixItUp] WARNING: This element already has an active MixItUp instance. The provided configuration object will be ignored. If you wish to perform additional methods on this instance, please create a reference.";
        this.WARNING_INSERT_NO_ELEMENTS = "[MixItUp] WARNING: No valid elements were passed to `.insert()`";
        this.WARNING_REMOVE_NO_ELEMENTS = "[MixItUp] WARNING: No valid elements were passed to `.remove()`";
        this.WARNING_MULTIMIX_INSTANCE_QUEUE_FULL = "[MixItUp] WARNING: An operation was requested but the MixItUp instance was busy. The operation was rejected because the queue is full or queuing is disabled.";
        this.WARNING_GET_OPERATION_INSTANCE_BUSY = "[MixItUp] WARNING: Operations can be be created while the MixItUp instance is busy.";
        this.WARNING_NO_PROMISE_IMPLEMENTATION = "[MixItUp] WARNING: No Promise implementations could be found. If you wish to use promises with MixItUp please install an ES6 Promise polyfill.";
        this.WARNING_INCONSISTENT_SORTING_ATTRIBUTES = '[MixItUp] WARNING: The requested sorting data attribute "${attribute}" was not present on one or more target elements which may product unexpected sort output';
        this.callActions("afterConstruct");
        this.compileTemplates();
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.Messages);
      mixitup2.Messages.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.Messages.prototype.constructor = mixitup2.Messages;
      mixitup2.Messages.prototype.compileTemplates = function() {
        var errorKey = "";
        var errorMessage = "";
        for (errorKey in this) {
          if (typeof (errorMessage = this[errorKey]) !== "string") continue;
          this[h.camelCase(errorKey)] = h.template(errorMessage);
        }
      };
      mixitup2.messages = new mixitup2.Messages();
      mixitup2.Facade = function Mixer(mixer) {
        mixitup2.Base.call(this);
        this.callActions("beforeConstruct", arguments);
        this.configure = mixer.configure.bind(mixer);
        this.show = mixer.show.bind(mixer);
        this.hide = mixer.hide.bind(mixer);
        this.filter = mixer.filter.bind(mixer);
        this.toggleOn = mixer.toggleOn.bind(mixer);
        this.toggleOff = mixer.toggleOff.bind(mixer);
        this.sort = mixer.sort.bind(mixer);
        this.changeLayout = mixer.changeLayout.bind(mixer);
        this.multimix = mixer.multimix.bind(mixer);
        this.dataset = mixer.dataset.bind(mixer);
        this.tween = mixer.tween.bind(mixer);
        this.insert = mixer.insert.bind(mixer);
        this.insertBefore = mixer.insertBefore.bind(mixer);
        this.insertAfter = mixer.insertAfter.bind(mixer);
        this.prepend = mixer.prepend.bind(mixer);
        this.append = mixer.append.bind(mixer);
        this.remove = mixer.remove.bind(mixer);
        this.destroy = mixer.destroy.bind(mixer);
        this.forceRefresh = mixer.forceRefresh.bind(mixer);
        this.forceRender = mixer.forceRender.bind(mixer);
        this.isMixing = mixer.isMixing.bind(mixer);
        this.getOperation = mixer.getOperation.bind(mixer);
        this.getConfig = mixer.getConfig.bind(mixer);
        this.getState = mixer.getState.bind(mixer);
        this.callActions("afterConstruct", arguments);
        h.freeze(this);
        h.seal(this);
      };
      mixitup2.BaseStatic.call(mixitup2.Facade);
      mixitup2.Facade.prototype = Object.create(mixitup2.Base.prototype);
      mixitup2.Facade.prototype.constructor = mixitup2.Facade;
      {
        module.exports = mixitup2;
      }
      mixitup2.BaseStatic.call(mixitup2.constructor);
      mixitup2.NAME = "mixitup";
      mixitup2.CORE_VERSION = "3.3.2";
    })(window);
  })(mixitup$1);
  return mixitup$1.exports;
}
var mixitupExports = requireMixitup();
const mixitup = /* @__PURE__ */ getDefaultExportFromCjs(mixitupExports);
window.addEventListener("load", () => {
  function initMixitup(containerSelector, targetSelector, controlSelector) {
    const container = document.querySelector(containerSelector);
    const controls = document.querySelectorAll(controlSelector);
    if (!container) return;
    mixitup(container, {
      selectors: { target: targetSelector },
      animation: {
        duration: 250,
        effects: "fade scale(0.98)",
        easing: "ease-out",
        animateResizeContainer: false
      }
    });
    controls.forEach((btn) => {
      btn.addEventListener("click", () => {
        controls.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  }
  initMixitup(".blog__items", ".blog__item", ".blog__control");
  initMixitup(".programs-course__cards", ".programs-course__card", ".programs-course__control");
});
document.addEventListener("DOMContentLoaded", () => {
  function equalHeightMobile() {
    const items = document.querySelectorAll(".statistic-block__item:not(:first-child)");
    items.forEach((el) => el.style.height = "auto");
    if (window.innerWidth < 768) {
      const max = Math.max(...[...items].map((el) => el.offsetHeight));
      items.forEach((el) => el.style.height = max + "px");
    }
  }
  equalHeightMobile();
  window.addEventListener("resize", equalHeightMobile);
});
