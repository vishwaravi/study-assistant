package com.vishwa.studyassistant.models;

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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "study_material")
public class StudyMaterial {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private UserModel user;

  @Column(name = "title", nullable = false)
  private String title;

  @Column(name = "category", nullable = false)
  private String category;

  @Column(name = "description", nullable = true, length = 500)
  private String description;

  @Column(name = "file_url", nullable = false)
  private String fileUrl;

  @Column(name = "file_name", nullable = false)
  private String fileName;

  @Column(name = "uploaded_at" ,nullable = false)
  @CreationTimestamp
  private LocalDateTime uploadedAt;
}