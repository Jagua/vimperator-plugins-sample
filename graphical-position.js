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


var INFO = xml`
<plugin name="GPosition"
        version="0.5"
        href="https://github.com/Jagua/vimperator-plugins-sample/blob/master/graphical-position.js"
        summary="Graphical Position"
        lang="en-US"
        xmlns="http://vimperator.org/namespaces/liberator">
  <author homepage="https://github.com/Jagua">Jagua</author>
  <license>New BSD License</license>
  <project name="Vimperator" minVersion="3.8"/>
  <item>
    <tags>'gposition'</tags>
    <spec>'gposition'</spec>
    <description>
      <p>Show the graphical position of vertical scroll in the status bar.</p>
    </description>
  </item>
</plugin>`;


(function () {
  var e = document.createElement('toolbaritem');
  e.setAttribute('id', 'liberator-status-gposition');
  var c = document.createElement('toolbarbutton');
  e.appendChild(c);
  document.getElementById('liberator-status').appendChild(e);

  drawGPosition_init();

  statusline.addField(
    'gposition',
    'The graphical position of vertical scroll',
    'liberator-status-gposition',
    function updateGPosition (node, percent) {
      if (!percent || typeof percent != 'number') {
        let win = document.commandDispatcher.focusedWindow;
        if (win && win.scrollMaxY != 0) {
          percent = win.scrollY / win.scrollMaxY * 100;
        } else if (win && win.scrollY == 0 && win.scrollMaxY == 0) {
          percent = -2;
        } else {
          return;
        }
      }
      node.value = '';
      drawGPosition_update(percent);
    }
  );


  function drawGPosition_init() {
    var e = document.getElementById('liberator-status-gposition');
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('id', 'liberator-status-gposition-svg');
    svg.setAttribute('width', '16px');
    svg.setAttribute('height', '16px');
    svg.setAttribute('version', '1.1');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('id', 'liberator-status-gposition-svg-path');
    svg.appendChild(path);

    path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('id', 'liberator-status-gposition-border');
    svg.appendChild(path);

    e.appendChild(svg);
  }


  function drawGPosition_update(percent) {

    function d_(per, cx, cy, r) {
      let d = ``;
      let deg = per * 360 / 100 - 90;
      if (deg > 269)
        deg = 270 - 0.1;
      if (deg <= -90)
        deg = -90 + 0.1;
      let x1 = cx + r * Math.cos(-90 * Math.PI / 180);
      let y1 = cy + r * Math.sin(-90 * Math.PI / 180);
      let x2 = cx + r * Math.cos(deg * Math.PI / 180);
      let y2 = cy + r * Math.sin(deg * Math.PI / 180);
      let dx = x2 - x1;
      let dy = y2 - y1;
      let flag = 0;
      if (per > 50)
        flag = 1;
      if (per == 100) {
        d = `M ${cx},${cy - r} a ${r} ${r} -90 ${flag} 1 ${dx},${dy}`;
      } else {
        d = `M ${cx},${cy} L ${cx},${cy - r} a ${r} ${r} -90 `
            + `${flag} 1 ${dx},${dy} L ${cx},${cy} Z`;
      }
      return d;
    }

    let path = document.getElementById('liberator-status-gposition-svg-path');

    if (percent == -1) {
      let e = document.getElementById('liberator-status-gposition-loading');
      if (!e) {
        let svg = document.getElementById('liberator-status-gposition-svg');
        let circle = document.createElementNS('http://www.w3.org/2000/svg',
                                              'circle');
        circle.setAttribute('id', 'liberator-status-gposition-loading');
        circle.setAttribute('cx', '8px');
        circle.setAttribute('cy', '8px');
        circle.setAttribute('r', '4px');
        circle.setAttribute('fill', 'transparent');
        circle.setAttribute('stroke', 'black');
        circle.setAttribute('stroke-width', '5px');
        circle.setAttribute('stroke-dasharray', '1.2,3');
        let a = document.createElementNS('http://www.w3.org/2000/svg',
                                         'animateTransform');
        a.setAttribute('attributeType', 'auto');
        a.setAttribute('attributeName', 'transform');
        a.setAttribute('type', 'rotate');
        a.setAttribute('from', '0 8 8');
        a.setAttribute('to', '360 8 8');
        a.setAttribute('dur', '3s');
        a.setAttribute('stroke', 'freeze');
        a.setAttribute('repeatCount', 'indefinite');
        circle.appendChild(a);
        svg.appendChild(circle);
        path.setAttribute('style', 'visibility: hidden');
      }
    } else {
      let e = document.getElementById('liberator-status-gposition-loading');
      if (e) {
        let svg = document.getElementById('liberator-status-gposition-svg');
        svg.removeChild(e);
      }
      path.setAttribute('style', 'visibility:visible');
    }

    let d = d_(percent, 7 + 1, 1 + 7, 7); // radius=7, padding=1

    if (percent == -1) {
      path.setAttribute('class', 'position_phase_loading');
      path.setAttribute('style', 'visibility:hidden');
    } else if (percent == -2) {
      d = d_(100, 7 + 1, 1 + 7, 4);
      path.setAttribute('class', 'position_phase_whole');
      path.setAttribute('style', 'fill:DimGray');
    } else if (percent == 0) {
      path.setAttribute('class', 'position_phase_top');
      path.setAttribute('style', 'fill:white');
    } else if (percent == 100) {
      path.setAttribute('class', 'position_phase_bottom');
      path.setAttribute('style', 'fill:DimGray');
    } else {
      path.setAttribute('class', 'position_phase_interlude');
      path.setAttribute('style', 'fill:gray');
    }
    path.setAttribute('d', d);

    path = document.getElementById('liberator-status-gposition-border');
    d = d_(100, 7 + 1, 1 + 7, 7); // radius=7, padding=1
    path.setAttribute('d', d);

    if (percent == -1) {
      path.setAttribute('style',
        'stroke:silver; stroke-dasharray:2.5,2.5,0.5,2.5;'
        + ' stroke-width:2; fill:transparent');
    } else if (percent == -2) {
      path.setAttribute('style',
        'stroke:Black; stroke-width:1px; fill:transparent');
    } else if (percent == 0) {
      path.setAttribute('style',
        'stroke:black; stroke-dasharray:2.5,2.5,0.5,2.5;'
        + ' stroke-width:2; fill:transparent');
    } else if (percent == 100) {
      path.setAttribute('style',
        'stroke:Black; stroke-width:1.2px; fill:transparent');
    } else {
      path.setAttribute('style',
        'stroke:DarkSlateGray; stroke-width:1px; fill:transparent');
    }
  }


  autocommands.add(
    'LocationChange',
    '.*',
    function () {
      statusline.updateField('gposition', -1);
      if (document.readyState == 'complete') {
        setTimeout(function () {
            statusline.updateField('gposition');}, 250);
      } else {
        document.onreadystatechange = function () {
          if (document.readyState == 'complete') {
            statusline.updateField('gposition');
          }
        };
      }
    }
  );


  gBrowser.addEventListener('scroll', function (e) {
    statusline.updateField('gposition');
  }, false);


  gBrowser.addEventListener('DOMContentLoaded', function (e) {
    statusline.updateField('gposition');
  }, false);


  options.status += ',gposition';


})();

// vim: set et fdm=marker ft=javascript sts=2 sw=2 ts=2 : 

