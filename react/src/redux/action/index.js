export const Login='login'
export const Logout='logout'

export const login=(userInfo)=>({
    type:Login,
    userInfo
});
export const logout=()=>({
    type:Logout
});