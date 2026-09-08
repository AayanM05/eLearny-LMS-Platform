package com.elearny.practice.repository;

import com.elearny.practice.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ArticleRepository extends JpaRepository<Article, UUID> {
    Optional<Article> findBySlug(String slug);
    List<Article> findByCategoryOrderByCreatedAtDesc(String category);
    List<Article> findAllByOrderByCreatedAtDesc();
}
