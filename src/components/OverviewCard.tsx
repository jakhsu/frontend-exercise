import { cn } from "@/lib/utils"
import { Card, CardContent } from "./ui/card"

export const OverviewCard = ({ title, value, className }: { title: string, value?: number, className?: string }) => {
    return (
        <Card className={cn('w-[230px]', className)}>
            <CardContent className="flex items-center px-[80px] gap-y-[17px] py-[23px] flex-col">
                <span className="capatalize whitespace-nowrap">
                    {title}
                </span>
                <span className="text-4xl">
                    {value}
                </span>
            </CardContent>
        </Card>
    )
}