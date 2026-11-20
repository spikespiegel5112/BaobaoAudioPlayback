
class _BaobaoAudioPlayback {
  constructor(options = {}) {
    this.options = {
      src: "",
      loop: false,
      el: "body",
      icon: true,
      preload: "auto",
      autoPlay: true,
      loadingText: "Loading...",
      failedText: "Retry",
      volume: 1,
      ...options,
    };

    // Initialize instance states
    this.destroyed = false;
    this.hasError = false;
    this.userPaused = false;
    this.autoPlayAttempted = false;

    // Normalize audio source
    this.options.src =
      typeof this.options.src === "string"
        ? this.options.src.trim()
        : "";

    // Create audio element
    this.audio = document.createElement("audio");
    this.audio.loop = Boolean(this.options.loop);

    const validPreload = ["none", "metadata", "auto"].includes(
      this.options.preload,
    )
      ? this.options.preload
      : "auto";

    // Automatic playback requires the browser to load audio data
    this.audio.preload = this.options.autoPlay ? "auto" : validPreload;

    // Validate and set volume
    const volume = Number(this.options.volume);

    this.audio.volume = Number.isFinite(volume)
      ? Math.max(0, Math.min(1, volume))
      : 1;

    // Create player UI
    this.createUI();

    // Register event listeners
    this.setupEvent();

    // Initialize audio source
    if (this.options.src) {
      this.audio.src = this.options.src;
    } else {
      this.setStatus("idle");
    }
  }

  // Create the player UI
  createUI() {
    const container =
      typeof this.options.el === "string"
        ? document.querySelector(this.options.el)
        : this.options.el;

    if (!container || typeof container.appendChild !== "function") {
      throw new Error("BaobaoAudioPlayback: Invalid container element.");
    }

    const wrapper = document.createElement("div");

    wrapper.id = `audio_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}`;

    wrapper.className = "common_musicbutton_wrapper";

    this.el = wrapper;
    this.container = container;

    if (this.options.icon) {
      this.iconElement = document.createElement("span");

      this.textElement = document.createElement("p");
      this.textElement.className = "loadinghint";
      this.textElement.textContent = this.options.loadingText;

      wrapper.append(this.iconElement, this.textElement);

      wrapper.setAttribute("role", "button");
      wrapper.setAttribute("tabindex", "0");
      wrapper.setAttribute("aria-label", "Play audio");

      wrapper.classList.add("loading");
    }

    container.appendChild(wrapper);
  }

  // Register audio and UI event listeners
  setupEvent() {
    // Handle audio loading
    this.handleLoadStart = () => {
      if (this.destroyed || this.hasError) return;

      this.setStatus("loading");
    };

    // Handle audio readiness
    this.handleCanPlay = () => {
      if (this.destroyed || this.hasError) return;

      if (this.audio.paused) {
        this.setStatus("ready");
      }

      // Attempt automatic playback only once
      if (
        this.options.autoPlay &&
        !this.userPaused &&
        !this.autoPlayAttempted &&
        this.audio.paused
      ) {
        this.autoPlayAttempted = true;
        this.play().catch(() => {});
      }
    };

    // Handle actual playback start
    this.handlePlaying = () => {
      if (this.destroyed || this.hasError) return;

      this.setStatus("playing");
    };

    // Handle playback pause
    this.handlePause = () => {
      if (this.destroyed || this.hasError) return;

      this.setStatus("paused");
    };

    // Handle playback completion
    this.handleEnded = () => {
      if (this.destroyed || this.hasError) return;

      this.setStatus("paused");
    };

    // Handle audio buffering
    this.handleWaiting = () => {
      if (this.destroyed || this.hasError) return;

      this.setStatus("loading");
    };

    // Handle audio loading errors
    this.handleError = () => {
      this.showError();
    };

    this.audio.addEventListener("loadstart", this.handleLoadStart);
    this.audio.addEventListener("canplay", this.handleCanPlay);
    this.audio.addEventListener("playing", this.handlePlaying);
    this.audio.addEventListener("pause", this.handlePause);
    this.audio.addEventListener("ended", this.handleEnded);
    this.audio.addEventListener("waiting", this.handleWaiting);
    this.audio.addEventListener("error", this.handleError);

    // Handle UI interactions
    if (this.options.icon) {
      this.handleClick = () => {
        this.toggle();
      };

      this.el.addEventListener("click", this.handleClick);

      // Handle keyboard interactions
      this.handleKeydown = (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;

        event.preventDefault();
        this.toggle();
      };

      this.el.addEventListener("keydown", this.handleKeydown);
    }
  }

  // Update the player UI based on its current state
  setStatus(status) {
    if (this.destroyed) return;

    if (this.options.icon) {
      this.el.classList.remove("loading", "active", "error");

      switch (status) {
        case "loading":
          this.el.classList.add("loading");
          this.updateText(this.options.loadingText, "loadinghint");
          this.el.setAttribute("aria-label", "Loading audio");
          break;

        case "playing":
          this.el.classList.add("active");
          this.updateText("", "");
          this.el.setAttribute("aria-label", "Pause audio");
          break;

        case "error":
          this.el.classList.add("error");
          this.updateText(this.options.failedText, "errorhint");
          this.el.setAttribute("aria-label", "Retry audio");
          break;

        case "ready":
        case "paused":
        case "idle":
        default:
          this.updateText("", "");
          this.el.setAttribute("aria-label", "Play audio");
          break;
      }
    }
  }

  // Update status text safely
  updateText(content, className) {
    if (!this.textElement) return;

    this.textElement.className = className;
    this.textElement.textContent = content;
  }

  // Handle playback and loading errors
  showError() {
    if (this.destroyed || this.hasError) return;

    this.hasError = true;

    // Stop playback after a resource error
    this.audio.pause();

    this.setStatus("error");
  }

  // Start audio playback
  play() {
    if (this.destroyed) {
      return Promise.reject(
        new Error("Audio instance has been destroyed."),
      );
    }

    if (!this.options.src) {
      return Promise.reject(new Error("Audio source is empty."));
    }

    if (this.hasError) {
      return Promise.reject(new Error("Audio loading failed."));
    }

    this.userPaused = false;

    try {
      return Promise.resolve(this.audio.play()).catch((error) => {
        // Handle browser playback restrictions separately
        if (
          error?.name === "NotAllowedError" ||
          error?.name === "AbortError"
        ) {
          if (!this.destroyed && !this.hasError) {
            this.setStatus("paused");
          }
        } else {
          this.showError();
        }

        throw error;
      });
    } catch (error) {
      this.showError();
      return Promise.reject(error);
    }
  }

  // Pause audio playback
  pause() {
    if (this.destroyed) return;

    this.userPaused = true;
    this.audio.pause();
  }

  // Toggle playback state
  toggle() {
    if (this.destroyed) return;

    if (this.hasError) {
      this.retry();
      return;
    }

    if (this.audio.paused) {
      this.play().catch(() => {});
    } else {
      this.pause();
    }
  }

  // Reload the audio source and retry playback
  retry() {
    if (this.destroyed || !this.options.src) return;

    this.hasError = false;
    this.userPaused = false;

    this.setStatus("loading");

    // Restart resource selection
    this.audio.load();

    // Attempt playback within the current user interaction
    return this.play().catch(() => {});
  }

  // Destroy the player instance and release resources
  destroy() {
    if (this.destroyed) return;

    this.destroyed = true;

    // Stop audio playback
    this.audio.pause();

    // Remove audio event listeners
    this.audio.removeEventListener("loadstart", this.handleLoadStart);
    this.audio.removeEventListener("canplay", this.handleCanPlay);
    this.audio.removeEventListener("playing", this.handlePlaying);
    this.audio.removeEventListener("pause", this.handlePause);
    this.audio.removeEventListener("ended", this.handleEnded);
    this.audio.removeEventListener("waiting", this.handleWaiting);
    this.audio.removeEventListener("error", this.handleError);

    // Remove UI event listeners
    if (this.handleClick) {
      this.el.removeEventListener("click", this.handleClick);
    }

    if (this.handleKeydown) {
      this.el.removeEventListener("keydown", this.handleKeydown);
    }

    // Release audio resources
    this.audio.removeAttribute("src");
    this.audio.load();

    // Remove player UI
    this.el.remove();

    this.audio = null;
    this.el = null;
    this.container = null;
  }
}

// Export the player factory
const BaobaoAudioPlayback = function (options) {
  return new _BaobaoAudioPlayback(options);
};

export default BaobaoAudioPlayback;
