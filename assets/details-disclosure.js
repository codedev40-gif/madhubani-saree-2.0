class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector('details');

    this.addEventListener('keyup', onKeyUpEscape);
    this.mainDetailsToggle.addEventListener('focusout', this.onFocusOut.bind(this));

    this.hoverQuery = window.matchMedia('(min-width: 990px) and (hover: hover) and (pointer: fine)');
    if (this.hoverQuery.matches) this.bindHover();
    this.hoverQuery.addEventListener('change', () => {
      if (this.hoverQuery.matches) this.bindHover();
    });
  }

  bindHover() {
    if (this.dataset.hoverBound === 'true') return;
    this.dataset.hoverBound = 'true';

    const details = this.mainDetailsToggle;
    const summary = details.querySelector('summary');
    let closeTimer;

    const open = () => {
      clearTimeout(closeTimer);
      details.setAttribute('open', '');
    };

    const scheduleClose = () => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => {
        if (!this.matches(':hover') && !this.contains(document.activeElement)) this.close();
      }, 150);
    };

    this.addEventListener('mouseenter', open);
    this.addEventListener('mouseleave', scheduleClose);
    this.addEventListener('focusin', open);

    summary.addEventListener('click', (event) => {
      if (this.hoverQuery.matches && event.pointerType === 'mouse') event.preventDefault();
    });

    this.querySelectorAll('.header__submenu details').forEach((nested) => {
      const nestedSummary = nested.querySelector('summary');
      nested.addEventListener('mouseenter', () => nested.setAttribute('open', ''));
      nested.addEventListener('mouseleave', () => nested.removeAttribute('open'));
      if (nestedSummary) {
        nestedSummary.addEventListener('click', (event) => {
          if (this.hoverQuery.matches && event.pointerType === 'mouse') event.preventDefault();
        });
      }
    });
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    })
  }

  close() {
    this.mainDetailsToggle.removeAttribute('open');
    this.querySelectorAll('.header__submenu details[open]').forEach((nested) => nested.removeAttribute('open'));
  }
}

customElements.define('details-disclosure', DetailsDisclosure);
