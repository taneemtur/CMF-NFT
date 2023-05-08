import React, { useEffect, useState } from "react";
import { FiMoon, FiSun }from 'react-icons/fi'
import { MdDarkMode, MdOutlineLightMode} from 'react-icons/md'
import { setTheme } from "../../Store/Slicers/theme";
import { useDispatch,useSelector } from "react-redux";


function ThemeSwitcher() {
  const dispatch = useDispatch()
  const theme = useSelector((state)=>state.theme.theme)
  useEffect(() => {
    
  
    
  }, [])
  
  function toggleTheme(){
    if(theme==='light'){
    dispatch(setTheme('dark'));
    console.log(theme)
    document.getElementById('theme-opt').href = './css/style-dark.min.css'
    }else{
      dispatch(setTheme('light'));
      console.log(theme)
    document.getElementById('theme-opt').href = './css/style.min.css'
    }
  }

  return (
    <div>
      {theme==='dark' ?
        <button onClick={toggleTheme} className="bg-black" style={{height:36, width:36, borderRadius:100, border:'none',transition:'all 0.3s'}}>
        <FiMoon color="white" style={{paddingBottom:'3px'}} />
        </button>
       :  
       <button onClick={toggleTheme} className="bg-white" style={{height:36, width:36, borderRadius:100, border:'none',transition:'all 0.3s'}}>
        <FiSun style={{paddingBottom:'3px'}} />
        </button>
      }
    </div>
  );
}

export default ThemeSwitcher;
