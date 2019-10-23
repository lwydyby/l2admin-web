import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const regionKey= 'region_key'
const azKey= 'az_key'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function getRegion() {
  return Cookies.get(regionKey)
}

export function setRegion(region) {
  return Cookies.set(regionKey, region)
}

export function removeRegion() {
  return Cookies.remove(regionKey)
}

export function getAz() {
  return Cookies.get(azKey)
}

export function setAz(az) {
    return Cookies.set(azKey, az)
}

export function removeAz() {
  return Cookies.remove(azKey)
}
