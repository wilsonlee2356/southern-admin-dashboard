import React from "react";
import PageWrapper from "./page_wrapper";

async function ClientManagementPage() {
  // const { data: session, status } = useSession();
  // // const data = await InvoiceService.getAll();
  // const data = await CombinedService.get_all_invoice(session?.accessToken);
  // const clientData = await CombinedService.get_all_client();
  // const postData = await CombinedService.get_all_post();

  return (
    <>
      <div>
        {/* <Suspense fallback={<div>Loading search form...</div>}> */}
        <PageWrapper />
        {/* </Suspense> */}
      </div>
      {/* <InputBox dataArray={data}/>x
        <br />
        <InvoiceInputTable dataArray={data}/> */}
    </>
  );
}

export default ClientManagementPage;
