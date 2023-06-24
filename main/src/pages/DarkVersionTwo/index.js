import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { tns } from 'tiny-slider/src/tiny-slider';

import {
  work1, work2, work3, work4, work5, work6, work7, work8, work9, work10, work11, work12,
  client01, client02, client03, client04, client05, client06, client07, client08,
  client09, client10, client11, client12, client13,
  gif1, gif2, gif3, gif4, gif5, gif6, item1, item2, item3, item4, item5, item6,
  c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12,
} from '../../components/imageImport'
import Main from '../../Layouts/Main';
import axiosConfig from '../../axiosConfig'
import { getChainByName } from '../../blockchain/supportedChains';
import { useSelector } from 'react-redux';
import { splitWalletAddress } from '../../utils';



const DarkVersionTwo = () => {
  const {chain} = useSelector(state => state.theme)
  const navigate = useNavigate()

  const AuctionData = [
    {
      image: gif1,
      title: 'Deep Sea Phantasy',
      type: 'GIFs',
      filter: ['all', 'games'],
    },
    {
      image: item1,
      title: 'CyberPrimal 042 LAN',
      type: 'Arts',
      filter: ['all', 'art'],
    },
    {
      image: gif2,
      title: 'Crypto Egg Stamp #5',
      type: 'Games',
      filter: ['all', 'music', 'meme'],
    },
    {
      image: item2,
      title: 'Colorful Abstract Painting',
      type: '',
      filter: ['all', 'video'],
    },
    {
      image: item3,
      title: 'Liquid Forest Princess',
      type: '',
      filter: ['all', 'video', 'meme'],
    },
    {
      image: gif3,
      title: 'Spider Eyes Modern Art',
      type: 'GIFs',
      filter: ['all', 'games'],
    },
    {
      image: item4,
      title: 'Synthwave Painting',
      type: '',
      filter: ['all', 'art'],
    },
    {
      image: gif4,
      title: 'Contemporary Abstract',
      type: 'GIFs',
      filter: ['all', 'music'],
    },
    {
      image: item5,
      title: 'Valkyrie Abstract Art',
      type: '',
      filter: ['all', 'video', 'meme'],
    },
    {
      image: gif5,
      title: 'The girl with the firefly',
      type: '',
      filter: ['all', 'art'],
    },
    {
      image: item6,
      title: 'Dodo hide the seek',
      type: '',
      filter: ['all', 'games'],
    },
    {
      image: gif6,
      title: 'Pinky Ocean',
      type: '',
      filter: ['all', 'music'],
    },
  ]

  const [allData, setAllData] = useState(AuctionData)
  const [hero, setHero] = useState(null);
  const [collections, setCollections] = useState(null);
  const [creators, setCreators] = useState(null);
  const [type, setType] = useState('All')
  const [allExploreitems, setAllExploreitems] = useState()
  const [categories, setCategories] = useState([])
  const location = useLocation()

  const getHeroNFTs = async () => {
    await axiosConfig.get('/landingpage/herosection/').then((res)=>{
      setHero(res.data.data)
      console.log(res.data);
    })
  }

  const getPopularCollections = async () => {
    await axiosConfig.get('/landingpage/mostpopularcollection/').then((res)=>{
      setCollections(res.data.data)
      console.log(res.data);
    })
  }

  const getBestCreatorsSellers = async () => {
    await axiosConfig.get('/landingpage/bestcreatorssellers/').then((res)=>{
      setCreators(res.data.data)
      console.log(res.data);
    })
  }

  const getAllExploreItems = async () => {
    await axiosConfig.get('/landingpage/exploreitems/categoriessnfts').then((res)=>{
      const data = res.data.data
      const cats = data["categories"]
      const nfts = data["categoriesNFTs"]
      setCategories(["All", ...cats])
      setAllExploreitems(nfts)
    })
  }

  const setFilter = type => {
    setType(type)
    // const newOne = AuctionData?.filter(data => data?.filter?.includes(type))
    // setAllData(newOne)
  }

  useEffect( async ()=>{
    await getHeroNFTs();
    if (document.getElementsByClassName('tiny-five-item').length > 0) {
      tns({
        container: '.tiny-five-item',
        controls: false,
        mouseDrag: true,
        loop: true,
        rewind: true,
        autoplay: true,
        autoplayButtonOutput: false,
        autoplayTimeout: 3000,
        navPosition: 'bottom',
        speed: 400,
        gutter: 12,
        responsive: {
          1025: {
            items: 5,
          },

          992: {
            items: 3,
          },

          767: {
            items: 2,
          },

          320: {
            items: 1,
          },
        },
      })
    }
    await getPopularCollections();
    if (document.getElementsByClassName('tiny-three-item-nav-arrow').length > 0) {
      var slider = tns({
        container: '.tiny-three-item-nav-arrow',
        controls: true,
        mouseDrag: true,
        loop: true,
        rewind: true,
        autoplay: true,
        autoplayButtonOutput: false,
        autoplayTimeout: 3000,
        navPosition: 'bottom',
        controlsText: [
          '<i class="mdi mdi-chevron-left "></i>',
          '<i class="mdi mdi-chevron-right"></i>',
        ],
        nav: false,
        speed: 400,
        gutter: 12,
        responsive: {
          992: {
            items: 3,
          },

          767: {
            items: 2,
          },

          320: {
            items: 1,
          },
        },
      })
    }
    await getBestCreatorsSellers()
    await getAllExploreItems()
    return () => {
      setHero(null)
      setCategories(null)
      setCreators(null)
      setAllExploreitems(null)
    }
  },[])

  return (
    <Main>
      <div className="round-effect">
        <div className="primary-round opacity-3"></div>
        <div className="gradient-round opacity-3"></div>
      </div>

      {/* Start Home */}
      <section className="bg-half-174">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="tiny-five-item">                  
                {hero && hero?.map(data => {
                  return (
                    <div className="tiny-slide" key={data?.name}>
                      <div className="card bg-white nft-items nft-primary rounded-md shadow-md overflow-hidden mx-2 my-3">
                        <div className="nft-image position-relative overflow-hidden">
                          <a
                            href={`/nft/${data?.nftAddress}`}
                            onClick={e => {
                              e.preventDefault()
                              navigate(`/nft/${data?.nftAddress}`)
                            }}
                          >
                            <img
                              src={data?.image}
                              className="img-fluid"
                              alt=""
                              style={{ width: '100%', height: '250px', objectFit: 'cover', }}
                            />
                          </a>
                          <div className="position-absolute top-0 start-0 m-3">
                            <a
                              href=""
                              onClick={e => e.preventDefault()}
                              className="badge badge-link bg-primary"
                            >
                              {data?.type}
                            </a>
                          </div>
                          <div className="position-absolute top-0 end-0 m-3">
                            <span className="like-icon shadow-sm">
                              <a
                                href=""
                                onClick={e => e.preventDefault()}
                                className="text-muted icon"
                              >
                                <i className="mdi mdi-18px mdi-heart mb-0"></i>
                              </a>
                            </span>
                          </div>
                        </div>

                        <div className="card-body content position-relative">
                          <a
                            href={`/nft/${data?.nftAddress}`}
                            onClick={e => {
                              e.preventDefault()
                              navigate(`/nft/${data?.nftAddress}`)
                            }}
                            className="title text-dark h6"
                          >
                            {data?.name}
                          </a>

                          <div className="d-flex align-items-center justify-content-between mt-3">
                            <div className="">
                              <small className="rate fw-bold"> {data?.price} {getChainByName(chain)} </small>
                            </div>
                            <a
                              href="/item-detail-one"
                              onClick={e => {
                                e.preventDefault()
                                navigate('/item-detail-one')
                              }}
                              className="btn btn-icon btn-pills btn-primary"
                            >
                              <i className="uil uil-shopping-bag"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                {/*end slide*/}
              </div>
            </div>
            {/*end col*/}
          </div>
          {/*end row*/}
        </div>
        {/*end container*/}

        <div className="container mt-100 mt-60">
          <div className="row align-items-end">
            <div className="col-md-8">
              <div className="section-title mb-4 pb-2">
                <h4 className="title mb-2">Explore CMF Items</h4>
                <p className="text-muted mb-0">
                  Explore the latest NFTs on CMF
                </p>
              </div>
            </div>
            {/*end col*/}

            <div className="col-md-4">
              <div className="text-end d-md-block d-none">
                <a
                  href="/explore-one"
                  onClick={e => {
                    e.preventDefault()
                    navigate('/explore')
                  }}
                  className="btn btn-link primary text-dark"
                >
                  See More <i className="uil uil-arrow-right"></i>
                </a>
              </div>
            </div>
            {/*end col*/}
          </div>
          {/*end row*/}

          <div className="row justify-content-center mb-4 pb-2">
            <div className="col filters-group-wrap">
              <div className="filters-group">
                <ul className="container-filter mb-0 categories-filter list-unstyled filter-options">
                  {
                    categories && categories?.map((data, index) => {
                      return (
                        <li
                          className={`list-inline-item categories position-relative text-dark ${type === data ? 'active' : ''
                            }`}
                          onClick={() => setFilter(data)}
                          key={index}
                        >
                          <i className="uil uil-browser"></i> {data}
                        </li>
                      )
                    })
                  }
                  {/* <li
                    className={`list-inline-item categories position-relative text-dark ${type === 'all' ? 'active' : ''
                      }`}
                    onClick={() => setFilter('all')}
                  >
                    <i className="uil uil-browser"></i> All
                  </li>
                  <li
                    className={`list-inline-item categories position-relative text-dark ${type === 'games' ? 'active' : ''
                      }`}
                    onClick={() => setFilter('games')}
                  >
                    <i className="uil uil-volleyball"></i> Games
                  </li>
                  <li
                    className={`list-inline-item categories position-relative text-dark ${type === 'art' ? 'active' : ''
                      }`}
                    onClick={() => setFilter('art')}
                  >
                    <i className="uil uil-chart-pie-alt"></i> Art
                  </li>
                  <li
                    className={`list-inline-item categories position-relative text-dark ${type === 'music' ? 'active' : ''
                      }`}
                    onClick={() => setFilter('music')}
                  >
                    <i className="uil uil-music"></i> Music
                  </li>
                  <li
                    className={`list-inline-item categories position-relative text-dark ${type === 'video' ? 'active' : ''
                      }`}
                    onClick={() => setFilter('video')}
                  >
                    <i className="uil uil-camera-plus"></i> Video
                  </li>
                  <li
                    className={`list-inline-item categories position-relative text-dark ${type === 'meme' ? 'active' : ''
                      }`}
                    // data-group="memes"
                    onClick={() => setFilter('meme')}
                  >
                    <i className="uil uil-rocket"></i> Memes
                  </li> */}
                </ul>
              </div>
            </div>
            {/*end col*/}
          </div>
          {/*end row*/}

          <div
            className="row row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 g-4"
            id="grid"
          >
            {allExploreitems && allExploreitems[type].map((data, index) => {
              return (
                <div className="col picture-item" key={index}>
                  <div className="card bg-white nft-items nft-primary rounded-md shadow overflow-hidden mb-1">
                    <div className="nft-image position-relative overflow-hidden">
                      <img src={data?.image} className="img-fluid" alt="" />
                      <div className="position-absolute top-0 end-0 m-2">
                        <span className="like-icon shadow-sm">
                          <a
                            href=""
                            onClick={e => e.preventDefault()}
                            className="text-muted icon"
                          >
                            <i className="mdi mdi-18px mdi-heart mb-0"></i>
                          </a>
                        </span>
                      </div>

                      <div className="bid-btn">
                        <a
                          href="/item-detail-one"
                          onClick={e => {
                            e.preventDefault()
                            navigate('/item-detail-one')
                          }}
                          className="btn btn-pills"
                        >
                          <i className="mdi mdi-gavel fs-5 align-middle me-1"></i>{' '}
                          Bid
                        </a>
                      </div>
                    </div>

                    <div className="card-body content position-relative">
                      <div className="img-group">
                        {/* <a
                          href="/creator-profile"
                          onClick={e => {
                            e.preventDefault()
                            navigate('/creator-profile')
                          }}
                          className="user-avatar"
                        >
                          <img
                            src={client08}
                            alt="user"
                            className="avatar avatar-sm-sm img-thumbnail border-0 shadow-md rounded-circle"
                          />
                        </a> */}
                        <a
                          href="/creator-profile"
                          onClick={e => {
                            e.preventDefault()
                            navigate('/creator-profile')
                          }}
                          className="user-avatar ms-n3"
                        >
                          <img
                            src={data?.owner?.profileImage}
                            alt="user"
                            className="avatar avatar-sm-sm img-thumbnail border-0 shadow-md rounded-circle"
                          />
                        </a>
                        {/* <a
                          href="/creator-profile"
                          onClick={e => {
                            e.preventDefault()
                            navigate('/creator-profile')
                          }}
                          className="user-avatar ms-n3"
                        >
                          <img
                            src={client06}
                            alt="user"
                            className="avatar avatar-sm-sm img-thumbnail border-0 shadow-md rounded-circle"
                          />
                        </a> */}
                      </div>

                      <div className="mt-2">
                        <a
                          href="/item-detail-one"
                          onClick={e => {
                            e.preventDefault()
                            navigate('/item-detail-one')
                          }}
                          className="title text-dark h6"
                        >
                          {data?.title}
                        </a>

                        <div className="d-flex justify-content-between mt-2">
                          <small className="rate fw-bold">20.5 ETH</small>
                          <small className="text-dark fw-bold">
                            1 out of 10
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            {/*end col*/}
          </div>
          {/*end row*/}

          <div className="row justify-content-center">
            <div className="col">
              <div className="text-center d-block d-md-none mt-4">
                <a
                  href="/explore-one"
                  onClick={e => {
                    e.preventDefault()
                    navigate('/explore-one')
                  }}
                  className="btn btn-link primary text-dark"
                >
                  See More <i className="uil uil-arrow-right"></i>
                </a>
              </div>
            </div>
            {/*end col*/}
          </div>
          {/*end row*/}
        </div>
        {/*end container*/}

        <div className="container mt-100 mt-60">
          <div className="row">
            <div className="col-12">
              <div className="section-title">
                <h4 className="title mb-2">Best Creators & Sellers</h4>
                <p className="text-muted mb-0">
                  Best sellers of this week
                </p>
              </div>
            </div>
            {/*end col*/}
          </div>
          {/*end row*/}
          <div className="row">
            {creators && creators?.map((data, index) => {
              return (
                <div className="col-lg-3 col-md-4 mt-5" key={index}>
                  <div className="creators creator-primary d-flex align-items-center">
                    <span className="fw-bold text-muted">
                      {index < 10 ? `0${index}.` : `${index}.`}
                    </span>

                    <div className="d-flex align-items-center ms-3">
                      <div className="position-relative d-inline-flex">
                        <img
                          src={data?.profileImage}
                          className="avatar avatar-md-sm shadow-md rounded-pill"
                          alt=""
                        />
                        {data?.profileIcon && (
                          <>
                            <span className="verified text-primary">
                              <i className="mdi mdi-check-decagram"></i>
                            </span>
                            <span className="online text-success">
                              <i className="mdi mdi-circle"></i>
                            </span>
                          </>
                        )}
                      </div>

                      <div className="ms-3">
                        <h6 className="mb-0">
                          <a
                            href="/creators"
                            onClick={e => {
                              e.preventDefault()
                              navigate('/creators')
                            }}
                            className="text-dark name"
                          >
                            {data?.name}
                          </a>
                        </h6>
                        <small className="text-muted">{splitWalletAddress(data?.walletAddress)}</small>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            {/*end col*/}
            {/*end row*/}
          </div>
        </div>
        {/*end container*/}

        <div className="container mt-100 mt-60">
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="section-title text-center mb-4 pb-2">
                <h4 className="title mb-2">Most Popular Collections</h4>
                <p className="text-muted mb-0">
                  Best NFT collections of this week
                </p>
              </div>
            </div>
            {/*end col*/}
          </div>
          {/*end row*/}

          <div className="row">
            <div className="col">
              <div className="tiny-three-item-nav-arrow">
                {collections && collections?.map((data, index) => {
                  return (<div className="tiny-slide" key={index}>
                    <div className="card bg-white collections collection-primary rounded-md shadow p-2 pb-0 m-1">
                      <div className="row g-2">
                        <div className="col-12">
                          <img
                            src={data?.collectionImage}
                            className="img-fluid shadow-sm rounded-md"
                            alt=""
                            style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                          />
                        </div>
                        {/*end col*/}
                      </div>
                      {/*end row*/}

                      <div className="content text-center p-4 mt-n5">
                        <div className="position-relative d-inline-flex">
                          <img
                            src={data?.owner?.profileImage}
                            className="avatar avatar-small rounded-pill img-thumbnail shadow-md"
                            alt=""
                          />
                          <span className="verified text-primary">
                            <i className="mdi mdi-check-decagram"></i>
                          </span>
                        </div>

                        <div className="mt-2">
                          <a
                            href={`/collection/${data?.collectionAddress}`}
                            onClick={e => {
                              e.preventDefault()
                              navigate(`/collection/${data?.collectionAddress}`)
                            }}
                            className="text-dark title h5"
                          >
                            {data?.name}
                          </a>
                          {/* <p className="text-muted mb-0 small">27 Items</p> */}
                        </div>
                      </div>
                    </div>
                  </div>)
                })}
              </div>

              {/*end slide*/}
            </div>
          </div>
          {/*end row*/}
        </div>
        {/*end container*/}
      </section>
      {/*end section*/}
      {/* End Home */}
    </Main>
  )
}

export default DarkVersionTwo
