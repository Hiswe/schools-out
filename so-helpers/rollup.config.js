// import typescript from 'rollup-plugin-typescript2'

const NAME = `index`

const config = {
  input: `${NAME}.js`,
  output: [
    {
      format: `cjs`,
      file: `lib/${NAME}.js`,
    },
    {
      format: `esm`,
      file: `lib/${NAME}.esm.js`,
    },
  ],
  plugins: [],
  // https://rollupjs.org/guide/en#warning-treating-module-as-external-dependency
  external: [`@sindresorhus/slugify`, `lodash.flow`, `luxon`],
}

export default [config]
