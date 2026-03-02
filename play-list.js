import { LitElement, html, css } from "lit";
 import "./play-list-slide.js";
export class PlayList extends LitElement {
  static get tag() {
    return "play-list";
   
  }

  static get properties() {
    return {
      index: { type: Number, reflect: true },
      wrap: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.index = 0;
    this.wrap = true;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        --play-list-accent: var(--ddd-theme-primary, #1f63c6);
      }

      .slider {
        position: relative;
        width: min(980px, 92vw);
        margin: 40px auto;
        display: grid;
        align-items: center;
        overflow: visible;
      }

      .nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 44px;
        height: 44px;
        border-radius: 999px;
        border: 2px solid color-mix(in srgb, var(--play-list-accent) 35%, transparent);
        background: #fff;
        color: var(--play-list-accent);
        font-size: 28px;
        display: grid;
        place-items: center;
        cursor: pointer;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
        z-index: 5;
      }

      .nav.prev {
        left: -18px;
      }
      .nav.next {
        right: -18px;
      }

      .dots {
        position: absolute;
        left: 28px;
        bottom: 16px;
        display: flex;
        gap: 10px;
        z-index: 6;
      }

      .dot {
        width: 9px;
        height: 9px;
        border-radius: 999px;
        border: none;
        background: color-mix(in srgb, var(--play-list-accent) 25%, transparent);
        cursor: pointer;
        padding: 0;
      }

      .dot.active {
        background: var(--play-list-accent);
        width: 20px;
      }

      @media (max-width: 520px) {
        .nav.prev {
          left: 10px;
        }
        .nav.next {
          right: 10px;
        }
      }
    `;
  }

  firstUpdated() {
    if (!this.hasAttribute("tabindex")) this.setAttribute("tabindex", "0");

    this._syncActive();

    this.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.prev();
      if (e.key === "ArrowRight") this.next();
    });

    this.addEventListener("play-list-index-changed", (e) => {
      this.goTo(e.detail.index);
    });
  }

  updated(changed) {
    if (changed.has("index")) this._syncActive();
  }

  _slides() {
    const slot = this.shadowRoot?.querySelector("slot");
    const assigned = slot ? slot.assignedElements({ flatten: true }) : [];
    return assigned.filter((el) => el.tagName?.toLowerCase() === "play-list-slide");
  }

  _maxIndex() {
    return Math.max(0, this._slides().length - 1);
  }

  _clampOrWrap(i) {
    const n = this._slides().length;
    if (n === 0) return 0;
    if (this.wrap) return ((i % n) + n) % n;
    return Math.min(this._maxIndex(), Math.max(0, i));
  }

  _syncActive() {
    const slides = this._slides();
    if (!slides.length) return;

    const idx = this._clampOrWrap(this.index);
    if (idx !== this.index) {
      this.index = idx;
      return;
    }

    slides.forEach((s, i) => (s.active = i === this.index));
    this.requestUpdate(); // refresh dots
  }

  prev() {
    if (!this.wrap && this.index === 0) return;
    this.index = this._clampOrWrap(this.index - 1);
  }

  next() {
    if (!this.wrap && this.index === this._maxIndex()) return;
    this.index = this._clampOrWrap(this.index + 1);
  }

  goTo(i) {
    this.index = this._clampOrWrap(i);
  }

  _onSlotChange() {
    this._syncActive();
  }

  render() {
    const count = this._slides().length;
    return html`
      <div class="slider">
        <button class="nav prev" @click=${this.prev} aria-label="Previous slide">‹</button>

        <slot @slotchange=${this._onSlotChange}></slot>

        <button class="nav next" @click=${this.next} aria-label="Next slide">›</button>

        <div class="dots" ?hidden=${count <= 1}>
          ${Array.from({ length: count }, (_, i) => html`
            <button class="dot ${i === this.index ? "active" : ""}" @click=${() => this.goTo(i)}></button>
          `)}
        </div>
      </div>
    `;
  }
}

globalThis.customElements.define(PlayList.tag, PlayList);