package com.moviebooking.moviebooking.repository;

import com.moviebooking.moviebooking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {

}