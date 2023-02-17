"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.artplayerPlaylist = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var artplayerPlaylist = function artplayerPlaylist(options) {
  return function (art) {
    // 更新i18n
    var addedI18n = {
      'zh-cn': {
        playlist: '播放列表'
      },
      en: {
        playlist: 'Playlist'
      }
    };
    art.i18n.update(addedI18n);

    // 更换分集视频
    var changeVideo = function changeVideo(art, index) {
      if (!options.playlist[index]) {
        return;
      }

      // 获取artplayer配置
      var artOptions = art.option;
      var newArtplayer = art;
      if (options.rebuildPlayer) {
        var _options$autoNext;
        // 销毁之前的artplayer
        art.destroy();

        // 重建artplayer
        newArtplayer = new Artplayer(_objectSpread(_objectSpread(_objectSpread({}, artOptions), options.playlist[index]), {}, {
          autoplay: (_options$autoNext = options.autoNext) !== null && _options$autoNext !== void 0 ? _options$autoNext : artOptions.autoplay,
          i18n: addedI18n,
          id: "".concat(artOptions.id, "-").concat(index === 0 ? '' : index)
        }));
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

    // 自动播放下一P
    var currentEp = options.playlist.findIndex(function (videoInfo) {
      return videoInfo.url === art.option.url;
    });
    if (options.autoNext && currentEp < options.playlist.length) {
      art.on('video:ended', function () {
        changeVideo(art, currentEp + 1);
      });
    }
    var icon = '<i class="art-icon"><svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="M810.666667 384H85.333333v85.333333h725.333334V384z m0-170.666667H85.333333v85.333334h725.333334v-85.333334zM85.333333 640h554.666667v-85.333333H85.333333v85.333333z m640-85.333333v256l213.333334-128-213.333334-128z" fill="#ffffff"></path></svg></i>';

    // 添加播放列表控件
    art.controls.add({
      name: 'playlist',
      position: 'right',
      html: options.showText ? art.i18n.get('playlist') : icon,
      style: {
        padding: '0 10px'
      },
      selector: options.playlist.map(function (videoInfo, index) {
        return {
          html: "".concat(index + 1, ". ").concat(videoInfo.title || "Ep.".concat(index + 1)),
          style: {
            textAlign: 'left'
          },
          index: index,
          "default": currentEp === index
        };
      }),
      onSelect: function onSelect(item) {
        changeVideo(art, item.index);
        return options.showText ? art.i18n.get('playlist') : icon;
      }
    });
    return {
      name: 'artplayerPlaylist'
    };
  };
};
exports.artplayerPlaylist = artplayerPlaylist;
if (typeof window !== 'undefined') {
  window.artplayerPlaylist = artplayerPlaylist;
}
