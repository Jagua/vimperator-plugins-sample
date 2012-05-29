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

// PLUGIN_INFO {{{
let PLUGIN_INFO =
<VimperatorPlugin>
  <name>thunder</name>
  <description>tell you how far away lightning is from you.</description>
  <version>0.0.1</version>
  <author homepage="https://github.com/Jagua">Jagua</author>
  <license>new BSD License (Please read the source code comments of this plugin)</license>
  <license lang="ja">修正BSDライセンス (ソースコードのコメントを参照してください)</license>
  <updateURL>https://github.com/Jagua/vimperator-plugins-sample/blob/master/thunder.js</updateURL>
  <minVersion>2.3</minVersion>
  <maxVersion>3.4</maxVersion>
  <detail><![CDATA[
    == Commands ==
    :thunder <oa>time</oa>
      display how far away lightning is from you.
      <oa>time</oa> : time until hearing the thunder from shining the lightning.

    == Setting Sample ==
    .vimperatorrc setting sample

    if you want to use weatherapi, write the following setting.

    let g:thunder_city = 'Tokyo'
    let g:thunder_use_weatherapi = 0
      0: not use api
      1: use api

  ]]></detail>
</VimperatorPlugin>;
// }}}

(function () {

  function getweather(city, callback) {
    util.httpGet("http://www.google.com/ig/api?weather=" + city, function (xhr) {
      let xml = xhr.responseXML;
      let temp_c = xml.getElementsByTagName("temp_c")[0].getAttribute("data");
      callback(parseFloat(temp_c));
    });
  }

  function thunder(args) {
    var useapi = liberator.globalVariables.thunder_use_weatherapi || false;
    var city = liberator.globalVariables.thunder_city || 'Tokyo';
    var temp_c = liberator.globalVariables.thunder_temp || 20;
    var time = parseFloat(args[0]);
    var c = 340;
    var distance = 0;

    function calc_and_display(temp_c) {
      /**
        c = sqrt(kRT/M)

        k = 1.403
        R = 8.314472
        T = 273.15 + t
        M = 28.966E-3 kg/mol
       **/

      c = Math.sqrt(1.403 * 8.314472 * (273.15 + temp_c) / 0.028966);
      distance = c * time;
      distance = Math.round(distance * 100) / 100;

      var app = "";
      if (useapi) {
        app = " <span style='margin-left:1em'>/ USEAPI(city: &quot;" + city + "&quot;, temp_c: &quot;" + temp_c + "&quot;)</span>";
      }

      liberator.echo("<span style='font-size:120%;margin:1em'><strong>"
                     + distance +
                       "</strong></span> <span>meters away</span>" + app,
                     commandline.FORCE_MULTILINE);
    }

    if (useapi) {
      getweather(city, calc_and_display);
    } else {
      calc_and_display(parseFloat(temp_c));
    }
  }

  commands.addUserCommand(
    ['thu[nder]'],
    'display the distance to the lightning',
    function (args) {
      thunder(args);
    },{
      bang: false,
      argCount: '1',
    },
    true
  );

})();

// vim: set et fdm=syntax fenc= ft=javascript sts=2 sw=2 ts=2 : 
