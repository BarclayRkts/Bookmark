package com.dejabarclay.bookmark.controller;

import com.dejabarclay.bookmark.service.implementation.MetadataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class MetadataController {

    private final MetadataService metadataService;

    public MetadataController(MetadataService metadataService) {
        this.metadataService = metadataService;
    }

    @GetMapping("/fetch")
    public ResponseEntity<Map<String, String>> fetch(@RequestParam String url) {
        return ResponseEntity.ok(metadataService.getWebsiteMetadata(url));
    }
}