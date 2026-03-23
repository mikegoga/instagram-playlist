import { LitElement, html, css } from 'lit';

export class FoxCard extends LitElement {
  static properties = {
    image: { type: String },
    link: { type: String }
  };

  static styles = css`
    .card {
      width: 300px;
      border: 1px solid #ccc;
      border-radius: 10px;
      overflow: hidden;
      text-align: center;
      background: white;
    }
    img {
      width: 100%;
    }
    a {
      display: block;
      padding: 10px;
      text-decoration: none;
      color: blue;
    }
  `;

  render() {
    return html`
      <div class="card">
        <img src="${this.image}" alt="fox" />
        <a href="${this.link}" target="_blank">View Source</a>
      </div>
    `;
  }
}

customElements.define('fox-card', FoxCard);