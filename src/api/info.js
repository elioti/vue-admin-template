import request from '@/utils/request'
// 增
export function createInfo(data) {
  return request({
    url: '/settings/',
    method: 'post',
    data
  })
}
// 查
export function getInfo() {
  return request({
    url: '/settings/'
  })
}
// 改
export function updateInfo(id, data) {
  return request({
    url: '/settings/' + id + '/',
    method: 'patch',
    data
  })
}
