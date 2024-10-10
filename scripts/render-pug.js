import fs from 'fs';
import upath from 'upath';
import pug from 'pug';
import sh from 'shelljs';
import prettier from 'prettier';

import {Article, Extra} from '../src/database/schema.js';


export async function renderPug(filePath) {
  console.log(filePath);
  const destPath = filePath.replace(/src\/pug\/\pages/, 'docs').replace(
    /\.pug$/, '.html');
  const srcPath = upath.resolve('./src');

  const writing = await getWriting(filePath);

  console.log(`### INFO: Rendering ${filePath} to ${destPath}`);
  const html = pug.renderFile(filePath, {
    doctype: 'html',
    filename: filePath,
    basedir: srcPath,
    ...writing
  });

  const destPathDirname = upath.dirname(destPath);
  if (!sh.test('-e', destPathDirname)) {
    sh.mkdir('-p', destPathDirname);
  }

  const prettified = prettier.format(html, {
    printWidth: 1000,
    tabWidth: 4,
    singleQuote: true,
    proseWrap: 'preserve',
    endOfLine: 'lf',
    parser: 'html',
    htmlWhitespaceSensitivity: 'ignore',
  });

  fs.writeFileSync(destPath, prettified);
};


let writings = [];

async function getWriting(filePath) {
  if (filePath.match(/writing/)) {
    const writings = fs.readFileSync('./content/writing.json', "utf-8", 'r');
    const jsonData = JSON.parse(writings);
    return {
      journals: jsonData,
    };
  }
  return {}
}
