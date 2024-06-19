'use client';
import Image from "next/image";
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import closeicon from "../../../../assets/icons/inventory/closeIcon.svg";
import addicon from "../../../../assets/icons/inventory/add.svg";
import deleteicon from "../../../../assets/icons/loginsignup/delete.svg";
import add1icon from "../../../../assets/icons/inventory/add (1).svg";
import RadioButton from './RadioButton';
import subicon from "../../../../assets/icons/inventory/1. Icons-24 (6) (2).svg";
import checkicon from "../../../../assets/icons/inventory/check (1).svg";
import Select from 'react-select';
import calicon from "../../../../assets/icons/finance/calendar_today.svg"
import formatDateAndTime from "@/utils/formateDateTime";
import { Stock } from "@prisma/client";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Notif_Source } from "@prisma/client";
import { useAppSelector } from "@/lib/hooks";
import useSWR from 'swr';
//@ts-ignore
const fetcher = (...args:any[]) => fetch(...args).then(res => res.json())
type PopupProps = {
    onClose: () => void;
}
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
    location:Location;
    totalCost:number;
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
const Popup2: React.FC<PopupProps> = ({ onClose }) => {
    const [selectedOption, setSelectedOption] = useState<string>(Stock.StockIN);
    const [selectedProductDetails,setSelectedProduct]= useState<Products>()
    const [isChecked, setChecked] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [batches,setBatches] = useState<any[]>([]);
    const [filteredBatches,setFilteredBatches]=useState<any[]>([]);
    const [inventory, setInventory] = useState<any[]>([]);
    const appState = useAppSelector((state) => state.app)


    const {fetchedProducts,isLoading,error}=useProductfetch(appState.currentBranchId);
    const {fetchedBathces,isBatchLoading,batchError}=useProductBatchfetch(appState.currentBranchId);
    useEffect(()=>{
     if(!isLoading&&products&&!error){
         const formattedProducts = fetchedProducts.map((product: Products) => ({
             value:{
                id: product.id,
                quantity:product.quantity,
                itemName:product.itemName,
                hsnCode:product.hsnCode
            },
             label: product.itemName,
         }));
         console.log(formattedProducts)
         setProducts(formattedProducts);
     }
     if(!batchError&&!isBatchLoading&&fetchedBathces){
        const formattedProductBatches=fetchedBathces.map((product:ProductBatch)=>({
            value:{
                id:product.id,
                productId:product.productId,
                quantity: product.quantity ,
                batchNumber: product.batchNumber,
                expiry:  product.expiry,
                sellingPrice:  product.sellingPrice,
                costPrice:product.costPrice,
                location:product.location,
                distributors:product.distributors,
                totalCost:product.totalCost,
                maxQuantity:product.quantity
            },
            label:product.batchNumber
        }));
        console.log(formattedProductBatches)
        setBatches(formattedProductBatches)
    }
    },[fetchedProducts,fetchedBathces])

    //Handlers
    const handleRadioChange = useCallback((value: string) => {
        setSelectedOption(value);
        const updatedInventory = inventory.map((item) => ({
            ...item,
            quantity: value === Stock.StockIN ? 0 : item.quantity,
            expiry: value === Stock.StockIN ? "" : item.expiry,
            batchNumber:value===Stock.StockIN?"":item.batchNumber,
            totalCost:value===Stock.StockIN?0:item.totalCost,
            costPrice:value===Stock.StockIN?0:item.costPrice,
            sellingPrice:value===Stock.StockIN?0:item.sellingPrice,
        }));
        setInventory(updatedInventory);
    }, [inventory]);

    const handleDeleteRow = useCallback((index: number) => {
        const updatedInventory = [...inventory];
        updatedInventory.splice(index, 1);
        setInventory(updatedInventory);
    }, [inventory]);
    
    const handleQuantityDecClick = useCallback((index: number) => {
        const updatedInventory = [...inventory];
        updatedInventory[index].quantity = Math.max(updatedInventory[index].quantity - 1, 0);
        setInventory(updatedInventory);
    },[inventory]);

    const handleQuantityIncClick = useCallback((index: number) => {
        const updatedInventory = [...inventory];
        if(selectedOption===Stock.StockOUT){
            if(updatedInventory[index].quantity<updatedInventory[index].maxQuantity){
                updatedInventory[index].quantity += 1;
            }  
        }else{
            updatedInventory[index].quantity += 1;
        }
        
        setInventory(updatedInventory);
    },[inventory]);
      
    const handleInputChange = useCallback((index: number, field: string, value: string | number) => {
        const updatedInventory = [...inventory];
        updatedInventory[index][field] = value;
        setInventory(updatedInventory);
    }, [inventory]);


    const handleCheckBoxChange = useCallback(() => {
        setChecked(!isChecked);
    },[inventory]);

    const handleAddItemClick = useCallback(() => {
        setInventory([...inventory, {}]);
    }, [inventory]);

    const handleProductSelect = useCallback(async (selectedProduct: any, index: number) => {
        console.log(selectedProduct)
        if (selectedProduct.value) {
            try {
                const data = products.find((product) => product.value.id === selectedProduct.value.id);
                setSelectedProduct(data); 
                const updatedInventory = [...inventory];
                updatedInventory[index] = {
                    ...updatedInventory[index],
                    quantity: selectedOption === Stock.StockIN ? 0 : data.value.quantity,
                    productId:data.value.id,
                    hsnCode:data.value.hsnCode
                };
                setInventory(updatedInventory);   
                const productBatches = batches?.filter((batch) => batch.value.productId === selectedProduct.value.id).sort((a, b) => a.value.id - b.value.id);
                setFilteredBatches(productBatches);
                if(selectedOption===Stock.StockOUT){
                    const defaultBatch = productBatches?.[0];
                    setInventory((prevItems) =>
                      prevItems.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, id: defaultBatch?.value?.id,
                            quantity: defaultBatch?.value?.quantity ,
                            batchNumber: defaultBatch?.value?.batchNumber,
                            expiry:  defaultBatch?.value?.expiry,
                            sellingPrice:  defaultBatch?.value?.sellingPrice,
                            costPrice: defaultBatch?.value?.costPrice,
                            location:defaultBatch?.value?.location,
                            distributors:defaultBatch?.value?.distributors,
                            totalCost:defaultBatch?.value?.totalCost,
                            maxQuantity:defaultBatch?.value?.quantity,
                            productId:defaultBatch?.value?.productId } :
                             item,  
                      )
                    );

                }
                
            } catch (error) {
                console.error("Error fetching product details from API:", error);
            }
        }
    }, [inventory, products, selectedOption]);
    const handleBatchSelect = useCallback(async (selectedProduct: any, index: number) => {
        if (selectedProduct.value) {
            try {
                const data = filteredBatches.find((batch)=>batch.value.id==selectedProduct.value.id);
                console.log(data)
                const updatedInventory = [...inventory];
                updatedInventory[index] = {
                    ...updatedInventory[index],
                    id: data?.value?.id,
                    date: data?.value?.date,
                    time: data?.value?.time,
                    quantity: selectedOption === Stock.StockIN ? 0 : data?.value?.quantity,
                    maxQuantity: Math.max(data?.value?.quantity,data?.value?.maxQuantity),
                    batchNumber: selectedOption === Stock.StockIN ? "" : data?.value?.batchNumber,
                    expiry: selectedOption === Stock.StockIN ? "" : data?.value?.expiry,
                    costPrice: selectedOption === Stock.StockIN ? "" : data?.value?.costPrice,
                    sellingPrice: selectedOption === Stock.StockIN ? "" : data?.value?.sellingPrice,
                    totalCost: selectedOption === Stock.StockIN ? "" : data?.value?.totalCost,
                    hsnCode: selectedProductDetails?.hsnCode,
                    location:selectedOption===Stock.StockIN?"":data?.value?.location,
                    distributors: data?.value?.category,
                    providers: data?.value?.distributors,
                    productId:data?.value?.productId
                };
                setInventory(updatedInventory);
                // if (selectedOption === Stock.StockOUT) {
                //     const updatedProducts = products.filter((product) => product.value !== selectedProduct.value);
                //     setProducts(updatedProducts);
                // }
            } catch (error) {
                console.error("Error fetching product details from API:", error);
            }
        }
    }, [inventory, products, selectedOption]);
    const handleUpdateInventory = useCallback(async () => {
        try {
            for (const item of inventory) {
                const { id, date, quantity, batchNumber, distributors,productId} = item;
                const invoiceType="Manual";
                let {expiry,costPrice,sellingPrice}=item;
                console.log("here is the product",productId)
                expiry = expiry || null;
                costPrice = costPrice ||null;
                sellingPrice = sellingPrice || null;
                if(expiry){
                let datetime = new Date(expiry);
                let isoString = datetime.toISOString(); 
                expiry = isoString.substring(0, 23) + "+00:00";
                }
                 
                const stockStatus=selectedOption;
                const body = {
                    invoiceType,
                    stockStatus,
                    date,
                    quantity,
                    batchNumber,
                    expiry,
                    costPrice,
                    sellingPrice,
                    distributors,
                    productId,
                };

                if(selectedOption===Stock.StockOUT){
                    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/inventory/product/productBatch/${id}?branchId=${appState.currentBranchId}`, body);
                    const notifData={
                        totalItems:body.quantity,
                        source:Notif_Source.Inventory_Timeline_Removed,
                        url: `${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/inventory/products/timeline`,
                        orgId:appState.currentBranch.org.id
                    }
                    const notif= await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/notifications/create`,notifData)
                    console.log('Updated inventory item:', response.data);
                }else if(selectedOption===Stock.StockIN){
                    console.log("saving new batch")
                    const response =await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/inventory/product/productBatch/create?branchId=${appState.currentBranchId}`,body);
                    const notifData={
                        totalItems:body.quantity,
                        source:Notif_Source.Inventory_Timeline_Added,
                        url: `${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/inventory/products/timeline`,
                        orgId:appState.currentBranch.org.id
                    }
                    const notif= await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/notifications/create`,notifData)
                    console.log('Created New Batch Item:', response.data);
                }
                
            }
            alert('Inventory updated successfully');
            onClose();
        } catch (error) {
            console.error("Error updating inventory:", error);
            alert('Error updating inventory. Please try again.');
        }
    },[inventory]);
    

    return (
        <>
            <div className="w-full h-full flex justify-center items-center fixed top-0 left-0 inset-0 backdrop-blur-sm bg-gray-100 bg-opacity-50 z-50">
                <div className="w-[1392px] min-h-[481px] flex-col p-8 bg-gray-200 gap-6 rounded-md">
                    <div className="flex justify-end p-8 gap-4">
                        {/* <button className="border-0 outline-0 cursor-pointer"><Image src={minicon} alt="minimize" /></button> */}
                        <button className="border-0 outline-0 cursor-pointer" onClick={onClose}><Image src={closeicon} alt="minimize" /></button>
                    </div>
                    <div className="text-gray-500 text-xl font-medium ">Update Inventory</div>
                    <div className="text-neutral-400 text-base font-medium ">Add or subtract quantity from inventory</div>
                    <div className="w-full h-[72px] px-6 py-4 bg-white border border-neutral-400 justify-between items-center gap-4 flex">
                        <div className="flex gap-4">
                            <RadioButton
                                label="Stock In"
                                value={Stock.StockIN}
                                checked={selectedOption === Stock.StockIN}
                                onChange={handleRadioChange}
                            />
                            <RadioButton
                                label="Stock Out"
                                value={Stock.StockOUT}
                                checked={selectedOption === Stock.StockOUT}
                                onChange={handleRadioChange}
                            />
                        </div>
                        <div className="relative">
                            <button className="cursor-pointer h-11 px-4 py-2.5 bg-zinc-900 rounded-[5px] border-0 justify-start items-center gap-2 flex" onClick={handleAddItemClick}>
                                <Image src={addicon} alt="add" />
                                <div className="text-white text-base font-bold  bg-transparent border-0" >
                                    Add Item
                                </div>
                            </button>
                        </div>
                    </div>
                    <div className="pb-6">
                        <div className='flex  w-full justify-evenly items-center box-border bg-gray-100  h-12  border-b border-neutral-400 text-gray-500'>
                            <div className=' flex text-gray-500 text-base font-medium  w-[3rem]'>No.</div>
                            <div className=' flex text-gray-500 text-base font-medium  w-[12rem]'>Product</div>
                            <div className=' flex text-gray-500 text-base font-medium  w-[6rem]'>Quantity</div>
                            <div className=' flex text-gray-500 text-base font-medium  w-[6rem]'>Batch No.</div>
                            <div className=' flex text-gray-500 text-base font-medium  w-[8rem]'>Expiry</div>
                            <div className=' flex text-gray-500 text-base font-medium  w-[5rem]'>Barcode</div>
                            <div className=' flex text-gray-500 text-base font-medium  w-[6rem]'>Location</div>
                            <div className=' flex text-gray-500 text-base font-medium  w-[8rem]'>Distributor</div>
                            <div className=' flex text-gray-500 text-base font-medium  w-[6rem]'>Total Cost</div>
                            <div className=' flex text-gray-500 text-base font-medium  w-[6rem]'>MRP</div>
                            <div className=' flex text-gray-500 text-base font-medium  w-[6rem]'>Selling Price</div>
                            <div className=' flex text-gray-500 text-base font-medium  w-[2rem]'></div>
                        </div>
                        {inventory.map((item, index) => (
                            <div key={index} className='flex justify-evenly items-center w-full  py-2 box-border bg-white border border-solid border-gray-300 text-gray-400 border-t-0.5  '>
                                <div className='w-[3rem] flex items-center text-neutral-400 text-base font-medium'>{index + 1}</div>
                                <div className='w-[12rem] flex items-center text-neutral-400 text-base font-medium'>
                                    <Select
                                        className="text-gray-500 text-base font-medium  w-[90%] border-0 boxShadow-0"
                                        classNamePrefix="select"
                                        value={products.find((prod) => prod.value.id === item.productId)}
                                        isClearable={false}
                                        isSearchable={true}
                                        name="itemName"
                                        options={products}
                                        onChange={(selectedProduct: any) => handleProductSelect(selectedProduct, index)}
                                    />
                                </div>
                                <div className='w-[6rem] flex items-center text-neutral-400 text-base font-medium gap-[12px]'>
                                    <button className="bg-white rounded-[5px] border-2 border-solid border-borderGrey" onClick={() => handleQuantityDecClick(index)}>
                                        <Image className="w-4 h-2" src={subicon} alt="-" />
                                    </button>
                                    <div>{item.quantity}</div>
                                    <button className="bg-white rounded-[5px] border-2 border-solid border-borderGrey" onClick={() => handleQuantityIncClick(index)}>
                                        <Image className="w-4 h-2" src={add1icon} alt="+" />
                                    </button>
                                </div>
                                <div className='w-[6rem] flex items-center text-neutral-400 text-base font-medium'>
                                    { selectedOption===Stock.StockIN ?(
                                    <input
                                    type="text"
                                    value={item.batchNumber}
                                    onChange={(e) => handleInputChange(index,'batchNumber', e.target.value)}
                                    className="w-full border border-solid border-borderGrey focus:border-textGreen outline-none bg-transparent text-neutral-400 text-base font-medium px-1 py-1 rounded"
                                    name={`batchNumber-${index}`}
                                    />
                                    ):
                                    (
                                      <Select
                                      className="text-gray-500 text-base font-medium  w-full border-0 boxShadow-0"
                                      classNamePrefix="select"
                                      value={batches.find((prod) => prod.value.id === item.id)}
                                      isClearable={false}
                                      isSearchable={true}
                                      name={`batchNumber=${index}`}
                                      options={filteredBatches}
                                      onChange={(selectedProduct: any) => handleBatchSelect(selectedProduct, index)}
                                  />  
                                    )}
           
        </div>
        <div className='w-[8rem] flex items-center text-neutral-400 text-base font-medium'>
        <DatePicker
            // showIcon
            className="w-full rounded-[5px] border border-solid border-borderGrey outline-none  focus:border focus:border-textGreen px-1 py-2"
            selected={item.expiry}
            placeholderText="MM/DD/YYYY"
            onChange={(date:any) =>{ 
                handleInputChange(index,"expiry",date)}}
            calendarClassName="react-datepicker-custom"
            // value={startDate.toLocaleDateString()}
            // customInput={
            //     // <div className="relative">
            //     //     <input
            //     //         className="w-full h-9 text-textGrey1 text-base font-medium px-2 rounded border border-solid border-borderText focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
            //     //         value={startDate.toLocaleDateString()}
                        
            //     //     />
                    
            //     // </div>
            // }
        />
    {item.expiry && selectedOption !== Stock.StockIN && (
        <div>{formatDateAndTime(item.expiry).formattedDate}</div>
    )}
</div>

        <div className='w-[5rem] flex items-center text-neutral-400 text-base font-medium'>
            <input
                type="text"
                value={item.hsnCode}
                onChange={(e) => handleInputChange(index, 'hsnCode' ,e.target.value)}
                className="w-full border border-solid border-borderGrey focus:border-textGreen outline-none bg-transparent text-neutral-400 text-base font-medium px-1 py-1 rounded "
            name={`hsnCode-${index}`}
            />
        </div>
        <div className='w-[6rem] flex items-center text-neutral-400 text-base font-medium'>
            <input
                type="text"
                value={item.category}
                onChange={(e) => handleInputChange(index,'category' ,e.target.value)}
                className="w-full border border-solid border-borderGrey focus:border-textGreen outline-none bg-transparent text-neutral-400 text-base font-medium px-1 py-1 rounded"
            name={`category-${index}`}
            />
        </div>
        <div className='w-[8rem] flex items-center text-neutral-400 text-base font-medium '>
        <input
            type="text"
            value={item.providers}
            onChange={(e) => handleInputChange(index,'providers', e.target.value)}
            className="w-full border border-solid border-borderGrey focus:border-textGreen outline-none bg-transparent text-neutral-400 text-base font-medium px-1 py-1 rounded"
            name={`providers-${index}`}
        />
        </div>
        <div className='w-[6rem] flex items-center text-neutral-400 text-base font-medium'>₹ 
            <input
                type="number"
                value={item.costPrice}
                onChange={(e) => handleInputChange(index, 'costPrice',parseFloat(e.target.value))}
                className="w-full rounded-[5px] border border-solid border-borderGrey focus:border-textGreen outline-none bg-transparent text-neutral-400 text-base font-medium"
                name={`costPrice-${index}`}
            />
        </div>
        <div className='w-[6rem] rounded-[5px] flex items-center text-neutral-400 text-base font-medium'>₹
            <input
                type="number"
                value={item.costPrice}
                onChange={(e) =>  handleInputChange(index, 'costPrice',parseFloat(e.target.value))}
                className="w-full rounded-[5px] border border-solid border-borderGrey focus:border-textGreen outline-none bg-transparent text-neutral-400 text-base font-medium"
                name={`costPrice-${index}`}
            />
        </div>

        <div className='w-[6rem] flex items-center text-neutral-400 text-base font-medium'>₹
            <input
                type="number"
                value={item.sellingPrice}
                onChange={(e) =>  handleInputChange(index, 'sellingPrice',parseFloat(e.target.value))}
                className="w-full rounded-[5px] border border-solid border-borderGrey focus:border-textGreen outline-none bg-transparent text-neutral-400 text-base font-medium"
                name={`sellingPrice-${index}`}
            />
        </div>
        <div className="w-[2rem]">
        <button onClick={() => handleDeleteRow(index)} className=" border-0 flex-col justify-start items-end gap-2.5 flex">
                                <div className="h-6 px-2 py-1 bg-gray-100 rounded-[5px] justify-start items-center gap-1 flex">
                                    <Image className="w-4 h-4 relative" src={deleteicon} alt="delete" />
                                </div>
        </button>
        </div>
    </div>
))}
                    </div>
                    <div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="pr-[4px]">
                                    <input type="checkbox" onChange={handleCheckBoxChange} />
                                </div>
                                <div className="text-teal-400 text-base font-medium ">
                                    Update total cost as Expense
                                </div>
                            </div>
                            <div className="bg-black px-4 py-2.5 rounded-[5px] justify-start items-center gap-2 flex">
                                <Image src={checkicon} alt="add" />
                                <button className="text-white text-base font-bold  bg-transparent border-0" onClick={handleUpdateInventory}>
                                    Update Inventory
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Popup2;
