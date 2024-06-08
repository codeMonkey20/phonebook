import { twMerge } from "tailwind-merge";

export default function Skeleton({
    className,
    ...props
}: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
>) {
    return (
        <div
            className={twMerge(
                "rounded-lg bg-slate-200 animate-pulse h-full w-full",
                className
            )}
            {...props}
        >
            ‎
        </div>
    );
}
