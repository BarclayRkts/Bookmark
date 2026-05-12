import BookmarkCard from "@/app/bookmarks/BookmarkCard";

export default function BookmarksGrid({refreshKey, setOpen, onEdit, setRefreshKey, bookmarks, loading}: any) {

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 animate-pulse">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-[300px] w-full bg-muted rounded-xl shadow-sm"/>
                ))}
            </div>
        );
    }

    if (bookmarks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-muted-foreground">No bookmarks found. Start by adding one!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {bookmarks.map((bookmark : any) => (
                <BookmarkCard key={bookmark.bookmarkId} data={bookmark} setOpen={setOpen} onEdit={onEdit} setRefreshKey={setRefreshKey}/>
            ))}
        </div>
    );
}
