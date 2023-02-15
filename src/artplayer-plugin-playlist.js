const artplayerPlaylist = (options) => (art) => {
  // 更新i18n
  const addedI18n = {
    'zh-cn': {
      playlist: '播放列表'
    },
    en: {
      playlist: 'Playlist'
    }
  };
  art.i18n.update(addedI18n);

  // 更换分集视频
  const changeVideo = (art, index) => {
    if (!options.playlist[index]) {
      return;
    }
    // 获取artplayer配置
    const artOptions = art.option;

    let newArtplayer = art;
    if (options.rebuildPlayer) {
      // 销毁之前的artplayer
      art.destroy();

      // 重建artplayer
      newArtplayer = new Artplayer({
        ...artOptions,
        ...options.playlist[index],
        autoplay: options.autoNext ?? artOptions.autoplay,
        i18n: addedI18n
      });
    } else {
      art.switchUrl(options.playlist[index].url, options.playlist[index].title);
      if (artOptions.autoplay) {
        art.play();
      }
    }

    // 执行onchanged回调
    if (typeof options.onchanged === 'function') {
      options.onchanged(newArtplayer);
    }
  };

  // 自动播放下一集
  const currentEp = options.playlist.findIndex((videoInfo) => videoInfo.url === art.option.url);
  if (options.autoNext && currentEp < options.playlist.length) {
    art.on('video:ended', () => {
      changeVideo(art, currentEp + 1);
    });
  }

  const icon = '<i class="art-icon"><svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="M810.666667 384H85.333333v85.333333h725.333334V384z m0-170.666667H85.333333v85.333334h725.333334v-85.333334zM85.333333 640h554.666667v-85.333333H85.333333v85.333333z m640-85.333333v256l213.333334-128-213.333334-128z" fill="#ffffff"></path></svg></i>';

  // 添加播放列表
  art.controls.add({
    name: 'playlist',
    position: 'right',
    html: options.showText ? art.i18n.get('playlist') : icon,
    style: { padding: '0 10px' },
    selector: options.playlist.map((videoInfo, index) => ({
      html: `${index + 1}. ${videoInfo.title || `Ep.${index + 1}`}`,
      style: { textAlign: 'left' },
      index,
      default: currentEp === index
    })),
    onSelect(item) {
      changeVideo(art, item.index);
      return options.showText ? art.i18n.get('playlist') : icon;
    }
  });

  return {
    name: 'artplayerPlaylist'
  };
};

if (typeof window !== 'undefined') {
  window.artplayerPlaylist = artplayerPlaylist;
}

export { artplayerPlaylist };
