import { LitElement, html } from 'lit';
import './fox-card.js';

export class MyApp extends LitElement {
  static properties = {
    fox: { type: Object }
  };

  constructor() {
    super();
    this.fox = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadFox();
  }

  async loadFox() {
    const res = await fetch('https://randomfox.ca/floof/');
    const data = await res.json();
    this.fox = data;
  }

  render() {
  return html`
    <h1>Instagram </h1>

    <button @click=${this.loadFox}>New Fox</button>

    ${this.fox
      ? html`
          <fox-card
            .image=${this.fox.image}
            .link=${this.fox.link}
          ></fox-card>
        `
      : html`<p>Loading...</p>`}
  `;
}
}

customElements.define('my-app', MyApp);