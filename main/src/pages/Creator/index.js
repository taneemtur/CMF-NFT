import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosConfig from '../../axiosConfig'
import { bg01, client01 } from '../../components/imageImport'
import Main from '../../Layouts/Main'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { splitWalletAddress } from '../../utils'

const Creator = () => {
  const { user, account } = useSelector(state => state.theme)
  const navigate = useNavigate()
  const [creators, setCreators] = useState([]);
  const [end, setEnd] = useState(10);

  const getCreators = async () => {
    await axiosConfig.get('/profile/getusers').then((res)=>{
      console.log(res.data)
      setCreators(res.data.data);
    })
  }

  const followUser = async (followUser) => {
    await axiosConfig.post('/profile/addfollowedusers', {walletAddress: account, user: followUser}).then((res)=>{
      toast(res.data.message)
    }) 
  }

  useEffect(()=>{
    getCreators();

    return () => {
      setCreators(null);
    }
  },[])

  return (
   <Main>
     {/*- Start Home */}
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
                  Creators
                </h5>
                <p className="text-white-50 para-desc mx-auto mb-0">
                  All CMF Creators
                </p>
              </div>
            </div>
            {/*-end col*/}
          </div>
          {/*-end row*/}

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
                  Creators
                </li>
              </ul>
            </nav>
          </div>
        </div>
        {/*-end container*/}
      </section>
      {/*-end section*/}
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
      {/*- End Home */}

      {/*- Start Section */}
      <section className="section">
        <div className="container">
          <div className="row row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-1 g-4 justify-content-center">
            {creators && creators.slice(0,end)?.map((creator, index) => {
              return (
                <div className="col" key={index}>
                  <div className="card creators creators-two creator-primary rounded-md shadow overflow-hidden">
                    <div
                      className="py-5"
                      style={{ background: `url(${creator?.bannerImage || bg01})` }}
                    ></div>
                    <div className="position-relative mt-n5">
                      <img
                        src={creator?.profileImage || client01}
                        className="avatar avatar-md-md rounded-pill shadow-sm bg-light img-thumbnail mx-auto d-block"
                        alt=""
                      />

                      <div className="content text-center pt-2 p-4">
                        <a
                          href={`/profile/${creator?.walletAddress}`}
                          onClick={e => {
                            e.preventDefault()
                            navigate(`/profile/${creator?.walletAddress}`)
                          }}
                          className="text-dark h6 name d-block mb-0"
                        >
                          {splitWalletAddress(creator?.walletAddress)}
                        </a>
                        <small className="text-muted">{creator?.name ? `@ ${creator?.name}` : ''}</small>

                        <div className="mt-3">
                          <a
                            href=""
                            onClick={e => {
                              e.preventDefault()
                              followUser(creator)
                            }}
                            className="btn btn-pills btn-soft-primary"
                          >
                            Follow
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            {/*-end col*/}
          </div>
          {
            end < creators.length && (
              <div className="row justify-content-center mt-4">
                <div className="col">
                  <div className="text-center">
                    <a
                      href=""
                      onClick={e => {
                        e.preventDefault()
                        setEnd(prev => prev + 10)
                      }}
                      className="btn btn-primary rounded-md"
                    >
                      <i className="uil uil-process mdi-spin me-1"></i> Load More
                    </a>
                  </div>
                </div>
                {/*end col*/}
              </div>
            )
          }
          {/*-end row*/}
        </div>
        {/*-end container*/}
      </section>
      {/*-end section*/}
      {/*- End Section */}
   </Main>
  )
}

export default Creator
