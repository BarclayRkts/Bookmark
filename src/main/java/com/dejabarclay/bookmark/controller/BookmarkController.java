package com.dejabarclay.bookmark.controller;

import com.dejabarclay.bookmark.dto.BookmarkDTO;
import com.dejabarclay.bookmark.service.implementation.BookmarkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("bookmark")
public class BookmarkController {

    @Autowired
    private BookmarkService bookmarkService;

    @GetMapping("/{id}")
    public ResponseEntity<BookmarkDTO> getBookmarkById(@PathVariable("id") String id) {
        // Expected id format from frontend: "dejabarclay|12345"
        String[] parts = id.split(":", 2);

        if (parts.length < 2) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid format");
        }

        String sk = parts[0]; // Bookmark ID goes to the Partition Key (sk)
        String pk = parts[1];     // User ID goes to the Sort Key (pk)

        BookmarkDTO bookmark = bookmarkService.getBookmarkById(pk, sk);
        return ResponseEntity.ok(bookmark);
    }

    @PostMapping("/create")
    public ResponseEntity<BookmarkDTO> createBookmark(@RequestBody BookmarkDTO bookmarkDto) {

        BookmarkDTO savedBookmark = bookmarkService.createBookmark(bookmarkDto);
        return new ResponseEntity<>(savedBookmark, HttpStatus.CREATED);
    }
}


