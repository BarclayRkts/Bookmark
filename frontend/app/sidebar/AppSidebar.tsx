"use client"
import * as React from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {Archive, Bookmark, Home} from "lucide-react";
import {Checkbox} from "@/components/ui/checkbox";
import {useEffect, useState} from "react";

const navItems = [
    {title: "Home", url: "/", icon: Home, isActive: true},
    {title: "Archived", url: "/", icon: Archive,},
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    activeTab: string;
    onTabChange: (id: string) => void;
    selectedTags?: string[];
    onTagToggle?: (tag: string) => void;
    availableTags: string[];
}

export function AppSidebar({
                               activeTab,
                               selectedTags,
                               onTagToggle,
                               onTabChange,
                               availableTags,
                               ...props
                           }: AppSidebarProps) {
    const [mounted, setMounted] = useState(false);

    const data = {
        navMain: [
            {
                title: "Main",
                url: "#",
                items: navItems
            },
            {
                title: "Tags",
                items: availableTags.map((tag: string) => ({
                    title: tag,
                    url: "#",
                })),
            },
        ],
    }

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <Sidebar {...props} />;
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" className="hover:bg-transparent cursor-default" asChild>
                            <div className="flex items-center gap-3">
                                <div
                                    className="flex aspect-square size-8 items-center justify-center rounded-lg bg-teal-950 text-white">
                                    <Bookmark className="size-5"/>
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-bold text-lg tracking-tight">Bookmark Manager</span>
                                </div>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {data.navMain.map((group, index) => {
                    const isTag = group.title === "Tags";

                    return (
                        <SidebarGroup key={group.title || index}>
                            {group.title && group.title !== "Main" && (
                                <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                            )}
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {group.items.map((item) => {
                                        // @ts-ignore
                                        const IconComponent = item?.icon;
                                        // @ts-ignore
                                        const itemId = item?.id || item.title.toLowerCase();
                                        return (
                                            <SidebarMenuItem key={item.title}>
                                                <div
                                                    className="flex items-center gap-1 px-2 rounded-md hover:bg-sidebar-accent group/row">
                                                    {isTag && (
                                                        <Checkbox
                                                            id={item.title}
                                                            className="size-4 ml-1"
                                                            checked={selectedTags?.includes(item.title)}
                                                            onCheckedChange={() => onTagToggle?.(item.title)}
                                                        />
                                                    )}
                                                    <SidebarMenuButton
                                                        isActive={activeTab === itemId}
                                                        onClick={() => onTabChange(itemId)}
                                                        className="flex-1 bg-transparent hover:bg-transparent px-2"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {IconComponent && <IconComponent className="size-4"/>}
                                                            <span className="text-sm font-medium">{item.title}</span>
                                                        </div>
                                                    </SidebarMenuButton>
                                                </div>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    );
                })}
            </SidebarContent>
        </Sidebar>
    );
}

