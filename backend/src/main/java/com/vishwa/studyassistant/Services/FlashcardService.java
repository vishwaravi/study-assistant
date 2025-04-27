package com.vishwa.studyassistant.Services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.vishwa.studyassistant.models.Flashcard;
import com.vishwa.studyassistant.models.UserModel;
import com.vishwa.studyassistant.repositories.FlashcardRepo;
import com.vishwa.studyassistant.repositories.UserRepo;

@Service
public class FlashcardService {

    private FlashcardRepo flashcardRepo;
    private UserRepo userRepo;
    
    FlashcardService(FlashcardRepo flashcardRepo, UserRepo userRepo){
      this.flashcardRepo = flashcardRepo;
      this.userRepo = userRepo;
    }

    public List<Flashcard> getFlashCardByUserId(Long userId){
      return flashcardRepo.getFlashcardsByUserid(userId);
    }

    public Flashcard storeFlashcard(Flashcard flashcard, Long userId) {
        UserModel user = userRepo.findById(userId).get();
        flashcard.setUser(user);
        return flashcardRepo.save(flashcard);
    }

    public List<Flashcard> storeFlashcards(List<Flashcard> flashcards, Long userId) {
        UserModel user = userRepo.findById(userId).get();
        for(Flashcard card:flashcards)
          card.setUser(user);
        return flashcardRepo.saveAll(flashcards);
    }
}
