import request from '@/utils/request'

export function getPrize(params) {
  return request({
    url: '/prizes',
    method: 'get',
    headers: {
      'X-REQUESTED-WITH': 'XMLHttpRequest'
    }
  })
}

export function setPrize(data) {
  return request({
    url: '/prizes',
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data
  })
}

