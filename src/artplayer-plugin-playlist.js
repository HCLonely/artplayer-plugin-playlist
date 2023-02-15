const artplayerPlaylist = (options) => (art) => {
  // 更换分集视频
  const changeVideo = (art, index) => {
    if (!options.playlist[index]) {
      return;
    }

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

  // 添加播放列表
  art.controls.add({
    name: 'playlist',
    position: 'right',
    html: art.i18n.get('playlist'),
    style: { padding: '0 10px' },
    selector: options.playlist.map((videoInfo, index) => ({
      html: `${index + 1}. ${videoInfo.title || `Ep.${index + 1}`}`,
      index,
      default: currentEp === index
    })),
    onSelect(item) {
      changeVideo(art, item.index);
      return art.i18n.get('playlist');
    }
  });

  return {
    name: 'playlist'
  };
};

if (typeof window !== 'undefined') {
  window.artplayerPlaylist = artplayerPlaylist;
}

export { artplayerPlaylist };
