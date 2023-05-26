package tfip.nus.iss.miniprojectserver.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import tfip.nus.iss.miniprojectserver.models.UserProfile;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Integer> {

    Optional<UserProfile> findByUserId(Integer userId);

    // @Query(value = "SELECT * FROM profiles " +
    //     "WHERE gender = :gender " +
    //     "AND preference = :preference " +
    //     "AND user_id NOT IN (:userIds) " +
    //     "ORDER BY RAND() " +
    //     "LIMIT :limit", nativeQuery = true)
    // List<UserProfile> findByGenderAndPreferenceAndUserIdNotIn(String gender, List<String> preference, List<Integer> userIds, Integer limit);

    @Query(value = "SELECT * FROM profiles " +
        "WHERE gender = :gender " +
        "AND (preference = :preference OR preference = 'either') " +
        "AND user_id NOT IN :userIds " +
        "ORDER BY RAND() " +
        "LIMIT :limit", nativeQuery = true)
    List<UserProfile> findByGenderAndPreferenceAndUserIdNotIn(String gender,  String preference, List<Integer> userIds, Integer limit);

    @Query(value = "SELECT * FROM profiles " +
        "WHERE (preference = :preference OR preference = 'either')" +
        "AND user_id NOT IN :userIds " +
        "ORDER BY RAND() " +
        "LIMIT :limit", nativeQuery = true)
    List<UserProfile> findByPreferenceAndUserIdNotIn(String preference, List<Integer> userIds, Integer limit);  

    List<UserProfile> findByUserIdIn(List<Integer> userIds);
}
