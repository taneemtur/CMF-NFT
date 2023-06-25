import { useState, useCallback, useEffect, useMemo, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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



const UserProfile = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [collections, setCollections] = useState([]);
  const [userOnSale, setUserOnSale] = useState([]);
  const [userFollowers, setUserFollowers] = useState([]);
  const [userLikedNFTs, setUserLikedNFTs] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [user, setUser] = useState([]);
  const [userActivities, setUserActivities] = useState([]);
  const { walletAddress } = useParams();


  const activityData = [
    {
      title: 'THE SECRET SOCIETY XX #775',
      author: 'CalvinCarlo',
      time: '23 hours ago',
      favorite: 'Listed by',
      image: gif5,
    },
    {
      title: 'Create Your Own World',
      author: 'ButterFly',
      time: '24 hours ago',
      favorite: 'Liked by',
      image: item5,
    },
  ]

  const getUserData = async function () {
    await axiosConfig.get(`/profile/user/${walletAddress}`).then((res)=>{
        setUser(res.data.data)
    })
  }

  const getUserCollection = async () => {
    await axiosConfig.get(`/collections/user/${walletAddress}`).then((res) => {
      setCollections(res.data.data)
      console.log(res.data.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  const getUserNFTs = async () => {
    await axiosConfig.get(`/nfts/getnfts/${walletAddress}`).then((res) => {
      setNfts(res.data.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  const getUserActivities = async () => {
    await axiosConfig.get(`/activity/useractivity/${walletAddress}`).then((res) => {
      console.log(res.data.data)
      setUserActivities(res.data.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  const getUserOnSale = async () => {
    await axiosConfig.get(`/nfts/getlistednfts/${walletAddress}`).then((res) => {
      setUserOnSale(res.data.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  const getUserFollwers = async () => {
    await axiosConfig.get(`/profile/getfollowedusers/${walletAddress}`).then((res) => {
      setUserFollowers(res.data.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  const getUserLikedNFTs = async () => {
    await axiosConfig.get(`/profile/getlikednfts/${walletAddress}`).then((res) => {
      setUserLikedNFTs(res.data.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  useEffect(() => {
    if (walletAddress) {
      getUserNFTs();
    }
    return () => {
      // cleanup
      setNfts([])
    }
  }, [walletAddress])

  useEffect(() => {
    if (walletAddress) {
      getUserData();
      getUserActivities();
      getUserCollection();
      getUserOnSale();
      getUserFollwers();
      getUserLikedNFTs();
    }
    return () => {
      // cleanup
      setUserActivities([])
      setCollections([])
      setUserOnSale([])
      setUserFollowers([])
      setUserLikedNFTs([])
      setUser([])
    }
  }, [walletAddress])


  if (!walletAddress) {
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
                  </div>
                </div>

                <div className="content mt-3">
                  <h5 className="mb-3">{user?.name}</h5>
                  <small className="text-muted px-2 py-1 rounded-lg shadow">
                    {splitWalletAddress(walletAddress)}{' '}
                    <a
                      href=""
                      onClick={async (e) => {
                        e.preventDefault()
                        try {
                          await navigator.clipboard.writeText(walletAddress);
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
                                src={collection?.owner.profileImage}
                                className="avatar avatar-small rounded-pill img-thumbnail shadow-md"
                                alt=""
                              />
                              <span className="verified text-primary">
                                <i className="mdi mdi-check-decagram"></i>
                              </span>
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
                              <p className="text-muted mb-0 small">27 Items</p>
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
                    {activityData && activityData?.map(data => {
                      return (
                        <div className="col-12" key={data?.title}>
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
                                  href=""
                                  onClick={e => e.preventDefault()}
                                  className="text-dark title mb-0 h6 d-block"
                                >
                                  {data?.title}
                                </a>
                                <small className="text-muted d-block mt-1">
                                  {data?.favorite}
                                  <a
                                    href=""
                                    onClick={e => e.preventDefault()}
                                    className="link fw-bold"
                                  >
                                    @{data?.author}
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

export default UserProfile
