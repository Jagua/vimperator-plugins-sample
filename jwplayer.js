/* NEW BSD LICENSE {{{
Copyright (c) 2011, Jagua.
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice,
this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
this list of conditions and the following disclaimer in the documentation
and/or other materials provided with the distribution.
3. The names of the authors may not be used to endorse or promote products
derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
THE POSSIBILITY OF SUCH DAMAGE.


###################################################################################
# http://sourceforge.jp/projects/opensource/wiki/licenses%2Fnew_BSD_license #
# に参考になる日本語訳がありますが、有効なのは上記英文となります。 #
###################################################################################

}}} */

// PLUGIN_INFO {{{
let PLUGIN_INFO =
<VimperatorPlugin>
  <name>JWPlayer</name>
  <name lang="ja">JWPlayer</name>
  <description>Add :jwplayer command to control videos with JW Player.</description>
  <description lang="ja">JW Player を使って Video を操作するために :jwplayer コマンドを追加する．</description>
  <version>0.0.1</version>
  <author homepage="https://github.com/Jagua">Jagua</author>
  <license>new BSD License (Please read the source code comments of this plugin)</license>
  <license lang="ja">修正BSDライセンス (ソースコードのコメントを参照してください)</license>
  <updateURL>https://github.com/Jagua/vimperator-plugins-sample/blob/master/jwplayer.js</updateURL>
  <minVersion>2.3</minVersion>
  <maxVersion>3.2</maxVersion>
  <detail><![CDATA[
    == Commands ==
    :jwplayer play
      play or pause.
    :jwplayer stop
      stop.
    :jwplayer mute
      turn on/off mute.
    :jwplayer fullscreen
      turn on/off fullscreen.
    :jwplayer volume_up
      turn up volume.
    :jwplayer volume_down
      turn down volume.
    :jwplayer seek_ff
      fast-forward a video.
    :jwplayer seek_rwd
      rewind a video.

    == Local Mappings Sample ==
    " .vimperatorrc setting sample
    " addLocalMappings cf. stella.js
    js<<EOM
    addLocalMappings(
      /^http:\/\/example.com\/where\//,
      [
        ['p',      ':jwplayer play',       ],
        ['@',      ':jwplayer pause',      ],
        ['s',      ':jwplayer stop',       ],
        ['m',      ':jwplayer mute',       ],
        ['.',      ':jwplayer volume_up',  ],
        [',',      ':jwplayer volume_down',],
        ['j',      ':jwplayer seek_rwd',   ],
        ['k',      ':jwplayer seek_ff',    ],
        ['z',      ':jwplayer fullscreen', ],
      ]
    );
    EOM
  ]]></detail>
  <detail lang="ja"><![CDATA[
    ----
  ]]></detail>
</VimperatorPlugin>;
// }}}


(function () {

  const HintName = 'jagua-jwplayer-hint';

  function timeCodeToSec (t) {
    let [a, h, m, s] = (t.match(/(?:(\d+):)?(\d+):(\d+)/) || []).map(function (v) parseInt(v, 10) || 0);
    return a ? (h * 60 * 60 + m * 60 + s) : parseInt(t, 10);
  }

  function jwctrl (event, action) {
    var contents = gBrowser.selectedBrowser.contentDocument;
    var evt = contents.createEvent("MouseEvents");
    evt.initMouseEvent(
      'click',
      true, // canBubble
      true, // cancelable
      window, // view
      0, // detail
      0, // screenX
      0, // screenY
      0, // clientX
      0, // clientY
      false, // ctrlKey
      false, // altKey
      false, // shiftKey
      false, // metaKey
      0, // button
      null //relatedTarget
      );
    var ctlr = content.document.getElementById('jwpanel');
    if (ctlr) {
    } else {
      ctlr = content.document.createElement('div');
      ctlr.setAttribute('id', 'jwpanel');
      ctlr.setAttribute('style', 'visibility:hidden');
    }
    //ctlr.innerHTML = "<span class='jw_" + event + "' onclick='" + action + "'>" + event + "</span>";
    ctlr.innerHTML = "<span class='jw_" + event + "' onclick='" + action + ";jwplayer().on" + event[0].toUpperCase() + event.substring(1) + "(function(){content.document.getElementsByTagName(\"body\").item(0).removeChild(content.document.getElementsByClassName(\"jw_" + event + "\"));})'>" + event + "</span>";
    content.document.getElementsByTagName("body").item(0).appendChild(ctlr);
    targets = contents.getElementsByClassName("jw_" + event);
    targets.item(0).dispatchEvent(evt);
  }


  let targets;
  let lastArgs = null;
  let controlls = {
    __proto__: null,
    play: function () {
      jwctrl("play", "jwplayer().play()");
    },
    pause: function () {
      jwctrl("pause", "jwplayer().pause()");
    },
    stop: function () {
      jwctrl("stop", "jwplayer().stop()");
    },
    mute: function () {
      jwctrl("mute", "if(jwplayer().getMute()){jwplayer().setMute(false);}else{jwplayer().setMute(true);}");
    },
    focus: function () {
      content.document.getElementsByTagName("video").item(0).focus();
    },
    volume_up: function () {
      jwctrl("volume", "var v=jwplayer().getVolume();jwplayer().setVolume(v+10>100?100:v+10)");
    },
    volume_down: function () {
      jwctrl("volume", "var v=jwplayer().getVolume();jwplayer().setVolume(v-10<0?0:v-10)");
    },
/*
    volume: function (value) {
      var vol;
      if (value[0]=="+" || value[0]=="-") {
      } else {
        value = parseFloat(value);
        vol = Math.min(((value > 1) ? value : (value * 100)), 100);
        jwctrl("volume", "jwplayer().volume(" + vol.toString + ")");
      }
    },
    seek: function (value) {
      var time;
      if (value[0]=="+" || value[0]=="-") {
        time = timeCodeToSec(value.substring(1));
        jwctrl("seek", "jwplayer().seek(jwplayer().time()" + value[0] + time.toString + ")");
      } else {
        time = timeCodeToSec(value);
        jwctrl("seek", "jwplayer().seek(" + time.toString + ")");
      }
    },
*/
    seek_ff: function () {
      jwctrl("seek", "var a=jwplayer().getPosition();var b=jwplayer().getDuration();jwplayer().seek(a+20<b?a+20:b)");
    },
    seek_rwd: function () {
      jwctrl("seek", "var a=jwplayer().getPosition();jwplayer().seek(a-20<0?0:a-20)");
    },
    fullscreen: function () {
      jwctrl("fullscreen", "if(jwplayer().getFullscreen()){jwplayer().setFullscreen(false);}else{jwplayer().setFullscreen(true);}");
    },
  };

  hints.addMode(
    HintName,
    'Select video',
    function (elem) {
      controlls[lastArgs[0]].apply(null, [elem].concat(lastArgs.slice(1)));
    },
    function () '//video'
  );

  commands.addUserCommand(
    ['jwplayer'],
    'Control Videos with JW Player',
    function (args) {
      lastArgs = args;
      hints.show(HintName);
    },
    {
      completer: function (context, args) {
        const completions = [[n, n] for (n in controlls)];
        context.title = ['Command', ''];
        context.completions = completions;
      }
    },
    true
  );

})();

// vim:sw=2 ts=2 et si fdm=marker:
