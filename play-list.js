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
      }

      .slider {
        position: relative;
        width: min(980px, 92vw);
        margin: 40px auto;
        display: grid;
        align-items: center;
      }

      ::slotted(play-list-slide) {
        /* slides decide visibility via [active] */
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
    // keyboard support (left/right)
    this.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.prev();
      if (e.key === "ArrowRight") this.next();
    });
    this.setAttribute("tabindex", "0"); // make host focusable for keyboard
  }

  updated(changed) {
    if (changed.has("index")) this._syncActive();
  }

  _slides() {
    // slotted children in light DOM
    return Array.from(this.querySelectorAll("play-list-slide"));
  }

  _clampIndex(i) {
    const n = this._slides().length;
    if (n === 0) return 0;
    return ((i % n) + n) % n;
  }

  _syncActive() {
    const slides = this._slides();
    if (!slides.length) return;

    const idx = this._clampIndex(this.index);
    if (idx !== this.index) this.index = idx;

    slides.forEach((s, i) => (s.active = i === this.index));
    this.requestUpdate();
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
    this._syncActive();
  }

  render() {
    return html`
    <div class="wrapper">
      <play-list index="0">
        <play-list-slide
          top-heading="TOP LINE HEADING"
          second-heading="Slide 1, sub-heading"
        >
          <p>
            This could be an image, a whole bunch of text or anything really...
            This could be an image, a whole bunch of text or anything really...
          </p>
        </play-list-slide>

        <play-list-slide
          top-heading="TOP LINE HEADING"
          second-heading="Slide 2, sub-heading"
        >
          <p>Second slide content goes here...</p>
        </play-list-slide>

        <play-list-slide
          top-heading="TOP LINE HEADING"
          second-heading="Slide 3, sub-heading"
        >
          <p>Third slide content goes here...</p>
        </play-list-slide>

        <play-list-slide
          top-heading="TOP LINE HEADING"
          second-heading="Slide 4, sub-heading"
        >
          <p>Fourth slide content goes here...</p>
        </play-list-slide>
      </play-list>
    </div>
  `;
}

globalThis.customElements.define(PlayList.tag, PlayList);