import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axiosconfig from '../../axiosConfig'
import Countdown from 'react-countdown'
import { client01, client02, client03, client08, client09, client10, item1, item2, gif1, gif2, itemDetail1 } from '../../components/imageImport'
import Main from '../../Layouts/Main'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import NFTListModel from '../../components/NFTListModel'
import NftBidModal from '../../components/NftBidModal'
import { splitWalletAddress } from '../../utils'
import { getChainByName } from '../../blockchain/supportedChains'
import { approveUSDT, buyNFT, listingCancel } from '../../blockchain/mintContracts'
import { NFT_ACTIVITIES, USER_ACTIVITIES } from '../../activities'


const ItemDetailOne = () => {
  const navigate = useNavigate();
  const { account } = useSelector(state => state.theme)
  const { nftAddress } = useParams();
  const [nft, setNft] = useState(null);
  const [showListModal, setShowListModal] = useState(false);
  const [nftActivity, setNftActivity] = useState(null);

  const getNftData = async () => {
    await axiosconfig.get(`/nfts/nft/${nftAddress}`).then((res) => {
      setNft(res.data.data)
    })
  }

  async function cancel() {
    const id = toast.loading('Cancel Listing...');
    try {
      if(nft?.type == 'auction'){
        await listingCancel(parseInt(nft?.auctionListingId), nft?.blockchain, account);
      }else{
        await listingCancel(parseInt(nft?.fixedListingId), nft?.blockchain, account);
      }
      const res = await axiosconfig.put(`/nfts/unlistnft`, { nftAddress })
      await axiosconfig.post("/activity/useractivity", {
        // userId, activityName, activityData
        userId: account,
        activityName: USER_ACTIVITIES.CANCEL_LISTING,
        activityData: {
          ...res.data.data,
          unlistedAt: new Date()
        }
      })
      await axiosconfig.post("/activity/nftactivity", {
        nftId: res.data.data.nftAddress,
        activityData: {
          activity: NFT_ACTIVITIES.CANCEL_LISTING,
          canceledAt: new Date(),
          ...res.data.data
        }
      })
      toast.update(id, { render: `${res.data.message}`, closeOnClick: true, type: 'success', isLoading: false, closeButton: true, autoClose: 5000 })
    } catch (error) {
      toast.update(id, { render: `${error.message}`, closeOnClick: true, type: 'error', isLoading: false, closeButton: true, autoClose: 5000 })
    }
    getNftData()
  }

  async function buy() {
    const id = toast.loading('Buying NFT...');
    try {
      nft?.paymentToken == 'USDT' ? await approveUSDT(account, nft?.blockchain, nft?.price) : '';
      await buyNFT(nft?.fixedListingId, nft?.price, nft?.blockchain, account)
      const res = await axiosconfig.put(`/nfts/updatenftowner`, { nftAddress, owner: account });
      await axiosconfig.post("/activity/useractivity", {
        // userId, activityName, activityData
        userId: account,
        activityName: USER_ACTIVITIES.BUY_NFT,
        activityData: {
          ...res.data.data,
          buyAt: new Date()
        }
      })
      await axiosconfig.post("/activity/nftactivity", {
        nftId: res.data.data.nftAddress,
        activityData: {
          activity: NFT_ACTIVITIES.SELL_NFT,
          soldAt: new Date(),
          ...res.data.data
        }
      })
      await axiosconfig.post("/activity/useractivity", {
        // userId, activityName, activityData
        userId: nft?.owner.walletAddress,
        activityName: USER_ACTIVITIES.SELL_NFT,
        activityData: {
          ...res.data.data,
          sellAt: new Date()
        }
      })
      await axiosconfig.put(`/nfts/unlistnft`, { nftAddress });
      toast.update(id, { render: `NFT Bought`, closeOnClick: true, type: 'success', isLoading: false, closeButton: true, autoClose: 5000 })
    } catch (error) {
      toast.update(id, { render: `${error.message}`, closeOnClick: true, type: 'error', isLoading: false, closeButton: true, autoClose: 5000 })
    }
    getNftData()
  }

  async function getActivity() {
    await axiosconfig.get(`/activity/nftactivity/${nftAddress}`)
      .then((res) => {
        console.log('activity', res.data.data)
        setNftActivity(res.data.data)
      }).catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    if (nftAddress) {
      getNftData()
      getActivity()
    }
    return () => {
      setNft(null)
    }
  }, [nftAddress])

  const activityData = [
    {
      title: 'Digital Art Collection',
      author: 'Panda',
      time: '1 hours ago',
      favorite: 'Started Following',
      image: item1,
    },
    {
      title: 'Skrrt Cobain Official',
      author: 'ButterFly',
      time: '2 hours ago',
      favorite: 'Liked by',
      image: gif1,
    },
    {
      title: 'Wow! That Brain Is Floating',
      author: 'ButterFly',
      time: '2 hours ago',
      favorite: 'Liked by',
      image: item2,
    },
  ]

  return (
    <Main>
      {/* Start */}
      <section className="bg-item-detail d-table w-100">
        <div className="container">
          <div className="row">
            {
              nft?.owner?.walletAddress == account && (
                <div className='col-md-12 d-flex justify-content-end'>
                  <a
                    href="/"
                    onClick={e => {
                      e.preventDefault()
                      navigate('/create-nft', {
                        state: { nft: nft }
                      })
                    }}
                    className="btn btn-pills btn-outline-primary mx-1"
                  >
                    Edit Item
                  </a>
                  {
                    nft?.listed == false && (
                      <a
                        data-bs-toggle="modal"
                        data-bs-target="#ListNFT"
                        className="btn btn-pills btn-outline-primary mx-1"
                      >
                        List Item
                      </a>
                    )
                  }
                  {
                    nft?.listed == true && (
                      <a
                        onClick={cancel}
                        className="btn btn-pills btn-outline-primary mx-1"
                      >
                        Cancel Listing
                      </a>
                    )
                  }
                  <a
                    onClick={async (e) => {
                      e.preventDefault()
                      const id = toast.loading('NFT Deleteing');
                      // navigate('/upload-work')
                      await axiosconfig.delete(`/nfts/${nft.nftAddress}`)
                        .then(async (res) => {
                          await axiosconfig.post("/activity/useractivity", {
                            // userId, activityName, activityData
                            userId: account,
                            activityName: USER_ACTIVITIES.DELETE_NFT,
                            activityData: {
                              ...res.data.data,
                              deleteAt: new Date()
                            }
                          })
                          toast.update(id, {
                            render: `${res.data.message}`, closeOnClick: true, type: 'success', isLoading: false, closeButton: true, onClick: () => navigate(`/creator-profile`)
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
            <div className="col-md-6">
              <div className="sticky-bar">
                <img
                  src={nft?.image || itemDetail1}
                  className="img-fluid rounded-md shadow"
                  alt={nft?.walletAddress}
                />
              </div>
            </div>

            <div className="col-md-6 mt-4 pt-2 mt-sm-0 pt-sm-0">
              <div className="ms-lg-5">
                <Link to={`/collection/${nft
                  ?.collection?.collectionAddress}`}>
                  <p>{nft?.collection.name}</p>
                </Link>
                <div className="title-heading">
                  <h4 className="h3 fw-bold mb-0">
                    {nft?.name}
                  </h4>
                </div>

                {
                  nft?.type == 'auction' && (
                    <div className="col-4 mt-4 pt-2">
                      <div className="start-0 m-2 h5 bg-gradient-primary text-white title-dark rounded-pill px-3">
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
                    </div>
                  )
                }

                <div className="row">
                  <div className="col-md-6 mt-4 pt-2">
                    <h6> {nft?.type == 'auction' ? 'Current Bid' : 'Price'} </h6>
                    <h4 className="mb-0"> {nft?.price} {nft?.paymentToken == 'USDT' ? nft?.paymentToken : getChainByName(nft?.blockchain)} </h4>
                  </div>
                  {
                    nft?.listed && nft?.owner?.walletAddress != account && nft?.type == 'fixedprice' && (
                      <div className="col-12 mt-4 pt-2">
                        <a
                          href=""
                          className="btn btn-l btn-pills btn-primary"
                          onClick={(e) => {
                            e.preventDefault();
                            buy();
                          }}
                        >
                          <i className="mdi mdi-cart fs-5 me-2"></i> Buy Now
                        </a>
                      </div>
                    )
                  }
                  {
                    nft?.listed && nft?.owner?.walletAddress != account && nft?.type == 'auction' && (
                      <div className="col-12 mt-4 pt-2">
                        <a
                          href=""
                          className="btn btn-l btn-pills btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#NftBid"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <i className="mdi mdi-cart fs-5 me-2"></i> Place Bid
                        </a>
                      </div>
                    )
                  }
                </div>
                <div className="row mt-4 pt-2">
                  <div className="col-12">
                    <ul
                      className="nav nav-tabs border-bottom"
                      id="myTab"
                      role="tablist"
                    >
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link active"
                          id="detail-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#detailItem"
                          type="button"
                          role="tab"
                          aria-controls="detailItem"
                          aria-selected="true"
                        >
                          Details
                        </button>
                      </li>

                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link"
                          id="activity-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#activity"
                          type="button"
                          role="tab"
                          aria-controls="activity"
                          aria-selected="false"
                        >
                          Activity
                        </button>
                      </li>
                    </ul>

                    <div className="tab-content mt-4 pt-2" id="myTabContent">
                      <div
                        className="tab-pane fade show active"
                        id="detailItem"
                        role="tabpanel"
                        aria-labelledby="detail-tab"
                      >
                        <p className="text-muted">
                          {nft?.description}
                        </p>
                        <h6>Owner</h6>

                        <div className="creators creator-primary d-flex align-items-center">
                          <div className="position-relative">
                            <img
                              src={nft?.owner?.profileImage || client09}
                              className="avatar avatar-md-sm shadow-md rounded-pill"
                              alt={nft?.owner?.name}
                            />
                            <span className="verified text-primary">
                              <i className="mdi mdi-check-decagram"></i>
                            </span>
                          </div>

                          <div className="ms-3">
                            <h6 className="mb-0">
                              {
                                nft && (
                                  <a
                                    href={`/profile/${nft?.owner?.walletAddress}`}
                                    onClick={e => {
                                      e.preventDefault()
                                      navigate(`/profile/${nft?.owner?.walletAddress}`)
                                    }}
                                    className="text-dark name"
                                  >
                                    {splitWalletAddress(nft?.owner?.walletAddress)} - {nft?.owner?.name && nft?.owner?.name}
                                  </a>
                                )
                              }
                            </h6>
                          </div>
                        </div>
                      </div>

                      <div
                        className="tab-pane fade"
                        id="activity"
                        role="tabpanel"
                        aria-labelledby="activity-tab"
                      >
                        <div className="row g-4">
                          {nftActivity && nftActivity?.map(data => {
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
                                        {data?.favorite ===
                                          'Started Following' ? (
                                          <i className="mdi mdi-account-check mdi-18px text-success"></i>
                                        ) : data?.favorite === 'Liked by' ? (
                                          <i className="mdi mdi-heart mdi-18px text-danger"></i>
                                        ) : (
                                          <i className="mdi mdi-format-list-bulleted mdi-18px text-warning"></i>
                                        )}
                                      </div>
                                    </div>
                                    <span className="content ms-3">
                                      <a
                                        href=""
                                        onClick={e => e.preventDefault()}
                                        className="text-dark title mb-0 h6 d-block"
                                      >
                                        {data?.activity}
                                      </a>
                                      {/* <small className="text-muted d-block mt-1">
                                        {data?.activity}{' '}
                                        <a
                                          href=""
                                          onClick={e => e.preventDefault()}
                                          className="link fw-bold"
                                        >
                                          @{data?.owner}
                                        </a>
                                      </small> */}

                                      {/* <small className="text-muted d-block mt-1">
                                        {data?.activity}
                                      </small> */}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                          {/*end col*/}
                        </div>
                        {/*end row*/}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
            {/*end col*/}
          </div>
          {/*end row*/}
        </div>
        {/*end container*/}

        {/*end container*/}
      </section>
      {/*end section*/}
      {/* End */}

      <NFTListModel prevPrice={nft?.price} nft={nft} id="ListNFT" labelledby="NFTList" nftAddress={nftAddress} setNFT={setNft} />

      <NftBidModal nft={nft} nftAddress={nftAddress} getNftData={getNftData} />

    </Main>
  )
}

export default ItemDetailOne
