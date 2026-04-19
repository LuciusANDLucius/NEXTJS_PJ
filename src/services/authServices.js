import axiosInstance from "@/lib/axiosInstance";

export const register =  async(data) =>{
    let res = await axiosInstance.post('/auth/register',data);
    return res.data;
}

export const login = async (data) => {
  
    let res = await axiosInstance.post('/auth/login', data);

   
    if (res.data) {
        const tokenValue = res.data.token; 
        const userData = res.data.user;   
        if (tokenValue) {
            localStorage.setItem('token', tokenValue);
        }
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
        }
    }

    return res.data;
}

export const me = async(data) =>{
    let res = await axiosInstance.get('auth/me');
    return res.data
}

export const profile = async (id) => {
    let res = await axiosInstance.get(`/auth/profile/${id}`);
    return res.data
}

export const updateProfile = async (data) => {
let res = await axiosInstance.put('/auth/profile', data);
return res.data;
}
export const changePassword = async (data) => {
    // API requires: { oldPass, newPass }
    let res = await axiosInstance.put('/auth/change-password', {
        oldPass: data.currentPassword || data.oldPass,
        newPass: data.newPassword || data.newPass,
    });
    return res.data;
}
export const logout = async (data) => {
localStorage.removeItem('user');
localStorage.removeItem('token');
}
