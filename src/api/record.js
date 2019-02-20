import request from '@/utils/request'

// 增
export function createRecord(data) {
  return request({
    url: '/records',
    method: 'post',
    data
  })
}
// 删
export function delteRecord(id) {
  return request({
    url: 'records/' + id + '/',
    method: 'delete'
  })
}
// 改
export function updateRecord(id, data) {
  return request({
    url: '/records/' + id + '/',
    method: 'patch',
    data
  })
}
// 查
export function getRecord(query) {
  return request({
    url: '/records',
    query
  })
}

