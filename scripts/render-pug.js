import fs from 'fs';
import upath from 'upath';
import pug from 'pug';
import sh from 'shelljs';
import prettier from 'prettier';

import {Article, Extra} from '../src/database/schema.js';


export async function renderPug(filePath, db) {
  console.log(filePath);
  const destPath = filePath.replace(/src\/pug\/\pages/, 'docs').replace(
    /\.pug$/, '.html');
  const srcPath = upath.resolve('./src');

  const extras = await getExtraData(filePath, db);

  console.log(`### INFO: Rendering ${filePath} to ${destPath}`);
  const html = pug.renderFile(filePath, {
    doctype: 'html',
    filename: filePath,
    basedir: srcPath,
    ...extras
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

async function getExtraData(filePath) {
  if (filePath.match(/writing/)) {
    const writings = await Article.find({}).exec();
    return {
      journals: writings,
    };
  }
  if (filePath.match(/index/)) {
    const intro = fs.readFileSync('./content/intro.txt', 'UTF-8', 'r');
    return {
      intro: intro,
    };
  }
  if (filePath.match(/extra/)) {
    const extras = await Extra.find({}).exec();
    return {
      extras: extras,
    }
  }
}
