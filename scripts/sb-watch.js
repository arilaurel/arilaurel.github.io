import _ from 'lodash';
import chokidar from 'chokidar';
import upath from 'upath';
import renderAssets from './render-assets.js';
import {renderPug} from './render-pug.js';
import renderScripts from './render-scripts.js';
import renderSCSS from './render-scss.js';
import mongoose from 'mongoose';
const url = 'mongodb://127.0.0.1:27017/ari?compressors=none&';
let client = await mongoose.connect(url);
const db = mongoose.connection;

const watcher = chokidar.watch('src', {
  persistent: true,
});

let READY = false;

process.title = 'pug-watch';
process.stdout.write('Loading');
const allPugFiles = {};

watcher.on('add', (filePath) => _processFile(upath.normalize(filePath), 'add'));
watcher.on('change', (filePath) => _processFile(upath.normalize(filePath),
    'change'));
watcher.on('ready', () => {
  READY = true;
  console.log(' READY TO ROLL!');
});

_handleSCSS();

function _processFile(filePath, watchEvent) {
  if (!READY) {
    if (filePath.match(/\.pug$/)) {
      if (!filePath.match(/includes/) && !filePath.match(/mixins/) && !filePath
          .match(/\/pug\/layouts\//)) {
        allPugFiles[filePath] = true;
      }
    }
    process.stdout.write('.');
    return;
  }

  console.log(`### INFO: File event: ${watchEvent}: ${filePath}`);

  if (filePath.match(/\.pug$/)) {
    return _handlePug(filePath, watchEvent);
  }

  if (filePath.match(/\.scss$/)) {
    if (watchEvent === 'change') {
      return _handleSCSS(filePath, watchEvent);
    }
    return;
  }

  if (filePath.match(/src\/js\//)) {
    return renderScripts();
  }

  if (filePath.match(/src\/assets\//)) {
    return renderAssets();
  }
}

function _handlePug(filePath, watchEvent) {
  if (watchEvent === 'change') {
    if (filePath.match(/includes/) || filePath.match(/mixins/) || filePath
        .match(/\/pug\/layouts\//)) {
      return _renderAllPug();
    }
    return renderPug(filePath, db);
  }
  if (!filePath.match(/includes/) && !filePath.match(/mixins/) && !filePath
      .match(/\/pug\/layouts\//)) {
    return renderPug(filePath, db);
  }
}

function _renderAllPug() {
  console.log('### INFO: Rendering All');
  _.each(allPugFiles, (value, filePath) => {
    renderPug(filePath, db);
  });
}

function _handleSCSS() {
  renderSCSS();
}
