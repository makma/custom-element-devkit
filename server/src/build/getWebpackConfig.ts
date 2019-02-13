import {
  Configuration,
  Entry,
  Loader,
  Output,
} from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import OptimizeCssPlugin from 'optimize-css-assets-webpack-plugin';

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


export const getWebpackConfig = (entries: Entry, output: Output, minify: boolean): Configuration => {
  const {
    cssLoaders,
    lessLoaders,
    stylusLoaders,
  } = wrapAllInExtractText(getStyleLoaders());

  const plugins = [
    new ExtractTextPlugin({
      filename: '[name]/bundle.css',
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
    entry: entries,
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
          test: /\.svg$/,
          use: 'url-loader',
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
