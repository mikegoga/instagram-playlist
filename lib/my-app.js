import { LitElement, html, css } from 'lit';

export class MyApp extends LitElement {

  static properties = {
    items: { type: Array },
    activeIndex: { type: Number }
  };

  static styles = css`
    .app {
      display: flex;
      justify-content: center;
      margin-top: 40px;
      font-family: Arial, sans-serif;
      background: #f0f0f0;
      min-height: auto;
    }

    .card {
      width: 350px;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    /* HEADER */
    .topbar {
      padding: 12px;
      font-weight: bold;
      font-size: 18px;
    }
    
    .logo {
       height: 30px;
    }

    .header {
      display: flex;
      align-items: center;
      padding: 10px;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }

    .username {
      font-weight: bold;
    }

    /* IMAGE */
    .image-container {
      position: relative;
    }

    img.main {
      width: 100%;
      height: 320px;
      object-fit: cover;
    }

    /* ARROWS */
    .arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0,0,0,0.5);
      color: white;
      border: none;
      border-radius: 50%;
      padding: 8px;
      cursor: pointer;
    }

    .left { left: 10px; }
    .right { right: 10px; }

    /* ACTIONS */
    .actions {
      display: flex;
      gap: 10px;
      padding: 10px;
      font-size: 20px;
    }

    .actions button {
      background: none;
      border: none;
      cursor: pointer;
    }

    /* CAPTION */
    .caption {
      padding: 0 10px 10px;
      font-size: 14px;
    }

    /* DOTS */
    .dots {
      display: flex;
      justify-content: center;
      gap: 5px;
      padding-bottom: 10px;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ccc;
    }

    .dot.active {
      background: black;
    }
  `;

  constructor() {
    super();
    this.items = [];
    this.activeIndex = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadData();
  }

  async loadData() {
    const res = await fetch('./data.json');
    const data = await res.json();
    this.items = data;
  }

  next = () => {
    this.activeIndex = (this.activeIndex + 1) % this.items.length;
    this.updateURL();
  }

  prev = () => {
    this.activeIndex =
      (this.activeIndex - 1 + this.items.length) % this.items.length;
    this.updateURL();
  }
  toggleLike(id) {
  const liked = JSON.parse(localStorage.getItem('likes') || '[]');

  if (liked.includes(id)) {
    liked.splice(liked.indexOf(id), 1);
  } else {
    liked.push(id);
  }

  localStorage.setItem('likes', JSON.stringify(liked));
  this.requestUpdate();
}

isLiked(id) {
  const liked = JSON.parse(localStorage.getItem('likes') || '[]');
  return liked.includes(id);
}

  updateURL() {
    const url = new URL(window.location);
    url.searchParams.set('index', this.activeIndex);
    window.history.pushState({}, '', url);
  }

  render() {
    if (!this.items.length) return html`<p>Loading...</p>`;

    const item = this.items[this.activeIndex];

    return html`
      <div class="app">
        <div class="card">

          <!-- INSTAGRAM LOGO -->
          <div class="topbar">
            <img src="../images/instagram.png" class="logo" />
          </div>

          <!-- USER HEADER -->
          <div class="header">
            <img class="avatar" src="../edmres.png" />
            <span class="username">edmresidence and ${item.title} </span>
          </div>

          <!-- IMAGE -->
          <div class="image-container">
            <button class="arrow left" @click=${this.prev}>⬅</button>

            <img class="main" src="${item.image}" />

            <button class="arrow right" @click=${this.next}>➡</button>
          </div>

          <!-- ACTIONS -->
          <div class="actions">
            <button @click=${() => this.toggleLike(item.id)}>
               ${this.isLiked(item.id) ? '❤️' : '🤍'}
            </button>
            <button>💬</button>
            <button>📤</button>
          </div>

          <!-- CAPTION -->
          <div class="caption">
            <b>edmresidence</b> ${item.caption}
          </div>

          <!-- DOTS -->
          <div class="dots">
            ${this.items.map((_, i) => html`
              <div class="dot ${i === this.activeIndex ? 'active' : ''}"></div>
            `)}
          </div>

        </div>
      </div>
    `;
  }
}

customElements.define('my-app', MyApp);