import { Outlet } from "react-router-dom";

export const RootLayout = () => {
    return (
        <div className="bg-gray-200 h-screen w-screen overflow-auto">
            <main className="flex justify-center h-full items-center py-4 px-4 md:px-10 lg:px-20">
                <Outlet />
            </main>
        </div>
    );
};