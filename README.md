<h1 align="center">
<sub>
<img src="https://raw.githubusercontent.com/code-hemu/klak-newtab/refs/heads/main/src/assets/icon/128.png" height="38" width="38">
</sub>
Klak - New Tab
</h1> 

| Browser   | Install from ... | Status |
| :-------: | ---------------- | ------ |
| <img src="https://github.com/user-attachments/assets/3a7569f8-688b-4eb1-a643-8d0fe173aefe" alt="Get Klak - New Tab for Microsoft Edge"> | <a href="https://microsoftedge.microsoft.com/addons/detail/klak-new-tab/efhdkicldnpbahdeonlddciolplijoeh">Edge Add-ons</a> | Stable & Development Versions Available
| <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Firefox_logo%2C_2019.svg/960px-Firefox_logo%2C_2019.svg.png" height="50" alt="Get Klak - New Tab for Firefox"> | <a href="https://addons.mozilla.org/en-US/firefox/addon/klak-new-tab/">Opera Add-ons</a> | Stable & Development Versions Available
| <img src="https://github.com/user-attachments/assets/5463ef88-873b-4516-8514-5277664cfde7" alt="Get Klak - New Tab for Chromium"> | <a href="https://chromewebstore.google.com/detail/klak-new-tab/aiedbcgelehdnojllldckpdjfkpmehap">Chrome Web Store</a> | Stable & Development Versions Available
| <img src="https://upload.wikimedia.org/wikipedia/commons/c/c2/GitHub_Invertocat_Logo.svg" height="50" alt="Get Klak - New Tab through GitHub"> | <a href="https://github.com/code-hemu/volume-booster/releases">GitHub - Releases</a> | Stable and development versions on Chromium MV3, Micreosoft Edge, Opera, and NAVER Whale. You have to extract it from the zip and install it manually in the web browser.
<br/>
A minimal, clean, and customizable **Klak - New Tab browser extension** that replaces your default tab with a beautiful and functional dashboard.

## 🔧 Manual Install (Chrome / Edge / Brave)
1. Clone the repository:
   ```bash
   git clone https://github.com/code-hemu/klak-newtab.git
   cd klak-newtab

2. Install dependencies and build:
   ```bash
   npm install
   npm run build
   
The output will be generated in a build/ folder.

## ⚙️ How It Works

This extension overrides the default new tab page using:

```json
{
  "chrome_url_overrides": {
    "newtab": "index.html"
  }
}
```
## 🤝 Contributing

Contributions are welcome!

1. Fork the repo

2. Create your branch:
   ```bash
   git checkout -b feature/your-feature
   
3. Commit changes:
   ```bash   
   git commit -m "Add your feature"
   
4. Push and open a PR 🚀

## ⭐ Support
If you like [this project](https://github.com/code-hemu/klak-newtab), give it a ⭐ on GitHub!
