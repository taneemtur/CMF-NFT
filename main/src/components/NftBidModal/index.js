import React, { useState } from 'react'
import { bid } from '../../blockchain/mintContracts';
import { useSelector } from 'react-redux';
import axiosConfig from '../../axiosConfig'
import { toast } from 'react-toastify';
import { NFT_ACTIVITIES } from '../../activities';

const index = ({nft, nftAddress, getNftData}) => {
    const [price, setPrice] = useState(null);
    const { account } = useSelector(state => state.theme)

    const placeBid = async (auctionListingId, price, chainId, account) => {
        const id = toast.loading('Placing Bid')
        try {
            await bid(auctionListingId, price, chainId, account)
            await axiosConfig.put("/nfts/updatelisting", {nftAddress, price} )
            await axiosconfig.post("/activity/useractivity", {
                // userId, activityName, activityData
                userId: account,
                activityName: USER_ACTIVITIES.BID_NFT,
                activityData: {
                    nftAddress, 
                    price,
                    BidAt: new Date()
                }
            })
            await axiosconfig.post("/activity/nftactivity", {
                // userId, activityName, activityData
                userId: account,
                activityName: NFT_ACTIVITIES.BID_NFT,
                activityData: {
                    nftAddress, 
                    price,
                    BidAt: new Date()
                }
            })
            toast.update(id, {
                render: `Bid Successfully Placed`, closeOnClick: true, isLoading: false, autoClose: 5000, closeButton: true, type: 'success'
            })
            getNftData()
        } catch (error) {
            toast.update(id, {
                render: `${error.message}`, closeOnClick: true, isLoading: false, autoClose: 5000, closeButton: true
            })
        }
    } 

  return (
    <div
        className="modal fade"
        id="NftBid"
        aria-hidden="true"
        aria-labelledby="bidtitle"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content border-0 shadow-md rounded-md">
            <div className="modal-header">
              <h5 className="modal-title" id="bidtitle">
                Place a Bid
              </h5>
              <button
                type="button"
                className="btn btn-close"
                data-bs-dismiss="modal"
                id="close-modal"
              >
                <i className="uil uil-times fs-4"></i>
              </button>
            </div>
            <div className="modal-body p-4">
              <form>
                <div className="row">
                  <div className="col-12">
                    <div className="mb-4">
                      <label className="form-label fw-bold">
                        Your Bid Price <span className="text-danger">*</span>
                      </label>
                      <input
                        name="price"
                        id="price"
                        type="text"
                        className="form-control"
                        placeholder="00.00 ETH"
                        value={price}
                        onChange={(e)=> setPrice(e.target.value) }
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-pills btn-primary"
                onClick={e => {
                    e.preventDefault()
                    placeBid(nft?.auctionListingId, price, nft?.blockchain, account)
                }}
              >
                <i className="mdi mdi-gavel fs-5 me-2"></i> Place a Bid
              </button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default index