
import { Skeleton } from "@/components/ui/skeleton"


const CardSkeloton = () => { 

    return (
        <section className={`flex flex-col relative  justify-center w-[420px] rounded-md bg-black/30 shadow-md opacity group overflow-hidden`}>
            <div>
                <div className={" relative p-4 px-6 bg-contain bg-[image:var(--image-url)]"}>
                    <div className="flex justify-between items-center mb-12">
                        <Skeleton className="h-6 w-[170px] bg-[#545454]/5"/>
                        <div className="flex space-x-1">
                            <Skeleton className="h-4 w-4 bg-[#545454]/5" />
                            <Skeleton className="h-4 w-4 bg-[#545454]/5" />
                            <Skeleton className="h-4 w-4 bg-[#545454]/5" />
                            <Skeleton className="h-4 w-4 bg-[#545454]/5" />
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <Skeleton className="h-[250px] w-[250px] bg-[#545454]/5 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-[60px] bg-[#545454]/5 rounded-full" />
                </div>

                <div className={`flex items-center justify-between py-3 px-3 border-t border-[0.5] border-[#545454]/20`}>
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-10 w-10 bg-[#545454]/5 rounded-full"/>
                        <Skeleton className="h-4 w-[70px] bg-[#545454]/5" />

                    </div>
                    <Skeleton className="h-10 w-[120px] bg-[#545454]/5" />

                </div>
            </div>
        </section>
    )
}

export default CardSkeloton