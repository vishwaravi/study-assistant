package com.vishwa.studyassistant.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "flashcards") // Specifies the table name in the database
public class Flashcard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incrementing primary key
    @Column(name = "id") // Column for the primary key
    private Long id;

    @Column(name = "front", nullable = false,length = 1000) // Column for the front of the flashcard
    private String front;

    @Column(name = "back", nullable = false, length = 1000) // Column for the back of the flashcard
    private String back;

    @Column(name = "subject")
    private String subject;

    @ManyToOne
    @JoinColumn(name = "user_id")
    UserModel user;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp  
    private LocalDateTime createdAt;
}

