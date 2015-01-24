/* NEW BSD LICENSE {{{
Copyright (c) 2014-2015, Jagua.
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


var INFO = xml`
<plugin name="GPosition-Element"
        version="0.1"
        href="https://github.com/Jagua/vimperator-plugins-sample/blob/master/graphical-position-element.js"
        summary="Graphical Position Element"
        lang="en-US"
        xmlns="http://vimperator.org/namespaces/liberator">
  <author homepage="https://github.com/Jagua">Jagua</author>
  <license>New BSD License</license>
  <project name="Vimperator" minVersion="3.8"/>
  <item>
    <tags>'gposition-element'</tags>
    <spec>'gposition-element'</spec>
    <description>
      <p>Show the graphical position of vertical scroll at an element in the status bar.</p>
    </description>
  </item>
  <item>
    <tags>'g:gposition_element_siteinfo'</tags>
    <spec>'g:gposition_element_siteinfo'</spec>
    <description>
      <p>add siteinfo. siteinfo has three properties. {name, url, selector}. see SITE_INFO in the plugin source.</p>
    </description>
  </item>
</plugin>`;


(function () {
  var e = document.createElement('toolbaritem');
  e.setAttribute('id', 'liberator-status-gposition-element');
  document.getElementById('liberator-status').appendChild(e);


  const SITE_INFO = [
    {
      name: 'Gmail',
      url: /^https:\/\/mail\.google\.com\/mail\//,
      selector: 'DIV#\\:4',
    },{
      name: 'LDR',
      url: /^http:\/\/reader\.livedoor\.com\/reader\//,
      selector: 'DIV#right_container',
    },
  ];


  const api = {
    _siteinfo: {},

    _url: '',

    _node: '',

    storeNode: function (node) api._node = node,

    getNode: function (node) api._node,

    eraseNode: function (node) api._node = false,

    recentUrl: function () api._url,

    updateRecentUrl: function () api._url = buffer.URL,

    register: function(siteinfo) {
      if (siteinfo.name && siteinfo.url && siteinfo.selector) {
        api._siteinfo[siteinfo.name] = siteinfo;
      } else {
        liberator.log(`gposition-element: register error: ${siteinfo}`);
      }
    },

    getBufferData: function (bufferUrl) {
      let name = false;
      for (var key in api._siteinfo) {
        if (bufferUrl.match(api._siteinfo[key].url)) {
          name = key;
          break;
        }
      }
      return name;
    },

    hideMeter: function () {
      let e = document.getElementById('liberator-status-gposition-css');
      e.setAttribute('style', 'visibility:hidden');
    },

    locationChange: function() {
      let recentBufferData = api.getBufferData(api.recentUrl());
      if (recentBufferData) {
        api.removeEventListener(recentBufferData);
      }
      let currentBufferData = api.getBufferData(buffer.URL);
      if (currentBufferData) {
        api.statusUpdate();
        api.addEventListener(currentBufferData);
      } else {
        api.hideMeter();
      }
      api.updateRecentUrl();
    },

    statusUpdate: function (e) {
      if (api.getBufferData(buffer.URL)) {
        statusline.updateField('gposition-element');
      }
    },

    querySelector: function (selector) {
      let e = undefined;
      if (typeof selector === 'function') {
        liberator.log(selector());
        e = content.document.querySelector(selector());
      } else if (typeof selector === 'string') {
        e = content.document.querySelector(selector);
      }
      return e;
    },

    getPercentage: function (name) {
      if (api._siteinfo.hasOwnProperty(name)) {
        let selector = api._siteinfo[name].selector;
        let e = api.querySelector(selector);
        let percent = 100.0 * e.scrollTop / (e.scrollHeight - e.clientHeight);
        return percent;
      }
    },

    addEventListener: function (name) {
      if (api._siteinfo.hasOwnProperty(name)) {
        let selector = api._siteinfo[name].selector;
        let e = api.querySelector(selector);
        e.addEventListener('scroll', api.statusUpdate, false);
        api.storeNode(e);
      }
    },

    removeEventListener: function (name) {
      if (api._siteinfo.hasOwnProperty(name)) {
        let e = api.getNode();
        if (e) {
          e.removeEventListener('scroll', api.statusUpdate, false);
          api.eraseNode();
        }
      }
    },
  };


  liberator._gposition_element = __context__.api = api;


  drawGPosition_init();


  statusline.addField(
    'gposition-element',
    'The graphical position of vertical scroll',
    'liberator-status-gposition',
    function updateGPosition (node, percent) {
      let name = api.getBufferData(buffer.URL);
      let percentage = api.getPercentage(name);
      drawGPosition_update(percentage);
    }
  );


  function drawGPosition_init() {
    var e = document.getElementById('liberator-status-gposition');
    if (e) {
      var css = document.createElement('div');
      css.setAttribute('id', 'liberator-status-gposition-css');
      css.setAttribute('style', 'position:relative;left:-16px;margin:0;padding:0;');
      e.appendChild(css);
      SITE_INFO.forEach(function(e) {
        api.register(e);
      });
      if (liberator.globalVariables.gposition_element_siteinfo) {
        liberator.globalVariables.gposition_element_siteinfo.forEach(function(e) {
          api.register(e);
        });
      }
    }
  }


  function drawGPosition_update(percent) {
    let e = document.getElementById('liberator-status-gposition-css');
    let css_template = `
    margin:0; padding:0;
    z-index:10; width:16px; height:16px;
    margin-left:-16px;
    position:relative;
    border-radius: 3px;
    border: 1.5px solid ${percent==100 ? 'rgb(10,10,10)' : 'rgb(148,148,148)'};
    background-image: linear-gradient(to bottom right, rgba(128,128,128,0.9), rgba(128,128,128,0.9) ${percent}%, rgba(255,255,255,0.5) ${percent+1}%, rgba(255,255,255,0.5));`;
    e.setAttribute('style', css_template);
  }


  autocommands.add(
    'LocationChange',
    '.*',
    function () {
      if (document.readyState == 'complete') {
        setTimeout(function () {
            api.locationChange();
        }, 250);
      } else {
        document.onreadystatechange = function () {
          if (document.readyState == 'complete') {
            api.locationChange();
          }
        };
      }
    }
  );


  gBrowser.addEventListener('DOMContentLoaded', function (e) {
      api.statusUpdate();
  }, false);


  options.status += ',gposition-element';


})();

// vim: set et fdm=marker ft=javascript sts=2 sw=2 ts=2 :

