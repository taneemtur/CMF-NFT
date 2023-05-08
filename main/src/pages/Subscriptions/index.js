import { useNavigate } from 'react-router-dom'
import {
    client01, client02, client03, client04, client05, client06, client08,
    client10, client12, client13,
    gif1, gif2, gif3, gif4, gif5, gif6,
    item1, item2, item3, item4, item5, item6, item7, item8, item9, item10,
    single, ofcDesk, prodToCard,
  } from '../../components/imageImport'
import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'

const index = () => {
    const navigate = useNavigate()

  return (
    <div>
    {/* Navbar */}
    <Navbar />
    <div className="container">
    <section className='' style={{minHeight:'471px'}}>
        <div className="container d-flex align-items-center flex-column" style={{paddingTop:'20%'}}>
        <h1>Subscriptions</h1>
        </div>
    </section>
    </div>
    {/* footer */}
    <Footer />
    </div>
  )
}

export default index
