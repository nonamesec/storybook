import {
  getVersions,
  retrievePackageJson,
  writePackageJson,
  getBabelDependencies,
  installDependencies,
  copyTemplate,
  copyComponents,
} from '../../helpers';
import { Generator } from '../generator';

const generator: Generator = async (npmOptions, { storyFormat, language }) => {
  const [
    storybookVersion,
    actionsVersion,
    linksVersion,
    addonsVersion,
    svelte,
    svelteLoader,
  ] = await getVersions(
    npmOptions,
    '@storybook/svelte',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addons',
    'svelte',
    'svelte-loader'
  );

  copyComponents('svelte', language);
  copyTemplate(__dirname, storyFormat);

  const packageJson = await retrievePackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(npmOptions, packageJson);

  installDependencies({ ...npmOptions, packageJson }, [
    `@storybook/svelte@${storybookVersion}`,
    `@storybook/addon-actions@${actionsVersion}`,
    `@storybook/addon-links@${linksVersion}`,
    `@storybook/addons@${addonsVersion}`,
    `svelte@${svelte}`,
    `svelte-loader@${svelteLoader}`,
    ...babelDependencies,
  ]);
};

export default generator;
