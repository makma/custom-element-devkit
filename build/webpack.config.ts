import { Configuration, Loader } from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

type StyleLoaders = {
  cssLoaders: Array<Loader>;
  lessLoaders: Array<Loader>;
}
const getStyleLoaders = (): StyleLoaders => {
  const cssLoaders = [
    'style-loader', {
      loader: 'css-loader',
      options: {
        url: true,
      },
    }, 'postcss-loader'
  ];
  const lessLoaders = cssLoaders.concat(['less-loader']);

  return {
    cssLoaders,
    lessLoaders,
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

const {
  cssLoaders,
  lessLoaders,
} = wrapAllInExtractText(getStyleLoaders());

export const webpackConfig: Configuration = {
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
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
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
        test: /\.svg$/,
        use: 'url-loader',
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name]/bundle.css',
    }),
  ],
  node: {
    __filename: true
  },
  optimization: {
    // minimize is handled by plugins config
    minimize: false,
  },
  watch: true,
};
