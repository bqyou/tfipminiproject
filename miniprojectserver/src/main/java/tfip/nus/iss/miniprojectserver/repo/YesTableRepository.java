package tfip.nus.iss.miniprojectserver.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import tfip.nus.iss.miniprojectserver.models.YesTable;

public interface YesTableRepository extends JpaRepository<YesTable, Integer> {
    
    List<YesTable> findByActiveUserId(Integer activeUserId);

    YesTable findByActiveUserIdAndMatchId(Integer activeUserId, Integer matchId);
}
