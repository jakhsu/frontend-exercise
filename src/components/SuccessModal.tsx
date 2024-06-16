import { Dialog, DialogContent } from "./ui/dialog"
import success from "../assets/success.svg"

export const SuccessModal = ({
    open, onOpenChange, msg
}: {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    msg?: string
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex gap-[30px] h-[295px] px-[43px] flex-col justify-center">
                <div className="justify-center flex items-center">
                    <img src={success} />
                </div>
                <span className="text-center text-2xl">
                    {msg ?? 'Successfully login'}
                </span>
            </DialogContent>
        </Dialog>
    )
}