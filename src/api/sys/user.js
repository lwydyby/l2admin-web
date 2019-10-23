import request from '@/plugin/axios'
export function getUser(id) {
    return request({
        url: '/user/' + id,
        method: 'get',
        loading: {
            type: 'nprogress',
            interval: 500
        }
    })
}
export function getUserPermissionInfo() {
    return request({
        url: '/user/info',
        method: 'get'
    })
}
export function getUserPagedList(query) {
    return request({
        url: '/user/pagedlist',
        method: 'get',
        params: query
    })
}
export function editRoleUser(data) {
    return request({
        url: '/user/editroleuser',
        method: 'post',
        data: data
    })
}
export function saveUser(data) {
    return request({
        url: '/user/save',
        method: 'post',
        data: data,
        success: {
            type: 'message',
            options: {
                message: '保存成功',
                type: 'success'
            }
        }
    })
}
export function delUser(id) {
    return request({
        url: '/user/del',
        method: 'delete',
        params: { id: id },
        success: {
            type: 'message',
            options: {
                message: '删除成功',
                type: 'success'
            }
        }
    })
}
export function delUsers(ids) {
    return request({
        url: '/user/batchdel',
        method: 'delete',
        data: ids.ids,
        success: {
            type: 'message',
            options: {
                message: '删除成功',
                type: 'success'
            }
        }
    })
}

export function getAllUser() {
    return request({
        url: '/user/all',
        method: 'get'
    })

}

export function addRole(data) {
    return request({
        url: '/user/addRole',
        method: 'post',
        data: data,
        success: {
            type: 'message',
            options: {
                message: '保存成功',
                type: 'success'
            }
        }
    })
}

export function saveRP(data) {
    return request({
        url: '/user/saveRP',
        method: 'post',
        data: data,
        success: {
            type: 'message',
            options: {
                message: '保存成功',
                type: 'success'
            }
        }
    })
}

export function getRp(data) {
    return request({
        url: '/user/getRp?id='+data,
        method: 'get',
    })
}