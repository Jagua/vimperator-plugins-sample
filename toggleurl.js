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
  <name>toggleurl</name>
  <description>toggle url</description>
  <version>0.0.1</version>
  <author homepage="https://github.com/Jagua">Jagua</author>
  <license>new BSD License (Please read the source code comments of this plugin)</license>
  <license lang="ja">修正BSDライセンス (ソースコードのコメントを参照してください)</license>
  <updateURL>https://github.com/Jagua/vimperator-plugins-sample/blob/master/toggleurl.js</updateURL>
  <minVersion>2.3</minVersion>
  <maxVersion>3.1</maxVersion>
  <detail><![CDATA[
    == Command ==
    :toggleurl[!]


    == Setting ==
    add the following setting to your ".vimperatorrc".

    js <<EOM
    liberator.globalVariables.toggleurl_site_definition = [{
      url: "^(https:\\/\\/developer\\.mozilla\\.org\\/)(?:[^\\/].*?)(\\/.*?)$",
      toggle: ["RegExp.$1+'ja'+RegExp.$2", "RegExp.$1+'en'+RegExp.$2"],
    }];
    EOM

    you type ':toggleurl' and enter, and you can go back and forth between
    the two sites of https://developer.mozilla.org/ja/JavaScript and
    https://developer.mozilla.org/en/JavaScript.


  ]]></detail>
  <detail lang="ja"><![CDATA[
    https://developer.mozilla.org/en/JavaScript と
    https://developer.mozilla.org/ja/JavaScript のように
    2 つの良く似た URL を行き来したいときに使うのを想定してます．
    (※本当は似てなくてもよいです)

    設定はあらかじめ .vimperatorrc に書いておきます．

    liberator.globalVariables.toggleurl_site_definition に登録情報を書いて設定する．

    js <<EOM
    liberator.globalVariables.toggleurl_site_definition = [{
      url: "^(https:\\/\\/developer\\.mozilla\\.org\\/)(?:[^\\/].*?)(\\/.*?)$",
      toggle: ["RegExp.$1+'ja'+RegExp.$2", "RegExp.$1+'en'+RegExp.$2"],
    }];
    EOM

    と書くと :toggleurl するたびに MDC の今見てるページの日本語サイトと英語サイトを
    トグルします．


    == Command ==
    :toggleurl[!]

    ! を付けると新規タブにオープン．付けなければ現在のタブにオープン．


    == Setting ==
    .vimperatorrc に設定書いて任意のサイトをどんどん追加できます．

    プロパティは url と toggle の２つで，url にはマッチさせたい URL の正規表現を，
    toggle には実際にトグルさせたい URL を構成し後程 eval で通るような文字列を列記する．
    詳しくはサンプルを．


    == Todo ==
    ISO 639 をサポートしようと思ったり思わなかったり．


    == Notice ==

   ※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
   ※      サンプルなのでソース中に登録情報をハードコーディングしてあります      ※
   ※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※


    ]]></detail>
</VimperatorPlugin>;
// }}}

(function () {

  const SITE_DEFINITION = [{
    // MDC の日本語を英語を行き来
    url: "^(https:\\/\\/developer\\.mozilla\\.org\\/)(?:[^\\/].*?)(\\/.*?)$",
    toggle: ["RegExp.$1+'ja'+RegExp.$2", "RegExp.$1+'en'+RegExp.$2"],
  },{
    // WikiPedia の日本語と英語を行き来
    url: "^(http:\\/\\/)(?:[^\\/].*?)(\\.wikipedia\\.org\\/wiki\\/.*)$",
    toggle: ["RegExp.$1+'ja'+RegExp.$2", "RegExp.$1+'en'+RegExp.$2"],
  },{
    // Microsoft Knowledge Base の日本語と英語とドイツ語を行き来
    url: "^(http:\\/\\/support\\.microsoft\\.com\\/kb\\/\\d+)",
    toggle: ["RegExp.$1+'/ja'", "RegExp.$1+'/en'", "RegExp.$1+'/de'"],
  },{
    // Ruby マニュアルの v1.8.7 用と v1.9.2 用を行き来
    url: "^(http:\/\/doc\\.ruby-lang\\.org\\/ja\\/)(?:\\d\\.\\d\\.\\d)(\\/.*)$",
    toggle: ["RegExp.$1+'1.8.7'+RegExp.$2", "RegExp.$1+'1.9.2'+RegExp.$2"],
  },{
    // Google 検索の日本語と英語を行き来
    url: "^(http:\\/\\/www\\.google)(?:[^\\/].*?)\\/(.*)$",
    toggle: ["(RegExp.$1+'.co.jp/'+RegExp.$2).replace(/^(.*?hl=).*?(&.*)$/,'$1ja$2')", "(RegExp.$1+'.com/'+RegExp.$2).replace(/^(.*?hl=).*?(&.*)$/,'$1en$2')"],
  },{
/*
    // goo辞書の和英辞書と英和辞書と国語辞書を行き来 (不完全版)
    url: '^(http:\\/\\/dictionary\\.goo\\.ne\\.jp\\/srch\\/)(?:[^\\/].*?)(\\/.*)$',
    toggle: ["RegExp.$1+'je'+RegExp.$2", "RegExp.$1+'ej'+RegExp.$2", "RegExp.$1+'jn'+RegExp.$2"],
  },{
    url: '',
    toggle: [""],
*/
    }];

  let (siteDef = liberator.globalVariables.toggleurl_site_definition) {
    if (siteDef) {
      if (siteDef instanceof String)
        siteDef = eval(siteDef);
      if (siteDef.forEach instanceof Function)
        siteDef.forEach(function (obj) SITE_DEFINITION.push(obj));
      else
        SITE_DEFINITION.push(siteDef);
    }
  }

  function toggleurl (args) {
    SITE_DEFINITION.forEach(function (def) {
      var re = new RegExp(def.url, "i");
       if (buffer.URL.match(re)) {
        var urls = [];
        var index = 0, i = 0;
        def.toggle.forEach(function (expr) {
          var url_temp = eval(expr);
          urls.push(url_temp);
          if (buffer.URL == url_temp) {
            index = i;
          }
          i += 1;
        });
        index += 1;
        if (index > urls.length-1) index -= urls.length;
        liberator.open(urls[index], (args.bang ? liberator.NEW_TAB : liberator.CURRENT_TAB));
      }
    });
  }

  commands.addUserCommand(
    ['toggleurl'],
    'Toggle URL',
    function (args) {
      toggleurl(args);
    },
    {
      bang: true,
    },
    true
    );

})();

// vim:sw=2 ts=2 et si fdm=marker:

