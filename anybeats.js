/* NEW BSD LICENSE {{{
Copyright (c) 2014, Jagua.
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
# http://sourceforge.jp/projects/opensource/wiki/licenses%2Fnew_BSD_license       #
# に参考になる日本語訳がありますが、有効なのは上記英文となります。                #
###################################################################################

}}} */


// INFO {{{
var INFO = xml`
<plugin name="AnyBeats"
        version="0.5"
        href="https://github.com/Jagua/vimperator-plugins-sample/blob/master/anybeats.js"
        summary="for Any Beats."
        lang="en-US"
        xmlns="http://vimperator.org/namespaces/liberator">
  <author homepage="https://github.com/Jagua">Jagua</author>
  <license>New BSD License</license>
  <project name="Vimperator" minVersion="3.8"/>
  <item>
    <tags>:anybeats</tags>
    <spec>:anybeats o<oa>pen</oa> n<oa>\d+</oa></spec>
    <description>
    <p>
      Open a link smartly.
    </p>
    </description>
  </item>
  <item>
    <tags>g:anybeats_scroll_percentage</tags>
    <spec><oa>g:</oa>anybeats_scroll_percentage</spec>
    <spec>liberator.globalVariables.anybeats_scroll_percentage</spec>
    <description>
      <p>a percentage to scroll in play pages.</p>
    </description>
  </item>
</plugin>`;
// }}}


(function () {

  const Ab = {

    domainCheck: function () {
      var result = 0;
      if (content.document.domain != 'www.anybeats.jp') {
        liberator.echoerr('This plugin can only run at www.anybeats.jp');
        result = -1;
      }
      return result;
    },

    html: function () {
      return gBrowser.selectedBrowser.contentDocument
                     .getElementsByTagName('html').item(0).innerHTML;
    },

    open: function (args) {
      var base_url = 'http://www.anybeats.jp/note/';
      if (args.literalArg.match(/n\d+/)) {
        liberator.open(base_url + args,
                       (args.bang ? liberator.NEW_TAB : liberator.CURRENT_TAB));
        }
    },

    getMyRecord: function (callback) {
      util.httpGet('http://www.anybeats.jp/my/record/', function (xhr) {
        if (callback) {
          callback((new DOMParser()).parseFromString(xhr.responseText, 'text/html'));
        }
      });
    },

    miTest: function (res) {
      let r = [];
      for (var i = 1; i <= 4; i++ ) {
        if (res.querySelectorAll('.note_table tr.game_type0')[i - 1]
               .querySelector('.point .rank').innerHTML.match(/(\d{2}\.\d{3})/)) {
          r[i - 1] = { title: res.querySelectorAll('.note_table tr.game_type0')[i - 1]
                                 .querySelector('.title a').innerHTML,
                       rank: RegExp.$1,
          };
        }
      }
      Ab.showResult(r); // XXX: not 'this' but 'Ab'.
    },

    rankTest: function () {
      this.getMyRecord(this.miTest);
    },

    showResult: function (r) {
      var sum = 0;
      var text = `<h1>(mi) Rank Test Result</h1>
                  <hr/><ul style='margin:0'>`;
      for (var i = 1; i <= 4; i++) {
        text += `<li style='clear:both;list-style-type:none'>
                 <span style='width:100px;float:left;text-align:right'>${r[i - 1].rank}</span>
                 <span style='width:auto;margin-left:50px;float:left'>${r[i - 1].title}</span>
                 </li>`;
        sum += parseFloat(r[i - 1].rank);
      }
      text += `</ul>
               <hr style='clear:both;margin:0'/>
               <ul style='margin:0'>
               <li style='list-style-type:none'>
               <span style='width:100px;float:left;text-align:right'>
               ${(Math.round(sum * 1000) / 1000).toString()}
               </span>
               <span style='width:auto;margin-left:50px;float:left'>`;
      if (parseFloat(r[0].rank) >= 95 &&
          parseFloat(r[1].rank) >= 95 &&
          parseFloat(r[2].rank) >= 95 &&
          parseFloat(r[3].rank) >= 95 &&
          sum >= 380) {
        text += `ヾﾉ｡ÒㅅÓ)ﾉｼ`;
      } else {
        text += `｜⌒~⊃｡Д｡)⊃`;
      }
      text += `</span></li></ul><div style='clear:both'/>`;

      liberator.echo(`<div style='white-space:normal'>${text}</div>`,
                     commandline.FORCE_MULTILINE);
    },

    openCompleter: function (context, args) {
      var url = buffer.URL;
      if (url.match(/^http:\/\/www\.anybeats\.jp\/note\//)) {
        var lines = content.document.querySelector('p.comment')
                                    .innerHTML.split(/<br\s*\/?>/);
        var filtered = lines.filter(function(s) { return s.match(/n\d+/) });
      } else if (url.match(/^http:\/\/www\.anybeats\.jp\/profile\//)) {
        var profile = util.evaluateXPath('//div[@class="block"][h2[text()="プロフィール"]]/table//tr[th[text()="自己紹介"]]/td').snapshotItem(0).innerHTML;     // XXX: "LANG:Jananese" only.
        var lines = profile.split(/<br\s*\/?>/);
        var filtered = lines.filter(function(s) { return s.match(/n\d+/) });
      }
      context.incomplete = false;
      context.title = ['id', 'title'];
      context.compare = void 0;
      context.completions = [
        [id, title]
        for ([id, title] of filtered.map(function(s) {
              return [s.replace(/.*?(n\d+)\D*/, '$1'), s];
            }
          )
        )
      ];
    },
  };


  MainSubCommands = [
    new Command(
      ['o[pen]'],
      'smart open',
      function (args) {
        if (content.document.domain == 'www.anybeats.jp') {
          Ab.open(args);
        } else {
          liberator.echoerr('anybeats.js can only run at www.anybeats.jp.');
        }
      },
      {
        literal: 0,
        bang: true,
        completer: Ab.openCompleter,
      }
    ),
    new Command(
      ['t[est]'],
      'rank test',
      function (args) {
        if (content.document.domain == 'www.anybeats.jp') {
          Ab.rankTest();
        } else {
          liberator.echoerr('anybeats.js can only run at www.anybeats.jp.');
        }
      },
      {
        literal: 0,
        bang: false,
      }
    ),
  ];


  commands.addUserCommand(
    ['anybeats'],
    'for AnyBeats',
    function (args) {
      anybeats(args);
    },
    {
      subCommands: MainSubCommands,
    },
    true
  );


  mappings.add(
    [modes.NORMAL],
    [',ao'],
    'Anybeats (open)',
    function () {
      if (Ab.domainCheck() == 0) {
        setTimeout(function () {
            commandline.open(':', 'anybeats open n', modes.EX);
        }, 500);
      }
    },
    {
    }
  );


  mappings.add(
    [modes.NORMAL],
    [',ab'],
    'tabopen a page of my best.',
    function () {
      liberator.open('http://www.anybeats.jp/my/best/', liberator.NEW_TAB);
    },
    {
    }
  );


  // 「続きを表示 »」に自動フォーカス
  autocommands.add('DOMLoad', /^http:\/\/www\.anybeats\.jp\/note\/n\d+$/,
    function() {
      let n = content.document.querySelector('p[class="more ranking_more"] a');
      if (n) n.focus();
    }
  );


  // 画面上半分自動隠し
  autocommands.add('DOMLoad', /^http:\/\/www\.anybeats\.jp\/#!\/simple\/n\d+$/,
                   function() {
                     let per = (liberator.globalVariables.anybeats_scroll_percentage || 41).toString();
                     if (per.match(/^\d+$/))
                       setTimeout(function () events.feedkeys(per + '%', false), 1500);
                   }
  );


})();

// vim: set et fdm=marker ft=javascript si sts=2 sw=2 ts=2 :

