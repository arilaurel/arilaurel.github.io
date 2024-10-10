import upath from 'upath';
import sh from 'shelljs';
import {renderPug} from './render-pug.js';
import fs from 'fs';
import process from 'process';

const srcPath = upath.resolve('./src');


await Promise.all(sh.find(srcPath).map(async (path) => {
  return _processFile(path);
}));



async function _processFile(filePath) {
  if ( filePath.match(/\.pug$/)
    && !filePath.match(/include/)
    && !filePath.match(/mixin/)
    && !filePath.match(/\/pug\/layouts\//)) {
      await renderPug(filePath);
    }
}

