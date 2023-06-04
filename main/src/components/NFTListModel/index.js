import React from 'react'
import DatePicker from "react-datepicker";
import axiosConfig from '../../axiosConfig';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { type } from 'os';
import { approveCollection } from '../../blockchain/mintContracts';
import { useSelector } from 'react-redux';

const LISTINGTYPE = {
    auction: 'auction',
    fixedprice: 'fixedprice'
}

const NFTListModel = ({ id, labelledby, nftAddress, setNFT, prevPrice, nft }) => {
    const navigate = useNavigate()
    const {account} = useSelector(state => state.theme);
    const [listingType, setListingType] = React.useState(LISTINGTYPE.fixedprice)
    const [startDate, setStartDate] = React.useState(new Date());
    const [price, setPrice] = React.useState(prevPrice)
    const btnRef = React.useRef(null)

    const handleListNFT = async () => {
        const id = toast.loading('Listing NFT')
        const approve = await approveCollection(account, nft.blockchain, nft?.collection?.collectionAddress);
        await axiosConfig.put("/nfts/listnft", {
            listingType,
            endDate: listingType == LISTINGTYPE.fixedprice ? null : startDate,
            nftAddress,
            price
        }).then(res => {
            toast.update(id, {
                render: `${res.data.message}`, closeOnClick: true, isLoading: false, autoClose: 5000, closeButton: true
            })
            setNFT(prev => ({
                ...prev,
                listed: true,
                type: listingType,
                endDate: listingType == LISTINGTYPE.fixedprice ? null : res.data.data.auctionTimeEnd
            }))
        }).catch(err => {
            console.log(err)
            toast.update(id, {
                render: `${err}`, closeOnClick: true, isLoading: false, autoClose: 5000, closeButton: true
            })
        })
    }

    return (
        <div
            className="modal fade"
            id={id}
            aria-labelledby={labelledby}
            tabIndex="-1"
        >
            <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content border-0 shadow-md rounded-md">
                    <div className="modal-header">
                        <h5 className="modal-title" id={labelledby}>
                            List NFT
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
                                <div className="col-12 mb-4">
                                    <label className="form-label fw-bold">Listing Type:</label>
                                    <select
                                        required
                                        value={listingType} className='form-control' onChange={e => setListingType(e.target.value)} >
                                        <option value={LISTINGTYPE.fixedprice}> {LISTINGTYPE.fixedprice} </option>
                                        <option value={LISTINGTYPE.auction}> {LISTINGTYPE.auction} </option>
                                    </select>
                                </div>
                                {
                                    listingType === LISTINGTYPE.auction && (
                                        <div className="col-12 mb-4">
                                            <label className="form-label fw-bold">Auction End Time:</label>
                                            <DatePicker
                                                selected={startDate}
                                                onChange={(date) => {
                                                    console.log(date)
                                                    setStartDate(date)
                                                }}
                                                showTimeSelect
                                                dateFormat="Pp"
                                            />
                                        </div>
                                    )
                                }
                                {
                                    listingType === LISTINGTYPE.fixedprice && (
                                        <div className="col-12 mb-4">
                                            <label className="form-label fw-bold">Price</label>
                                            <input type="number" value={price} onChange={e => setPrice(e.target.value)} />
                                        </div>
                                    )
                                }
                            </div>
                        </form>



                        <div className="mt-4">
                            <button
                                className="btn btn-pills btn-primary w-100"
                                data-bs-dismiss="modal"
                                id="close-modal"
                                onClick={handleListNFT}
                                ref={btnRef}
                            >
                                List NFT
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NFTListModel