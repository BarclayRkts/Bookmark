"use client"

import * as React from "react"
import {SidebarProvider} from "@/components/ui/sidebar"
import {AppSidebar} from "@/app/sidebar/AppSidebar";
import {Header} from "@/app/header/Header";
import {useCallback, useEffect, useState} from "react";
import BookmarksGrid from "@/app/bookmarks/BookmarksGrid";
import AddBookmarkModal from "@/app/bookmarks/AddBookmarkModal";

export default function Home() {
    const [activeTab, setActiveTab] = useState("home");
    const [refreshKey, setRefreshKey] = useState(0);
    const [open, setOpen] = React.useState(false);
    const [bookmarks, setBookmarks] = useState<any[]>([]);
    const [selectedBookmark, setSelectedBookmark] = useState(null);
    const currentUsername = "dejabarclay";
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const [loading, setLoading] = useState(true);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [availableTags, setAvailableTags] = useState<string[]>([]);

    const handleEditClick = (bookmark: any) => {
        setSelectedBookmark(bookmark);
        setOpen(true);
    };

    const handleAddClick = () => {
        setSelectedBookmark(null);
        setOpen(true);
    };

    const baseBookmarks = bookmarks.filter((b) => {
        if (activeTab === "home") return !b.isArchived;
        if (activeTab === "archived") return b.isArchived;
        return true;
    });

    const allBookmarks = baseBookmarks
        .filter((bookmark) => {
            if (selectedTags.length === 0) return true;
            return bookmark.tags?.some((tag: string) => selectedTags.includes(tag));
        })
        .sort((a, b) => {
            if (a.isPinned === b.isPinned) return 0;
            return a.isPinned ? -1 : 1;
        });

    const handleSearch = useCallback(async (query: string) => {
        try {
            const url = query
                ? `${BASE_URL}/bookmark/search?query=${query}&username=${currentUsername}`
                : `${BASE_URL}/bookmark/all/${currentUsername}`;

            const response = await fetch(url);
            const data = await response.json();
            console.log("data: ", data);
            setBookmarks(data);
        } catch (error) {
            console.error("Search failed:", error);
        }
    }, [currentUsername]);

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const userId = "dejabarclay";
                const response = await fetch(`${BASE_URL}/bookmark/all/${userId}`);

                if (response.ok) {
                    const data = await response.json();
                    setBookmarks(data);
                }
            } catch (error) {
                console.error("Failed to fetch bookmarks:", error);
            } finally {
                setLoading(false);
            }
        };

        void fetchBookmarks();
    }, [refreshKey]);

    useEffect(() => {
        const fetchTags = async () => {
            const response = await fetch(`${BASE_URL}/bookmark/tags/${currentUsername}`);
            if (response.ok) {
                const data = await response.json();
                setAvailableTags(data);
            }
        };
        fetchTags();
    }, [currentUsername]);

    const handleTagToggle = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag)
                ? prev.filter((t) => t !== tag)
                : [...prev, tag]
        );
    };

    return (
        <SidebarProvider>
            <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} selectedTags={selectedTags}
                        onTagToggle={handleTagToggle} availableTags={availableTags}/>
            <div className="flex flex-1 flex-col">
                <Header handleAddClick={handleAddClick} handleSearch={handleSearch}/>
                <main className="flex-1 p-6">
                    <h1 className="text-2xl font-bold mb-6">
                        {activeTab === "home" ?
                            <BookmarksGrid
                                refreshKey={refreshKey}
                                setOpen={setOpen}
                                onEdit={handleEditClick}
                                setRefreshKey={setRefreshKey}
                                bookmarks={allBookmarks}
                                loading={loading}
                            />
                            : <BookmarksGrid
                                refreshKey={refreshKey}
                                setOpen={setOpen}
                                onEdit={handleEditClick}
                                setRefreshKey={setRefreshKey}
                                bookmarks={allBookmarks}
                                loading={loading}
                            />}
                    </h1>
                </main>
                <AddBookmarkModal open={open} setOpen={setOpen} setRefreshKey={setRefreshKey} initialData={selectedBookmark}/>
            </div>
        </SidebarProvider>
    )
}