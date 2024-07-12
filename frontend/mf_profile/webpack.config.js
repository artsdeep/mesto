const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');
const deps = require('./package.json').dependencies;
module.exports = {
  entry: './src/index',
  mode: 'development',
  devServer: {
    static: path.join(__dirname, 'dist'),
    port: 3303,
  },
  output: {
    publicPath: 'auto',
  },
  resolve: {
    alias: {
      'frontend_shared-context': path.resolve(__dirname, '../shared-context'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-react'],
        },
      },{
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash:8].[ext]',
              outputPath: 'fonts/', // Optional: where to output the fonts
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash:8].[ext]',
              outputPath: 'images/', // Optional: where to output the images
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // To learn more about the usage of this plugin, please visit https://webpack.js.org/plugins/module-federation-plugin/
    new ModuleFederationPlugin({
      name: 'mf_profile',
      filename: 'remoteEntry.js',
      exposes: {
        './EditProfilePopup': './src/Components/EditProfilePopup',
        './EditAvatarPopup': './src/Components/EditAvatarPopup',
      },
      shared: [{
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
        'frontend_shared-context': {
          import: 'frontend_shared-context',
          requiredVersion: require('../shared-context/package.json').version,
        },
      }]
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};

