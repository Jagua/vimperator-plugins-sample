// INFO {{{
var INFO = xml`
<plugin name="firefox-channel-badge"
        version="0.5"
        href="https://github.com/Jagua/vimperator-plugins-sample/blob/master/firefox-channel-badge.js"
        summary="display Firefox channel in StatusLine"
        lang="en-US"
        xmlns="http://vimperator.org/namespaces/liberator">
  <author homepage="https://github.com/Jagua">Jagua</author>
  <license href="http://www.opensource.org/licenses/bsd-license.php">New BSD License</license>
  <project name="Vimperator" minVersion="3.8"/>
  <item>
    <description>
      display Firefox channel in StatusLine.
      support Firefox, Firefox Beta, Firefox Aurora and Firefox Nightly.
    </description>
  </item>
</plugin>`;
// }}}


(function () {

  var updateChannel = options.getPref('app.update.channel');

  var Config = {
    updateChannel: {
      release: {
        badgeColor: '#D2470A',
      },
      beta: {
        badgeColor: '#a40c0c',
      },
      aurora: {
        badgeColor: '#b47055',
      },
      nightly: {
        badgeColor: '#002c56',
      },
    },
    svgTemplate: `<?xml version="1.0"?>
                  <svg width="100" height="24" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <rect id="badge-ground" x="0" y="0"
                          width="100" height="24" fill="%badgeColor%" />
                    <text id="badge-text" x="3" y="16"
                          font-family="Consolas,Sans-serif" font-size="20" fill="#fff">
                      %channel%
                    </text>
                  </svg>`,
    hiTemplate: `hi -append StatusLine  background-image: url(data:image/svg+xml,%svg%);
                                        background-position: top left;
                                        background-attachment: local;
                                        background-repeat: no-repeat;`
    getSVG: function () {
      let badgeColor = (this.updateChannel.hasOwnProperty(updateChannel)) ?
                        this.updateChannel[updateChannel].badgeColor : '#000';
      let channelText = updateChannel[0].toUpperCase()
                        + ((updateChannel.length > 1) ? updateChannel.slice(1) : '');
      return this.svgTemplate.replace(/%channel%/, channelText)
                             .replace(/%badgeColor%/, badgeColor);
    },
    hiCommand: function () {
      return this.hiTemplate.replace(/\s(?=\s)/g, '')
                            .replace(/%svg%/,
                                     escape(this.getSVG().replace(/\s(?=\s)/g, '')));
    },
  };


  autocommands.add('VimperatorEnter', /.*/, function () {
    liberator.execute(Config.hiCommand());
  });


})();

// vim: set et fdm=marker ft=javascript sts=2 sw=2 ts=2 :

