import React from 'react'
// import toggleSwitcher from '../StyleSwitcher'
const StyleSwitcher = () => {
    const toggleSwitcher = () => {
        var i = document.getElementById('style-switcher')
        if (i) {
            if (i.style.left === '-189px') {
                i.style.left = '0px'
            } else {
                i.style.left = '-189px'
            }
        }
    }
    return (
        <div id="style-switcher" className="bg-light border p-3 pt-2 pb-2" onClick={(e) => { e.preventDefault(); toggleSwitcher() }}>
            {/* Style switcher  */}
            <div className="content">

                <h6 className="title text-center pt-3 mb-0">Theme Option</h6>
                <ul className="text-center list-unstyled mb-0">
                    <li className="d-grid"><a className="btn btn-sm btn-block btn-dark dark-version t-dark mt-2" onClick={(e) => { e.preventDefault(); document.getElementById('theme-opt').href = './css/style-dark.min.css' }}>Dark</a></li>
                    <li className="d-grid"><a href="" className="btn btn-sm btn-block btn-dark light-version t-light mt-2" onClick={(e) => { e.preventDefault(); document.getElementById('theme-opt').href = './css/style.min.css' }}>Light</a></li>
                </ul>
            </div>
            <div className="bottom p-0">
                <a href="" className="settings bg-white title-bg-dark shadow d-flex align-items-center justify-content-center">
                    <i className="mdi mdi-cog mdi-24px position-absolute mdi-spin text-primary"></i></a>
            </div>
            {/* end Style switcher  */}
        </div>
    )

}

export default StyleSwitcher