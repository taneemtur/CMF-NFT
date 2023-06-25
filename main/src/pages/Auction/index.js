import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Countdown from 'react-countdown'
import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'
import axiosConfig from "../../axiosConfig"

import { cta, bg01 } from '../../components/imageImport'
import NftCardAuction from '../../components/NftCardAuction'

const Auction = () => {
  const navigate = useNavigate()
  const [nfts, setNfts] = React.useState([])
  const [end, setEnd] = React.useState(10)

 
  const getAuctionedNFTs = async () => {
    await axiosConfig.get("nfts/getauctionednfts").then(res => {
      console.log('nfts', res.data)
      setNfts(res.data.data)
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    getAuctionedNFTs()
  }, [])

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Start Home */}
      <section
        className="bg-half-170 d-table w-100"
        style={{ background: `url(${bg01}) bottom` }}
      >
        <div className="bg-overlay bg-gradient-overlay-2"></div>
        <div className="container">
          <div className="row mt-5 justify-content-center">
            <div className="col-12">
              <div className="title-heading text-center">
                <h5 className="heading fw-semibold sub-heading text-white title-dark">
                  Live Auctions
                </h5>
                <p className="text-white-50 para-desc mx-auto mb-0">
                  Please check live auctions of digital arts
                </p>
              </div>
            </div>
            {/*end col*/}
          </div>
          {/*end row*/}

          <div className="position-middle-bottom">
            <nav aria-label="breadcrumb" className="d-block">
              <ul
                className="breadcrumb breadcrumb-muted mb-0 p-0"
                style={{ backgroundColor: 'transparent' }}
              >
                <li className="breadcrumb-item">
                  <a
                    href="/"
                    onClick={e => {
                      e.preventDefault()
                      navigate('/')
                    }}
                  >
                    Chain Master Finance
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Auction
                </li>
              </ul>
            </nav>
          </div>
        </div>
        {/*end container*/}
      </section>
      {/*end section*/}
      <div className="position-relative">
        <div className="shape overflow-hidden text-white">
          <svg
            viewBox="0 0 2880 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>
      {/* End Home */}

      {/* Start */}
      <section className="section">
        <div className="container">
          <div className="row row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-1 g-4">
            {nfts.slice(0, end)?.map((data, index) => {
              return (
                <div className="col" key={index}>
                  <NftCardAuction data={data} key={index} />
                </div>
              )
            })}
            {/*end col*/}
          </div>
          {/*end row*/}

          <div className="row justify-content-center mt-4">
            <div className="col">
              {
                end < nfts.length && (
                  <div className="text-center">
                    <a
                      href=""
                      onClick={e => {
                        e.preventDefault()
                        setEnd(end + 10)
                      }}
                      className="btn btn-primary rounded-md"
                    >
                      <i className="uil uil-process mdi-spin me-1"></i> Load More
                    </a>
                  </div>
                )
              }
            </div>
            {/*end col*/}
          </div>
          {/*end row*/}
        </div>
        {/*end container*/}
      </section>
      {/*end section*/}
      {/* End */}

      {/* CTA Start */}
      <section className="section pt-0 pt-sm-5 mt-0 mt-sm-5">
        <div className="container">
          <div className="bg-black rounded-md p-md-5 p-4">
            <div className="container">
              <div className="row">
                <div className="col-lg-4 col-md-6">
                  <div className="app-subscribe text-center text-md-start">
                    <img src={cta} className="img-fluid" height="120" alt="" />
                  </div>
                </div>
                {/*end col*/}

                <div className="col-lg-8 col-md-6 mt-4 pt-2 mt-sm-0 pt-sm-0">
                  <div className="section-title text-center text-md-start ms-xl-5 ms-md-4">
                    <h4 className="display-6 fw-bold text-white title-dark mb-0">
                      Get{' '}
                      <span className="text-gradient-primary fw-bold">
                        Free collections{' '}
                      </span>{' '}
                      <br /> with your subscription
                    </h4>

                    <div className="mt-4">
                      <a
                        href=""
                        onClick={e => e.preventDefault()}
                        className="btn btn-link primary text-white title-dark"
                      >
                        Subscribe Now <i className="uil uil-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </div>
                {/*end col*/}
              </div>
              {/*end row*/}
            </div>
            {/*end container*/}
          </div>
        </div>
        {/*end container*/}
      </section>
      {/*end section*/}
      {/* CTA End */}
      {/* footer */}
      <Footer />
    </>
  )
}

export default Auction
