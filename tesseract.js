
Cu.import('resource://gre/modules/Downloads.jsm');
Cu.import('resource://gre/modules/Task.jsm');


(() => {

  const nl = liberator.has('Unix') ? '\n' : '\r\n';

  function tesseract(url) {
    let editor_path = liberator.globalVariables.tesseract_editor_path || 'gvim';
    let tesseract_path = liberator.globalVariables.tesseract_tesseract_path || 'tesseract';
    let default_lang = liberator.globalVariables.tesseract_default_lang || 'eng';

    commandline.input('language (default: ' + default_lang + ')',
      (arg) => {
        let lang = arg || default_lang;
        let tempfile = io.createTempFile();
        Task.spawn(function* () {
          yield Downloads.fetch(url, tempfile.path);
          return tempfile;
        }).then((tempfile) => {
          if (tempfile.exists()) {
            let langs = io.system(tesseract_path + ' --list-langs')
                          .split(nl)
                          .filter((e, i, a) => (e.length == 3));
            if (langs.some((e, i, a) => (lang == e))) {
              let tempfile_txt = io.createTempFile();
              io.run(tesseract_path, [tempfile.path, tempfile_txt.path, '-l', lang], true);
              io.run(editor_path, [tempfile_txt.path + '.txt'], true);
            } else {
              liberator.echo('Invalid language. select from (' + langs.join(',') + ')');
            }
          }
        });
      }
    );
  }


  function url(url) {
    let uri = liberator.modules.util.newURI(url);
    if (uri.host === 'pds.twimg.com') {
      url += ':orig';
    }
    return url;
  }


  hints.addMode('r', 'Tesseract-OCR',
    (elem, loc, count) => {
      liberator.echomsg(elem.src);
      tesseract(url(elem.src));
    },
     () => '//img[@src]'
  );


})();

// vim: set et fdm=syntax ft=javascript sts=2 sw=2 ts=2 :
