import request from '@/utils/request'
// 增
export function createInfo(data) {
  return request({
    url: '/infos/',
    method: 'post',
    data
  })
}
// 查
export function getInfo() {
  return request({
    url: '/infos/'
  })
}

