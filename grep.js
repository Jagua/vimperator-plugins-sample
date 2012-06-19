/* NEW BSD LICENSE {{{
Copyright (c) 2012, Jagua.
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

// INFO {{{
let INFO =
<>
  <plugin name="grep" version="0.1.0"
          href="https://github.com/Jagua/vimperator-plugins-sample"
          summary="grep - scan string in all buffers."
          lang="en-US"
          xmlns="http://vimperator.org/namespaces/liberator">
    <author homepage="https://github.com/Jagua">Jagua</author>
    <license>New BSD License</license>
    <project name="Vimperator" minVersion="3.0"/>
    <p>scan string in all buffers.</p>
    <item>
      <tags>:grep</tags>
      <spec>:grep <a>string</a></spec>
      <description><p>scan string in all buffers, and switch to a buffer which you select within greped buffers.</p></description>
    </item>
  </plugin>
</>;
// }}}

(function() {


  function grep(keywords) {
    var firefoxVer = Components.classes["@mozilla.org/xre/app-info;1"]
                               .getService(Components.interfaces.nsIXULAppInfo)
                               .version;

    if (firefoxVer < '13.0') {
      var scriptableUnescapeHTML = Components.classes["@mozilla.org/feed-unescapehtml;1"]
                                             .getService(Components.interfaces.nsIScriptableUnescapeHTML);
    } else {
      var parserUtils = Components.classes["@mozilla.org/parserutils;1"]
                                  .getService(Components.interfaces.nsIParserUtils);
    }
    var html;
    var text;
    var title;
    var url;
    var a = [];
    var i;
    for(i = 0; i < gBrowser.browsers.length; i++) {
      html = gBrowser.getBrowserAtIndex(i).contentDocument.getElementsByTagName('html').item(0).innerHTML;
      if (firefoxVer < '13.0') {
        text = scriptableUnescapeHTML.unescape(html);
      } else {
        text = parserUtils.convertToPlainText(html, 1, 0);
      }
      if (text.search(RegExp(keywords, 'i')) != -1) {
        title = gBrowser.getBrowserAtIndex(i).contentTitle;
        url = gBrowser.getBrowserAtIndex(i).currentURI.spec;
        a.push([i + ": " + title, url]);
      }
    }
    return a;
  }


  function bufferCompleter(context, args) {
    context.title = ['title', 'buffer url'];
    context.filters = [];
    context.compare = void 0;
    context.incomplete = false;
    context.completions = grep(args.toString());
  }


  commands.addUserCommand(
    ['grep'],
    'scan string in all buffers',
    function (args) {
      if (args != '') {
        if (args.toString().match(/^(\d+):/)) {
          gBrowser.selectedTab = gBrowser.selectTabAtIndex(parseInt(RegExp.$1));
        }
      } else {
        liberator.echo('Grep <usage> :grep <args>');
      }
    },{
      literal: 0,
      bang: true,
      completer: bufferCompleter,
    },
    true
  );

})();

// vim: set et fdm=syntax ft=javascript sts=2 sw=2 ts=2 :
