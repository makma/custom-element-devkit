import * as path from 'path';
import {
  Configuration,
  Entry,
  Loader,
  Output,
} from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import OptimizeCssPlugin from 'optimize-css-assets-webpack-plugin';
import { CustomElementsFolderName } from './constants';

type StyleLoaders = {
  cssLoaders: Array<Loader>;
  lessLoaders: Array<Loader>;
  stylusLoaders: Array<Loader>;
};

const getStyleLoaders = (): StyleLoaders => {
  const cssLoaders = [
    'style-loader', {
      loader: 'css-loader',
      options: {
        url: true,
      },
    }, 'postcss-loader',
  ];
  const lessLoaders = cssLoaders.concat(['less-loader']);
  const stylusLoaders = cssLoaders.concat('stylus-loader');

  return {
    cssLoaders,
    lessLoaders,
    stylusLoaders,
  };
};

const wrapInExtractText = (loaders: Array<Loader>): Array<Loader> => {
  return ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: loaders.filter(loader => loader !== 'style-loader'),
  });
};

const wrapAllInExtractText = (loaderObject: StyleLoaders): StyleLoaders => {
  return Object.keys(loaderObject).reduce((result, key) => ({
    ...result,
    [key]: wrapInExtractText(loaderObject[key]),
  }), {}) as StyleLoaders;
};

const getCustomElementApiMockEntry = () => {
  return {
    'custom-element-api-mock': path.join(__dirname, '../../../client/custom-element-api-mock/index.ts'),
  };
};

const getCustomElementWrapperEntry = () => {
  return {
    'custom-element-wrapper': path.join(__dirname, '../../../client/custom-element-wrapper/index.ts'),
  };
};


export const getWebpackConfig = (entries: Entry, output: Output, minify: boolean): Configuration => {
  const {
    cssLoaders,
    lessLoaders,
    stylusLoaders,
  } = wrapAllInExtractText(getStyleLoaders());

  const plugins = [
    new ExtractTextPlugin({
      filename: `${CustomElementsFolderName}/[name]/bundle.css`,
    }),
  ];

  if (minify) {
    plugins.push(new OptimizeCssPlugin({
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
    }));
  }

  const webpackConfig: Configuration = {
    mode: minify ? 'production' : 'development',
    devtool: minify ? undefined : 'cheap-module-source-map',
    entry: Object.assign({}, entries, getCustomElementApiMockEntry(), getCustomElementWrapperEntry()),
    output,
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.less'],
    },
    module: {
      rules: [
        {
          test: /\.(jsx?|tsx?)$/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/,
          use: cssLoaders,
        },
        {
          test: /\.less$/i,
          use: lessLoaders,
        },
        {
          test: /\.styl$/i,
          use: stylusLoaders,
        },
        {
          test: /\.woff$/,
          loader: 'file-loader',
          options: {
            name: '/[name].[ext]',
          },
        },
        // Add media from imported libraries to the bundle, but not the ones from custom elements
        {
          test: /\.(svg|png)$/,
          exclude: /custom-elements/,
          use: 'url-loader',
        },
        // Media from custom elements go directly to the output folder so we can reference them by URL in custom element code
        {
          test: /\.(svg|png)$/,
          include: /custom-elements/,
          loader: 'file-loader',
          options: {
            name: '/custom-elements/[folder]/[name].[ext]',
          },
        },
      ],
    },
    plugins,
    node: {
      __filename: true,
    },
  };

  return webpackConfig;
};
