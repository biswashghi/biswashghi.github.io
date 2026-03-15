import path from 'path';
import { fileURLToPath } from 'url';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = process.env.PUBLIC_PATH || '/';

export default {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    publicPath,
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
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
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.mdx$/,
        use: [
          { loader: 'babel-loader' },
          {
            loader: '@mdx-js/loader',
            options: {
              providerImportSource: '@mdx-js/react',
              remarkPlugins: [
                remarkFrontmatter,
                [remarkMdxFrontmatter, { name: 'meta' }],
              ],
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' },
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
    extensions: ['.js', '.jsx', '.mdx'],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
      publicPath,
    },
    historyApiFallback: {
      index: `${publicPath}index.html`,
      disableDotRule: true,
    },
    devMiddleware: {
      publicPath,
    },
    compress: true,
    port: 8080,
  },
};
