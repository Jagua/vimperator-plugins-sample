// PLUGIN_INFO {{{
let PLUGIN_INFO =
<VimperatorPlugin>
  <name>my echo</name>
  <name lang="ja">マイ・エコー</name>
  <description>my echo</description>
  <description lang="ja">いわゆるエコー</description>
  <version>0.0.1</version>
  <author mail="" homepage="https://github.com/Jagua">Jagua</author>
  <license href="http://opensource.org/licenses/mit-license.php">The MIT License</license>
  <updateURL>https://github.com/Jagua/vimperator-plugins/raw/master/myecho.js</updateURL>
  <minVersion>2.3</minVersion>
  <maxVersion>2.3</maxVersion>
  <detail><![CDATA[
    my echo
  ]]></detail>
  <detail lang="ja"><![CDATA[
    echo するだけ．
    vimperator の plugin を書くれんしゅう．
    「関数のテンプレート」を書き換えた．
  ]]></detail>
</VimperatorPlugin>;
// }}}

(function () {
  // XXX 以下は実行しないよ。
  //return;


  commands.addUserCommand(
    ['myec[ho]'],
    'my echo',
    function (args) {
      args.literalArg;
      args.length;
      args.bang;          // :command!
      args.count;         // :10command  入力されていない時は -1
      args['-option1'];
      liberator.echo("my echo : "+args);
    },
    {
      literal: 0,
      bang: true,
      count: true,
      argCount: '*', // 0 1 + * ?
      options: [
        [['-force'], commands.OPTION_NOARG],
        [['-fullscreen', '-f'], commands.OPTION_BOOL],
        [['-language'], commands.OPTION_STRING, null, [['perl', 'llama'], ['ruby', 'rabbit']]],
        [['-speed'], commands.OPTION_INT],
        [['-acceleration'], commands.OPTION_FLOAT],
        //[['-accessories'], commands.OPTION_LIST, validaterFunc, ['foo', 'bar']],
        [['-other'], commands.OPTION_ANY]
      ],
      completer: function (context, args) {
        context.title = ['value', 'description'];
        context.filters = [CompletionContext.Filter.textDescription]; // 説明(desc)もフィルタリング対象にする
        context.completions = [
          ['item1', 'desc1'],
        ];
      }
    },
    true // replace
  );


  options.add(
    ['names'],
    'description',
    'string', // type: string, stringlist, charlist, boolean
    'defaultValue',
    {
      scope: options.OPTION_SCOPE_GLOBAL, // <- default
                                          // or OPTION_SCOPE_LOCAL, OPTION_SCOPE_BOTH
      setter: function (value) {
        /* mozo mozo */
        return value;
      },
      getter: function (value) {
        /* mozo mozo */
        return value;
      },
      completer: function () {
      },
      validator: function () {
      },
      checkHas: function () {
      }
    }
  );


  hints.addMode(
    'm', // mode char
    'description',
    function (elem, loc, count) {
    },
    function () '//*'
  );


  mappings.addUserMap(
    [modes.NORMAL, modes.INSERT, modes.COMMAND_LINE, modes.VISUAL],
    ['`moge'],
    'Description',
    // extraInfo で指定していない引数は渡されません
    //   count => 入力されていない場合は - 1
    function (motion, count, arg) {
    },
    {
      noremap: true,
      silent: true,
      rhs: '`rhs',
      motion: true,
      count: true,
      arg: true
    }
  );

  /*
  autocommands.add(
    'LocationChange',
    '.*',
    function (args) {
      args.url;
      args.state // at Fullscreen
    }
    // or 'js ex-command'
  );
  */

})();

// vim:sw=2 ts=2 et si fdm=marker:
