import { createContext, useContext, useState } from "react";


//B1: Khởi tạo context
const ThemeContext  = createContext();
//B2:
export const MyTheme = ( {children})=>{
   // Tạo state lưu trạng thái sử dụng mẫu theme: sáng hoặc tối
   const [theme, setTheme] = useState('light'); // mặc định để dùng theme sáng
   // viết hàm đổi giao diện
   const toggleTheme = ()=>{
       console.log('Theme đang dùng : ' + theme );
       setTheme(theme === 'light'?'dark':'light');
   }


   return(
       <ThemeContext.Provider value={ { theme, toggleTheme } }>
           {children}
       </ThemeContext.Provider>
   )
}
// b3: ngoài hàm MyTheme, định nghĩa hàm hook
export const useTheme = ()=> useContext( ThemeContext );
