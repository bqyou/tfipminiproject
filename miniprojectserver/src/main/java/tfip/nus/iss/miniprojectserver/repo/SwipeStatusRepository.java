package tfip.nus.iss.miniprojectserver.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import tfip.nus.iss.miniprojectserver.models.SwipeStatus;

@Repository
public interface SwipeStatusRepository extends JpaRepository<SwipeStatus, Integer> {
    
    @Modifying
    @Query("UPDATE SwipeStatus p SET p.swipes = p.swipes - 1 WHERE p.user.id = :userId")
    void reduceSwipesByUserId(@Param("userId") Integer userId);

    @Modifying
    @Query("UPDATE SwipeStatus p SET p.swipes = p.swipes + 10 WHERE p.user.id = :userId")
    void addSwipesByUserId(@Param("userId") Integer userId);
}
