# Baobao Audio Playback

[![npm version](https://img.shields.io/npm/v/baobao-audio-playback.svg)](https://www.npmjs.com/package/baobao-audio-playback)
[![npm downloads](https://img.shields.io/npm/dm/baobao-audio-playback.svg)](https://www.npmjs.com/package/baobao-audio-playback)
[![License](https://img.shields.io/npm/l/baobao-audio-playback.svg)](https://github.com/YOUR_USERNAME/baobao-audio-playback/blob/main/LICENSE)

A lightweight audio playback plugin for web applications.

**Baobao Audio Playback** is a simple and lightweight audio playback utility that makes it easy to integrate audio playback functionality into your web application.

## Features

- Lightweight and easy to integrate.
- Supports creating multiple instances to play multiple audio tracks.
- Simple API for audio playback.
- Supports loop playback.
- Configurable audio preload strategy.
- Optional built-in playback UI.
- Supports specifying a custom DOM container.

## Installation

Install via npm:

```bash
npm install baobao-audio-playback
```

Or using Yarn:

```bash
yarn add baobao-audio-playback
```

## Quick Start

### Configuration Example

```javascript
const BaobaoAudioPlayback = require("baobao-audio-playback");

const audio = BaobaoAudioPlayback({
  src: "https://example.com/audio.mp3",
  loop: false,
  icon: true,
  el: ".audio-container",
  preload: "auto",
});

audio.play();
```

## API Reference

### Options

The plugin accepts a configuration object when initialized.

| Option    | Type      | Default  | Description                                                                                        |
| :-------- | :-------- | :------- | :------------------------------------------------------------------------------------------------- |
| `src`     | `String`  | `''`     | URL of the audio file.                                                                             |
| `loop`    | `Boolean` | `false`  | Whether to enable loop playback.                                                                   |
| `icon`    | `Boolean` | `false`  | Whether to display the built-in playback UI.                                                       |
| `el`      | `String`  | `'body'` | CSS selector of the parent DOM element where the component will be mounted.                        |
| `preload` | `String`  | `'auto'` | Audio preload strategy. Supports native HTML audio preload values: `none`, `metadata`, and `auto`. |

### Methods

| Method   | Description                                   |
| :------- | :-------------------------------------------- |
| `play()` | Loads the audio resource and starts playback. |

## Usage Examples

### 1. Loop Playback

Enable continuous playback by setting `loop` to `true`.

```javascript
const audio = BaobaoAudioPlayback({
  src: "https://example.com/background-music.mp3",
  loop: true,
});

audio.play();
```

### 2. Custom DOM Container

Specify a DOM container using the `el` option.

```javascript
const audio = BaobaoAudioPlayback({
  src: "https://example.com/notification.mp3",
  el: "#app",
});

audio.play();
```

### 3. Enable Playback UI

Set `icon` to `true` to enable the built-in playback UI.

```javascript
const audio = BaobaoAudioPlayback({
  src: "https://example.com/audio.mp3",
  icon: true,
});

audio.play();
```

## Notes

- Make sure the audio URL is accessible from your application.
- Browser autoplay policies may restrict audio playback without prior user interaction. For the most reliable experience, trigger `play()` from a user interaction such as a click.
- The `el` option should point to an existing DOM element when the plugin is initialized.

## License

MIT
