import { LitElement, html, css } from 'lit';
import './fox-card.js';

export class MyApp extends LitElement {
  static styles = css`
  .app {
    display: flex;
    justify-content: center;
    margin-top: 40px;
    font-family: Arial, sans-serif;
  }

  .card {
    width: 320px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    overflow: hidden;
  }

  /* HEADER */
  .header {
    display: flex;
    align-items: center;
    padding: 12px;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(45deg, #ff5f6d, #ffc371);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    margin-right: 10px;
  }

  .user-info {
    display: flex;
    flex-direction: column;
  }

  .username {
    font-weight: bold;
  }

  .genre {
    font-size: 12px;
    color: gray;
  }

  /* IMAGE */
  .image-container {
    position: relative;
  }

  .image-container img {
    width: 100%;
    height: 300px;
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
    padding: 8px;
    cursor: pointer;
    border-radius: 50%;
  }

  .left {
    left: 10px;
  }

  .right {
    right: 10px;
  }

  /* ACTIONS */
  .actions {
    padding: 10px;
  }

  .actions button {
    font-size: 20px;
    background: none;
    border: none;
    cursor: pointer;
  }
`;
  
  static properties = {
    items: { type: Array },
    activeIndex: { type: Number }
  };

  constructor() {
    super();
    this.items = [];
    this.activeIndex = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadData();
  }

  firstUpdated() {
    const params = new URLSearchParams(window.location.search);
    const index = params.get('index');
    if (index !== null) {
      this.activeIndex = parseInt(index);
    }
  }

  async loadData() {
    const res = await fetch('./data.json');
    const json = await res.json();
    this.items = json.data;
  }

  updateQueryParam(key, value) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.pushState({}, '', url);
  }

  next() {
    this.activeIndex = (this.activeIndex + 1) % this.items.length;
    this.updateQueryParam('index', this.activeIndex);
  }
  
  prev() {
  this.activeIndex =
    (this.activeIndex - 1 + this.items.length) % this.items.length;
  this.updateQueryParam('index', this.activeIndex);
  }

  toggleLike(id) {
    let likes = JSON.parse(localStorage.getItem('likes')) || {};
    likes[id] = !likes[id];
    localStorage.setItem('likes', JSON.stringify(likes));
    this.requestUpdate();
  }

  isLiked(id) {
    let likes = JSON.parse(localStorage.getItem('likes')) || {};
    return likes[id];
  }

  render() {
    if (!this.items.length) {
      return html`<p>Loading...</p>`;
    }

    const item = this.items[this.activeIndex];

    return html`
      <div class="app">

      <div class="card">

        <div class="header">
          <div class="avatar">
            ${item.title[0]}
          </div>
          <div class="user-info">
            <span class="username">${item.title}</span>
            <span class="genre">${item.author.name}</span>
          </div>
        </div>

        <div class="image-container">
          <button class="arrow left" @click=${this.prev}>⬅</button>

          <img src="${item.image}" alt="artist" />

          <button class="arrow right" @click=${this.next}>➡</button>
        </div>

        <div class="actions">
          <button @click=${() => this.toggleLike(item.id)}>
            ${this.isLiked(item.id) ? '❤️' : '🤍'}
          </button>
        </div>

      </div>
    </div>
    `;
  }
}

customElements.define('my-app', MyApp);