import { Dialog, DialogContent } from "./ui/dialog"
import failure from "../assets/failure.svg"
import { Button } from "./ui/button"

export const FailureModal = ({
    open, onOpenChange, msg
}: {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    msg?: string
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex gap-[30px] h-[295px] px-[43px] flex-col justify-center items-center">
                <div className="justify-center flex items-center">
                    <img src={failure} />
                </div>
                <span className="text-2xl">
                    {msg ?? 'Invalid credentials'}
                </span>
                <Button className="w-[212px] rounded-full text-black" onClick={() => onOpenChange(false)}>Ok</Button>
            </DialogContent>
        </Dialog>
    )
}