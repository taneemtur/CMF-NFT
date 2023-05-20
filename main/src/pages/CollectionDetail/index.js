import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'
import {
  bg01,
  item1,
  item2,
  item3,
  item4,
  item5,
  item6,
  item7,
  item8,
  item9,
  item10,
  gif1,
  gif2,
  gif3,
  gif4,
  gif5,
  gif6,
  cta,
  client05,
  client06,
  client08,
  client01,
  single,
} from '../../components/imageImport'
import axiosConfig from '../../axiosConfig'
import { useSelector } from 'react-redux'
import Main from '../../Layouts/Main'
import { getChainByName } from '../../blockchain/supportedChains'
import { toast } from 'react-toastify'



const CollectionDetail = () => {
  const navigate = useNavigate()
  const { user, account } = useSelector(state => state.theme)
  const [collection, setCollection] = useState(null);
  const [nfts, setNfts] = useState(null);
  const { collectionAddress } = useParams();


  const AuctionData = [
    {
      image: gif1,
      title: 'Deep Sea Phantasy',
      id: 'May 29, 2022 6:0:0',
      type: 'GIFs',
    },
    {
      image: item1,
      title: 'CyberPrimal 042 LAN',
      id: '',
      type: 'Arts',
    },
    {
      image: gif2,
      title: 'Crypto Egg Stamp #5',
      id: '',
      type: 'Games',
    },
    {
      image: item2,
      title: 'Colorful Abstract Painting',
      id: 'June 03, 2022 5:3:1',
      type: '',
    },
    {
      image: item3,
      title: 'Liquid Forest Princess',
      id: '',
      type: '',
    },
    {
      image: gif3,
      title: 'Spider Eyes Modern Art',
      id: 'June 10, 2022 1:0:1',
      type: 'GIFs',
    },
    {
      image: item4,
      title: 'Synthwave Painting',
      id: '',
      type: '',
    },
    {
      image: gif4,
      title: 'Contemporary Abstract',
      id: '',
      type: 'GIFs',
    },
    {
      image: item5,
      title: 'Valkyrie Abstract Art',
      id: '',
      type: '',
    },
    {
      image: gif5,
      title: 'The girl with the firefly',
      id: '',
      type: '',
    },
    {
      image: item6,
      title: 'Dodo hide the seek',
      id: '',
      type: '',
    },
    {
      image: gif6,
      title: 'Pinky Ocean',
      id: 'June 10, 2022 1:0:1',
      type: '',
    },
    {
      image: item7,
      title: 'Rainbow Style',
      id: 'June 18, 2022 1:2:1',
      type: 'Music',
    },
    {
      image: item8,
      title: 'Running Puppets',
      id: '',
      type: 'Gallery',
    },
    {
      image: item9,
      title: 'Loop Donut',
      id: 'July 01, 2022 1:6:6',
      type: 'Video',
    },
    {
      image: item10,
      title: 'This is Our Story',
      id: 'July 15, 2022 2:5:5',
      type: '',
    },
  ]

  const getCollectionData = async () => {
    await axiosConfig.get(`collections/${collectionAddress}`).then((res) => {
      setCollection(res.data.data)
    })
  }

  const getCollectionNfts = async () => {
    await axiosConfig.get(`nfts/getcollectionnfts/${collectionAddress}`).then((res) => {
      console.log(res.data)
      setNfts(res.data.data)
    })
  }

  useEffect(() => {
    if (collectionAddress) {
      getCollectionData();
      getCollectionNfts();
    }

    return () => {
      setCollection(null);
      setNfts([]);
    }
  }, [collectionAddress])

  return (
    <Main>
      {/* collection banner and name section */}
      <section className='bg-creator-profile'>
        <div className="container">
          {/* this is collection banner image */}
          <div className="profile-banner">
            <div className="position-relative d-inline-block">
              <img
                src={collection?.collectionImage || single}
                className="rounded-md shadow-sm img-fluid"
                id="profile-banner"
                alt=""
              />
              <label
                className="icons position-absolute bottom-0 end-0"
                htmlFor="pro-banner"
              >
              </label>
            </div>
          </div>
          {/* collection banner image end */}
          <div className="row justify-content-center">
            <div className="col">
              <div className="text-left mt-n80 ">
                {/* collection logo image */}
                <div className="profile-pic">
                  <div className="position-relative d-inline-block">
                    <img
                      src={collection?.collectionImage || client01}
                      className="avatar avatar-medium img-thumbnail rounded-pill shadow-sm"
                      id="profile-image"
                      alt=""
                    />
                    <label
                      className="icons position-absolute bottom-0 end-0"
                      htmlFor="pro-img"
                    >
                    </label>
                  </div>
                </div>
                {/* collection logo image */}
                {/* collection name and details */}
                <div className="content mt-3">
                  <h5 className="m-2"> {collection?.name} </h5>
                  <div className='row align-items-baseline '>
                    <div className='col-lg-9 col-md-9 col-sm-12 d-lg-flex d-sm-block d-md-flex' >
                      <p className='m-2'> Owner:  {collection?.owner.walletAddress} </p>
                      <p className='m-2'> Chain: {collection?.blockchain} </p>
                      <p className='m-2'> Category: {collection?.category.name} </p>
                    </div>
                    {/* edit and delete button for owner only */}
                    {
                      collection?.owner.walletAddress == account && (
                        <div className='col-lg-3 col-md-3 col-sm-12 text-center'>
                        <a
                          href="/upload-work"
                          onClick={e => {
                            e.preventDefault()
                            navigate('/upload-work', {
                              state: {
                                collection
                              }
                            })
                          }}
                          className="btn btn-pills btn-outline-primary mx-1"
                        >
                          Edit Collection
                        </a>
                        <a
                          href="/upload-work"
                          onClick={async (e) => {
                            e.preventDefault()
                            const id = toast.loading('Collection Deleteing');
                            // navigate('/upload-work')
                            await axiosConfig.delete(`/collections/${collection.collectionAddress}`)
                            .then(res => {
                              toast.update(id, {
                                render: `${res.data.message}`, closeOnClick: true, type: 'success', isLoading: false, closeButton: true, onClick: ()=>navigate(`/creator-profile`)
                              })
                              navigate(`/creator-profile`)
                            }).catch(err => {
                              console.log(err)
                            })
                          }}
                          className="btn btn-pills btn-icon btn-outline-primary mx-1"
                        >
                          <i className="uil uil-trash"></i>
                        </a>
                        </div>
                      )
                    }
                    {/* edit and delete button for owner only */}
                  </div>
                  <h6 className='m-2'> {collection?.description} </h6>
                </div>
                {/* collection name and details */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* collection banner and name section */}

      {/* collection nfts section */}
      <section className="section">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className="sticky-bar">
                <h5 className="mb-0">NFT Filters</h5>
                <div className="p-4 rounded-md shadow mt-4">
                  <div>
                    <h6>Orders By:</h6>
                    <form>
                      <div className="form-check align-items-center d-flex mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="NewOrder"
                        />
                        <label
                          className="form-check-label fw-bold ms-2"
                          htmlFor="NewOrder"
                        >
                          Newest
                        </label>
                      </div>
                      <div className="form-check align-items-center d-flex mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="TrendOrder"
                        />
                        <label
                          className="form-check-label fw-bold ms-2"
                          htmlFor="TrendOrder"
                        >
                          Trending
                        </label>
                      </div>
                      <div className="form-check align-items-center d-flex mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="OldOrder"
                        />
                        <label
                          className="form-check-label fw-bold ms-2"
                          htmlFor="OldOrder"
                        >
                          Oldest
                        </label>
                      </div>
                    </form>
                  </div>

                  <div className="mt-4">
                    <h6>Catagories By:</h6>
                    <form>
                      <div className="form-check align-items-center d-flex mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="GamesCatagory"
                        />
                        <label
                          className="form-check-label fw-bold ms-2"
                          htmlFor="GamesCatagory"
                        >
                          Games
                        </label>
                      </div>
                      <div className="form-check align-items-center d-flex mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="ArtCatagory"
                        />
                        <label
                          className="form-check-label fw-bold ms-2"
                          htmlFor="ArtCatagory"
                        >
                          Art
                        </label>
                      </div>
                      <div className="form-check align-items-center d-flex mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="MusicCatagory"
                        />
                        <label
                          className="form-check-label fw-bold ms-2"
                          htmlFor="MusicCatagory"
                        >
                          Music
                        </label>
                      </div>
                      <div className="form-check align-items-center d-flex mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="VideoCatagory"
                        />
                        <label
                          className="form-check-label fw-bold ms-2"
                          htmlFor="VideoCatagory"
                        >
                          Video
                        </label>
                      </div>
                      <div className="form-check align-items-center d-flex mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="MemesCatagory"
                        />
                        <label
                          className="form-check-label fw-bold ms-2"
                          htmlFor="MemesCatagory"
                        >
                          Memes
                        </label>
                      </div>
                      <div className="form-check align-items-center d-flex mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="IllustrationCatagory"
                        />
                        <label
                          className="form-check-label fw-bold ms-2"
                          htmlFor="IllustrationCatagory"
                        >
                          Illustration
                        </label>
                      </div>
                      <div className="form-check align-items-center d-flex mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="GIFsCatagory"
                        />
                        <label
                          className="form-check-label fw-bold ms-2"
                          htmlFor="GIFsCatagory"
                        >
                          GIFs
                        </label>
                      </div>
                    </form>
                  </div>

                  <div className="mt-4">
                    <h6>Creators By:</h6>
                    <form>
                      <div className="form-check align-items-center d-flex mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="AllCreators"
                        />
                        <label
                          className="form-check-label fw-bold ms-2"
                          htmlFor="AllCreators"
                        >
                          All Creators
                        </label>
                      </div>
                      <div className="form-check align-items-center d-flex mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="VerifyCreators"
                        />
                        <label
                          className="form-check-label fw-bold ms-2"
                          htmlFor="VerifyCreators"
                        >
                          Verified Creators
                        </label>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            {/*end col*/}

            <div className="col-lg-9 col-md-6 mt-4 mt-sm-0 pt-2 pt-sm-0">
              <div className="row row-cols-xl-3 row-cols-lg-2 row-cols-1">
                {nfts && nfts?.map((nft, index) => {
                  return (
                    <div
                      className={index < 3 ? 'col' : 'col pt-2 mt-4'}
                      key={index}
                    >
                      <div className="card nft-items nft-primary rounded-md shadow overflow-hidden mb-1 p-3">
                        <div className="d-flex justify-content-between">
                          <div className="img-group">
                            <a
                              href="/creator-profile"
                              onClick={e => {
                                e.preventDefault()
                                navigate('/creator-profile')
                              }}
                              className="user-avatar"
                            >
                              <img
                                src={nft?.owner?.profileImage || client08}
                                alt="user"
                                className="avatar avatar-sm-sm img-thumbnail border-0 shadow-sm rounded-circle"
                              />
                            </a>
                          </div>

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

                        <div className="nft-image rounded-md mt-3 position-relative overflow-hidden">
                          <a
                            href={`/nft/${nft?.nftAddress}`}
                            onClick={e => {
                              e.preventDefault()
                              navigate(`/nft/${nft?.nftAddress}`)
                            }}
                          >
                            <img
                              src={nft?.image}
                              className="img-fluid"
                              alt={nft?.name}
                            />
                          </a>
                          {nft?.collection?.category && (
                            <div className="position-absolute top-0 start-0 m-2">
                              <a
                                href=""
                                onClick={e => e.preventDefault()}
                                className="badge badge-link bg-primary"
                              >
                                {nft?.collection?.category?.name}
                              </a>
                            </div>
                          )}
                          <div
                            className={`${nft?.id ? '' : 'hide-data'
                              } position-absolute bottom-0 start-0 m-2 bg-gradient-primary text-white title-dark rounded-pill px-3`}
                          >
                            <i className="uil uil-clock"></i>{' '}
                          </div>
                        </div>

                        <div className="card-body content position-relative p-0 mt-3">
                          <a
                            href={`/nft/${nft?.nftAddress}`}
                            onClick={e => {
                              e.preventDefault()
                              navigate(`/nft/${nft?.nftAddress}`)
                            }}
                            className="title text-dark h6"
                          >
                            {nft?.name}
                          </a>

                          <div className="d-flex justify-content-between mt-2">
                            <small className="rate fw-bold">{nft?.price} {getChainByName(nft?.blockchain)} </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                {/*end col*/}
              </div>
              {/*end row*/}

              <div className="row justify-content-center mt-4">
                <div className="col">
                  <div className="text-center">
                    <a
                      href=""
                      onClick={e => e.preventDefault()}
                      className="btn btn-primary rounded-md"
                    >
                      <i className="uil uil-process mdi-spin me-1"></i> Load
                      More
                    </a>
                  </div>
                </div>
                {/*end col*/}
              </div>
              {/*end row*/}
            </div>
            {/*end col*/}
          </div>
          {/*end row*/}
        </div>
        {/*end container*/}
      </section>
      {/* collection nfts section */}
    </Main>
  )
}

export default CollectionDetail
