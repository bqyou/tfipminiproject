package tfip.nus.iss.miniprojectserver.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tfip.nus.iss.miniprojectserver.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    
    Optional<User> findByEmail(String email);


    boolean existsByEmail(String email);
}
