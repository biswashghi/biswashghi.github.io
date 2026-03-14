const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const publicPath = process.env.PUBLIC_PATH || '/';

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    publicPath,
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Use the index.html from the public directory
      filename: 'index.html', // Output file name in the dist directory
      favicon: './public/favicon.ico',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets',
          to: 'assets',
          globOptions: {
            ignore: ['**/.DS_Store'],
          },
        }, // Copy assets to the output directory
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.mdx$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: '@mdx-js/loader',
            options: {
              providerImportSource: '@mdx-js/react',
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/, // Match .js and .jsx files
        exclude: /node_modules/, // Exclude node_modules
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp|avif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/media/[name].[contenthash][ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.mdx'], // Add .jsx and .mdx to the list of resolved extensions
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Serve files from the dist directory
      publicPath,
    },
    historyApiFallback: {
      index: `${publicPath}index.html`,
      disableDotRule: true,
    }, // React Router: serve index.html for deep links
    devMiddleware: {
      publicPath,
    },
    compress: true,
    port: 8080, // Default port
  },
};
