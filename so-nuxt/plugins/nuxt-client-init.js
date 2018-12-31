import setAxiosTokenFromCookie from '~/helpers/set-axios-token-from-cookie'

// set again axios token on the client side
export default async nuxtContext => {
  setAxiosTokenFromCookie(nuxtContext)
}
