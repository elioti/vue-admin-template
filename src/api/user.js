import request from '@/utils/request'

// 增
export function createUser(data) {
  return request({
    url: '/users/',
    method: 'post',
    data
  })
}
// 删
export function delteUser(id) {
  return request({
    url: 'users/' + id + '/',
    method: 'delete'
  })
}
// 改
export function updateUser(id, data) {
  return request({
    url: '/users/' + id + '/',
    method: 'patch',
    data
  })
}
// 查
export function getUser(params) {
  return request({
    url: '/users/',
    params
  })
}

