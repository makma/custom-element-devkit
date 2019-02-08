import {
  Configuration,
  Loader,
} from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

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


export const getWebpackConfig = (): Configuration => {
  const {
    cssLoaders,
    lessLoaders,
    stylusLoaders,
  } = wrapAllInExtractText(getStyleLoaders());

  return {
    mode: 'none',
    devtool: 'cheap-module-source-map',
    entry: 'Will be modified in buildWebpack.ts',
    output: {
      // 'Will be modified in buildWebpack.ts'
    },
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
    plugins: [
      new ExtractTextPlugin({
        filename: '[name]/bundle.css',
      }),
    ],
    node: {
      __filename: true,
    },
    optimization: {
      // minimize is handled by plugins config
      minimize: false,
    },
    watch: true,
  };
};
