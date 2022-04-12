import sh from 'shelljs';
import upath from 'upath';

const destPath = upath.resolve('./docs');

sh.rm('-rf', `${destPath}/*`);

