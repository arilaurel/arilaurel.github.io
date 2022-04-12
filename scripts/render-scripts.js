import upath from 'upath';
import sh from 'shelljs';

export default function renderScripts() {
  const sourcePath = upath.resolve('./src/js');
  const destPath = upath.resolve('./docs/.');

  sh.cp('-R', sourcePath, destPath);
};
