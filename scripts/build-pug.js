import upath from 'upath';
import sh from 'shelljs';
import {renderPug} from './render-pug.js';
import fs from 'fs';
import process from 'process';

import mongoose from 'mongoose';
const url = 'mongodb://127.0.0.1:27017/ari?';
let client = await mongoose.connect(url);
const db = mongoose.connection;

const srcPath = upath.resolve('./src');


await Promise.all(sh.find(srcPath).map(async (path) => {
  return _processFile(path, db);
}));

client.connection.close();


async function _processFile(filePath) {
  if ( filePath.match(/\.pug$/)
    && !filePath.match(/include/)
    && !filePath.match(/mixin/)
    && !filePath.match(/\/pug\/layouts\//)) {
      await renderPug(filePath);
    }
}

