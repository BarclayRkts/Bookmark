package com.dejabarclay.bookmark.controller;

import com.dejabarclay.bookmark.dto.BookmarkDTO;
import com.dejabarclay.bookmark.service.implementation.BookmarkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://bookmark-sigma-two.vercel.app"}, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH})
@RequestMapping("/bookmark")
public class BookmarkController {

    @Autowired
    private BookmarkService bookmarkService;

    @GetMapping("/all/{userId}")
    public ResponseEntity<List<BookmarkDTO>> getAllBookmarks(@PathVariable("userId") String userId) {
        List<BookmarkDTO> bookmarks = bookmarkService.getAllBookmarksByUserId(userId);

        if (bookmarks.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(bookmarks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookmarkDTO> getBookmarkById(@PathVariable("id") String id) {
        String[] parts = id.split(":", 2);

        if (parts.length < 2) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid format");
        }

        String sk = parts[0];
        String pk = parts[1];

        BookmarkDTO bookmark = bookmarkService.getBookmarkById(pk, sk);
        return ResponseEntity.ok(bookmark);
    }

    @PostMapping("/create")
    public ResponseEntity<BookmarkDTO> createBookmark(@RequestBody BookmarkDTO bookmarkDto) {

        BookmarkDTO savedBookmark = bookmarkService.createBookmark(bookmarkDto);
        return new ResponseEntity<>(savedBookmark, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<BookmarkDTO> updateBookmark(
            @PathVariable String id,
            @RequestBody BookmarkDTO bookmarkDto
    ) {
        BookmarkDTO updatedBookmark = bookmarkService.updateBookmark(id, bookmarkDto);
        return new ResponseEntity<>(updatedBookmark, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteBookmark(
            @PathVariable String id,
            @RequestParam String username
    ) {
        bookmarkService.deleteBookmark(id, username);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/search")
    public ResponseEntity<List<BookmarkDTO>> searchBookmarks(
            @RequestParam String query,
            @RequestParam String username) {
        List<BookmarkDTO> results = bookmarkService.searchBookmarks(query, username);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/tags/{username}")
    public ResponseEntity<List<String>> getUniqueTags(@PathVariable String username) {
        List<String> tags = bookmarkService.getAllUniqueTags(username);
        return ResponseEntity.ok(tags);
    }

    @PatchMapping("/archive/{bookmarkId}")
    public ResponseEntity<String> archiveBookmark(@PathVariable String bookmarkId, @RequestParam String username) {

        try {
            bookmarkService.archiveBookmark(bookmarkId, username);
            return ResponseEntity.ok("Bookmark archived successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error archiving bookmark: " + e.getMessage());
        }
    }

    @PatchMapping("/pin/{id}")
    public ResponseEntity<Void> togglePin(@PathVariable String id, @RequestParam String username) {
        bookmarkService.togglePin(id, username);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/increment-views/{id}")
    public ResponseEntity<Void> incrementViews(@PathVariable String id, @RequestParam String username) {
        bookmarkService.incrementViewCount(id, username);
        return ResponseEntity.ok().build();
    }

}


