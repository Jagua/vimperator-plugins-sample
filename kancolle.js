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
<plugin name="KanColle"
        version="0.5"
        href="https://github.com/Jagua/vimperator-plugins-sample/blob/master/kancolle.js"
        summary="Kantai Collection - switch tab, tabopen, search wiki"
        lang="en-US"
        xmlns="http://vimperator.org/namespaces/liberator">
  <author homepage="https://github.com/Jagua">Jagua</author>
  <license>New BSD License</license>
  <project name="Vimperator" minVersion="3.8"/>
  <item>
    <tags>plugins.kancolle.kanColle.switchToKanColleTab()</tags>
    <spec>nnoremap <a>key</a> :js plugins.kancolle.kanColle.switchToKanColleTab()<k name="CR"/></spec>
    <description>
      <p>
        existing kancolle tab, switch current tab to kancolle tab,
        otherwise tabopen it. 
        (default: <em>,kc</em>)
      </p>
    </description>
  </item>
  <item>
    <tags>plugins.kancolle.kanColle.gotoKanColleWiki()</tags>
    <spec>nnoremap <a>key</a> :js plugins.kancolle.kanColle.gotoKanColleWiki()<k name="CR"/></spec>
    <description>
      <p>
        tabopen kancolle wiki by i'm feeling lucky.
        (default: <em>,kw</em>)
      </p>
    </description>
  </item>
</plugin>`;
// }}}


var kanColle = (function () {

  const kancolle_url = 'http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/';


  function switch_to_kancolle_tab() {
    var num = gBrowser.browsers.length;
    var index = -1;
    for(var i = 0; i < num; i++) {
      var b = gBrowser.getBrowserAtIndex(i);
      if (b.currentURI.spec == kancolle_url) {
        index = i;
        break;
      }
    }
    if (index == -1) {
      liberator.open(kancolle_url, liberator.NEW_TAB);
    } else {
      tabs.select(index, false, true);
    }
  }


  mappings.add(
    [modes.NORMAL],
    [',kc'],
    'switch to the KanColle tab.',
    function () {
      switch_to_kancolle_tab();
    },
    {
      noremap: true,
      silent: false,
      motion: false,
      count: false,
      arg: false
    }
  );


  function goto_kancolle_wiki() {
    const ifl_base_url = 'http://www.google.com/search?ie=UTF-8&oe=UTF-8'
                         + '&sourceid=navclient&btnI=1&hl=ja&q=';

    commandline.input("I'm feeling lucky (艦これWiki) ",
      function(arg) {
        liberator.open(ifl_base_url + encodeURIComponent('艦これ Wiki ' + arg),
                       liberator.NEW_TAB);
        commandline.close();
      }
    );
  }


  mappings.add(
    [modes.NORMAL],
    [',kw'],
    "I'm feeling lucky to the KanColle wiki.",
    function () {
      goto_kancolle_wiki();
    },
    {
      noremap: true,
      silent: false,
      motion: false,
      count: false,
      arg: false
    }
  );


  return {
    switchToKanColleTab: function () switch_to_kancolle_tab(),
    gotoKanColleWiki: function () goto_kancolle_wiki(),
  };


})();

// vim: set et fdm=marker ft=javascript sts=2 sw=2 ts=2 :

