/* global process */
// import * as dotenv from 'dotenv'
// dotenv.config()

import { boot } from 'quasar/wrappers'
import axios from 'axios'

// eslint-disable-next-line no-undef
// const baseURL = process.env.SERVER

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

const api = axios.create({
  baseURL: process.env.SERVER || 'http://localhost:3002'
})

// api.interceptors.request.use(
//   config => {
//     config.headers.authorization = `Bearer ${token}`
//     return config
//   },
//   error => {
//     return Promise.reject(error)
//   }
// )

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
