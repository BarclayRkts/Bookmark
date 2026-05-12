"use client";

import * as React from "react"
import {Search, Plus} from "lucide-react";
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {useEffect, useRef, useState} from "react";

export function Header({handleAddClick, handleSearch}: any) {
    const isFirstRender = useRef(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            handleSearch(searchTerm);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, handleSearch]);
    return (
        <>
            <header
                className="sticky top-0 z-10 w-full border-b bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-16 items-center justify-between gap-6 px-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                        <Input
                            type="search"
                            placeholder="Search by title, description, or tags..."
                            className="w-full pl-9 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button className="flex items-center gap-2 px-4 py-2" onClick={handleAddClick}>
                            <Plus className="h-4 w-4"/>
                            <span>Add Bookmark</span>
                        </Button>

                        <Avatar className="h-10 w-10">
                            <AvatarImage src="/path-to-your-avatar.jpg" alt="User"/>
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                    </div>
                </div>

            </header>
        </>
    )
}