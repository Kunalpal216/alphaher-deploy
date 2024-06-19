"use client"

import DownArrow from '../../../../../assets/icons/finance/downArrow.svg';
import subicon from "../../../../../assets/icons/finance/1. Icons-26.svg";
import delicon from '../../../../../assets/icons/finance/1. Icons-27.svg';

import Subtract from "../../../../../assets/icons/finance/Subtract.svg"
import Add from "../../../../../assets/icons/finance/add (2).svg"
import addicon from '../../../../../assets/icons/finance/add.svg';
import add1icon from '../../../../../assets/icons/finance/add1.svg';
import sellicon from '../../../../../assets/icons/finance/sell.svg';
import Invoice from '../../../../../assets/icons/finance/invoice.svg';
import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import Select from 'react-select';
import Image from 'next/image';
import Link from 'next/link';
import NewsaleEstimateHeader from './header';
import { Popover, PopoverTrigger, PopoverContent, Button, useCalendar } from '@nextui-org/react';
import NewsaleEstimateBottomBar from './bottombar';
import NewsaleEstimateTotalAmout from './totalamount';
import { FinanceCreationType } from '@prisma/client';
import { DataContext } from './DataContext';
import axios from 'axios';
import { useAppSelector } from "@/lib/hooks";
import formatDateAndTime from '@/utils/formateDateTime';
import { Tax } from '@prisma/client';
import useSWR from 'swr';
//@ts-ignore
const fetcher = (...args:any[]) => fetch(...args).then(res => res.json())

interface Products{
    id :string,
    itemName:string,
    productBatch:ProductBatch[],
    hsnCode:string,
    quantity:number
}
interface ProductBatch {
    id: number;
    date: string;
    time: string;
    quantity: number;
    batchNumber:string;
    expiry:string;
    costPrice:number;
    sellingPrice :number;
    hsnCode:string;
    category :string;
    distributors:string[];
    productId:number;
}
function useProductfetch (id: number | null) {
    const {data,error,isLoading}=useSWR(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/inventory/product/getAll?branchId=${id}`,fetcher,{revalidateOnFocus:true});
   return {
    fetchedProducts:data,
    isLoading,
    error
   }
}
function useProductBatchfetch(id:number|null){
    const {data,error,isLoading}=useSWR(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/inventory/product/productBatch/getAll/?branchId=${id}`,fetcher,{revalidateOnFocus:true});
    return {
        fetchedBathces:data,
        isBatchLoading:isLoading,
        batchError:error
    }
}
const NewsaleEstimateTable = () => {
    const { tableData, setTableData } = useContext(DataContext);
    const [selectedProductDetails,setSelectedProduct]= useState<Products>()
    const [products, setProducts] = useState<any[]>([]);
    const [batches,setBatches] = useState<any[]>([]);
    const [filteredBatches,setFilteredBatches]=useState<any[]>([]);
    const [otherData, setOtherData] = useState({});
    const appState = useAppSelector((state) => state.app)
    const { tableData: items, setTableData: setItems } = useContext(DataContext);   
    const [discountStates, setDiscountStates] = useState(new Array(items.length).fill(false));
    const taxOptions = [
        { value: 'Tax excl.', label: 'Tax excl.' },
        { value: 'Tax incl.', label: 'Tax incl.' }
    ];

    const gstOptions = [
        { value: 0.18, label: Tax.GST_18 },
        { value: 0.09, label: Tax.GST_9 }
    ];
    const discountOptions= [
        {value:0.05,label:"5% off"},
        {value:0.08,label:"8% off"},
        {value:0.10, label:"10% off"},
        {value:0.12,label:"12% off"},
        {value:0.15,label:"15% off"},
    ]

    
    const Checkbox = ({ children, ...props }: JSX.IntrinsicElements['input']) => (
        <label style={{ marginRight: '1em' }}>
            <input type="checkbox" {...props} />
            {children}
        </label>
    );
    const [disableButton, setDisableButton] = useState(true);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isChecked, setChecked] = useState(false);
    
    useEffect(() => {
        if (!disableButton && inputRef.current) {
            inputRef.current.focus();
        }
    }, [disableButton]);
    const {fetchedProducts,isLoading,error}=useProductfetch(appState.currentBranchId);
    const {fetchedBathces,isBatchLoading,batchError}=useProductBatchfetch(appState.currentBranchId);
    useEffect(()=>{
     if(!isLoading&&products&&!error){
         const formattedProducts = fetchedProducts.map((product: Products) => ({
             value:{
                id: product.id,
                quantity:product.quantity,
                itemName:product.itemName
            },
             label: product.itemName,
         }));
         setProducts(formattedProducts);
     }
     if(!batchError&&!isBatchLoading&&fetchedBathces){
        const formattedProductBatches=fetchedBathces.map((product:ProductBatch)=>({
            value:{
                id:product.id,
                productId:product.productId,
                quantity: 1,
                batchNumber: product.batchNumber,
                expiry:  product.expiry,
                sellingPrice:  product.sellingPrice,
            },
            label:product.batchNumber
        }));
        console.log(formattedProductBatches)
        setBatches(formattedProductBatches)
    }
    },[fetchedProducts,fetchedBathces])
  const handleDeleteRow = useCallback((index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
}, [items]);

const handleGstSelect = (selectedGst: any, index: number) => {
    const updatedItems = [...tableData];
    console.log(selectedGst)
    updatedItems[index] = {
        ...updatedItems[index],
        gst: selectedGst.value
    };
    setTableData(updatedItems);
};
const handleDiscountSelect= (selectedDiscount:any,index:number)=>{
    const updatedItems=[...tableData];
    console.log(selectedDiscount);
    updatedItems[index]={
        ...updatedItems[index],
        discount:selectedDiscount.value
    };
    setTableData(updatedItems);
}
const handleAddDiscount = (index:number) => {
    const newDiscountStates = [...discountStates]; 
    newDiscountStates[index] = !newDiscountStates[index]; 
    setDiscountStates(newDiscountStates);
};
const handleEditButtonClick = () => {
    setDisableButton(!disableButton);
};

const handleCheckBoxChange = () => {
    setChecked(!isChecked);
    setItems((prevItems) =>
        prevItems.map((item) => ({
            ...item,
            quantity: isChecked ? item.quantity  : item.quantity,
            lowQty: item.quantity,
            highQty:item.quantity,

        }))
    );
};

const handleQuantityDecClick = (itemId: any) => {
    setItems((prevItems) =>
        prevItems.map((item) => {
            if (item.id === itemId && item.quantity > 1) {
                return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        })
    );
};

const handleQuantityIncClick = (itemId: any) => {
    setItems((prevItems) =>
        prevItems.map((item) => {
            if (item.id === itemId) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        })
    );
};

const handleQuantityDecClick1 = (itemId: any) => {
    setItems((prevItems) =>
        prevItems.map((item) => {
            if (item.id === itemId && item.lowQty > 1) {
                return { ...item, lowQty: item.lowQty - 1 };
            }
            return item;
        })
    );
};

const handleQuantityIncClick1 = (itemId: any) => {
    setItems((prevItems) =>
        prevItems.map((item) => {
            if (item.id === itemId) {
                return { ...item, lowQty: item.lowQty + 1 };
            }
            return item;
        })
    );
};
const handleQuantityDecClick2= (itemId: any) => {
    setItems((prevItems) =>
        prevItems.map((item) => {
            if (item.id === itemId && item.highQty > 1) {
                return { ...item, highQty: item.highQty - 1 };
            }
            return item;
        })
    );
};

const handleQuantityIncClick2 = (itemId: any) => {
    setItems((prevItems) =>
        prevItems.map((item) => {
            if (item.id === itemId) {
                return { ...item, highQty: item.highQty + 1 };
            }
            return item;
        })
    );
};
const handleAddItem= useCallback(() => {
    setItems([...items, {}]);
}, [items]);

const handleProductSelect = useCallback(async (selectedProduct: any, index: number) => {
    console.log(selectedProduct);
    if (selectedProduct.value) {
      try {
        const data = products.find((product) => product.value.id === selectedProduct.value.id);
        setSelectedProduct(data);
        const updatedItems = [...items];
        updatedItems[index] = {
          ...updatedItems[index],
          quantity: data.value.quantity,
          productId: selectedProduct.value.id,
          itemName: data.value.itemName,
        };
        setItems(updatedItems);

        // Set first element of filteredBatches as default value for batches
        const productBatches = batches?.filter((batch) => batch.value.productId === selectedProduct.value.id).sort((a, b) => a.value.id - b.value.id);
        setFilteredBatches(productBatches);
        const defaultBatch = productBatches?.[0];
        setItems((prevItems) =>
          prevItems.map((item, itemIndex) =>
            itemIndex === index ? { ...item, id: defaultBatch?.value?.id,
                quantity: defaultBatch?.value?.quantity ,
                batchNumber: defaultBatch?.value?.batchNumber,
                expiry:  defaultBatch?.value?.expiry,
                sellingPrice:  defaultBatch?.value?.sellingPrice,
                lowQty:isChecked?defaultBatch?.value?.quantity:0,
                highQty:isChecked?defaultBatch?.value?.quantity:0,
                productId:defaultBatch?.value?.productId } : item
          )
        );
      } catch (error) {
        console.error("Error fetching product details from API:", error);
      }
    }
  }, [items, products]);
const handleBatchSelect = useCallback(async (selectedProduct: any, index: number) => {
    if (selectedProduct.value) {
        try {
            
            const data = filteredBatches.find((batch)=>batch.value.id==selectedProduct.value.id);
            console.log(data)
            const updatedItems = [...items];
            updatedItems[index] = {
                ...updatedItems[index],
                id: data.value.id,
                quantity: data.value.quantity ,
                lowQty:isChecked?data.value?.quantity:0,
                highQty:isChecked?data.value?.quantity:0,
                batchNumber: data.value.batchNumber,
                expiry:  data.value.expiry,
                sellingPrice:  data.value.sellingPrice,
                productId:data.value.productId
            };
            console.log("these are updated",updatedItems)
            setItems(updatedItems);
            setTableData(updatedItems);
                // const updatedProducts = products.filter((product) => product.value !== selectedProduct.value);
                // setProducts(updatedProducts);
        } catch (error) {
            console.error("Error fetching product details from API:", error);
        }
    }
}, [items, products]);



useEffect(() => {
    setItems(items);
    setTableData(items)
}, [items]);
    return (
        <>
            <div className="w-full h-full flex-col justify-start items-start flex mt-2 bg-gray-100 rounded-lg border border-solid border-borderGrey">
            <div className="w-full h-[84px] p-6 bg-white rounded-tl-[10px] rounded-tr-[10px] border-b border-t-0 border-r-0 border-l-0 border-solid border-borderGrey justify-start items-center gap-6 flex">
                </div>
                <div className="flex-col w-full pr-[16px] pl-[16px] pt-[20px]">
                    <NewsaleEstimateHeader />
                    <div className="w-full rounded-md border border-solid border-borderGrey">
                        <div className="w-full h-[84px] p-6 bg-white rounded-t-md  justify-between items-center gap-6 flex border-t-0 border-r-0 border-l-0 border-b border-solid border-borderGrey">
                            <div className="text-gray-500 text-xl font-medium ">Items</div>
                            <div className="flex items-center justify-center ">
                                <div className="flex items-center justify-center mr-2">
                                    <div className="pr-[4px]">
                                        <input value="test" type="checkbox" className="border-0" onChange={handleCheckBoxChange} />
                                    </div>
                                    <div className="text-textGrey2 text-base font-bold ">Price Range</div>
                                </div>
                                <Button onClick={handleAddItem} className='cursor-pointer text-white flex items-center h-9 px-4 py-2.5 bg-black justify-between rounded-lg border-0 outline-none'>
                                    <div className='w-4 h-4 mb-3 mr-2'>
                                        <Image src={addicon} alt='addicon' />
                                    </div>
                                   
                                        Add Item
                                    
                                </Button>
                            </div>
                        </div>
                        <div>
                            <div className='flex w-full justify-evenly items-center box-border bg-gray-100 h-12  text-gray-500 border-t-0 border-r-0 border-l-0 border-b border-solid border-borderGrey'>
                                <div className={`${isChecked === true ? "px-2": ""} flex text-gray-500 text-base font-medium w-[3rem]`}>No.</div>
                                <div className={`${isChecked === true ? "px-4": ""} flex text-gray-500 text-base font-medium w-[15rem]`}>Name</div>
                                <div className='flex text-gray-500 text-base font-medium w-[10rem]'>Batch No.</div>
                                <div className='flex text-gray-500 text-base font-medium w-[10rem]'>Selling Price</div>
                                {!isChecked && (
                                    <div className='flex text-gray-500 text-base font-medium w-[10rem]'>Quantity</div>
                                )}
                                {isChecked && (
                                    <div className='flex text-gray-500 text-base font-medium w-[10rem]'>Low Quantity</div>
                                )}
                                {isChecked && (
                                    <div className='flex text-gray-500 text-base font-medium w-[10rem]'>High Quantity</div>
                                )}
                                <div className='flex text-gray-500 text-base font-medium w-[10rem]'>Tax %</div>
                                <div className='flex text-gray-500 text-base font-medium w-[10rem]'>Tax Amt.</div>
                                <div className='flex text-gray-500 text-base font-medium w-1/12'>Total</div>
                                <div className='flex text-gray-500 text-base font-medium w-1/12'></div>
                            </div>
                            {items.map((item:any, index:number) => (
    <div key={index + 1} className='flex flex-col w-full'>
        <div className='flex justify-evenly items-center w-full box-border bg-white border-t-0 border-r-0 border-l-0 border-b border-solid border-borderGrey text-gray-400 py-2'>
            <div className={`${isChecked === true ? "ml-[5px]" : ""} w-[3rem] flex items-center text-neutral-400 text-base font-medium`}>{index + 1}</div>
            <div className={`${isChecked === true ? "px-4" : ""} w-[15rem] flex items-center text-neutral-400 text-base font-medium`}>
                <Select
                    className="text-gray-500 text-base font-medium w-[90%] border-0 boxShadow-0"
                    classNamePrefix="select"
                    value={products.find((prod) => prod.value.id === item.productId)}
                    isClearable={false}
                    isSearchable={true}
                    name="itemName"
                    options={products}
                    onChange={(selectedProduct: any) => handleProductSelect(selectedProduct, index)}
                    styles={{
                        control: (provided, state) => ({
                            ...provided,
                            border: state.isFocused ? 'none' : 'none',
                        }),
                    }}
                />
            </div>
            <div className='w-[10rem] flex-col items-center text-neutral-400 text-base font-medium'>
                <Select
                    className="text-gray-500 text-base font-medium w-[90%] border-0 boxShadow-0"
                    classNamePrefix="select"
                    value={batches.find((prod) => prod.value.id === item.id)}
                    isClearable={false}
                    isSearchable={true}
                    name={`batchNumber=${index}`}
                    options={filteredBatches}
                    onChange={(selectedProduct: any) => handleBatchSelect(selectedProduct, index)}
                    styles={{
                        control: (provided, state) => ({
                            ...provided,
                            border: state.isFocused ? 'none' : 'none',
                        }),
                    }}
                />
                <div className="text-neutral-400 text-[10px] font-medium px-2">{formatDateAndTime(item.expiry).formattedDate}</div>
            </div>
            <div className='w-[10rem] flex items-center text-neutral-400 text-base font-medium gap-5'>
                {item.sellingPrice}
                <Select
                    className="text-neutral-400 text-sm font-medium"
                    defaultValue={taxOptions[0]}
                    isClearable={false}
                    isSearchable={true}
                    options={taxOptions}
                    styles={{
                        control: (provided, state) => ({
                            ...provided,
                            border: state.isFocused ? 'none' : 'none',
                        }),
                    }}
                />
            </div>
            {!isChecked && (
                <div className='w-[10rem] flex items-center text-neutral-400 text-base font-medium gap-[12px]'>
                    <div className='flex items-center text-neutral-400 text-base font-medium gap-[20px] bg-white'>
                        <button className="border-0 rounded-md cursor-pointer" onClick={() => handleQuantityDecClick(item.id)}>
                            <Image className='rounded-md' src={Subtract} alt="-"></Image>
                        </button>
                        <div>{item.quantity}</div>
                        <button className="border-0 rounded-md cursor-pointer" onClick={() => handleQuantityIncClick(item.id)}>
                            <Image className="rounded-md" src={Add} alt="+"></Image>
                        </button>
                    </div>
                </div>
            )}
            {isChecked && (
                <>
                    <div className='w-[10rem] flex items-center text-neutral-400 text-base font-medium gap-[12px]'>
                        <div className='flex items-center text-neutral-400 text-base font-medium gap-[20px] bg-white'>
                            <button className="border-0 rounded-md cursor-pointer" onClick={() => handleQuantityDecClick1(item.id)}>
                                <Image className='rounded-md' src={Subtract} alt="-"></Image>
                            </button>
                            <div>{item.lowQty}</div>
                            <button className="border-0 rounded-md cursor-pointer" onClick={() => handleQuantityIncClick1(item.id)}>
                                <Image className="rounded-md" src={Add} alt="+"></Image>
                            </button>
                        </div>
                    </div>
                    <div className='w-[10rem] flex items-center text-neutral-400 text-base font-medium gap-[12px]'>
                        <div className='flex items-center text-neutral-400 text-base font-medium gap-[20px] bg-white'>
                            <button className="border-0 rounded-md cursor-pointer" onClick={() => handleQuantityDecClick2(item.id)}>
                                <Image className='rounded-md' src={Subtract} alt="-"></Image>
                            </button>
                            <div>{item.highQty}</div>
                            <button className="border-0 rounded-md cursor-pointer" onClick={() => handleQuantityIncClick2(item.id)}>
                                <Image className="rounded-md" src={Add} alt="+"></Image>
                            </button>
                        </div>
                    </div>
                </>
            )}
            <div className='w-[10rem] flex items-center text-neutral-400 text-base font-medium'>
                <Select
                    className="text-neutral-400 text-base font-medium"
                    defaultValue={[]}
                    isClearable={false}
                    isSearchable={true}
                    options={gstOptions}
                    styles={{
                        control: (provided, state) => ({
                            ...provided,
                            border: state.isFocused ? 'none' : 'none',
                            padding: '0',
                        }),
                    }}
                    onChange={(selectedOption: any) => handleGstSelect(selectedOption, index)}
                />
            </div>
            <div className='w-[10rem] flex items-center text-neutral-400 text-base font-medium'>
                {isChecked ? (
                    '₹' +
                    ((item?.sellingPrice * item?.lowQty * item?.gst).toFixed(2) +
                        '-' +
                        (item?.sellingPrice * item?.highQty * item?.gst).toFixed(2) || 0)
                ) : (
                    '₹' +
                    ((item?.sellingPrice * item?.quantity * item?.gst) || 0).toFixed(2)
                )}
            </div>
            <div className='w-1/12 flex items-center text-neutral-400 text-base font-medium'>
                {isChecked ? (
                    <>
                        {item?.lowQty && (
                            <>
                                ₹{(item?.sellingPrice * item?.lowQty * (1 + item?.gst)).toFixed(2) || 0}
                                -{' '}
                            </>
                        )}
                        {item?.highQty && (
                            <>₹{(item?.sellingPrice * item?.highQty * (1 + item?.gst)).toFixed(2) || 0}</>
                        )}
                    </>
                ) : (
                    <>
                        ₹{(item?.quantity * item?.sellingPrice * (1 + item?.gst)).toFixed(2) || 0}
                    </>
                )}
            </div>
            <div className='w-1/12 flex items-center text-neutral-400 text-base font-medium gap-[12px]'>
                <button className="border-0">
                                <Image src={sellicon} alt="sell" onClick={() => handleAddDiscount(index)}></Image>
                </button>
                <button className="border-0" onClick={() => handleDeleteRow(index)}>
                    <Image src={delicon} alt="delete"></Image>
                </button>
            </div>
        </div>

        {discountStates[index]  && (
                        <div className='flex w-full justify-evenly items-center box-border bg-white h-12 border-t-0 border-r-0 border-l-0 border-b border-solid border-borderGrey text-gray-500'>
                            <div className='flex text-gray-500 text-base font-medium w-[3rem]'></div>
                            <div className='flex text-gray-500 text-base font-medium w-[15rem]'>
                                <div className="h-7 px-2 py-1.5 bg-violet-100 rounded-[5px] justify-center items-center gap-2 inline-flex">
                                    <div className="text-indigo-600 text-sm font-medium">Item Discount</div>
                                </div>
                            </div>
                            <div className='flex text-gray-500 text-base font-medium w-[10rem]'><Select
                    className="text-neutral-400 text-base font-medium"
                    defaultValue={[]}
                    isClearable={false}
                    isSearchable={true}
                    options={discountOptions}
                    styles={{
                        control: (provided, state) => ({
                            ...provided,
                            border: state.isFocused ? 'none' : 'none',
                            padding: '0',
                        }),
                    }}
                    onChange={(selectedOption: any) => handleDiscountSelect(selectedOption, index)}
                /></div>
                            <div className='flex text-gray-500 text-base font-medium w-1/12'></div>
                            <div className='flex text-gray-500 text-base font-medium w-[10rem]'></div>
                            <div className='flex text-gray-500 text-base font-medium w-1/12'></div>
                            <div className='flex text-gray-500 text-base font-medium w-[10rem]'></div>
                            <div className="text-red-500 text-base font-bold w-1/12">-₹{(item.sellingPrice*item.discount*item. quantity).toFixed(2)}</div>
                        </div>
                    )}
    </div>
))}

                            <div className='flex w-full justify-evenly items-center box-border bg-gray-100 h-12 border-b border-neutral-400 text-gray-500 rounded-b-md'>
                                <div className='flex text-gray-500 text-base font-medium w-[3rem]'></div>
                                <div className='flex text-gray-500 text-base font-medium w-[15rem]'>Total</div>
                                <div className='flex text-gray-500 text-base font-medium w-[10rem]'></div>
                                <div className='flex text-gray-500 text-base font-medium w-[10rem]'></div>
                                <div className='flex text-gray-500 text-base font-medium w-[10rem]'>{(items.reduce((acc:any, item:any) => acc + item.quantity, 0))||0} Items</div>
                                
                                <div className='flex text-gray-500 text-base font-medium w-[10rem]'>
                                    <Select
                                        className="text-textGrey2 text-base font-medium"
                                        defaultValue={gstOptions[0]}
                                        isClearable={false}
                                        isSearchable={true}
                                        options={gstOptions}
                                        styles={{
                                            control: (provided, state) => ({
                                                ...provided,
                                                border: state.isFocused ? 'none' : 'none',
                                            }),
                                        }}
                                    />
                                </div>
                                <div className='flex text-gray-500 text-base font-medium w-[10rem]'>
                                        {isChecked ? (
                                           
                                            <>
                                            {items?.some((item) => item?.lowQty) && ( 
                                                <>
                                                ₹{
                                                    items.reduce(
                                                    (acc, item) =>
                                                        acc + (item?.lowQty || 0) * item?.gst * item?.sellingPrice,
                                                    0
                                                    ).toFixed(2) ||
                                                    0
                                                }
                                               -{' '}
                                                </>
                                            )}
                                            {items?.some((item) => item?.highQty) && ( 
                                                <>
                                                ₹{
                                                    items.reduce(
                                                    (acc, item) =>
                                                        acc + (item?.highQty || 0) * item?.gst * item?.sellingPrice,
                                                    0
                                                    ).toFixed(2) ||
                                                    0
                                                }
                                                
                                                </>
                                            )}
                                            </>
                                        ) : (
                                           
                                            <>
                                            ₹{
                                                items.reduce((acc, item) => acc + item.quantity * item.gst * item?.sellingPrice, 0).toFixed(2) ||
                                                0
                                            }
                                            </>
                                        )}
                                     </div>

                                     <div className='flex text-gray-500 text-base font-medium w-1/12' >
  {isChecked ? (
    
    <>
      {items?.some((item) => item?.lowQty) && ( 
        <>
          ₹{
            items.reduce(
              (acc, item) => acc + (item?.lowQty || 0) * item?.sellingPrice,
              0
            ).toFixed(2) ||
            0
          }
         -{' '}
        </>
      )}
      {items?.some((item) => item?.highQty) && ( 
        <>
          ₹{
            items.reduce(
              (acc, item) => acc + (item?.highQty || 0) * item?.sellingPrice+(item?.highQty || 0) * item?.gst*item?.sellingPrice,
              0
            ).toFixed(2) ||
            0
          }
          
        </>
      )}
    </>
  ) : (
   
    <>
      ₹{
        items.reduce((acc, item) => acc + item.quantity * item?.sellingPrice+item.quantity*item?.sellingPrice*item.gst-(item.quantity*item?.sellingPrice*item.discount||0), 0) .toFixed(2) ||
        0
      }
     
    </>
  )}
</div>

                                <div className='flex text-gray-500 text-base font-medium w-1/12'></div>
                            </div>
                        </div>
                    </div>
                        <NewsaleEstimateTotalAmout />
                </div>
                <NewsaleEstimateBottomBar />
            </div>
        </>
    );
}

export default NewsaleEstimateTable;

