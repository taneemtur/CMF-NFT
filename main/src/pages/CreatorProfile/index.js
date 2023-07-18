import { useState, useCallback, useEffect, useMemo, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiCamera } from 'react-icons/fi'
import {
  client01, client02, client03, client04, client05, client06, client08,
  client10, client12, client13,
  gif1, gif2, gif3, gif4, gif5, gif6,
  item1, item2, item3, item4, item5, item6, item7, item8, item9, item10,
  single, ofcDesk, prodToCard,
} from '../../components/imageImport'

import axiosConfig from '../../axiosConfig'
import { useSelector } from 'react-redux'
import Main from '../../Layouts/Main'
import { splitWalletAddress } from '../../utils'
import NftCard from '../../components/NftCard'
import NftCardAuction from '../../components/NftCardAuction'
import { getChainByName } from '../../blockchain/supportedChains'
import Countdown from 'react-countdown'
import { claimNFT, claimReward } from '../../blockchain/mintContracts'
import { toast } from 'react-toastify'



const CreateProfile = () => {
  const navigate = useNavigate()
  const { user, account } = useSelector(state => state.theme);
  const [loading, setLoading] = useState(false)
  const [collections, setCollections] = useState([]);
  const [userOnSale, setUserOnSale] = useState([]);
  const [userFollowers, setUserFollowers] = useState([]);
  const [userLikedNFTs, setUserLikedNFTs] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [userActivities, setUserActivities] = useState([]);
  const [userClaimNFTs, setUserClaimNFTs] = useState([]);

  useEffect(() => {
    if (!account) {
      navigate('/')
    }
  }, [account, navigate])


  const loadFile = async function (event, banner = false) {
    var image = document.getElementById(event.target.name)
    image.src = URL.createObjectURL(event.target.files[0])
    const data = new FormData();
    data.append("file", event.target.files[0]);
    const endpoint = banner ? "/profile/uploadbannerimage" : "/profile/uploadprofileimage"
    await axiosConfig.post(`${endpoint}/${account}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const getUserCollection = async () => {
    await axiosConfig.get(`/collections/user/${account}`).then((res) => {
      setCollections(res.data.data)
      console.log(res.data.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  const getUserNFTs = async () => {
    await axiosConfig.get(`/nfts/getnfts/${account}`).then((res) => {
      setNfts(res.data.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  const getUserActivities = async () => {
    await axiosConfig.get(`/activity/useractivity/${account}`).then((res) => {
      setUserActivities(res.data.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  const getUserOnSale = async () => {
    await axiosConfig.get(`/nfts/getlistednfts/${account}`).then((res) => {
      setUserOnSale(res.data.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  const getUserFollwers = async () => {
    await axiosConfig.get(`/profile/getfollowedusers/${account}`).then((res) => {
      setUserFollowers(res.data.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  const getUserLikedNFTs = async () => {
    await axiosConfig.get(`/profile/getlikednfts/${account}`).then((res) => {
      setUserLikedNFTs(res.data.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  const getUserClaimNFTs = async () => {
    await axiosConfig.get(`/profile/getclaimnfts/${account}`).then((res) => {
      console.log(res.data.data)
      setUserClaimNFTs(res.data.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  const claimreward = async (auctionListingId, nftAddress, chainId, ownerUser = 0) => {
    const id = toast.loading('Claiming NFT Reward');
    try {
      await claimReward(auctionListingId, chainId, account)
      await axiosConfig.put(`/profile/updatebidnft/${nftAddress}`, {claimReward: true})
      if(ownerUser){
        toast.update(id, {
          render: `NFT Claimed`, closeOnClick: true, type: 'success', isLoading: false, closeButton: true
        })
      }else{
        toast.update(id, {
          render: `Reward Claimed`, closeOnClick: true, type: 'success', isLoading: false, closeButton: true
        })
      }
      
      getUserNFTs()
      getUserClaimNFTs()
      getUserOnSale()
    } catch (error) {
      toast.update(id, {
        render: `${error.message}`, closeOnClick: true, type: 'error', isLoading: false, closeButton: true
      })
    }
  }

  const claimnft = async (auctionListingId, nftAddress, chainId) => {
    const id = toast.loading('Claiming NFT');
    try {
      await claimNFT(auctionListingId, chainId, account)
      await axiosConfig.put(`/profile/updatebidnft/${nftAddress}`, {claimNFT: true})
      await axiosConfig.put(`/nfts/updatenftowner`, { nftAddress, owner: account });
      await axiosConfig.put(`/nfts/unlistnft`, { nftAddress })
      toast.update(id, {
        render: `NFT Claimed`, closeOnClick: true, type: 'success', isLoading: false, closeButton: true
      })
      getUserNFTs()
      getUserClaimNFTs()
      getUserOnSale()
    } catch (error) {
      toast.update(id, {
        render: `${error.message}`, closeOnClick: true, type: 'error', isLoading: false, closeButton: true
      })
    }
  }

  const cancelListing = async (nftAddress) => {
    await axiosConfig.put("/nfts/unlistnft", {nftAddress})
  }

  useEffect(() => {
    if (account) {
      getUserNFTs()
      getUserActivities();
      getUserCollection();
      getUserOnSale();
      getUserFollwers();
      getUserLikedNFTs();
      getUserClaimNFTs();
    }
    return () => {
      // cleanup
      setNfts([])
      setUserActivities([])
      setCollections([])
      setUserOnSale([])
      setUserFollowers([])
      setUserLikedNFTs([])
      setUserClaimNFTs([])
    }
  }, [account])


  if (!account) {
    return <></>
  }

  return (
    <Main>
      {/* Start Home */}
      <section className="bg-creator-profile">
        <div className="container">
          <div className="profile-banner">
            <input
              id="pro-banner"
              name="profile-banner"
              type="file"
              className="d-none"
              onChange={e => loadFile(e, true)}
            />
            <div className="position-relative d-inline-block">
              <img
                src={user?.bannerImage || single}
                className="rounded-md shadow-sm img-fluid"
                id="profile-banner"
                alt=""
              />
              <label
                className="icons position-absolute bottom-0 end-0"
                htmlFor="pro-banner"
              >
                <span className="btn btn-icon btn-sm btn-pills btn-primary">
                  <FiCamera className="icons" />
                </span>
              </label>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col">
              <div className="text-center mt-n80">
                <div className="profile-pic">
                  <input
                    id="pro-img"
                    name="profile-image"
                    type="file"
                    className="d-none"
                    onChange={e => loadFile(e)}
                  />
                  <div className="position-relative d-inline-block">
                    <img
                      src={user?.profileImage || client01}
                      className="avatar avatar-medium img-thumbnail rounded-pill shadow-sm"
                      id="profile-image"
                      alt=""
                    />
                    <label
                      className="icons position-absolute bottom-0 end-0"
                      htmlFor="pro-img"
                    >
                      <span className="btn btn-icon btn-sm btn-pills btn-primary">
                        <FiCamera className="icons" />
                      </span>
                    </label>
                  </div>
                </div>

                <div className="content mt-3">
                  <h5 className="mb-3">{user?.name}</h5>
                  <small className="text-muted px-2 py-1 rounded-lg shadow">
                    {splitWalletAddress(account)}{' '}
                    <a
                      href=""
                      onClick={async (e) => {
                        e.preventDefault()
                        try {
                          await navigator.clipboard.writeText(account);
                          console.log('Content copied to clipboard');
                        } catch (err) {
                          console.error('Failed to copy: ', err);
                        }
                      }}
                      className="text-primary h5 ms-1"
                    >
                      <i className="uil uil-copy"></i>
                    </a>
                  </small>

                  <h6 className="mt-3 mb-0">
                    {user?.bio}
                  </h6>

                  <div className="mt-4">
                    <a
                      href="/creator-profile-edit"
                      onClick={e => {
                        e.preventDefault()
                        navigate('/creator-profile-edit')
                      }}
                      className="btn btn-pills btn-outline-primary mx-1"
                    >
                      Edit Profile
                    </a>
                    <a
                      href="/upload-work"
                      onClick={e => {
                        e.preventDefault()
                        navigate('/upload-work')
                      }}
                      className="btn btn-pills btn-icon btn-outline-primary mx-1"
                    >
                      <i className="uil uil-folder-upload"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mt-100 mt-60">
          <div className="row">
            <div className="col-12">
              <ul
                className="nav nav-tabs border-bottom"
                id="myTab"
                role="tablist"
              >
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="Create-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#CreateItem"
                    type="button"
                    role="tab"
                    aria-controls="CreateItem"
                    aria-selected="true"
                  >
                    Created
                  </button>
                </li>

                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="Liked-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#Liked"
                    type="button"
                    role="tab"
                    aria-controls="Liked"
                    aria-selected="false"
                  >
                    Liked
                  </button>
                </li>

                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="Sale-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#Sale"
                    type="button"
                    role="tab"
                    aria-controls="Sale"
                    aria-selected="false"
                  >
                    On Sale
                  </button>
                </li>

                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="Collection-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#Collection"
                    type="button"
                    role="tab"
                    aria-controls="Collection"
                    aria-selected="false"
                  >
                    Collection
                  </button>
                </li>

                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="Activites-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#Activites"
                    type="button"
                    role="tab"
                    aria-controls="Activites"
                    aria-selected="false"
                  >
                    Activites
                  </button>
                </li>

                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="Followers-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#Followers"
                    type="button"
                    role="tab"
                    aria-controls="Followers"
                    aria-selected="false"
                  >
                    Followers
                  </button>
                </li>

                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="About-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#About"
                    type="button"
                    role="tab"
                    aria-controls="About"
                    aria-selected="false"
                  >
                    About
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="claim-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#claim"
                    type="button"
                    role="tab"
                    aria-controls="claim"
                    aria-selected="false"
                  >
                    Claim NFT & Rewards
                  </button>
                </li>
              </ul>

              <div className="tab-content mt-4 pt-2" id="myTabContent">
                <div
                  className="tab-pane fade show active"
                  id="CreateItem"
                  role="tabpanel"
                  aria-labelledby="Create-tab"
                >
                  {/* if value select created */}
                  <div className="row row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-1 g-4">
                    {nfts && nfts?.map((nft, index) => (
                      <NftCard nft={nft} index={index} />
                    ))}
                  </div>
                </div>
                {/* if value select like */}
                <div
                  className="tab-pane fade"
                  id="Liked"
                  role="tabpanel"
                  aria-labelledby="Liked-tab"
                >
                  <div className="row row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-1 g-4">
                    {userLikedNFTs && userLikedNFTs?.map((data, index) => (
                      <div className="col" key={index}>
                        <NftCard nft={data} key={index} />
                      </div>
                    ))}
                  </div>
                  {/* end row */}
                </div>
                {/* if value select on sale */}
                <div
                  className="tab-pane fade"
                  id="Sale"
                  role="tabpanel"
                  aria-labelledby="Sale-tab"
                >
                  <div className="row row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-1 g-4">
                    {userOnSale && userOnSale?.map((data, index) => (
                      <div className="col" key={index}>
                        <NftCard nft={data} key={index} />
                      </div>
                    ))}
                  </div>
                  {/*end row*/}
                </div>
                {/* if value select collection */}
                <div
                  className="tab-pane fade "
                  id="Collection"
                  role="tabpanel"
                  aria-labelledby="Collection-tab"
                >
                  <div className="row">
                    {collections != [] && collections.map((collection, index) => (
                      <div className="col-lg-3 col-md-3 mt-5" key={index}>
                        <div className="card collections collection-primary rounded-md shadow p-2 pb-0">
                          <div className="row g-2">
                            <div className="col-12">
                              <img
                                src={collection?.collectionImage}
                                className="img-fluid shadow-sm rounded-md"
                                alt=""
                                style={{ width: '100%', height: '250px', objectFit: 'cover', }}
                              />
                            </div>
                          </div>

                          <div className="content text-center p-4 mt-n5">
                            <div className="position-relative d-inline-flex">
                              <img
                                src={collection?.owner.profileImage || client01}
                                className="avatar avatar-small rounded-pill img-thumbnail shadow-md"
                                alt=""
                              />
                            </div>
                            <div className="mt-2">
                              <a
                                href={`/collection/${collection.collectionAddress}`}
                                onClick={e => {
                                  e.preventDefault()
                                  navigate(`/collection/${collection.collectionAddress}`)
                                }}
                                className="text-dark title h5"
                              >
                                {collection?.name}
                              </a>
                              {/* <p className="text-muted mb-0 small">27 Items</p> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {/*end col*/}
                  </div>
                  {/*end row*/}
                </div>
                {/* if value select follower */}
                <div
                  className="tab-pane fade"
                  id="Followers"
                  role="tabpanel"
                  aria-labelledby="Followers-tab"
                >
                  <h5 className="mb-4">{userFollowers?.length} Followers</h5>
                  <div className="row g-4">
                    {userFollowers && userFollowers?.map(data => {
                      return (
                        <div className="col-md-6" key={data?.name}>
                          <div className="p-4 rounded-md shadow users user-primary">
                            <div className="d-flex align-items-center">
                              <div className="position-relative">
                                <img
                                  src={data?.profileImage}
                                  className="avatar avatar-md-md rounded-pill shadow-sm img-thumbnail"
                                  alt=""
                                />
                              </div>

                              <div className="content ms-3">
                                <h6 className="mb-0">
                                  <a
                                    href={`/profile/${data?.walletAddress}`}
                                    onClick={e => {
                                      e.preventDefault()
                                      navigate(`/profile/${data?.walletAddress}`)
                                    }}
                                    className="text-dark name"
                                  >
                                    {splitWalletAddress(data?.walletAddress)}
                                  </a>
                                </h6>
                                <small className="text-muted d-flex align-items-center">
                                  @{data?.name}
                                </small>
                              </div>
                            </div>
                            {/*end row */}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                {/* if value select activity */}
                <div
                  className="tab-pane fade"
                  id="Activites"
                  role="tabpanel"
                  aria-labelledby="Activites-tab"
                >
                  <div className="row g-4">
                    {userActivities && userActivities?.map(data => {
                      return (
                        <div className="col-12" key={data?.activity}>
                          <div className="card activity activity-primary rounded-md shadow p-4">
                            <div className="d-flex align-items-center">
                              <div className="position-relative">
                                <img
                                  src={data?.image}
                                  className="avatar avatar-md-md rounded-md shadow-md"
                                  alt=""
                                />

                                <div className="position-absolute top-0 start-0 translate-middle px-1 rounded-lg shadow-md bg-white">
                                  {data?.favorite === 'Started Following' ? (
                                    <i className="mdi mdi-account-check mdi-18px text-success"></i>
                                  ) : data?.favorite === 'Liked by' ? (
                                    <i className="mdi mdi-heart mdi-18px text-danger"></i>
                                  ) : (
                                    <i className="mdi mdi-format-list-bulleted mdi-18px text-warning"></i>
                                  )}
                                </div>
                                <div className="position-absolute top-0 start-0 translate-middle px-1 rounded-lg shadow-md bg-white"></div>
                                <div className="position-absolute top-0 start-0 translate-middle px-1 rounded-lg shadow-md bg-white"></div>
                              </div>

                              <span className="content ms-3">
                                <a
                                  href={`/nft/${data?.nftAddress}`}
                                  onClick={e => {
                                    e.preventDefault();
                                    navigate(`/nft/${data?.nftAddress}`)
                                  }}
                                  className="text-dark title mb-0 h6 d-block"
                                >
                                  {data?.name}
                                </a>
                                <small className="text-muted d-block mt-1">
                                  {data?.favorite}
                                  <a
                                    href=""
                                    onClick={e => e.preventDefault()}
                                    className="link fw-bold"
                                  >
                                    @{data?.price}
                                  </a>
                                </small>

                                <small className="text-muted d-block mt-1">
                                  {data?.time}
                                </small>
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                {/* if value select about */}
                <div
                  className="tab-pane fade"
                  id="About"
                  role="tabpanel"
                  aria-labelledby="About-tab"
                >
                  {
                    user?.name && (
                      <h5 className="mb-4">{user.name || "...."}</h5>
                    )
                  }

                  {
                    user?.email && (
                      <p className="text-muted mb-0">
                        {user.email || "...."}
                      </p>
                    )
                  }
                  {
                    user?.website && (
                      <p className="text-muted mb-0">
                        {user.website || "...."}
                      </p>
                    )
                  }
                  {
                    user?.twitterAccount && (
                      <p className="text-muted mb-0">
                        {user.twitterAccount || "...."}
                      </p>
                    )
                  }
                  {
                    user?.url && (
                      <p className="text-muted mb-0">
                        {user.url || "...."}
                      </p>
                    )
                  }
                  {
                    user?.bio && (
                      <p className="text-muted mb-0">
                        {user.bio || "...."}
                      </p>
                    )
                  }
                </div>
                {/* if value select claim NFT */}
                <div
                  className="tab-pane fade"
                  id="claim"
                  role="tabpanel"
                  aria-labelledby="claim-tab"
                >
                  <div className="row row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-1 g-4">
                    {userClaimNFTs && userClaimNFTs?.map((nft, index) => (
                    (new Date().getTime()) / 1000 > nft?.auctionTimeEnd && account == nft?.user && nft?.claimNFT == false && nft?.owner != nft?.user ? (
                      <div key={index} className='mt-5'>
                        <div className="card nft-items nft-primary rounded-md shadow overflow-hidden mb-1 p-3">
                          <div className="d-flex justify-content-between">
                            <div className="img-group">
                              <a
                                href={`/profile/${nft?.userData?.walletAddress}`}
                                onClick={e => {
                                  e.preventDefault()
                                  navigate(`/profile/${nft?.userData?.walletAddress}`)
                                }}
                                className="user-avatar"
                              >
                                <img
                                  src={nft?.userData?.profileImage || client08}
                                  alt="user"
                                  className="avatar avatar-sm-sm img-thumbnail border-0 shadow-sm rounded-circle"
                                />
                                <span className="title text-dark h6"> Current User</span>
                              </a>
                            </div>

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
                                src={nft?.nft?.image || client08}
                                className="img-fluid"
                                alt={nft?.nft?.name}
                                style={{ width: '100%', height: '250px', objectFit: 'cover', }}
                              />
                            </a>
                            <div
                              className={`${nft?.id ? '' : 'hide-data'
                                } position-absolute bottom-0 start-0 m-2 bg-gradient-primary text-white title-dark rounded-pill px-3`}
                            >
                              <i className="uil uil-clock"></i>{' '}
                            </div>
                    
                            {
                              nft?.nft?.type == 'auction' && (
                                <div className="position-absolute bottom-0 start-0 m-2 h5 bg-gradient-primary text-white title-dark rounded-pill px-3">
                                  <i className="uil uil-clock"></i>{' '}
                                  <Countdown
                                    date={new Date(nft?.auctionTimeEnd * 1000)}
                                    renderer={({ days, hours, minutes, seconds }) => (
                                      <span>
                                        {days}:{hours}:{minutes}:{seconds}
                                      </span>
                                    )}
                                  />
                                </div>
                              )
                            }
                    
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
                              {nft?.nft?.name}
                            </a>
                    
                            <div className="d-flex justify-content-between mt-2">
                              <small className="rate fw-bold"> Current Bid: {nft?.price} { nft?.paymentToken == 'USDT' ? nft?.paymentToken : getChainByName(nft?.blockchain) } </small>
                            </div>

                            <div className="d-flex justify-content-between mt-2">
                              <button onClick={(e)=>{
                                e.preventDefault();
                                claimnft(nft?.auctionListingId, nft?.nftAddress, nft?.blockchain);
                                cancelListing(nft?.nftAddress)
                              }} className="btn btn-l btn-pills btn-primary" >Claim NFT</button> 
                            </div>

                          </div>
                        </div>
                      </div>  
                    ) : (
                      new Date().getTime() / 1000 > nft?.auctionTimeEnd && account == nft?.owner && nft?.claimReward == false && nft?.owner != nft?.user ? (
                      <div key={index} className='mt-5'>
                        <div className="card nft-items nft-primary rounded-md shadow overflow-hidden mb-1 p-3">
                          <div className="d-flex justify-content-between">
                            <div className="img-group">
                              <a
                                href={`/profile/${nft?.userData?.walletAddress}`}
                                onClick={e => {
                                  e.preventDefault()
                                  navigate(`/profile/${nft?.userData?.walletAddress}`)
                                }}
                                className="user-avatar"
                              >
                                <img
                                  src={nft?.userData?.profileImage || client08}
                                  alt="user"
                                  className="avatar avatar-sm-sm img-thumbnail border-0 shadow-sm rounded-circle"
                                />
                                <span className="title text-dark h6"> Current User</span>
                              </a>
                            </div>

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
                                src={nft?.nft?.image || client08}
                                className="img-fluid"
                                alt={nft?.nft?.name}
                                style={{ width: '100%', height: '250px', objectFit: 'cover', }}
                              />
                            </a>
                            <div
                              className={`${nft?.id ? '' : 'hide-data'
                                } position-absolute bottom-0 start-0 m-2 bg-gradient-primary text-white title-dark rounded-pill px-3`}
                            >
                              <i className="uil uil-clock"></i>{' '}
                            </div>
                    
                            {
                              nft?.nft?.type == 'auction' && (
                                <div className="position-absolute bottom-0 start-0 m-2 h5 bg-gradient-primary text-white title-dark rounded-pill px-3">
                                  <i className="uil uil-clock"></i>{' '}
                                  <Countdown
                                    date={nft?.auctionTimeEnd}
                                    renderer={({ days, hours, minutes, seconds }) => (
                                      <span>
                                        {days}:{hours}:{minutes}:{seconds}
                                      </span>
                                    )}
                                  />
                                </div>
                              )
                            }
                    
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
                              {nft?.nft?.name}
                            </a>
                    
                            <div className="d-flex justify-content-between mt-2">
                              <small className="rate fw-bold"> Current Bid: {nft?.price} { nft?.paymentToken == 'USDT' ? nft?.paymentToken : getChainByName(nft?.blockchain) } </small>
                            </div>

                            <div className="d-flex justify-content-between mt-2">
                              <button onClick={(e)=>{
                                e.preventDefault();
                                claimreward(nft?.auctionListingId, nft?.nftAddress, nft?.blockchain);
                              }} className="btn btn-l btn-pills btn-primary">Claim Reward</button> 
                            </div>

                          </div>
                        </div>
                      </div>
                      ) : (
                      new Date().getTime() / 1000 > nft?.auctionTimeEnd && account == nft?.owner && nft?.owner == nft?.user && nft?.claimReward == false && (
                      <div key={index} className='mt-5'>
                        <div className="card nft-items nft-primary rounded-md shadow overflow-hidden mb-1 p-3">
                          <div className="d-flex justify-content-between">
                            <div className="img-group">
                              <a
                                href={`/profile/${nft?.userData?.walletAddress}`}
                                onClick={e => {
                                  e.preventDefault()
                                  navigate(`/profile/${nft?.userData?.walletAddress}`)
                                }}
                                className="user-avatar"
                              >
                                <img
                                  src={nft?.userData?.profileImage || client08}
                                  alt="user"
                                  className="avatar avatar-sm-sm img-thumbnail border-0 shadow-sm rounded-circle"
                                />
                                <span className="title text-dark h6"> Current User</span>
                              </a>
                            </div>

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
                                src={nft?.nft?.image || client08}
                                className="img-fluid"
                                alt={nft?.nft?.name}
                                style={{ width: '100%', height: '250px', objectFit: 'cover', }}
                              />
                            </a>
                            <div
                              className={`${nft?.id ? '' : 'hide-data'
                                } position-absolute bottom-0 start-0 m-2 bg-gradient-primary text-white title-dark rounded-pill px-3`}
                            >
                              <i className="uil uil-clock"></i>{' '}
                            </div>
                    
                            {
                              nft?.nft?.type == 'auction' && (
                                <div className="position-absolute bottom-0 start-0 m-2 h5 bg-gradient-primary text-white title-dark rounded-pill px-3">
                                  <i className="uil uil-clock"></i>{' '}
                                  <Countdown
                                    date={nft?.auctionTimeEnd}
                                    renderer={({ days, hours, minutes, seconds }) => (
                                      <span>
                                        {days}:{hours}:{minutes}:{seconds}
                                      </span>
                                    )}
                                  />
                                </div>
                              )
                            }
                    
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
                              {nft?.nft?.name}
                            </a>
                    
                            <div className="d-flex justify-content-between mt-2">
                              <small className="rate fw-bold"> Current Bid: {nft?.price} { nft?.paymentToken == 'USDT' ? nft?.paymentToken : getChainByName(nft?.blockchain) } </small>
                            </div>

                            <div className="d-flex justify-content-between mt-2">
                              <button onClick={(e)=>{
                                e.preventDefault();
                                claimreward(nft?.auctionListingId, nft?.nftAddress, nft?.blockchain, 1);
                                cancelListing(nft?.nftAddress);
                              }} className="btn btn-l btn-pills btn-primary" >Claim NFT</button> 
                            </div>

                          </div>
                        </div>
                      </div>
                        )
                      )
                    )
                    ))}
                  </div>

                </div>
              </div>
            </div>
            {/*end col*/}
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

export default CreateProfile
