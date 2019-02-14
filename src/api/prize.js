import request from '@/utils/request'

export function getPrize(params) {
  return request({
    url: '/prizes',
    method: 'get'
  })
}

export function setPrize(params) {
  return request({
    url: '/prizes',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: {
      code: params.code,
      name: params.name,
      prob: params.prob
    }
  })
}

