import { LitElement, html, css } from "lit";
import "./play-list-slide.js";

export class PlayList extends LitElement {
  static get tag() {
    return "play-list";
  }

  static get properties() {
    return {
      index: { type: Number, reflect: true },
    };
  }

  constructor() {
    super();
    this.index = 0;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        outline: none;
      }

      .slider {
        position: relative;
        width: min(980px, 92vw);
        margin: 40px auto;
        display: grid;
        align-items: center;
      }

      /* arrows */
      .nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 44px;
        height: 44px;
        border-radius: 999px;
        border: 2px solid rgba(31, 99, 198, 0.35);
        background: #fff;
        color: var(--play-list-blue, #1f63c6);
        font-size: 28px;
        line-height: 1;
        display: grid;
        place-items: center;
        cursor: pointer;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
        user-select: none;
      }

      .nav.prev {
        left: -18px;
      }
      .nav.next {
        right: -18px;
      }

      .nav:hover {
        border-color: rgba(31, 99, 198, 0.65);
      }

      /* dots */
      .dots {
        position: absolute;
        left: 28px;
        bottom: 16px;
        display: flex;
        gap: 10px;
        z-index: 2;
      }

      .dot {
        width: 9px;
        height: 9px;
        border-radius: 999px;
        border: none;
        background: rgba(31, 99, 198, 0.25);
        cursor: pointer;
        padding: 0;
      }

      .dot.active {
        background: var(--play-list-blue, #1f63c6);
        width: 20px;
      }
    `;
  }

  firstUpdated() {
    this._syncActive();

    // make host focusable for keyboard
    if (!this.hasAttribute("tabindex")) this.setAttribute("tabindex", "0");

    // keyboard support (left/right)
    this.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.prev();
      if (e.key === "ArrowRight") this.next();
    });
    
  }

  updated(changed) {
    if (changed.has("index")) this._syncActive();
  }

  _slides() {
    // slides are light DOM children: <play-list-slide>...</play-list-slide>
    return Array.from(this.querySelectorAll("play-list-slide"));
  }

  _clampIndex(i) {
    const n = this._slides().length;
    if (n === 0) return 0;
    return ((i % n) + n) % n; // wrap
  }

  _syncActive() {
    const slides = this._slides();
    if (!slides.length) return;

    const idx = this._clampIndex(this.index);
    if (idx !== this.index) {
      // avoid infinite loop: only set if needed
      this.index = idx;
      return;
    }

    slides.forEach((s, i) => (s.active = i === this.index));
  }

  prev() {
    this.index = this._clampIndex(this.index - 1);
  }

  next() {
    this.index = this._clampIndex(this.index + 1);
  }

  goTo(i) {
    this.index = this._clampIndex(i);
  }

  _onSlotChange() {
    // if slides were added/removed after render
    this._syncActive();
    this.requestUpdate();
  }

  render() {
    const count = this._slides().length;

    return html`
      <div class="slider">
        <button class="nav prev" @click=${this.prev} aria-label="Previous slide">
          ‹
        </button>

        <!-- The slides come from outside via slot -->
        <slot @slotchange=${this._onSlotChange}></slot>

        <button class="nav next" @click=${this.next} aria-label="Next slide">
          ›
        </button>

        <div class="dots" ?hidden=${count <= 1}>
          ${Array.from({ length: count }, (_, i) => html`
            <button
              class="dot ${i === this.index ? "active" : ""}"
              @click=${() => this.goTo(i)}
              aria-label="Go to slide ${i + 1}"
            ></button>
          `)}
        </div>
      </div>
    `;
  }
}

globalThis.customElements.define(PlayList.tag, PlayList);