package com.vishwa.studyassistant.Controllers;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.vishwa.studyassistant.Services.FlashcardService;
import com.vishwa.studyassistant.models.Flashcard;
import com.vishwa.studyassistant.repositories.FlashcardRepo;

@RestController
public class FlashcardsController {
  private FlashcardService flashcardService;
  private FlashcardRepo flashcardRepo;

  FlashcardsController(FlashcardService flashcardService, FlashcardRepo flashcardRepo) {
    this.flashcardService = flashcardService;
    this.flashcardRepo = flashcardRepo;
  }

  @PostMapping("flashcards/{userId}")
  public List<Flashcard> storeFlashCards(@PathVariable Long userId, @RequestBody List<Flashcard> flashcards) {
    System.out.println(flashcards);
    System.out.println();
    return flashcardService.storeFlashcards(flashcards, userId);
  }

  @GetMapping("flashcards/{userId}")
  public List<Flashcard> getFlashcardsByUserid(@PathVariable Long userId) {
    return flashcardService.getFlashCardByUserId(userId);
  }

  @DeleteMapping("flashcards/{id}")
  public void deleteFlashcardById(@PathVariable Long id) {
    flashcardRepo.deleteById(id);
    return;
  }

}
