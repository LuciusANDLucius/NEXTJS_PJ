export function isEmail(value){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ''))
}

export function validateRegister(form){
  const errs = {}
  if(!form.username || String(form.username).trim().length === 0) errs.username = 'Vui lòng nhập username'
  if(!form.fullname || String(form.fullname).trim().length === 0) errs.fullname = 'Vui lòng nhập họ tên'
  if(!form.email || String(form.email).trim().length === 0) errs.email = 'Vui lòng nhập email'
  else if(!isEmail(form.email)) errs.email = 'Email không hợp lệ'
  if(!form.pass || String(form.pass).length < 8) errs.pass = 'Mật khẩu tối thiểu 8 ký tự'
  return errs
}

export function validateLogin(form){
  const errs = {}
  if(!form.username) errs.username = 'Vui lòng nhập username'
  if(!form.pass) errs.pass = 'Vui lòng nhập mật khẩu'
  return errs
}

export default { isEmail, validateRegister, validateLogin }
