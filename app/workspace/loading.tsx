import { LoaderOne } from "@/components/ui/Loader";

export default function Loading() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-[#0A0A23] z-[9999] absolute inset-0">
            <LoaderOne />
        </div>
    );
}
