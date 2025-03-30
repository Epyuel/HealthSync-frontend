"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import DocSearch from "@/appPages/common/DocSearch";
import Back from "@/components/navigation/Back";

const DocSearchWrapper = () => {
  const router = useRouter();
  const query = useSearchParams();
  const doctorID: string = query?.get("key") as string;


  return <DocSearch doctorID={doctorID} />;

};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Back/>
      <DocSearchWrapper />
    </Suspense>
  );
};

export default Page;
