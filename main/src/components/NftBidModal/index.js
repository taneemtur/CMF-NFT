import React, { useState } from 'react'
import { approveUSDT, bid } from '../../blockchain/mintContracts';
import { useSelector } from 'react-redux';
import axiosConfig from '../../axiosConfig'
import { toast } from 'react-toastify';
import { NFT_ACTIVITIES, USER_ACTIVITIES } from '../../activities';

const index = ({nft, nftAddress, getNftData, getActivity}) => {
    const [price, setPrice] = useState(null);
    const { account } = useSelector(state => state.theme)

    const placeBid = async (auctionListingId, price, chainId, account) => {
      if(price <= nft?.price){
        toast.error('Bidding Price should be higher than current price');
        return;
      }
        const id = toast.loading('Placing Bid')
        try {
            if(nft?.paymentToken == 'USDT'){
              await approveUSDT(account, chainId, price);
            }
            await bid(auctionListingId, price, chainId, account)
            await axiosConfig.post("/nfts/bidnft", {
              nftAddress,
              blockchain: chainId,
              price,
              user: account,
              owner: nft?.owner?.walletAddress,
              auctionTimeStart: new Date(nft?.auctionTimeStart).getTime() / 1000,
              auctionTimeEnd: new Date(nft?.auctionTimeEnd).getTime() / 1000,
              userBidTime: new Date(),
              auctionListingId: nft?.auctionListingId,
              paymentToken: nft?.paymentToken,
            }).then(async (res)=>{
              await axiosConfig.put("/nfts/updatelisting", {nftAddress, price} )
              await axiosConfig.post("/activity/useractivity", {
                  // userId, activityName, activityData
                  userId: account,
                  activityName: USER_ACTIVITIES.BID_NFT,
                  activityData: {
                      ...res.data.data,
                      BidAt: new Date()
                  }
              })
              await axiosConfig.post("/activity/nftactivity", {
                nftId: nftAddress,
                activityData: {
                  ...res.data.data,
                  activity: NFT_ACTIVITIES.BID_NFT,
                  BidAt: new Date()
                }
              })
            })

            toast.update(id, {
                render: `Bid Successfully Placed`, closeOnClick: true, isLoading: false, autoClose: 5000, closeButton: true, type: 'success'
            })
            getNftData()
            getActivity()
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