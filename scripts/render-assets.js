import upath from 'upath';
import sh from 'shelljs';

export default function renderAssets() {
  const sourcePath = upath.resolve('./src/assets');
  const destPath = upath.resolve('./docs/.');

  const cssAssetsDestPath = upath.resolve('./docs/css/assets');

  const cname = upath.resolve('./src/CNAME');
  const cnameDest = upath.resolve('./docs/CNAME');

  sh.cp('-R', sourcePath, destPath);
  sh.cp('-R', sourcePath, cssAssetsDestPath);
  sh.cp(cname, cnameDest);
};
