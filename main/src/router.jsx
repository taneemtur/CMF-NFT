import React from 'react'
import Error from './pages/Error'
import AboutUs from './pages/AboutUs'
import ComingSoon from './pages/ComingSoon'
import Maintenance from './pages/Maintenance'
import Support from './pages/Support'
import OverView from './pages/Overview'
import Guides from './pages/Guides'
import Faqs from './pages/Faqs'
import Contact from './pages/Contact'
import UploadWork from './pages/UploadWork'
import Collections from './pages/Collections'
import {BrowserRouter, Route, Routes } from 'react-router-dom'
import BecomeCreator from './pages/BecomeCreator'
import CreateProfile from './pages/CreatorProfile'
import Creator from './pages/Creator'
import Wallet from './pages/Walllet'
import Activity from './pages/Activity'
import ItemDetailOne from './pages/ItemDetailOne'
import ItemDetailTwo from './pages/ItemDetailTwo'
import Auction from './pages/Auction'
import ExploreFour from './pages/ExploreFour'
import ExploreThree from './pages/ExploreThree'
import ExploreTwo from './pages/ExploreTwo'
import DarkVersionOne from './pages/DarkVersionOne'
import DarkVersionTwo from './pages/DarkVersionTwo'
import DarkVersionFive from './pages/DarkVersionFive'
import DarkVersionThree from './pages/DarkVersionThree'
import DarkVersionFour from './pages/DarkVersionFour'
import ExploreOne from './pages/ExploreOne'
import CreatorProfileEdit from './pages/CreatorProfileEdit'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import ChangeLog from './pages/ChangeLog'
import Subscriptions from './pages/Subscriptions'
import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { useSelector } from 'react-redux'


export default function Router() { 
  const theme = useSelector((state)=>state.theme.theme)
  const location = useLocation();
  useEffect(() => {
    // 👇️ scroll to top on page load
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }, [location]);
  useEffect(() => {
    if(theme==='dark'){
      document.getElementById('theme-opt').href = './css/style-dark.min.css'
    }else{
      document.getElementById('theme-opt').href = './css/style.min.css'
    }
  }, [theme])
  return (
      <Routes>
        {/* auth router  */}

        {/* special router page  */}
        <Route exact path="/error" element={<Error />} />
        <Route exact path="/comingsoon" element={<ComingSoon />} />
        <Route exact path="/maintenance" element={<Maintenance />} />

        {/* help center routes */}
        <Route exact path="/helpcenter-support-request" element={<Support />} />
        <Route exact path="/helpcenter-overview" element={<OverView />} />
        <Route exact path="/helpcenter-guides" element={<Guides />} />
        <Route exact path="/helpcenter-faqs" element={<Faqs />} />

        {/* template page routes  */}
        <Route exact path="/aboutus" element={<AboutUs />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/upload-work" element={<UploadWork />} />
        <Route exact path="/collections" element={<Collections />} />
        <Route exact path="/become-creator" element={<BecomeCreator />} />
        <Route exact path="/creator-profile" element={<CreateProfile />} />
        <Route
          exact
          path="/creator-profile-edit"
          element={<CreatorProfileEdit />}
        />
        <Route exact path="/creators" element={<Creator />} />
        <Route exact path="/wallet" element={<Wallet />} />
        <Route exact path="/activity" element={<Activity />} />
        <Route exact path="/item-detail-one" element={<ItemDetailOne />} />
        <Route exact path="/item-detail-two" element={<ItemDetailTwo />} />
        <Route exact path="/auction" element={<Auction />} />
        <Route exact path="/explore-four" element={<ExploreFour />} />
        <Route exact path="/explore-three" element={<ExploreThree />} />
        <Route exact path="/explore-two" element={<ExploreTwo />} />
        <Route exact path="/explore-one" element={<ExploreOne />} />

        <Route exact path="/index-dark" element={<DarkVersionOne />} />
        <Route exact path="/index-dark-rtl" element={<DarkVersionOne />} />

        <Route exact path="/index-two-dark" element={<DarkVersionTwo />} />
        <Route exact path="/index-two-dark-rtl" element={<DarkVersionTwo />} />
        <Route exact path="/index-two" element={<DarkVersionTwo />} />
        <Route exact path="/index" element={<DarkVersionTwo />} />
        <Route exact path="/" element={<DarkVersionTwo />} />
        <Route exact path="/index-two-rtl" element={<DarkVersionTwo />} />

        <Route exact path="/index-three-dark" element={<DarkVersionThree />} />
        <Route
          exact
          path="/index-three-dark-rtl"
          element={<DarkVersionThree />}
        />
        <Route exact path="/index-three" element={<DarkVersionThree />} />
        <Route exact path="/index-three-rtl" element={<DarkVersionThree />} />

        <Route exact path="/index-four-dark" element={<DarkVersionFour />} />
        <Route
          exact
          path="/index-four-dark-rtl"
          element={<DarkVersionFour />}
        />                          
        <Route exact path="/index-four" element={<DarkVersionFour />} />
        <Route exact path="/index-four-rtl" element={<DarkVersionFour />} />

        <Route exact path="/index-five-dark" element={<DarkVersionFive />} />
        <Route
          exact
          path="/index-five-dark-rtl"
          element={<DarkVersionFive />}
        />
        <Route exact path="/index-five" element={<DarkVersionFive />} />
        <Route exact path="/index-five-rtl" element={<DarkVersionFive />} />

        <Route exact path="/subscriptions" element={<Subscriptions/>} />

        <Route exact path="/terms" element={<Terms />} />
        <Route exact path="/privacy" element={<Privacy />} />
        <Route exact path="/changelog" element={<ChangeLog />} />
      </Routes>
    
  )
}
