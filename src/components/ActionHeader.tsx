import { useContext } from "react"
import { AuthContext } from "./AuthContext"
import { Button } from "./ui/button"

export const ActionHeader = ({ action, actionBtnText }: { action: () => void; actionBtnText: string }) => {
    const authContext = useContext(AuthContext)

    return (
        <div className="w-full flex justify-between">
            <Button className="rounded-xl" onClick={() => {
                action()
            }}>{actionBtnText}</Button>
            <Button variant={'ghost'} onClick={() => {
                authContext?.logout()
            }}>
                <span className="text-destructive">
                    Logout
                </span>
            </Button>
        </div>
    )
}