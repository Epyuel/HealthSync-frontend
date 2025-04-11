import { Card } from "@/components/ui/card";
import Image, { StaticImageData } from "next/image";

const StatCard = ({ title, value, icon }: { title: string; value: string; icon: StaticImageData }) => (
    <Card className="flex flex-col items-center py-8 px-10 shadow-md rounded-2xl w-full md:w-fit space-y-2 bg-[#e6fcff]">
      <div className="flex items-center justify-between w-full gap-4">
        <div className="flex flex-col items-start justify-center gap-2">
          <h3 className="text-sm font-semibold mt-2 text-gray-500">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <Image src={icon} alt="" width={40} height={40}/>
      </div>
      {/* <p className="text-sm"><span className="text-primaryColor">{change}</span> Up from last month</p> */}
    </Card>
);

export default StatCard;