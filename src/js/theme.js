const domReady = (callback)=> {document.readyState === 'complete' ? callback() : window.addEventListener('load', callback, false);};
const $ = (selector) => {if (typeof selector !== "string") {console.error("Selector must be a string");return null;}if (typeof document === "undefined") {console.error("DOM is not available (document is undefined)");return null;}try {const elements = document.querySelectorAll(selector);if (elements.length === 0) {console.warn(`No elements found for selector: ${selector}`);return null;}return elements.length === 1 ? elements[0] : elements;} catch (error) {console.error(`Invalid selector: ${selector}`);return null;}};
const API = (() => {
  if (typeof browser !== 'undefined') return browser;
  if (typeof chrome !== 'undefined') return chrome;
  throw new Error('Extension API not found');
})();

const build = (defs, parent = document.body)=> {
  defs.forEach(def => {
    const count = def.repeat || 1;
    for (let i = 0; i < count; i++) {
      const el = document.createElement(def.tag);
      if (def.class) el.className = def.class;
      if (def.children) {
        build(def.children, el);
      }
      parent.appendChild(el);
    }
  });
}

const theme = {
	"load": async function () {
		build([
			{
				tag: "div",
				class: "fireflys",
				children: [
					{ tag: "div", class: "firefly", repeat: 25 }
				]
			},
			{ 
				tag: "div", 
				class: "space",
				children: [
					{ tag: "div", class: "stars", repeat: 3 }
				]
			},
			{ 
				tag: "div", 
				class: "layers", 
				children: [
					{ tag: "div", class: "layer", repeat: 7 }
				] 
			},
			{ tag: "div", class: "time" },
			{ 
				tag: "div", 
				class: "waves", 
				children: [
					{ tag: "div", class: "wave", repeat: 5 }
				] 
			}
		], $(".template"));

		const methods = {
			...theme.interface.set,
			...theme.interface.click
		};

		for (const key in methods) {
			if (typeof methods[key] === "function") {
				await methods[key]();
			}
		}	
	},
	"storage": {
		"set": function(key, value) {
			return new Promise((resolve) => {
				API.storage.local.set({[key]: value}, resolve);
			});
		},
		"get": function(key) {
			return new Promise((resolve) => {
				API.storage.local.get([key], (result) => {
					resolve(result[key]);
				});
			});
		}
	}, 
	"interface": {
		"set": {
			"time": async function(){
				const timeFormat = localStorage.twelveHourFormat;
				$(".checked").classList.toggle("hide", timeFormat !=undefined ? timeFormat === "true" : false);

				// let i = 0;
				// setInterval(() => {
				// 	$(".time").textContent = `${i}:${i}`;
				// 	i = i + 1;

				// 	if (i > 61) i = 0;
				// }, 200);

				setInterval(() => {
					const date = new Date();
					const timeFormat = localStorage.twelveHourFormat;
					const twelveHour = timeFormat !=undefined ? timeFormat === "true" : false;

					let hours = date.getHours();
					const minutes = String(date.getMinutes()).padStart(2, "0");

					if (twelveHour) {
						hours = ((hours + 11) % 12 + 1);
						$(".time").textContent = `${hours}:${minutes}`;
					} else {
						hours = String(hours).padStart(2, "0");
						$(".time").textContent = `${hours}:${minutes}`;
					}
				}, 1000);

			},
			"link": function(){
				$("#codehemu").href = "https://x.com/codehemu";
			},
			"themes": async function(){
				const styleSheet = await theme.storage.get("styleSheet");
				const styeName = styleSheet !=undefined ? styleSheet : "normal";

				$(".style").setAttribute("href", `${styeName}.css`);
				$("link[rel='icon']").setAttribute("href", `../icons/${styeName}.svg`) 
				const themes = $(".themes");
				if(!themes) return;
				for (let theme of [
					"normal", 
					"tea", 
					"orange", 
					"galaxy", 
					"neo", 
					"boss", 
					"pop", 
					"retro", 
					"glow", 
					"begging", 
					"gravity", 
					"scenery"
				]){
					const div = document.createElement("div");
					div.setAttribute("id", theme);
					div.className = `theme ${styeName == theme ? "active" : ""}`;

					const img = document.createElement("img");
					img.setAttribute("src", `../icons/${theme}.svg`);
					div.appendChild(img);
					themes.appendChild(div);
				}
			},
			"tooltip": async function(){
				const tipShow = await theme.storage.get("tip");
				$(".tooltip").classList.toggle("show", tipShow !=undefined ? tipShow : true);
			},
			"translate": function(){
				return new Promise((resolve) => {
					const elements = document.querySelectorAll("[data-message]");
					for (const element of elements) {
						const key = element.dataset.message;
						const message = API.i18n.getMessage(key);
						if (message) {
							element.textContent = message;
						} else {
							console.error("Missing chrome.i18n message:", key);
						}
					}
					resolve();
				});
			}
		},
		"click": {
			"toggle": function(){
				$(".closed").addEventListener("click", () => {
					theme.storage.set("tip", false);
					$(".closed").classList.toggle("hide", true);
					$(".opened").classList.toggle("show", true);
					$(".tooltip").classList.toggle("show", false);
				});

				document.addEventListener("click", function (event) {
					if (event.target.closest(".opened") || event.target.closest(".closed")) {
						return;
					} else {
						$(".closed").classList.toggle("hide", false);
						$(".opened").classList.toggle("show", false);
					}
				});

				$(".input").addEventListener("click", async () => {
					const timeFormat = localStorage.twelveHourFormat;
					if(timeFormat !=undefined ? timeFormat === "true" : false){
						localStorage.twelveHourFormat = false;
						$(".checked").classList.toggle("hide", false);
					}else{
						localStorage.twelveHourFormat = true;
						$(".checked").classList.toggle("hide", true);
					}
				});

			},
			"theme": function(){
				document.querySelectorAll(".themes .theme").forEach((ele)=> {
					ele.addEventListener("click", (event)=> {
						document.querySelectorAll(".themes .theme").forEach( (element)=> {
							element.classList.toggle("active", false);
							if(event.currentTarget.id == element.id){
								element.classList.toggle("active", true);
								theme.storage.set("styleSheet", element.id);
								const styeName = event.currentTarget.id;
								$(".style").setAttribute("href", `${styeName}.css`);
								$("link[rel='icon']").setAttribute("href", `../icons/${styeName}.svg`) 
							}
						});
					});
					ele.addEventListener("mouseover", function (event) {
						$(".caption").innerText = event.currentTarget.id;
					});
					ele.addEventListener("mouseout", function () {
						$(".caption").innerText = API.i18n.getMessage("themes");
					});
				});
			},
			"fullscreen": function(){
				const elem = document.documentElement;
				$(".fullscreen")?.addEventListener("click", () => {
					elem ? elem.requestFullscreen ? elem.requestFullscreen() : 
					elem.msRequestFullscreen ? elem.msRequestFullscreen() : 
					elem.mozRequestFullScreen ? elem.mozRequestFullScreen() :
					elem.webkitRequestFullscreen ? elem.webkitRequestFullscreen() : '' : '';
				});
			}

		}
	}
}

domReady(() => {theme.load()});