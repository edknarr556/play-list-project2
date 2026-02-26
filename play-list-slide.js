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

  static get styles() {
    return css`
      :host {
        display: none;
      }
      :host([active]) {
        display: block;
      }

      .card {
        position: relative;
        border-radius: 12px;
        background: var(--play-list-card-bg, #f7fbff);
        box-shadow: var(--play-list-shadow, 0 10px 25px rgba(0, 0, 0, 0.12));
        padding: 26px 28px 18px;
        min-height: 340px;
        overflow: hidden;
      }

      /* subtle patterned background */
      .card::before {
        content: "";
        position: absolute;
        inset: 0;
        opacity: 0.25;
        pointer-events: none;
        background: linear-gradient(
              135deg,
              rgba(11, 74, 162, 0.08) 0 1px,
              transparent 1px 100%
            )
            0 0/26px 26px,
          linear-gradient(
              45deg,
              rgba(11, 74, 162, 0.05) 0 1px,
              transparent 1px 100%
            )
            0 0/22px 22px;
      }

      .kicker,
      .title,
      .content,
      .dots {
        position: relative;
      }

      .kicker {
        margin: 0 0 8px;
        font-size: 12px;
        letter-spacing: 0.08em;
        font-weight: 700;
        color: var(--play-list-blue, #1f63c6);
        text-transform: uppercase;
      }

      .title {
        margin: 0 0 16px;
        font-size: clamp(30px, 3.2vw, 44px);
        line-height: 1.05;
        color: var(--play-list-title, #163b7a);
      }

      .content {
        max-width: 620px;
      }

      .body {
        margin: 0;
        font-size: 14px;
        line-height: 1.5;
        color: #1f2a3a;
        max-height: 120px; /* scroll area like screenshot */
        overflow: auto;
        padding-right: 10px;
      }
    `;
  }

  render() {
    return html`
      <section class="card" aria-live="polite">
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