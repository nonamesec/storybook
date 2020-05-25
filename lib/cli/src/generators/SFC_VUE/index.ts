import {
  retrievePackageJson,
  getVersionedPackages,
  writePackageJson,
  getBabelDependencies,
  installDependencies,
  copyTemplate,
  copyComponents,
} from '../../helpers';
import { StoryFormat } from '../../project_types';
import { Generator } from '../generator';

const generator: Generator = async (npmOptions, { storyFormat, language }) => {
  const packages = [
    '@storybook/vue',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addons',
  ];
  if (storyFormat === StoryFormat.MDX) {
    packages.push('@storybook/addon-docs');
  }
  const versionedPackages = await getVersionedPackages(npmOptions, ...packages);

  copyComponents('vue', language);
  copyTemplate(__dirname, storyFormat);

  const packageJson = await retrievePackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(npmOptions, packageJson);

  installDependencies({ ...npmOptions, packageJson }, [...versionedPackages, ...babelDependencies]);
};

export default generator;
