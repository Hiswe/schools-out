export default {
  modulesDir: [`../node_modules`],
  build: {
    // transpile: ['vuejs-datepicker'],
  },
  ignore: [`**@schools-out/helpers**`, `soHelpers`],
  css: [
    `vuetify/dist/vuetify.min.css`,
    // `@/assets/vuetify.styl`, `@/assets/global.scss`
  ],
  plugins: [
    `@/plugins/vue-libraries.js`,
    `@/plugins/nuxt-axios.js`,
    `@/plugins/vue-filters.js`,
    // `@/plugins/global-acount-components.ts`,
    { src: `@/plugins/nuxt-client-init`, ssr: false },
    // { src: `@/plugins/dom-libraries`, ssr: false },
  ],
  modules: [
    // `nuxt-ts-module`,
    `@nuxtjs/axios`,
    `cookie-universal-nuxt`,
    // [`nuxt-sass-resources-loader`, [`@/assets/media-queries.scss`]],
  ],
  router: {
    middleware: [`authenticated`],
    linkExactActiveClass: `is-active`,
  },
  env: {
    COOKIE_NAME: `schools-out_nuxt`,
    JWT_FORMAT: `Bearer`,
  },
  axios: {
    baseURL: `http://localhost:4060/v1`,
    browserBaseURL: `http://localhost:4060/v1`,
    credentials: true,
  },
  head: {
    meta: [
      { charset: `utf-8` },
      { name: `viewport`, content: `width=device-width, initial-scale=1` },
      { 'http-equiv': `X-UA-Compatible`, content: `IE=edge` },
      { rel: `icon`, href: `/favicon.png`, type: `image/png` },
    ],
    link: [
      {
        rel: `stylesheet`,
        href: `https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons`,
      },
    ],
  },
}
