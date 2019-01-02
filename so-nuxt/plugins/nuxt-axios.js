export default nuxtContext => {
  const { $axios, redirect } = nuxtContext
  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 401) redirect(`/login`)
  })
}
