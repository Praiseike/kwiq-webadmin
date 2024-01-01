import Layout from "../layouts/layout";
import { ReactElement } from "react";
export interface  EmptyProps {
}

const  Empty =  (props:  EmptyProps) =>{
  return (
    <div>
      
    </div>
  );
}

Empty.getLayout = function getLayout(page: ReactElement) {
    return (
      <Layout>
        {page}
      </Layout>
    )
  }
export default Empty