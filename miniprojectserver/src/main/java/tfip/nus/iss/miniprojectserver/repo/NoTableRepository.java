package tfip.nus.iss.miniprojectserver.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import tfip.nus.iss.miniprojectserver.models.NoTable;

public interface NoTableRepository extends JpaRepository<NoTable, Integer> {
    
    List<NoTable> findByActiveUserId(Integer activeUserId);
    
}