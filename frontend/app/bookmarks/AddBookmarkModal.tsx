import {Loader2, Plus, UploadIcon, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Badge} from "@/components/ui/badge";
import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";

// --- Sample Tag Data ---
const initialTags = [
    {id: 1, name: "Development"},
    {id: 2, name: "Resources"},
    {id: 3, name: "Reference"},
]

const availableTags = ["AI", "Community", "CSS", "JavaScript", "Git", "Design", "Framework"]

export default function AddBookmarkModal({open, setOpen, setRefreshKey, initialData}: {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>;
    setRefreshKey: Dispatch<SetStateAction<number>>;
    initialData?: any;
}) {
    const isEditing = !!initialData;
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetchingStatus, setFetchingStatus] = useState("IDLE");
    const [selectedTags, setSelectedTags] = useState(initialTags);
    const [tagInput, setTagInput] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    useEffect(() => {
        if (open && initialData) {
            setUrl(initialData.url || "");
            setTitle(initialData.title || "");
            setDescription(initialData.description || "");
            setImageUrl(initialData.iconUrl || "");
            setSelectedTags(initialData.tags?.map((tag: string, index: number) => ({ id: index, name: tag })) || []);
            setFetchingStatus("SUCCESS");
        }
        else  {
            setUrl("");
            setTitle("");
            setDescription("");
            setImageUrl("");
            setSelectedTags([]);
            setFetchingStatus("IDLE");
            setLoading(false);
        }
    }, [open, initialData]);

    const fetchMetadata = async (targetUrl: string) => {
        let finalUrl = targetUrl.trim();
        if (!finalUrl) return;

        if (!/^https?:\/\//i.test(finalUrl)) {
            finalUrl = `https://${finalUrl}`;
        }
        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/api/fetch?url=${encodeURIComponent(finalUrl)}`);
            const data = await response.json();

            if (data.error === "THIS_WEBSITE_DOES_NOT_SUPPORT_AUTO_FETCHING") {
                setFetchingStatus("THIS_WEBSITE_DOES_NOT_SUPPORT_AUTO_FETCHING");
                return;
            }

            if (data.title) setTitle(data.title);
            if (data.description) setDescription(data.description);
            if (data.image) setImageUrl(data.image);
            setFetchingStatus("SUCCESS");
        } catch (error) {
            console.error("Failed to fetch metadata:", error);
        } finally {
            setLoading(false);
        }
    };

    const addTag = (tagName: string) => {
        if (selectedTags.some(t => t.name === tagName)) return;

        const newTag = {
            id: Date.now(),
            name: tagName
        };
        setSelectedTags([...selectedTags, newTag]);
    };

    const removeTag = (tagId: number) => {
        setSelectedTags((tags: any[]) => tags.filter((tag: { id: number; }) => tag.id !== tagId));
    }

    const resetForm = () => {
        setUrl("");
        setTitle("");
        setDescription("");

        if (imageUrl && imageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(imageUrl);
        }
        setImageUrl("");

        setFetchingStatus("IDLE");
        setLoading(false);
        setSelectedTags([]);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        setOpen(false);
    };

    const handleCreateTag = () => {
        const trimmedName = tagInput.trim();

        if (!trimmedName) return;
        if (selectedTags.some(t => t.name.toLowerCase() === trimmedName.toLowerCase())) {
            setTagInput("");
            return;
        }

        const newTag = {
            id: Date.now(),
            name: trimmedName
        };

        setSelectedTags([...selectedTags, newTag]);
        setTagInput("");
    };

    const handleAddBookmark = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url || !imageUrl) return;

        try {
            const payload = {
                username: "dejabarclay",
                title: title,
                url: url,
                description: description,
                iconUrl: imageUrl,
                tags: selectedTags.map(t => t.name),
                isArchived: initialData?.isArchived || false
            };

            const requestURL = isEditing
                ? `${BASE_URL}/bookmark/update/${initialData.bookmarkId}`
                : `${BASE_URL}/bookmark/create`;

            const response = await fetch(requestURL, {
                method: isEditing ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            if (response.ok) {
                setOpen(false);
                setRefreshKey(prev => prev + 1);
                resetForm();
            } else {
                console.error("Failed to create bookmark");
            }
        } catch (error) {
            console.error("Submission Error:", error);
            alert("Could not connect to the server. Please check if the backend is running and CORS is enabled.");
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const localUrl = URL.createObjectURL(file);
            setImageUrl(localUrl);

            // setSelectedFile(file); //If you need to send the actual file to your backend later:
        }
    };

    const onUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    resetForm();
                }
                setOpen(isOpen);
            }}
        >
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        {isEditing ? "Edit Bookmark" : "Add a New Bookmark"}
                    </DialogTitle>
                    {
                        fetchingStatus === "THIS_WEBSITE_DOES_NOT_SUPPORT_AUTO_FETCHING" ? (
                            <DialogDescription asChild className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                                <p className="text-sm text-yellow-700">
                                    <strong>Note:</strong> This site requires manual entry.
                                </p>
                            </DialogDescription>
                        ) : <DialogDescription>
                            You can enter a URL, and we'll try to fetch the title and description automatically.
                        </DialogDescription>

                    }
                </DialogHeader>
                <form onSubmit={handleAddBookmark} className="grid gap-6 py-4">
                    <div className="flex gap-6 items-start">
                        <div className="flex flex-col items-center gap-3">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />

                            <div className={`mt-4 border-2 border-dashed rounded-lg p-4 flex flex-col items-center min-h-[160px] w-full justify-center transition-all 
        ${(!url || loading) ? 'opacity-40 grayscale' : 'opacity-100'}`}>

                                {loading ? (
                                    <div className="text-center">
                                        <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto"/>
                                        <p className="text-[10px] text-muted-foreground mt-2">Searching for
                                            preview...</p>
                                    </div>
                                ) : imageUrl ? (
                                    <div className="relative group">
                                        <img src={imageUrl} className="h-32 object-contain" alt="preview"/>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => setImageUrl("")}
                                        >
                                            ×
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <UploadIcon className="mx-auto h-8 w-8 text-gray-400"/>
                                        <Button
                                            type="button"
                                            variant="link"
                                            size="sm"
                                            className="text-primary font-medium mt-2"
                                            disabled={!url}
                                            onClick={onUploadClick}
                                        >
                                            Upload custom icon
                                        </Button>
                                        <p className="text-[10px] text-muted-foreground">
                                            {!url ? "Enter a URL to begin" : "No image found"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid flex-1 gap-4">
                            <div className="grid gap-1.5">
                                <Label htmlFor="url">Bookmark URL</Label>
                                <Input id="url"
                                       placeholder="https://example.com" required
                                       onChange={(e) => setUrl(e.target.value)}
                                       onBlur={(e) => fetchMetadata(e.target.value)}
                                       value={url}
                                />
                                <p className="text-xs text-muted-foreground">Validating...</p>
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="title">Bookmark Title</Label>
                                <Input id="title" placeholder="Example Site Title (auto-fetched, and user can edit)"
                                       required
                                       onChange={(e) => setTitle(e.target.value)}
                                       value={title}
                                />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="description">Bookmark Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="A short descriptive text about the website... (auto-fetched)"
                                    className="min-h-[80px]"
                                    onChange={(e) => setDescription(e.target.value)}
                                    value={description}
                                />
                                <p className="text-xs text-muted-foreground text-right">150 / 300</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-2 border border-input rounded-lg p-4 bg-muted/40">
                        <Label>Apply Tags</Label>

                        <div className="flex flex-wrap gap-2 py-2">
                            {availableTags.map((tagName: string) => (
                                <Badge
                                    key={tagName}
                                    variant="outline"
                                    className="flex gap-1 items-center px-2 py-1 h-7 border-teal-600 cursor-pointer hover:bg-teal-50"
                                    onClick={() => addTag(tagName)}
                                >
                                    {tagName} <Plus className="h-3 w-3"/>
                                </Badge>
                            ))}
                        </div>

                        <div className="flex gap-3 items-center mt-1 pt-3 border-t">
                            <Input
                                type="search"
                                placeholder="Search or create new tags..."
                                className="flex-1 bg-white"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleCreateTag();
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                variant="link"
                                size="sm"
                                className="h-auto p-0 text-primary font-medium"
                                onClick={handleCreateTag}
                                disabled={!tagInput.trim()}
                            >
                                Create Tag
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                            {selectedTags.map(tag => (
                                <Badge key={tag.id} variant="secondary"
                                       className="flex gap-1 items-center px-2 py-1 h-7 text-sm font-medium">
                                    {tag.name}
                                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer"
                                       onClick={() => removeTag(tag.id)}/>
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" type="button" onClick={() => resetForm()}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-teal-700 hover:bg-teal-800 text-white"
                            disabled={!url || !imageUrl || loading}
                        >
                            {loading ? "Saving..." : isEditing ? "Save Changes" : "Add Bookmark"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
