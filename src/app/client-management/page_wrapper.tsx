"use client";
import { useState, useEffect, useContext } from "react";
import {
  client,
  post,
  invoiceData,
  postClientInvoiceSummary,
} from "@/types/ObjectTypes/InvoiceType";
import PostSearchBox from "./_components/post-search-box";
import { CombinedService } from "@/app/api/invoice";
import { InvoiceService } from "../api/services/invoiceService";
import MuiDataGridForPostManagement from "@/components/Tables/DataGrid/MuiDataGridForPostManagement";
import { usePostClientContent } from "@/utils/post-client-content";

type PageWrapperProps = {
  // dataArray?: invoiceData[]; // Pass data as a prop instead of fetching here
  // clientData?: client[];
  // postData?: post[];
};

export default function PageWrapper({
  // // dataArray,
  // clientData,
  // postData,
}: PageWrapperProps) {
  const [processedDataArray, setProcessedDataArray] = useState<postClientInvoiceSummary[]>([]);
  const [dataToShow, setDataToShow] = useState<postClientInvoiceSummary[]>([]); //0 = NumberOfInvoices, 1 = TotalAmount, 2 = TotalOutstandingAmount, 3 = post_id, 4 = postcode, 5 = is_ended, 6 = clientName
  //   const [invoiceNumber, setInvoiceNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [postcode, setPostcode] = useState("");
  //   const [amount, setAmount] = useState("");
  //   const [period, setPeriod] = useState("");
  const [popUpOpen, setPopUpOpen] = useState(false);
  const [popUpOpenEdit, setPopUpOpenEdit] = useState(false);
  const [showNotEndedPosts, setShowNotEndedPosts] = useState(true);
  const [showEndedPosts, setShowEndedPosts] = useState(false);
  const [updateDataNeeded, setUpdateDataNeeded] = useState(false);

  const { updateInvoiceData, invoiceData, clientData, postData } = usePostClientContent();

  // let data = usePostClientContent().invoiceData;
  // let clients = usePostClientContent().clientData;
  // let posts = usePostClientContent().postData;
  // useEffect(() => {
  //   console.log( typeof dataArray[0].postcode  );
  //   setDataToShow(dataArray);
  // }, []);

  // useEffect(() => {
  //   console.log( showEndedPosts, showNotEndedPosts, showNotEndedPosts && !dataArray[0].ended );
  // }, [showEndedPosts, showNotEndedPosts]);

  useEffect(() => {
      const processedArray: postClientInvoiceSummary[] = []; //
      postData?.map((postItem) => {
        processedArray.push({
          post_id: postItem.postId,
          postcode: postItem.postcode,
          numberOfInvoices: 0,
          totalAmount: 0,
          outstanding: 0,
          ended: postItem.isEnded,
          client_name: postItem.client.clientName,
        })});
      invoiceData?.map((row: invoiceData) => {
        const existingPost = processedArray.find(
          (item) => item.post_id === row.post.postId,
        );
        if (existingPost) {
          existingPost.numberOfInvoices += 1;
          existingPost.totalAmount += row.amount;
          existingPost.outstanding += row.amount - row.paidAmount;
        } else {
          processedArray.push({
            post_id: row.post.postId,
            postcode: row.post.postcode,
            numberOfInvoices: 1,
            totalAmount: row.amount,
            outstanding: row.amount - row.paidAmount,
            ended: row.post.isEnded,
            client_name: row.post.client.clientName,
          });
        }
      });
      setProcessedDataArray(processedArray);
      console.log("Processed data array: ", processedArray);
    }, [postData, invoiceData]);

  useEffect(() => {
    const selectedData: any = processedDataArray?.filter(
      (row: postClientInvoiceSummary) =>
        (!checkEmpty(clientName)
          ? row.client_name
              .toLowerCase()
              .includes(clientName.toLowerCase())
          : true) &&
          (!checkEmpty(postcode)
            ? row.postcode.toLowerCase().includes(postcode.toLowerCase())
            : true) &&
          (showNotEndedPosts &&
          !row.ended) ||
        (showEndedPosts && row.ended),

      //&& (!checkEmpty(startDate) ? checkDateWithinMonths(row.invoiceDate, parseInt(startDate)) : true)
    );
    setDataToShow(selectedData);
    console.log("Filtered post data: ", selectedData);
    //console.log("Type ", selectedData = dataArray);
  }, [clientName, postcode, showNotEndedPosts, showEndedPosts, processedDataArray]);

  // useEffect(() => {
  //   if (updateDataNeeded) {
  //     console.log("Updating data");
  //     // InvoiceService.getAll().then((res) => {
  //     //   dataArray = res;
  //     //   // setDataToShow(res);
  //     // });
  //     CombinedService.get_all_client().then((res) => {
  //       clients = res;
  //     });
  //     CombinedService.get_all_post().then((res) => {
  //       posts = res;
  //     });
  //     setUpdateDataNeeded(false);
  //   }
  // }, [updateDataNeeded]);

  const checkEmpty = (value: string) => {
    return value === "" || value === undefined || value === null;
  };

  return (
    <>
      {/* <InputBox dataArray={dataArray} clientData={clientData} postData={postData} setDataToShow={setDataToShow}/>
      <MuiDataGridWithPopUpButton
        dataArray={dataToShow}
        popUpOpen={popUpOpen}
        setPopUpOpen={setPopUpOpen}
        popUpOpenEdit={popUpOpenEdit}
        setPopUpOpenEdit={setPopUpOpenEdit}
        setFilteredData={setDataToShow}
      /> */}
      <PostSearchBox
        // dataArray={dataToShow}
        clientData={clientData ?? []}
        postData={postData ?? []}
        clientName={clientName}
        postcode={postcode}
        showEndedPosts={showEndedPosts}
        showNotEndedPosts={showNotEndedPosts}
        setClientName={setClientName}
        setPostcode={setPostcode}
        setFilteredData={setDataToShow}
        setUpdateDataNeeded={() => {}}
        setShowEndedPosts={setShowEndedPosts}
        setShowNotEndedPosts={setShowNotEndedPosts}
      />

      <MuiDataGridForPostManagement
        dataArray={dataToShow}
        postArray={postData ?? []}
        popUpOpen={popUpOpen}
        setPopUpOpen={setPopUpOpen}
        popUpOpenEdit={popUpOpenEdit}
        setPopUpOpenEdit={setPopUpOpenEdit}
        setFilteredData={setDataToShow}
      />
    </>
  );
}
