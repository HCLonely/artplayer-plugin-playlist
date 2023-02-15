# artplayer-playlist

[ArtPlayer](https://github.com/zhw2590582/ArtPlayer)播放列表插件。

## 安装

### nodejs

```shell
npm install artplayer-playlist --save
```

### CDN

```text
https://cdn.jsdelivr.net/npm/artplayer-playlist/dist/artplayer-plugin-playlist.min.js
```

## 使用

```javascript
import { artplayerPlaylist } from 'artplayer-playlist'; // Nodejs ES6

var art = new Artplayer({
  container: '.artplayer-app',
  url: 'https://abc.xyz/video-1.mp4',
  title: 'Ep.1 ...',
  plugins: [artplayerPlaylist({
    rebuildPlayer: false, // 换P时重建播放器，默认false
    onchanged: (art) => { // 换P后的回调函数
      console.log('Video Changed');
    },
    autoNext: true, // 自动播放下一P, 默认false
    playlist: [ // 播放列表
      { // 每一P的视频信息，接受title和url参数。如果rebuildPlayer=false, 则接受ArtPlayer基础参数https://artplayer.org/document/start/option.html
        title: 'Ep.1 ...',
        url: 'https://abc.xyz/video-1.mp4',
      },
      {
        title: 'Ep.2 ...',
        url: 'https://abc.xyz/video-2.mp4'
      },
      {
        name: 'Ep.3 ...',
        url: 'https://abc.xyz/video-..mp4'
      }
    ]
  })]
});
```
