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
      variant: { type: String, reflect: true }, // optional: color variants
    };
  }

  constructor() {
    super();
    this.topHeading = "";
    this.secondHeading = "";
    this.active = false;
    this.variant = ""; // "blue" | "orange" | "green" | etc
  }

  _onClick() {
    // Tell parent slider which slide was clicked
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
        cursor: pointer;
        position: relative;
        border-radius: var(--ddd-radius-lg, 16px);
        background: var(--play-list-card-bg, var(--ddd-theme-default-limestoneLight, #f7fbff));
        border: 1px solid color-mix(in srgb, var(--ddd-theme-primary, #1f63c6) 18%, transparent);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
        padding: 26px 28px 18px;
        min-height: 340px;
        overflow: hidden;
      }

      /* variant examples (DDD-friendly but simple) */
      :host([variant="blue"]) .card {
        --play-list-card-bg: #eef5ff;
      }
      :host([variant="orange"]) .card {
        --play-list-card-bg: #fff3e6;
      }
      :host([variant="green"]) .card {
        --play-list-card-bg: #ecfff2;
      }
      :host([variant="purple"]) .card {
        --play-list-card-bg: #f5f0ff;
      }

      .kicker {
        margin: 0 0 8px;
        font-size: 12px;
        letter-spacing: 0.08em;
        font-weight: 700;
        color: var(--ddd-theme-primary, #1f63c6);
        text-transform: uppercase;
      }

      .title {
        margin: 0 0 16px;
        font-size: clamp(30px, 3.2vw, 44px);
        line-height: 1.05;
        color: var(--ddd-theme-default-slateGray, #163b7a);
      }

      .content {
        max-width: 620px;
      }

      /* scrollable text area */
      .body {
        margin: 0;
        font-size: 14px;
        line-height: 1.5;
        color: var(--ddd-theme-default-coalyGray, #1f2a3a);
        max-height: 120px;
        overflow: auto;
        padding-right: 10px;
      }

      /* mobile tweaks */
      @media (max-width: 520px) {
        .card {
          padding: 20px 18px 14px;
          min-height: 300px;
        }
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