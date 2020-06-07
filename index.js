const _BaobaoAudioPlayback = options => {
  options = Object.assign({
    src: '',
    loop: false,
    // autoplay: false,
    icon: true,
    el: 'body',
    preload: 'auto'
  }, options);

  this.loading = true;
  this.el = options.el;
  this.audioInstance = document.createElement('audio');
  this.audioInstance.preload = options.preload;
  this.audioInstance.src = options.src;
  this.audioInstance.loop = options.loop;
  this.instanceId = 'commonAudio' + Date.parse(new Date())

  const templateString = "<a></a><p class='loadinghint'>音乐载入中</p>";
  let templateNode = document.createElement('div');
  templateNode.setAttribute('id', this.instanceId);
  templateNode.setAttribute('class', 'common_musicbutton_wrapper');
  if (options.icon) {
    templateNode.innerHTML = templateString;
  }
  document.querySelector(options.el).appendChild(templateNode);


  if (options.icon) {
    templateNode.classList.add('active')
    templateNode.classList.add('loading')
  }
  _BaobaoAudioPlayback.prototype.play();

  this.instanceElement = document.getElementById(this.instanceId);

  this.instanceElement.addEventListener('click', () => {
    if (this.audioInstance.paused) {
      _BaobaoAudioPlayback.prototype.play();
      this.instanceElement.classList.add('active')
    } else {
      _BaobaoAudioPlayback.prototype.pause();
      this.instanceElement.classList.remove('active');
    }
  })
};


_BaobaoAudioPlayback.prototype = {
  constructor: _BaobaoAudioPlayback,
  play: () => {
    const play = () => {
      document.getElementById(this.instanceId).classList.remove('loading');
      this.audioInstance.play().then(() => {
      }).catch(error => {
        console.log(error)
      });
    };

    if (_BaobaoAudioPlayback.prototype.checkEnvironment() !== 'ios') {
      this.audioInstance.addEventListener('canplaythrough', e => {
        play();
      }, false)
    } else {
      play();
    }

    return this;
  },
  pause: () => {
    this.audioInstance.pause();
    return this;
  },
  checkEnvironment: () => {
    const ua = navigator.userAgent;
    console.log('us', ua)
    let environmentDictionary = [{
      name: 'wechat',
      checker: ua.toLowerCase().match(/MicroMessenger/i),
      getter: '',
      status: false
    }, {
      name: 'ios',
      method: "window.webkit.messageHandlers.token.postMessage('')",
      checker: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
      getter: 'window.webkit.messageHandlers.token',
      status: false
    }, {
      name: 'android',
      method: 'window.android',
      checker: ua.match(/(Android)\s+([\d]+)/),
      getter: 'window.android.getToken()',
      status: false
    }];
    let environment;
    environmentDictionary.forEach((item, index) => {
      if (item.checker) {
        environment = item.name;
      }
    });
    let result = environmentDictionary.filter(item => item.checker);
    environment = result.length > 0 ? result[0].name : 'unknown';

    return environment;
  }
};

const BaobaoAudioPlayback = options => {
  return new _BaobaoAudioPlayback(options)
};

export default BaobaoAudioPlayback;
