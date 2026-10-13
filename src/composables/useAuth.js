import { api } from 'src/boot/axios'
import Cookies from 'js-cookie'

export default function useAuthAdmin () {
  const login = async (data) => {
    try {
      const result = await api.post('/admin/login', data)
      if (!result.data?.token) {
        throw new Error('Não foi possível concluir o login.')
      }
      return result.data.token
    } catch (error) {
      const status = error.response?.status
      const message = status === 400
        ? 'Informe seu e-mail e sua senha.'
        : status === 401
          ? 'E-mail ou senha inválidos.'
          : 'Não foi possível conectar à API. Tente novamente.'
      const authError = new Error(message)
      authError.status = status
      throw authError
    }
  }

  const loginWithSocialProvider = async () => {}
  const logout = async () => {}

  const isLoggedIn = async () => {
    const tokenGet = Cookies.get('_myAppToken')
    if (!tokenGet) {
      return false
    }

    try {
      const pass = await api.post('/services/auth', { token: tokenGet })
      if (pass.data.message === 'Token invalido') {
        Cookies.remove('_myAppToken')
        return false
      }
      return true
    } catch (error) {
      return false
    }
  }

  const register = async () => {}
  const update = async () => {}
  const sendPasswordRestEmail = async () => {}

  return {
    login,
    loginWithSocialProvider,
    isLoggedIn,
    logout,
    register,
    update,
    sendPasswordRestEmail
  }
}
