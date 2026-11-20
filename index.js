class _BaobaoAudioPlayback {
  constructor(options = {}) {
    this.options = Object.assign(
      {
        src: "",
        loop: false,
        el: "body",
        icon: true,
        preload: "auto",
        autoPlay: true,
        loadingText: "Loading...",
        failedText: "Retry",
        volume: 1,
      },
      options,
    );

    this.audio = document.createElement("audio");
    this.audio.src = this.options.src;
    this.audio.loop = this.options.loop;
    this.audio.preload = this.options.preload;
    this.audio.volume = this.options.volume;

    this.id = "audio_" + Date.now() + Math.random(1000);
    this.createUI();
    this.setupEvent();
    this.tryPlay();
  }

  createUI() {
    const wrapper = document.createElement("div");
    wrapper.setAttribute("id", this.id);
    wrapper.setAttribute("class", "common_musicbutton_wrapper loading");

    if (this.options.icon) {
      wrapper.innerHTML = `<a></a><p class="loadinghint">${this.options.loadingText}</p>`;
    }

    document.querySelector(this.options.el).appendChild(wrapper);
    this.el = wrapper;
  }

  setupEvent() {
    this.el.addEventListener("click", () => {
      this.options.autoPlay = true;
      if (this.audio.paused) {
        this.play();
      } else {
        this.pause();
      }
    });
  }

  tryPlay() {
    const environment = this.getEnv();

    if (environment === "ios") {
      this.el.classList.remove("loading");
      if (this.options.autoPlay) {
        this.play();
      }
    } else {
      try {
        // Non-iOS: Listen for 'canplaythrough' before playing
        this.audio.addEventListener(
          "canplaythrough",
          () => {
            this.el.classList.remove("loading");
            if (this.options.autoPlay) {
              this.play();
            }
          },
          { once: true },
        );
      } catch (error) {
        console.log(error);
      }
    }
  }
  autoPlay() {}
  play() {
    this.el.classList.add("active");
    this.audio.play().catch((e) => {
      console.log("Playback failed:", e);
      this.el.classList.add("error");
      this.el.classList.remove("active");
      this.el.innerHTML = `<a></a><p class="errorhint">${this.options.failedText}</p>`;
    });
  }

  pause() {
    this.audio.pause();
    this.el.classList.remove("active");
  }

  getEnv() {
    const ua = navigator.userAgent;

    if (
      /iPhone|iPad|iPod/.test(ua) ||
      /\(i[^;]+;( U;)? CPU.+Mac OS X/.test(ua)
    ) {
      return "ios";
    }
    if (/Android/.test(ua)) {
      return "android";
    }
    if (/MicroMessenger/i.test(ua)) {
      return "wechat";
    }
    return "desktop";
  }
}

// Factory
var BaobaoAudioPlayback = function (options) {
  return new _BaobaoAudioPlayback(options);
};

export default BaobaoAudioPlayback;
