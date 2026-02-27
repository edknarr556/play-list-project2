import { LitElement, html, css } from "lit";

export class PlayListSlide extends LitElement {
  static get tag() {
    return "play-list-slide";
  }

  static get properties() {
    return {
      topHeading: { type: String, attribute: "top-heading" },
      secondHeading: { type: String, attribute: "second-heading" },
      active: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.topHeading = "";
    this.secondHeading = "";
    this.active = false;
  }

  _onClick() {
    // find my index in the parent <play-list> light DOM
    const parent = this.parentElement;
    if (!parent) return;

    const slides = Array.from(parent.querySelectorAll("play-list-slide"));
    const index = slides.indexOf(this);
    if (index < 0) return;

    this.dispatchEvent(
      new CustomEvent("play-list-index-changed", {
        bubbles: true,
        composed: true,
        detail: { index },
      })
    );
  }

  static get styles() {
    return css`
      :host {
        display: none;
      }
      :host([active]) {
        display: block;
      }

      .card {
        cursor: pointer; /* so it feels clickable */
        position: relative;
        border-radius: 12px;
        background: var(--play-list-card-bg, #f7fbff);
        box-shadow: var(--play-list-shadow, 0 10px 25px rgba(0, 0, 0, 0.12));
        padding: 26px 28px 18px;
        min-height: 340px;
        overflow: hidden;
      }
    `;
  }

  render() {
    return html`
      <section class="card" @click=${this._onClick} aria-live="polite">
        <p class="kicker">${this.topHeading}</p>
        <h2 class="title">${this.secondHeading}</h2>
        <div class="content">
          <div class="body"><slot></slot></div>
        </div>
      </section>
    `;
  }
}

globalThis.customElements.define(PlayListSlide.tag, PlayListSlide);