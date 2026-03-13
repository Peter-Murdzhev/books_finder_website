import AccountPageUI from "@/components/AccountPageUI";
import { Suspense } from "react";

const page = () => {
  return (
    <div>
      <Suspense fallback={null}>
        <AccountPageUI/>
      </Suspense>
    </div>
  )
}

export default page;