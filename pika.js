// INFO {{{
var INFO = xml`
<plugin name='Pika-!'
        version='0.5'
        href='https://github.com/Jagua/vimperator-plugins-sample/blob/master/pika.js'
        summary='calculate the distance from you to a lightning.'
        lang='en-US'
        xmlns='http://vimperator.org/namespaces/liberator'>
  <author homepage='https://github.com/Jagua'>Jagua</author>
  <license>New BSD License</license>
  <project name='Vimperator' minVersion='3.8'/>
  <item>
    <tags>:pika</tags>
    <spec>:pika</spec>
    <description>
    <p>
      calculate the distance from you to a lightning.
    </p>
    </description>
  </item>
</plugin>`;
// }}}

(function () {

  const api = {

    _shineTime: 0,

    _soundTime: 0,

    set soundTime (arg) this._soundTime = arg,

    set shineTime (arg) this._shineTime = arg,

    get soundTime () this._soundTime,

    get shineTime () this._shineTime,

    get calc () {
      let _dt = (api.soundTime - api.shineTime) / 1000;   // (sec)
      let distance = Math.round(0.34 * _dt * 100) / 100;  // (km)
      let dt = Math.round(_dt * 100) / 100;               // (sec)
      return [dt, distance];
    },

    start: function () {
      setTimeout(function() {
        commandline.input('Seeing the flash of lightning, press <Enter>!',
          function(arg) {
            liberator.execute(':thutime lightning');
            commandline.close();
          }
        );
      }, 0);
    },

    seeLightning: function () {
      setTimeout(function() {
        api.shineTime = (new Date()).getTime();
        commandline.input('Hearing the sound of thunder, press <Enter>!',
          function(arg) {
            liberator.execute(':thutime thunder');
            commandline.close();
          }
        );
      }, 0);
    },

    hearThunder: function () {
      api.soundTime = (new Date()).getTime();
      api.echoResult();
    },

    echoResult: function () {
      let [t, d] = api.calc;
      liberator.echo(`Distance: ${d} km (= 0.34 (km/s) x ${t} (s))`);
    },

  };


  liberator._thutime = __context__.api = api;


  let subCommands = [
    {name: 'start',      actionName: 'start'},
    {name: 'lightning',  actionName: 'seeLightning'},
    {name: 'thunder',    actionName: 'hearThunder'},
  ];


  commands.addUserCommand(['thutime'], 'display the distance to the lightning.',
    function (args) {
      api.start();
    },
    {
      subCommands:
        subCommands.map(cmd =>
          new Command(
            [cmd.name],
            cmd.description || cmd.name,
            cmd.actionName ? function (args) api[cmd.actionName](args) : cmd.action,
            {completer: cmd.completer, literal: 0, bang: false}
          )
        )
    },
    true
  );

})();

// vim: set et fdm=marker ft=javascript si sts=2 sw=2 ts=2 :
