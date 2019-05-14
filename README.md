# Baobao-audio-playback

## 安装 Install

```
npm i baobao-audio-playback
```

## 使用方法 Usage

```
let BaobaoAduioPlayback=require('baobao-audio-playback')
BaobaoAduioPlayback({
  src: 'htt[://www.xxx.com/xxx.mp3', //audio url,
  loop: true, //是否循环播放
  el: '.entrance_main_container'
}).play();
```

## API

### methods

| 名称 name | 描述 description | 默认值 default|
| :-----| ---: | :----: |
| play() | 开始加载并播放音频 | 	|


### options

| 名称 name | 描述 description | 默认值 default|
| :-----| ---: | :----: |
| src | 音频文件路径 | 空字符串|
| loop | 是否循环 | false|
| icon | 是否显示播放按钮UI | false|
| el | 组件HTML所在父元素 | body|
| preload | 预加载配置 | auto|
