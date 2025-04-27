package com.vishwa.studyassistant.models;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "profile_data")
public class ProfileData {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private UserModel user;
    
    @Column(name = "dob")
    private Date dob;

    @Column(name = "qualification")
    private String qualification;

    @Column(name = "role")
    private String role;

    @Column(name = "bio")
    private String bio;

    @Column(name = "subjects")
    private List<String> subjects;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}