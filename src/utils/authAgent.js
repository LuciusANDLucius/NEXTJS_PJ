// cập nhật thông báo cho login
export function authAgent(errorOrResponse){
  // handle when passed an axios error (with response) or a plain response object
  const hasResponse = errorOrResponse && errorOrResponse.response
  const response = hasResponse ? errorOrResponse.response : (errorOrResponse || null)

  const result = {
    success: false,
    uiMessage: 'Đã có lỗi xảy ra. Vui lòng thử lại sau!',
    field: 'global', // 'username' | 'pass' | 'global'
    action: 'retry'
  }

  if(!response){
    // no response from server => network
    result.uiMessage = 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra Internet.'
    result.action = 'retry'
    return result
  }

  const status = response.status
  const data = response.data || {}

  const errorMap = {
    401: 'Mật khẩu không chính xác hoặc tài khoản không tồn tại.',
    403: 'Tài khoản của bạn đã bị khóa hoặc không có quyền truy cập.',
    400: data?.message || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra các trường.',
    404: 'Tài nguyên không tồn tại (404).',
    429: 'Thao tác quá nhanh. Vui lòng thử lại sau vài phút.',
    500: 'Hệ thống đang gặp sự cố hoặc máy chủ không hoạt động.'
  }

  result.uiMessage = errorMap[status] || data?.message || result.uiMessage

  // field-level errors from backend
  if(data?.errors && typeof data.errors === 'object'){
    result.fieldErrors = data.errors
    // pick first field to focus
    const firstField = Object.keys(data.errors)[0]
    result.field = firstField || 'global'
    result.uiMessage = data.errors[firstField] || result.uiMessage
    result.action = 'retry'
    return result
  }

  // some APIs return a code or specific message details
  if(status === 401) result.field = 'pass'
  if(status === 400 && data?.field) result.field = data.field

  if(status === 401) result.action = 'retry'
  if(status === 403) result.action = 'reset'
  if(status >= 500) result.action = 'reset'

  return result
}

export default authAgent
