import { Plugin, UserConfig, CSSOptions } from 'vite';
import path from 'path';

export const cssModulesDevClassNames = (): Plugin => ({
  name: 'css-modules-dev-classnames',
  apply: 'serve' as const,
  config: (): UserConfig => {
    const cssOptions: CSSOptions = {
      modules: {
        generateScopedName:
          (name, filename, css) => {
            const i = css.indexOf('.' + name);
            const line = css.substring(0, i).split(/[\r\n]/).length;
            const file = path.basename(filename, '.module.css');

            return `${file}_${name}_${String(line).padStart(3, '0')}`;
          },
      }
    };
    return ({
      css: cssOptions,
    });
  },
});
