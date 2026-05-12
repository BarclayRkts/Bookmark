import {MoreVertical, Eye, Clock3, Pin, Trash2, Pencil, Archive} from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function BookmarkCard({data, onEdit, setRefreshKey}: any) {

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    const handleDelete = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}/bookmark/delete/${data.bookmarkId}?username=dejabarclay`,
                { method: 'DELETE' }
            );

            if (response.ok) {
                setRefreshKey((prev: number) => prev + 1);
            } else {
                console.error("Delete failed with status:", response.status);
            }
        } catch (error) {
            console.error("Network or parsing error:", error);
        }
    };

    const getAbsoluteUrl = (url: string) => {
        if (!url) return "#";
        return url.startsWith("https://") || url.startsWith("https://")
            ? url
            : `https://${url}`;
    };

    const handleArchive = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}/bookmark/archive/${data.bookmarkId}?username=dejabarclay`,
                { method: 'PATCH' }
            );

            if (response.ok) {
                setRefreshKey((prev: number) => prev + 1);
            }
        } catch (error) {
            console.error("Archive failed:", error);
        }
    };

    const handleTogglePin = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}/bookmark/pin/${data.bookmarkId}?username=dejabarclay`,
                { method: 'PATCH' }
            );

            if (response.ok) {
                setRefreshKey((prev: number) => prev + 1);
            }
        } catch (error) {
            console.error("Pinning failed:", error);
        }
    };

    const updateViewCount = async () => {
        try {
            await fetch(
                `${BASE_URL}/bookmark/increment-views/${data.bookmarkId}?username=dejabarclay`,
                { method: 'PATCH' }
            );
        } catch (error) {
            console.error("Failed to track view:", error);
        }
    };

    const formattedDate = data.createdAt
        ? new Date(data.createdAt).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short'
        })
        : 'Unknown date';

    return (
        <Card className="w-full rounded-xl shadow-sm border border-neutral-200/60 bg-white flex flex-col">
            {/* Reduced vertical padding from p-4 to py-2.5 */}
            <CardHeader className="flex flex-row items-center gap-3 px-4 py-2.5 border-b border-neutral-100">
                <div className="flex aspect-square size-9 items-center justify-center rounded-lg border border-neutral-100 bg-neutral-50 p-1 flex-shrink-0">
                    <img src={data.iconUrl} alt="" className="size-full object-contain"/>
                </div>
                <div className="flex flex-col flex-1 min-w-0 justify-center">
                    <CardTitle className="text-sm font-semibold truncate leading-none">
                        {data.title}
                    </CardTitle>
                    <CardDescription className="text-[10px] text-neutral-400 truncate mt-1">
                        <a
                            href={getAbsoluteUrl(data.url)}
                            key={data.bookmarkId}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={updateViewCount}
                        >
                            {data.url.replace(/^https?:\/\//, '').split(/[/?#]/)[0]}
                        </a>
                    </CardDescription>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex size-9 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-all flex-shrink-0">
                            <MoreVertical className="size-5"/>
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-32 rounded-xl">
                        <DropdownMenuItem
                            onClick={() => onEdit(data)}
                            className="gap-2 cursor-pointer focus:bg-neutral-50"
                        >
                            <Pencil className="size-4 text-neutral-500" />
                            <span className="text-sm font-medium">Edit</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={handleDelete}
                            className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                            <Trash2 className="size-4" />
                            <span className="text-sm font-medium">Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>

            <CardContent className="px-4 py-2.5 space-y-2.5 flex-1">
                <p className="text-sm text-neutral-600 leading-snug line-clamp-4">
                    {data.description}
                </p>

                <div className="flex flex-wrap gap-1">
                    {data.tags.map((tag: any) => (
                        <Badge key={tag} className="px-1.5 py-0 text-[10px] font-medium rounded-md h-5" variant="secondary">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardContent>

            <CardFooter className="flex-row justify-between items-center px-4 py-2 border-t border-neutral-100 text-[10px] text-neutral-400 font-medium">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <Eye className="size-3.5"/>
                        <span>{data.views}</span>
                    </div>
                    <div className="flex items-center gap-1" title={`Created on: ${formattedDate}`}>
                        <Clock3 className="size-3.5"/>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleArchive}
                            className="flex items-center gap-1 hover:text-amber-600 transition-colors"
                            title="Archive Bookmark"
                        >
                            <Archive className="size-3.5"/>
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleTogglePin}
                    className={`transition-colors ${
                        data.isPinned
                            ? "text-teal-600 fill-teal-600" // Filled and colored if pinned
                            : "text-neutral-300 hover:text-neutral-600"
                    }`}
                >
                    <Pin className="size-4" />
                </button>
            </CardFooter>
        </Card>
    )
}